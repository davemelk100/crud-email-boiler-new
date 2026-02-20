import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Dashboard from "@/views/Dashboard.vue";
import { useAuthStore } from "@/stores/authStore";
import { vi } from "vitest";

vi.mock("@/services/auth/authService", () => ({
  authService: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

describe("Dashboard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders dashboard content", () => {
    const auth = useAuthStore();
    auth.user = { id: "1", email: "test@test.com" } as any;

    const wrapper = mount(Dashboard);

    expect(wrapper.find("h1").text()).toBe("Dashboard");
    expect(wrapper.text()).toContain("test@test.com");
  });
});
