import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Sidebar from "./components/Sidebar";
import AddJobForm from "./components/AddJobForm";
import StatsCard from "./components/StatsCard";
import JobTable from "./components/JobTable";
import Charts from "./components/Charts";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from Supabase
  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("repairs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setJobs(data);
    setLoading(false);
  };

  // ✅ Real-time sync
  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel("realtime-repairs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "repairs" },
        () => fetchJobs()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <StatsCard jobs={jobs} />

        <Charts jobs={jobs} />

        <AddJobForm onAdded={fetchJobs} />

        {loading ? (
          <p className="text-center mt-10">Loading data...</p>
        ) : (
          <JobTable jobs={jobs} />
        )}
      </main>
    </div>
  );
}
