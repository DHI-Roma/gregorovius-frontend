<template>
  <q-icon name="comment_bank" class="comment-icon" :class="{ active: isActive }" @click="activate">
    <q-tooltip content-style="font-size: 12pt;">
      {{ commentPreview }}
    </q-tooltip>
  </q-icon>
</template>

<script>
import { QIcon, QTooltip } from "quasar";

const COMMENT_PREVIEW_LENGTH = 50;

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
    },
    commentReference: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive() {
      return this.$store.getters.activeComment.id === this.commentId;
    },
    commentPreview() {
      if (this.commentText.length < COMMENT_PREVIEW_LENGTH) {
        return this.commentText;
      }

      return this.commentText.substring(0, COMMENT_PREVIEW_LENGTH) + "...";
    }
  },
  methods: {
    activate() {
      const comment = {
        id: this.commentId,
        text: this.commentText,
        reference: this.commentReference
      };
      this.$store.dispatch("setActiveComment", comment);
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
