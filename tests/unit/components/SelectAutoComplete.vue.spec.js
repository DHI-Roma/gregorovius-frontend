import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/routes";
import MultipleSelectAutoComplete from "@/components/MultipleSelectAutoComplete.vue";
import { uniquePersons } from "../fixtures/unique-entities";

describe("SelectAutoComplete", () => {
  let localVue;
  let store;
  let wrapper;

  const router = new VueRouter({ routes, mode: "abstract" });

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    wrapper = shallowMount(MultipleSelectAutoComplete, {
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

  it("sees the available list of unique items", () => {
    expect(wrapper.vm.options.length).toBe(5);

    wrapper.vm.filterByInput("alt");

    expect(wrapper.vm.options.length).toBe(2);
  });
});
