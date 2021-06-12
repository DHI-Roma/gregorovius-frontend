<template>
  <div></div>
</template>

<script>
export default {
  name: "PersonsDetailMultiple",
  computed: {
    entityIds() {
      return this.$route.params.ids.split(",");
    }
  }
};
</script>
