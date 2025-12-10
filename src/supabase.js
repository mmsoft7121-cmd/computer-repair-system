import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qhgbzzyycgeqvirbtfky.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2J6enl5Y2dlcXZpcmJ0Zmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzU0MDUsImV4cCI6MjA4MDkxMTQwNX0.otf0qD8ytsx1WnsyCwdIfS1a2w0msSNiq2pPSqDDr6g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
