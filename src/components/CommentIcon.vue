<template>
  <q-icon name="comment_bank" class="comment-icon" :class="{ active: isActive }" @click.stop="activateComment"></q-icon>
</template>

<script>
import { QIcon, QTooltip } from "quasar";
import { basePathLetters } from "../router";

export default {
  name: "CommentIcon",
  components: {
    QIcon,
    QTooltip
  },
  props: {
    commentId: {
      type: String,
      required: true
    },
    commentText: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive() {
      return this.$store.getters.activeComment.id === this.commentId;
    }
  },
  methods: {
    activateComment() {
      const comment = {
        id: this.commentId,
        text: this.commentText,
        offsetTop: 0
      };
      this.$store.dispatch('setActiveComment', comment);

      history.pushState(
        {},
        null,
        basePathLetters + '/' + this.$route.params.id + '/' + this.commentId
      );
    
      setTimeout(() => {
        const commentReference = document.querySelector(`.g-comment-orig[commentId="${this.commentId}"]`);
        comment.offsetTop = commentReference.offsetTop;

        this.$store.dispatch('setActiveComment', comment);
      }, 0);
    }
  }
};
</script>

<style lang="stylus">
@import '../styles/quasar.variables.styl'

.comment-icon
  margin-left: 5px
  margin-right: 2px
  cursor: pointer
  color: $secondary

.active
  color: $primary

.comment-icon:hover
  cursor: pointer
  color: $primary
</style>
