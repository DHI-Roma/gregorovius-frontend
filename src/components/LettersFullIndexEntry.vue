<template>
  <div>{{ entry.placename_sent }}</div>
</template>

<script>
export default {
  name: 'LettersFullIndexEntry',
  props: {
    entry: {
      type: Object,
      required: true
    }
  }
};
</script>
