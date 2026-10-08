<template>
  <button
    type="button"
    class="comment-icon-button"
    :data-comment-id="commentId"
    :aria-label="`Kommentar zu „${lemma}“ öffnen`"
    :aria-expanded="isActive ? 'true' : 'false'"
    @click="openComment(commentId)"
  >
    <q-icon
      name="comment_bank"
      class="comment-icon"
      :class="{ active: isActive }"
      aria-hidden="true"
    ></q-icon>
  </button>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";

// openComment comes from the global mixin in boot/global-components.js
export default defineComponent({
  name: "CommentIcon",

  props: {
    commentId: {
      type: String,
      required: true,
    },
    lemma: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useMainStore();
    const { activeComment } = storeToRefs(store);

    const isActive = computed(() => {
      return activeComment.value.id === props.commentId;
    });

    return {
      isActive,
    };
  },
});
</script>

<style lang="scss">
@import '../css/quasar.variables.scss';

.comment-icon-button {
  all: unset;
  display: inline-block !important;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }
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
