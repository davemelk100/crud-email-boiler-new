import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { authGuard } from "@/routes/guards";
import { vi } from "vitest";

vi.mock("@/services/auth/authService", () => ({
  authService: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

describe("authGuard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("calls next() when authenticated", () => {
    const auth = useAuthStore();
    auth.session = { access_token: "token" } as any;

    const next = vi.fn();
    authGuard.call(undefined, {} as any, {} as any, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("redirects to SignIn when not authenticated", () => {
    const next = vi.fn();
    authGuard.call(undefined, {} as any, {} as any, next);

    expect(next).toHaveBeenCalledWith({ name: "SignIn" });
  });
});
