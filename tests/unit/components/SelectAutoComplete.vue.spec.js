import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/routes";
import SelectAutoComplete from "@/components/SelectAutoComplete.vue";
import { uniquePersons } from "../fixtures/unique-entities";

describe("SelectAutoComplete", () => {
  let localVue;
  let store;
  let wrapper;

  const router = new VueRouter({ routes, mode: "abstract" });

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
      },
      attrs: {
        options: uniquePersons
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

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

  it("sees the available list of unique items", () => {
    expect(wrapper.vm.options.length).toBe(5);

    wrapper.vm.filterByInput("alt");

    expect(wrapper.vm.options.length).toBe(2);
  });

  it("checks whether a value is assigned", () => {
    pending();
    expect(wrapper.vm.hasValue).toBeFalsy();

    wrapper.vm.model = {
      label: "Althaus, Friedrich",
      value: "G000920"
    };

    expect(wrapper.vm.hasValue).toBeTruthy();
  });
});
