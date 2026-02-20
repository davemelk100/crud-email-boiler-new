import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import AppNav from "@/components/AppNav.vue";
import { useAuthStore } from "@/stores/authStore";
import { vi } from "vitest";

vi.mock("@/services/auth/authService", () => ({
  authService: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
}));

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/signin", component: { template: "<div />" } },
      { path: "/dashboard", component: { template: "<div />" } },
      { path: "/setup", component: { template: "<div />" } },
      { path: "/chat", component: { template: "<div />" } },
      { path: "/reports", component: { template: "<div />" } },
      { path: "/contact", component: { template: "<div />" } },
    ],
  });
}

describe("AppNav", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders brand link", async () => {
    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(AppNav, {
      global: { plugins: [router] },
    });

    expect(wrapper.find(".brand").text()).toBe("CrudEmail");
  });

  it("shows Sign In link when not authenticated", async () => {
    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(AppNav, {
      global: { plugins: [router] },
    });

    // Open menu
    await wrapper.find(".desktop-avatar .avatar-trigger").trigger("click");
    expect(wrapper.find(".desktop-avatar .avatar-menu").text()).toContain("Sign In");
  });

  it("shows avatar dropdown when authenticated", async () => {
    const auth = useAuthStore();
    auth.session = { access_token: "token" } as any;
    auth.user = { id: "1", email: "test@test.com" } as any;

    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(AppNav, {
      global: { plugins: [router] },
    });

    expect(wrapper.find(".avatar").text()).toBe("T");
  });

  it("dropdown contains Dashboard and Sign Out when authenticated", async () => {
    const auth = useAuthStore();
    auth.session = { access_token: "token" } as any;
    auth.user = { id: "1", email: "test@test.com" } as any;

    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(AppNav, {
      global: { plugins: [router] },
    });

    await wrapper.find(".desktop-avatar .avatar-trigger").trigger("click");
    const menu = wrapper.find(".desktop-avatar .avatar-menu");
    expect(menu.text()).toContain("Dashboard");
    expect(menu.text()).toContain("Sign Out");
  });
});
