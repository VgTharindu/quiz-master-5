import { createClient } from "@supabase/supabase-js";

// මුළු app එකම භාවිත කරන එකම Supabase client එක. keys එන්නේ .env file එකෙන්
export const sb = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
