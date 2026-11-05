import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};

const supabaseUrl =
  metaEnv.SUPABASE_URL ||
  metaEnv.VITE_SUPABASE_URL ||
  metaEnv.NEXT_PUBLIC_SUPABASE_URL ||
  "https://peymklnsxdrcbofxzlaz.supabase.co";

const supabaseKey =
  metaEnv.SUPABASE_ANON_KEY ||
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBleW1rbG5zeGRyY2JvZnh6bGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTI4NjcsImV4cCI6MjA5NzE2ODg2N30.zFbNPrQJ3KuQsghj9rrG1vyVAa91WOXj7i9yZcRpu88";

export const supabase = createClient(supabaseUrl, supabaseKey);
