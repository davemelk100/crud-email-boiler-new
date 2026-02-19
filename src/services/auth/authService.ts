import { supabase } from "./supabaseClient";
import type { Provider } from "@supabase/supabase-js";

export type OAuthProvider = "google" | "github" | "apple" | "azure";

export const authService = {
  signUpWithEmailPassword(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  },

  signInWithEmailPassword(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  signInWithMagicLink(email: string) {
    return supabase.auth.signInWithOtp({ email });
  },

  resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email);
  },

  signOut() {
    return supabase.auth.signOut();
  },

  getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback);
  },

  signInWithOAuth(provider: OAuthProvider) {
    return supabase.auth.signInWithOAuth({ provider: provider as Provider });
  },
};
