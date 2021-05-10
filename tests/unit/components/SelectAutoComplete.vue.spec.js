import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/routes";
import SelectAutoComplete from "@/components/SelectAutoComplete.vue";

describe("SelectAutoComplete", () => {
  let localVue;
  let store;
  let wrapper;

  const router = new VueRouter({ routes, mode: 'abstract'});

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    wrapper = shallowMount(SelectAutoComplete, {
      localVue,
      store,
      router,
      props: {
        entity: "recipient",
        label: "Empfänger"
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  })

  it("creates the component", () => {
    expect(wrapper).toBeTruthy();
  });

  it("clears the selection", () => {
    wrapper.vm.setSelected = jest.fn();
    wrapper.vm.model = {
      label: "Althaus, Friedrich",
      value: "G000920"
    };

    expect(wrapper.vm.model.value).toBe("G000920");

    wrapper.vm.clearSelection();

    expect(wrapper.vm.model.label).toBe("");
    expect(wrapper.vm.model.value).toBe("");
  });
});
