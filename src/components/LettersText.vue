/* eslint-disable vue/no-unused-components */
<template>
  <v-runtime-template :template="data"></v-runtime-template>
</template>

<script>
import { mapGetters } from "vuex";
import VRuntimeTemplate from "v-runtime-template";
import { xslt } from "@/mixins/xslt";
import { dataService } from "@/shared";
import { basePathLetters } from "../router";
import CommentIcon from "@/components/CommentIcon.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";

export default {
  name: "LettersText",
  components: {
    VRuntimeTemplate,
    CommentIcon,
    ContextMenu
  },
  mixins: [openInNewTabMixin, xslt],
  data() {
    return {
      data: null
    };
  },

  computed: {
    ...mapGetters(["activeComment"])
  },

  watch: {
    "$route.params.id": {
      handler: function(oldId, newId) {
        if (oldId !== newId) {
          this.getItems();
        }
      }
    }
  },

  mounted() {
    this.getItems();
  },

  methods: {
    async getItems() {
      try {
        const response = await dataService.XSLTransform(
          `${basePathLetters}/${this.$route.params.id}`,
          "LettersText"
        );
        const data = await response;
        this.data = data;
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    },
    activateComment(event, commentId) {
      const hasActiveComment = this.activateComment.id ? true : false;
      let offsetTop = event.layerY;

      if (event.target.classList.contains("comment-icon")) {
        offsetTop = event.target.parentElement.offsetTop;
      }

      /** We don't use vue router.push here to not trigger a refresh of the component */
      history.pushState({}, null, basePathLetters + "/" + this.$route.params.id + "/" + commentId);

      const commentHtml = document.querySelector(`#comment-${commentId}`);

      const comment = {
        id: commentId,
        text: commentHtml.innerHTML,
        offsetTop: offsetTop
      };
      this.$store.dispatch("setActiveComment", comment);

      if (!hasActiveComment) {
        setTimeout(() => {
          const commentReference = document.querySelector(
            `.g-comment-orig[commentId="${commentId}"]`
          );
          comment.offsetTop = commentReference.offsetTop;

          this.$store.dispatch("setActiveComment", comment);
        }, 0);
      }
    }
  }
};
</script>

<style lang="stylus">
@import '../styles/quasar.variables.styl'

.g-edition-text
  font-family: Cardo
  font-size: 14pt
  padding: 16px

span.g-add
  color: green

del
  color: red

.g-uu
  text-decoration-line: underline
  text-decoration-style: double

.g-entity-link
  box-shadow: inset 0 -0.7rem 0 0 hsla(144.9, 100%, 82.5%, 0.5)
  transition: box-shadow 0.5s
  cursor: pointer
  text-decoration: none
  text-decoration: none

a.g-entity-link
  color: unset
  text-decoration: none


.g-entity-link.start-offset
  box-shadow: inset 0 -2.5rem 0 0 hsla(144.9, 100%, 82.5%, 1)

.g-entity-link.start-offset:hover
  box-shadow: inset 0 -0.5rem 0 0 hsla(144.9, 100%, 82.5%, 1)

.g-entity-link:hover
  box-shadow: inset 0 -2.5rem 0 0 hsla(144.9, 100%, 82.5%, 1)

.g-mprint
  font-family: "Courier New", Courier, monospace
  font-size: 12pt
  letter-spacing: 2px

.g-aq
  font-family: "IBMPlexSans"
  font-size: 13pt

.g-margin-right
  display: block
  position: absolute !important
  right: 0em

.g-coupled
  display: inline

.g-pb {
  display: block;
  position: absolute;
  left: 1em;
  margin-top: -1.7em;
  font-size: 0.8em;
}

span.g-list
  display: block
  margin-bottom: 1em

span.g-list-item
  display: flex
  margin-bottom: 0.5em
  margin-left: 1.5rem

.g-comment-orig
  transition: box-shadow 0.5s;
  cursor: pointer;

  &.active,
  &:hover
    box-shadow: inset 0 2.5rem 0 0 lighten($secondary, 40)

  .comment-icon
    display: inline-block !important


.g-comment-icon
  color: $primary

.q-splitter__before
  overflow: unset !important

  .g-pb
    left: -2.2em

.separator-hidden
  display: none

.g-edition-external-link
  color: unset
  text-decoration: none
  box-shadow: inset 0 -0.4rem 0 0 $info
  transition: box-shadow 0.5s
  cursor: pointer

  &:hover
    box-shadow: inset 0 -1rem 0 0 $info

.g-edition-comment
  *
    font-size: 10pt
</style>
