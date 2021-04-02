import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";
import CommentIcon from "@/components/CommentIcon.vue";

describe("CommentIcon", () => {
  let localVue;
  let actions;
  let getters;
  let store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    getters = {
      activeComment: () => {
        return {
          id: "comment_id",
          text: "Some comment text",
          reference: "This is the original text"
        };
      }
    }
    actions = {
      setActiveComment: jest.fn()
    };
    store = new Vuex.Store({
      actions,
      getters
    });
  });

  it("should create the component", () => {
    wrapper = shallowMount(CommentIcon, {
      localVue,
      store,
      propsData: {
        commentId: 'comment_id',
        commentText: "Some comment text",
        commentReference: "This is the original text"
      }
    });

    expect(wrapper).toBeTruthy();
    expect(wrapper.vm.commentId).toBe("comment_id");
    expect(wrapper.vm.commentText).toBe("Some comment text");
    wrapper.destroy();
  });

  it("should detect the active state when it matches the active comment id", () => {
    wrapper = shallowMount(CommentIcon, {
      localVue,
      store,
      propsData: {
        commentId: 'comment_id',
        commentText: "Some comment text",
      }
    });

    expect(wrapper.vm.isActive).toBeTruthy();
  });

  it("should not get the active state when it does not match the active comment id", () => {
    wrapper = shallowMount(CommentIcon, {
      localVue,
      store,
      propsData: {
        commentId: 'comment_id_other',
        commentText: "Some comment text",
      }
    });

    expect(wrapper.vm.isActive).toBeFalsy();
  });


});
