import type { NavigationGuardWithThis } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

export const authGuard: NavigationGuardWithThis<undefined> = (_to, _from, next) => {
  const auth = useAuthStore();
  if (auth.isAuthenticated) {
    next();
  } else {
    next({ name: "SignIn" });
  }
};
