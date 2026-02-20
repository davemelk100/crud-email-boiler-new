import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import SignIn from "@/views/SignIn.vue";
import { vi } from "vitest";

vi.mock("@/services/auth/authService", () => ({
  authService: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithOAuth: vi.fn(),
  },
}));

describe("SignIn", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders sign in form with email/password fields", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: { template: "<div />" } },
        { path: "/signin", component: SignIn },
        { path: "/signup", component: { template: "<div />" } },
        { path: "/forgot-password", component: { template: "<div />" } },
        { path: "/dashboard", component: { template: "<div />" } },
      ],
    });
    await router.push("/signin");
    await router.isReady();

    const wrapper = mount(SignIn, {
      global: { plugins: [router] },
    });

    expect(wrapper.find("h1").text()).toBe("Sign In");
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });
});
