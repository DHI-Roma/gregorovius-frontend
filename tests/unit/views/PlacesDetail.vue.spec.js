import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/router";

import { places } from "../fixtures/places";

import PlacesDetail from "@/views/PlacesDetail.vue";

describe("PlacesDetail", () => {
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
      places: () => places
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
    wrapper = shallowMount(PlacesDetail, {
      localVue,
      store,
      router,
      computed: {
        entityId: () => "G000807"
      },
      data() {
        return {
          data: {
            place: {
              "@xmlns": "http://www.tei-c.org/ns/1.0",
              "@xml:id": "G000807",
              idno: { "@type": "uri", "#text": "http://www.geonames.org/3247449" },
              placeName: { "@type": "reg", "#text": "Aachen" }
            }
          }
        };
      }
    });

    expect(wrapper).toBeTruthy();

    wrapper.destroy();
  });

  it("displays the geonames URI when there is one available", () => {
    wrapper = shallowMount(PlacesDetail, {
      localVue,
      store,
      router,
      computed: {
        entityId: () => "G000807"
      },
      data() {
        return {
          data: {
            place: {
              "@xmlns": "http://www.tei-c.org/ns/1.0",
              "@xml:id": "G000807",
              idno: { "@type": "uri", "#text": "http://www.geonames.org/3247449" },
              placeName: { "@type": "reg", "#text": "Aachen" }
            }
          }
        };
      }
    });

    expect(wrapper.vm.authorityUri).toBe("http://www.geonames.org/3247449");
    expect(wrapper.find("#geonames-uri").exists()).toBeTruthy();

    wrapper.destroy();
  });

  it("does not display the geonames URI when there is none available", () => {
    wrapper = shallowMount(PlacesDetail, {
      localVue,
      store,
      router,
      computed: {
        entityId: () => "G000807"
      },
      data() {
        return {
          data: {
            place: {
              "@xmlns": "http://www.tei-c.org/ns/1.0",
              "@xml:id": "G000807",
              placeName: { "@type": "reg", "#text": "Aachen" }
            }
          }
        };
      }
    });

    expect(wrapper.vm.authorityUri).toBe("");
    expect(wrapper.find("#geonames-uri").exists()).toBeFalsy();

    wrapper.destroy();
  });

  it("gets the place type", () => {
    wrapper = shallowMount(PlacesDetail, {
      localVue,
      store,
      router,
      computed: {
        entityId: () => "G000848"
      },
      data() {
        return {
          data: {
            place: {
              "@xmlns": "http://www.tei-c.org/ns/1.0",
              "@xml:id": "G000848",
              placeName: { "@type": "reg", "#text": "Aetna" }
            }
          }
        };
      }
    });

    expect(wrapper.vm.properties.type).toBe("mountains");

    wrapper.destroy();
  });
});
