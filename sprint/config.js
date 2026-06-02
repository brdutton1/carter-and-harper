/* Public client config. The anon/publishable key is safe to expose —
   Row Level Security protects all data. The studio access code is NOT here;
   it lives only inside the Supabase edge functions (server-side). */
export const SUPABASE_URL = "https://mydrjwqyqwadkdtjbbyg.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_yg9VslCveEa69NhM0J2kkg_SiPKjadJ";
export const FUNCTIONS_URL = SUPABASE_URL + "/functions/v1";
export const ACCOUNTS = [
  { name: "Carter", email: "carter@carterandharper.studio" },
  { name: "Harper", email: "harper@carterandharper.studio" }
];
