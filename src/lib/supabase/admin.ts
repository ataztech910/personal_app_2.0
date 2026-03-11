import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./config";

function getServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) {
    throw new Error("Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }
  return value;
}

export const supabaseAdmin = createClient(supabaseUrl, getServiceRoleKey(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
