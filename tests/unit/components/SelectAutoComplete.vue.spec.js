import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import VueRouter from "vue-router";
import { routes } from "@/routes";
import SelectAutoComplete from "@/components/SelectAutoComplete.vue";

describe("SelectAutoComplete", () => {
  let localVue;
  let actions;
  let getters;
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
});
