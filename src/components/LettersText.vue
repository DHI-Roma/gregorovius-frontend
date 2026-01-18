<template>
  <v-runtime-template :template="data"></v-runtime-template>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import { useMainStore } from "src/stores/main";
import { useRoute, useRouter } from "vue-router";
import VRuntimeTemplate from "vue3-runtime-template";
import { dataService } from "src/shared";
import { basePathLetters } from "../router";
import CommentIcon from "src/components/CommentIcon.vue";
import ContextMenu from "src/components/ContextMenu.vue";

export default defineComponent({
  name: "LettersText",
  components: {
    VRuntimeTemplate,
    CommentIcon,
    ContextMenu,
  },

  setup() {
    const store = useMainStore();
    const route = useRoute();
    const router = useRouter();

    // Use computed to expose raw object for vue3-runtime-template compatibility
    const activeComment = computed(() => store.activeComment);

    const data = ref(null);

    async function getItems() {
      try {
        const response = await dataService.XSLTransform(
          `${basePathLetters}/${route.params.id}`,
          "LettersText"
        );
        data.value = response;
      } catch (error) {
        console.error(error);
      }
    }

    function activateComment(event, commentId) {
      const hasActiveCommentFlag = store.activeComment.id ? true : false;
      let offsetTop = event.layerY;

      if (event.target.classList.contains("comment-icon")) {
        offsetTop = event.target.parentElement.offsetTop;
      }

      // We don't use vue router.push here to not trigger a refresh of the component
      history.pushState({}, null, basePathLetters + "/" + route.params.id + "/" + commentId);

      const commentHtml = document.querySelector(`#comment-${commentId}`);

      const comment = {
        id: commentId,
        text: commentHtml.innerHTML,
        offsetTop: offsetTop,
      };
      store.setActiveComment(comment);

      if (!hasActiveCommentFlag) {
        setTimeout(() => {
          const commentReference = document.querySelector(
            `.g-comment-orig[commentId="${commentId}"]`
          );
          comment.offsetTop = commentReference.offsetTop;
          store.setActiveComment(comment);
        }, 0);
      }
    }

    function openInNewTab(routeObj) {
      const resolved = router.resolve(routeObj);
      window.open(resolved.href, "_blank");
    }

    watch(
      () => route.params.id,
      (newId, oldId) => {
        if (newId !== oldId) {
          getItems();
        }
      }
    );

    onMounted(() => {
      getItems();
    });

    return {
      data,
      activeComment,
      activateComment,
      openInNewTab,
    };
  },
});
</script>

<style lang="scss">
@import '../css/quasar.variables.scss';

.g-edition-text {
  font-family: Cardo;
  font-size: 14pt;
  padding: 16px;
}

span.g-add {
  color: green;
}

del {
  color: red;
}

.g-uu {
  text-decoration-line: underline;
  text-decoration-style: double;
}

.g-entity-link {
  box-shadow: inset 0 -0.7rem 0 0 hsla(144.9, 100%, 82.5%, 0.5);
  transition: box-shadow 0.5s;
  cursor: pointer;
  text-decoration: none;
}

a.g-entity-link {
  color: unset;
  text-decoration: none;
}

.g-entity-link.start-offset {
  box-shadow: inset 0 -2.5rem 0 0 hsla(144.9, 100%, 82.5%, 1);
}

.g-entity-link.start-offset:hover {
  box-shadow: inset 0 -0.5rem 0 0 hsla(144.9, 100%, 82.5%, 1);
}

.g-entity-link:hover {
  box-shadow: inset 0 -2.5rem 0 0 hsla(144.9, 100%, 82.5%, 1);
}

.g-mprint {
  font-family: "Courier New", Courier, monospace;
  font-size: 12pt;
  letter-spacing: 2px;
}

.g-aq {
  font-family: "IBMPlexSans";
  font-size: 13pt;
}

.g-margin-right {
  display: block;
  position: absolute !important;
  right: 0em;
}

.g-coupled {
  display: inline;
}

.g-pb {
  display: block;
  position: absolute;
  left: 1em;
  margin-top: -1.7em;
  font-size: 0.8em;
}

span.g-list {
  display: block;
  margin-bottom: 1em;
}

span.g-list-item {
  display: flex;
  margin-bottom: 0.5em;
  margin-left: 1.5rem;
}

.g-comment-orig {
  transition: box-shadow 0.5s;
  cursor: pointer;

  &.active,
  &:hover {
    box-shadow: inset 0 2.5rem 0 0 lighten($secondary, 40%);
  }

  .comment-icon {
    display: inline-block !important;
  }
}

.g-comment-icon {
  color: $primary;
}

.q-splitter__before {
  overflow: unset !important;

  .g-pb {
    left: -2.2em;
  }
}

.separator-hidden {
  display: none;
}

.g-edition-external-link {
  color: unset;
  text-decoration: none;
  box-shadow: inset 0 -0.4rem 0 0 $info;
  transition: box-shadow 0.5s;
  cursor: pointer;

  &:hover {
    box-shadow: inset 0 -1rem 0 0 $info;
  }
}

.g-edition-comment {
  * {
    font-size: 10pt;
  }
}
</style>
