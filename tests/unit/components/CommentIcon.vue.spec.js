import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import CommentIcon from "@/components/CommentIcon.vue";

describe("CommentIcon", () => {
  let localVue;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    actions = {
      setActiveComment: jest.fn()
    };
    store = new Vuex.Store({
      actions
    });

    wrapper = shallowMount(CommentIcon, {
      propsData: {
        comment: "Some data"
      },
      localVue,
      store
    });
  });

  it("should create the component", () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.comment).toBe("Some data");
    wrapper.destroy();
  });
});
