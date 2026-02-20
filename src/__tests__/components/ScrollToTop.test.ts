import { mount } from "@vue/test-utils";
import ScrollToTop from "@/components/ScrollToTop.vue";
import { vi } from "vitest";

describe("ScrollToTop", () => {
  it("button hidden by default", () => {
    const wrapper = mount(ScrollToTop);
    expect(wrapper.find(".scroll-top").exists()).toBe(false);
  });

  it("button visible after scroll event beyond viewport height", async () => {
    // Set innerHeight so we can test scroll threshold
    Object.defineProperty(window, "innerHeight", { value: 500, writable: true });
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });

    const wrapper = mount(ScrollToTop);
    expect(wrapper.find(".scroll-top").exists()).toBe(false);

    // Simulate scrolling past viewport height
    Object.defineProperty(window, "scrollY", { value: 600 });
    window.dispatchEvent(new Event("scroll"));
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".scroll-top").exists()).toBe(true);
  });
});
