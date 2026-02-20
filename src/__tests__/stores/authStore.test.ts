import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth/authService";
import { vi } from "vitest";

vi.mock("@/services/auth/authService", () => ({
  authService: {
    getSession: vi.fn(),
    signInWithEmailPassword: vi.fn(),
    signUpWithEmailPassword: vi.fn(),
    signInWithMagicLink: vi.fn(),
    resetPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("isAuthenticated returns false when no session", () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
  });

  it("isAuthenticated returns true when session exists", () => {
    const store = useAuthStore();
    store.session = { access_token: "token" } as any;
    expect(store.isAuthenticated).toBe(true);
  });

  it("signOut clears user and session", async () => {
    vi.mocked(authService.signOut).mockResolvedValue({ error: null } as any);
    const store = useAuthStore();
    store.user = { id: "1", email: "test@test.com" } as any;
    store.session = { access_token: "token" } as any;

    await store.signOut();

    expect(store.user).toBeNull();
    expect(store.session).toBeNull();
  });

  it("signIn throws on error from authService", async () => {
    const err = new Error("Invalid credentials");
    vi.mocked(authService.signInWithEmailPassword).mockResolvedValue({ error: err } as any);
    const store = useAuthStore();

    await expect(store.signIn("bad@test.com", "wrong")).rejects.toThrow("Invalid credentials");
  });

  it("init sets user/session from getSession", async () => {
    const mockSession = { access_token: "abc", user: { id: "1", email: "a@b.com" } };
    vi.mocked(authService.getSession).mockResolvedValue({
      data: { session: mockSession },
    } as any);
    vi.mocked(authService.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as any);

    const store = useAuthStore();
    await store.init();

    expect(store.session).toEqual(mockSession);
    expect(store.user).toEqual(mockSession.user);
    expect(store.loading).toBe(false);
  });
});
