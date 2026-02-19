export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  supabaseGraphqlUrl: import.meta.env.VITE_SUPABASE_GRAPHQL_URL,
} as const;
