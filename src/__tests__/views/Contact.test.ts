import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Contact from "@/views/Contact.vue";
import { vi } from "vitest";

vi.mock("@/services/auth/authService", () => ({
  authService: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

describe("Contact", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders form with name/email/subject/message fields", () => {
    const wrapper = mount(Contact);

    expect(wrapper.find('input[placeholder="Name"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Subject"]').exists()).toBe(true);
    expect(wrapper.find('textarea[placeholder="Message"]').exists()).toBe(true);
  });
});
