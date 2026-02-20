import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

describe("Home", () => {
  it("renders heading", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: Home },
        { path: "/signup", component: { template: "<div />" } },
        { path: "/contact", component: { template: "<div />" } },
        { path: "/setup", component: { template: "<div />" } },
      ],
    });
    await router.push("/");
    await router.isReady();

    const wrapper = mount(Home, {
      global: { plugins: [router] },
    });

    expect(wrapper.find("h1").text()).toBe("CRUD Email Boiler");
  });
});
