import { authService } from "@/services/auth/authService";
import { supabase } from "@/services/auth/supabaseClient";
import { vi } from "vitest";

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signUpWithEmailPassword delegates to supabase.auth.signUp", async () => {
    await authService.signUpWithEmailPassword("a@b.com", "pass123");
    expect(supabase.auth.signUp).toHaveBeenCalledWith({ email: "a@b.com", password: "pass123" });
  });

  it("signInWithEmailPassword delegates to supabase.auth.signInWithPassword", async () => {
    await authService.signInWithEmailPassword("a@b.com", "pass123");
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: "a@b.com", password: "pass123" });
  });

  it("signInWithMagicLink delegates to supabase.auth.signInWithOtp", async () => {
    await authService.signInWithMagicLink("a@b.com");
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({ email: "a@b.com" });
  });

  it("resetPassword delegates to supabase.auth.resetPasswordForEmail", async () => {
    await authService.resetPassword("a@b.com");
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("a@b.com");
  });

  it("signOut delegates to supabase.auth.signOut", async () => {
    await authService.signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it("getSession delegates to supabase.auth.getSession", async () => {
    await authService.getSession();
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });

  it("onAuthStateChange delegates to supabase.auth.onAuthStateChange", () => {
    const callback = vi.fn();
    authService.onAuthStateChange(callback);
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(callback);
  });
});
