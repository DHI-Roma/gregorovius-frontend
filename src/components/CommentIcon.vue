<template>
  <q-icon name="comment_bank" class="comment-icon" @click="setActiveComment"></q-icon>
</template>

<script>
import { QIcon } from "quasar";

export default {
  name: "CommentIcon",
  components: {
    QIcon
  },
  props: {
    comment: {
      type: String,
      required: true
    }
  },
  methods: {
    setActiveComment() {
      this.$store.dispatch("setActiveComment", this.comment);
    }
  }
};
</script>
