import { shallowMount } from "@vue/test-utils";
import PersonsDetailMultiple from "@/views/PersonsDetailMultiple.vue";

describe("PersonsDetailMultiple", () => {
  it("creates the component", () => {
    const wrapper = shallowMount(PersonsDetailMultiple);
    expect(wrapper).toBeTruthy();
    wrapper.destroy();
  });

});
