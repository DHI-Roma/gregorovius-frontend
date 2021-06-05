import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/router";

import { persons } from "../fixtures/persons";

import PersonsIndex from "@/views/PersonsIndex.vue";

describe("PersonsIndex component", () => {
  let wrapper;
  let localVue;
  let actions;
  let getters;
  let store;

  jest.doMock("axios", () => ({
    get: jest.fn()
  }));

  localVue = createLocalVue();
  localVue.use(Vuex);
  const router = new VueRouter({ routes, mode: "abstract" });

  beforeEach(() => {
    getters = {
      fullNameIndex: () => [],
      persons: () => persons
    };

    actions = {
      loadFullNameIndexAction: jest.fn()
    };

    store = new Vuex.Store({
      actions,
      getters
    });
  });

  it("creates the component", () => {
    wrapper = shallowMount(PersonsIndex, {
      localVue,
      store,
      router
    });
    wrapper.vm.getItems = jest.fn();

    expect(wrapper).toBeTruthy();

    wrapper.destroy();
  });
});
