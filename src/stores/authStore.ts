import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth/authService";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!session.value);

  async function init() {
    loading.value = true;
    const { data } = await authService.getSession();
    session.value = data.session;
    user.value = data.session?.user ?? null;

    authService.onAuthStateChange((_event, s) => {
      session.value = s;
      user.value = s?.user ?? null;
    });
    loading.value = false;
  }

  async function signUp(email: string, password: string) {
    const { error } = await authService.signUpWithEmailPassword(email, password);
    if (error) throw error;
  }

  async function signIn(email: string, password: string) {
    const { error } = await authService.signInWithEmailPassword(email, password);
    if (error) throw error;
  }

  async function signInMagicLink(email: string) {
    const { error } = await authService.signInWithMagicLink(email);
    if (error) throw error;
  }

  async function forgotPassword(email: string) {
    const { error } = await authService.resetPassword(email);
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await authService.signOut();
    if (error) throw error;
    user.value = null;
    session.value = null;
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    init,
    signUp,
    signIn,
    signInMagicLink,
    forgotPassword,
    signOut,
  };
});
