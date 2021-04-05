<template>
  <div 
    class="g-edition-comment-container"
    v-bind:style="{ top: activeComment.offsetTop + 'px' }">
    <div class="row justify-between self-center q-pb-sm">
      <span class="text-h6">
        Kommentar
      </span>
    </div>
    <q-separator />

    <div class="g-edition-comment">
      {{ activeComment.text }}
    </div>

    <q-separator class="q-mt-sm" />

    <q-btn
      color="accent"
      icon="close"
      align="right"
      size="sm"
      rounded
      outline
      class="close-comment q-mt-sm"
      id="close-comment-large"
      @click="close"
    >
    Schließen
    </q-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { QChatMessage } from "quasar";

export default {
  name: "Comment",
  components: {
    QChatMessage
  },
  computed: { ...mapGetters(["activeComment"]) },
  methods: {
    close() {
      this.$store.dispatch('unselectComment');
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
