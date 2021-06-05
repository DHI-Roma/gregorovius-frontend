import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/router";

import PersonsDetail from "@/views/PersonsDetail.vue";
import { persons } from "../fixtures/persons";

describe("PersonsDetail view", () => {
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
    wrapper = shallowMount(PersonsDetail, {
      localVue,
      store,
      router,
      computed: {
        entityId: () => "G001323"
      }
    });
    wrapper.vm.getItems = jest.fn();

    expect(wrapper).toBeTruthy();

    wrapper.destroy();
  });

  it("can get the person properties", () => {
    wrapper = shallowMount(PersonsDetail, {
      localVue,
      store,
      router,
      computed: {
        entityId: () => "G001323"
      }
    });
    wrapper.vm.getItems = jest.fn();

    expect(wrapper.vm.properties.role).toBe("mythological");

    wrapper.destroy();
  });

  it("displays the role element when the entry is a person and not an organisation", () => {
    wrapper = shallowMount(PersonsDetail, {
      localVue,
      store,
      router,
      computed: {
        entityId: () => "G001323"
      }
    });
    wrapper.vm.getItems = jest.fn();

    const roleElement = wrapper.find("#role");
    const targetRole = "Mythologische Figur";

    expect(wrapper.vm.roleName).toBe(targetRole);
    expect(wrapper.vm.isPerson).toBeTruthy();
    expect(wrapper.vm.isOrganisation).toBeFalsy();
    expect(roleElement.exists()).toBeTruthy();
    expect(roleElement.text()).toBe(targetRole);

    wrapper.destroy();
  });
});
