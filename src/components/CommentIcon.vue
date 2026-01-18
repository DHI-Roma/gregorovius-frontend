<template>
  <span class="comment-icon-wrapper">
    <q-icon
      name="comment_bank"
      class="comment-icon"
      :class="{ active: isActive }"
      @click.stop="activateComment"
    ></q-icon>
  </span>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { basePathLetters } from "../router";

export default defineComponent({
  name: "CommentIcon",

  props: {
    commentId: {
      type: String,
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useMainStore();
    const route = useRoute();
    const { activeComment } = storeToRefs(store);

    const isActive = computed(() => {
      return activeComment.value.id === props.commentId;
    });

    function activateComment() {
      const commentHtml = document.querySelector(`#comment-${props.commentId}`);
      const commentReference = document.querySelector(
        `.g-comment-orig[commentId="${props.commentId}"]`
      );

      const comment = {
        id: props.commentId,
        text: commentHtml.innerHTML,
        offsetTop: commentReference.offsetTop,
      };
      store.setActiveComment(comment);

      /** We don't use vue router.push here to not trigger a refresh of the component */
      history.pushState(
        {},
        null,
        basePathLetters + "/" + route.params.id + "/" + props.commentId
      );

      // Recalculate after splitter resizes
      setTimeout(() => {
        const panel = document.querySelector('.comment-panel');
        if (panel && commentReference) {
          const panelRect = panel.getBoundingClientRect();
          const refRect = commentReference.getBoundingClientRect();
          comment.offsetTop = refRect.top - panelRect.top + panel.scrollTop;
          store.setActiveComment(comment);
        }
      }, 50);
    }

    return {
      isActive,
      activateComment,
    };
  },
});
</script>

<style lang="scss">
@import '../css/quasar.variables.scss';

.comment-icon-wrapper {
  display: inline-block !important;
}

.comment-icon {
  margin-left: 5px;
  margin-right: 2px;
  cursor: pointer;
  color: $secondary;
}

.active {
  color: $primary;
}

.comment-icon:hover {
  cursor: pointer;
  color: $primary;
}
</style>
