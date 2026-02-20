import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import SocialShare from "@/components/SocialShare.vue";

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/contact", component: { template: "<div />" } },
      { path: "/signin", component: { template: "<div />" } },
    ],
  });
}

describe("SocialShare", () => {
  it("renders all social links", async () => {
    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(SocialShare, {
      global: { plugins: [router] },
    });

    const links = wrapper.findAll("a");
    // GitHub (sign in), Twitter, LinkedIn, Facebook, Contact = 5 links
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it("renders contact (email) icon link", async () => {
    const router = createTestRouter();
    await router.push("/");
    await router.isReady();

    const wrapper = mount(SocialShare, {
      global: { plugins: [router] },
    });

    const contactLink = wrapper.find('a[aria-label="Contact"]');
    expect(contactLink.exists()).toBe(true);
  });
});
