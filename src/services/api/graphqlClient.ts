import { env } from "@/services/config/env";
import { supabase } from "@/services/auth/supabaseClient";

interface GraphQLResponse<T = unknown> {
  data: T | null;
  errors?: Array<{ message: string }>;
}

export async function graphql<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<GraphQLResponse<T>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: env.supabaseAnonKey,
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(env.supabaseGraphqlUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  return res.json();
}

// ── Example query ──────────────────────────────────────────────
export const EXAMPLE_QUERY = `
  query GetProfiles($first: Int!) {
    profileCollection(first: $first) {
      edges {
        node {
          id
          email
          created_at
        }
      }
    }
  }
`;

// ── Example mutation ───────────────────────────────────────────
export const EXAMPLE_MUTATION = `
  mutation InsertProfile($email: String!) {
    insertIntoprofileCollection(objects: [{ email: $email }]) {
      records {
        id
        email
      }
    }
  }
`;
