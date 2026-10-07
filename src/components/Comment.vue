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

    <div class="g-edition-comment" @click="onCommentClick" v-html="commentWithLinks"></div>

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
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Comment",

  setup() {
    const store = useMainStore();
    const router = useRouter();
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

    // The comment is plain HTML copied from the letter text, so its links have no
    // Vue handlers. Route internal links through the router to avoid a full reload;
    // modified clicks (new tab/window) keep the browser behaviour.
    function onCommentClick(event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    }

    return {
      activeComment,
      commentWithLinks,
      close,
      onCommentClick,
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
