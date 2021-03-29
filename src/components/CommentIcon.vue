<template>
  <q-icon name="comment_bank" class="comment-icon" :class="{ active: isActive }"></q-icon>
</template>

<script>
import { QIcon, QTooltip } from "quasar";

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
