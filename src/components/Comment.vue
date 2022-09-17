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
import { mapGetters } from "vuex";

export default {
  name: "Comment",
  data() {
    return {
      commentWithLinks: ""
    };
  },
  computed: {
    ...mapGetters(["activeComment"])
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    "activeComment.id": async function(_newValue) {
      this.commentWithLinks = this.activeComment.text;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("unselectComment");
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/quasar.variables.styl'

h6
  color: $seconary

.g-edition-comment-container
  position: absolute
  padding-left: 16px

.g-edition-comment
  font-family: "IBMPlexSans"
  font-size: 10pt
  padding-top: 1rem
  padding-bottom: 1rem
</style>
