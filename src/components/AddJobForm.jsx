import { useState } from "react";
import { supabase } from "../supabase";

export default function AddJobForm({ onAdded }) {
  const [form, setForm] = useState({
    customer_name: "",
    laptop_model: "",
    fault_type: "",
    status: "Pending",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("repairs").insert([form]);

    setForm({
      customer_name: "",
      laptop_model: "",
      fault_type: "",
      status: "Pending",
    });

    onAdded();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6"
    >
      <div className="grid md:grid-cols-4 gap-3">
        <input
          placeholder="Customer"
          className="border p-2 rounded"
          value={form.customer_name}
          onChange={(e) =>
            setForm({ ...form, customer_name: e.target.value })
          }
        />

        <input
          placeholder="Laptop Model"
          className="border p-2 rounded"
          value={form.laptop_model}
          onChange={(e) =>
            setForm({ ...form, laptop_model: e.target.value })
          }
        />

        <input
          placeholder="Fault"
          className="border p-2 rounded"
          value={form.fault_type}
          onChange={(e) =>
            setForm({ ...form, fault_type: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white rounded">
          Add Repair
        </button>
      </div>
    </form>
  );
}
