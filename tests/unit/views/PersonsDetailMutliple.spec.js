import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/router";

import PersonsDetailMultiple from "@/views/PersonsDetailMultiple.vue";
import * as service from "../../../src/shared/service";

import { persons } from "../fixtures/persons";
import { lettersResponse } from "../fixtures/letters-response";

describe("PersonsDetailMultiple", () => {
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
      persons: () => persons,
      letters: () => lettersResponse
    };

    actions = {
      loadFullNameIndexAction: jest.fn()
    };

    store = new Vuex.Store({
      actions,
      getters
    });

    service.dataService.getEntity = jest.fn(() => Promise.resolve({ data: { person: {} } }));
  });
  it("creates the component", () => {
    wrapper = shallowMount(PersonsDetailMultiple, {
      localVue,
      router,
      store,
      computed: {
        entityIds: () => ["G001203", "G001215"]
      }
    });

    wrapper.vm.getItem = () => {};

    expect(wrapper).toBeTruthy();
    wrapper.destroy();
  });

  // G001337,G001011

  it("gets the entities", () => {
    wrapper = shallowMount(PersonsDetailMultiple, {
      localVue,
      router,
      store,
      computed: {
        entityIds: () => ["G001337", "G001011"]
      }
    });

    wrapper.vm.getItem = () => {};

    expect(wrapper.vm.entities[0].properties.name.fullName).toBe("Klumpp, Charlotte");
    expect(wrapper.vm.entities[1].properties.name.fullName).toBe(
      "Caetani Lovatelli, Ersilia, Contessa"
    );

    wrapper.destroy();
  });
});
