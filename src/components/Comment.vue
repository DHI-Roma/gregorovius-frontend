<template>
  <section
    v-if="activeComment.id"
    class="g-edition-comment-container"
    :style="{ top: activeComment.offsetTop + 'px' }"
    aria-labelledby="comment-heading"
    @keydown.esc="close"
  >
    <div class="row justify-between self-center q-pb-sm">
      <span id="comment-heading" ref="heading" class="text-h6" tabindex="-1">
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
  </section>
</template>

<script>
import { defineComponent, nextTick, ref, watch } from "vue";
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
    const heading = ref(null);

    // Move the focus into the panel whenever a commentary is opened, so that
    // keyboard and screen reader users land on its content
    watch(
      () => activeComment.value.id,
      async (id) => {
        commentWithLinks.value = activeComment.value.text;
        if (!id) return;
        await nextTick();
        heading.value?.focus();
      }
    );

    // Return the focus to the button that opened the commentary
    async function close() {
      const id = activeComment.value.id;
      store.unselectComment();
      await nextTick();
      document.querySelector(`button[data-comment-id="${id}"]`)?.focus();
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
      heading,
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

#comment-heading:focus-visible {
  outline: 2px solid $primary;
  outline-offset: 2px;
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
