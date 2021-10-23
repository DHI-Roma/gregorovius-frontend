<!--suppress JSCheckFunctionSignatures -->
<template>
  <q-btn
    round
    icon="library_books"
    color="primary"
    @click="$router.push(routeWithFilter)"
    @click.middle="openInNewTab($router.resolve(routeWithFilter).href)"
  >
    <q-tooltip :delay="delay">{{ title }}</q-tooltip>
    <ContextMenu :route-to-open="$router.resolve(routeWithFilter).href"></ContextMenu>
  </q-btn>
</template>

<script>
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";
import ContextMenu from "@/components/ContextMenu.vue";
export default {
  name: "BrowseEntitiesButton",
  components: { ContextMenu },
  mixins: [openInNewTabMixin],
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
