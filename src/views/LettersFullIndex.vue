<template>
  <div>
    lti works
  </div>
</template>

<script>
export default {
  name: 'LettersFullIndex',
  mounted() {
    this.$store.dispatch('loadEntitiesAction');
  }
};
</script>
