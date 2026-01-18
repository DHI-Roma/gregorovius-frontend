<template>
  <div
    v-if="activeComment.id"
    class="g-edition-comment-container"
    :style="{ top: activeComment.offsetTop + 'px' }"
  >
    <div class="row justify-between self-center q-pb-sm">
      <span class="text-h6">
        Kommentar
      </span>
    </div>
    <q-separator />

    <div class="g-edition-comment" v-html="commentWithLinks"></div>

    <q-separator class="q-mt-sm" />

    <q-btn
      id="close-comment-large"
      color="accent"
      icon="close"
      align="right"
      size="sm"
      rounded
      outline
      class="close-comment q-mt-sm"
      @click="close"
    >
      Schließen
    </q-btn>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "Comment",

  setup() {
    const store = useMainStore();
    const { activeComment } = storeToRefs(store);

    const commentWithLinks = ref("");

    watch(
      () => activeComment.value.id,
      () => {
        commentWithLinks.value = activeComment.value.text;
      }
    );

    function close() {
      store.unselectComment();
    }

    return {
      activeComment,
      commentWithLinks,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../css/quasar.variables.scss';

h6 {
  color: $secondary;
}

.g-edition-comment-container {
  position: absolute;
  padding-left: 16px;
}

.g-edition-comment {
  font-family: "IBMPlexSans";
  font-size: 10pt;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
