import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";

import LettersIndex from "@/views/LettersIndex.vue";
import * as service from "../../../src/shared/service";
import { lettersResponse } from "../fixtures/letters-response";
import { fullNameIndex } from "../fixtures/full-name-index";

describe("LettersIndex", () => {
  let wrapper;
  let localVue;
  let actions;
  let getters;
  let store;

  localVue = createLocalVue();
  localVue.use(Vuex);

  beforeEach(() => {
    jest.doMock("axios", () => ({
      get: Promise.resolve(lettersResponse)
    }));

    service.dataService.getLetters = jest.fn();
    service.dataService.getEntities = jest.fn();

    getters = {
      letters: () => lettersResponse,
      fullNameIndex: () => fullNameIndex
    };

    actions = {
      loadFullNameIndexAction: jest.fn()
    }

    store = new Vuex.Store({
      actions,
      getters
    });

    const $route = {
      path: "/letters",
      query: {}
    };

    wrapper = shallowMount(LettersIndex, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
  });

  afterEach(() => {});

  it("renders the component", async () => {
    expect(wrapper).toBeTruthy();
    wrapper.destroy();
  });
});
