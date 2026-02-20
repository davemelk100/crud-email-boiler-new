import { mount } from "@vue/test-utils";
import Reports from "@/views/Reports.vue";

describe("Reports", () => {
  it("renders table with 5 rows", () => {
    const wrapper = mount(Reports);
    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(5);
  });

  it("renders sample data", () => {
    const wrapper = mount(Reports);
    expect(wrapper.text()).toContain("Alice Johnson");
    expect(wrapper.text()).toContain("$1,200.00");
  });
});
