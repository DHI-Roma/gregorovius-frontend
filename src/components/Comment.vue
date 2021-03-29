<template>
  <div 
    class="g-edition-comment-container"
    v-bind:style="{ top: activeComment.offsetTop + 'px' }">
    <div class="row justify-between self-center q-pb-sm">
      <span class="text-h6">
        Stellenkommentar
      </span>
      <q-btn
      color="accent"
      icon="close"
      align="right"
      size="sm"
      dense
      rounded
      outline
      @click="close"
      ></q-btn>
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
      rounded
      outline
      class="q-mt-sm"
      @click="close"
    >
    Kommentar schließen
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

.g-edition-comment-reference
  color: $accent

.g-edition-comment-reference,
.g-edition-comment
  font-family: Cardo
  font-size: 12pt
</style>
