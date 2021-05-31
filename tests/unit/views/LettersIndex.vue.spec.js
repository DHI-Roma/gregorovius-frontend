import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/router";

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

  const router = new VueRouter({ routes, mode: "abstract" });

  beforeEach(() => {
    jest.doMock("axios", () => ({
      get: Promise.resolve(lettersResponse)
    }));

    service.dataService.getLetters = jest.fn();
    service.dataService.getEntities = jest.fn();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders the component", () => {
    getters = {
      letters: () => lettersResponse,
      fullNameIndex: () => fullNameIndex,
      selectedRecipients: () => [],
      selectedPlaceSent: () => "",
      selectedPlaceReceived: () => "",
      selectedYears: () => []
    };

    actions = {
      loadFullNameIndexAction: jest.fn(),
      setSelectedAction: jest.fn()
    };

    store = new Vuex.Store({
      actions,
      getters
    });

    wrapper = shallowMount(LettersIndex, {
      localVue,
      store,
      router
    });

    expect(wrapper).toBeTruthy();
  });
});
