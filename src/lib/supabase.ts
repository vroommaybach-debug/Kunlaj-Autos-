import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://peymklnsxdrcbofxzlaz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBleW1rbG5zeGRyY2JvZnh6bGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTI4NjcsImV4cCI6MjA5NzE2ODg2N30.zFbNPrQJ3KuQsghj9rrG1vyVAa91WOXj7i9yZcRpu88";

export const supabase = createClient(supabaseUrl, supabaseKey);
