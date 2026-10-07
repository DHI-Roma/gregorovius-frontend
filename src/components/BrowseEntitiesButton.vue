<!--suppress JSCheckFunctionSignatures -->
<template>
  <q-btn
    round
    icon="library_books"
    color="primary"
    :to="routeWithFilter"
    :aria-label="title"
  >
    <q-tooltip :delay="delay">{{ title }}</q-tooltip>
  </q-btn>
</template>

<script>
export default {
  name: "BrowseEntitiesButton",
  props: {
    route: {
      type: Object,
      required: true
    },
    entityIds: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: "In Briefen blättern"
    }
  },
  data() {
    return {
      delay: 750
    };
  },
  computed: {
    routeWithFilter() {
      const entityIdsSuffix = this.entityIds.join(",");
      return {
        path: this.route.path + `/filters/${entityIdsSuffix}`
      };
    }
  }
};
</script>

<style scoped></style>
