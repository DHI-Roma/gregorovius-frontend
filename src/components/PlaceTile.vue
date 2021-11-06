<template>
  <q-item
    class="cursor-pointer g-card"
    @click.native="$router.push(route)"
    @click.middle="openInNewTab(route)"
  >
    <q-item-section>
      <q-item-label>{{ fullNameIndex[place.id] }}</q-item-label>
    </q-item-section>
    <q-chip
      v-if="place.properties.type"
      size="12px"
      :color="place.properties.type | getTypeChipColor"
    >
      {{ place.properties.type | formatPlaceType }}
    </q-chip>
    <context-menu :route-to-open="$router.resolve(route).href"></context-menu>
  </q-item>
</template>

<script>
import { mapGetters } from "vuex";

import { QChip, QItem, QItemLabel, QItemSection } from "quasar";
import placeService from "@/services/place-service";
import ContextMenu from "./ContextMenu.vue";
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";

export default {
  name: "PlaceTile",
  components: {
    QChip,
    QItem,
    QItemLabel,
    QItemSection,
    ContextMenu
  },
  filters: {
    formatPlaceType(rawType) {
      return placeService.getPlaceTypeTranslation(rawType);
    },
    getTypeChipColor(rawType) {
      return placeService.getPlaceTypeClass(rawType);
    }
  },
  mixins: [openInNewTabMixin],
  props: {
    place: {
      type: [Object, Promise],
      required: true,
      default: null
    }
  },
  computed: {
    ...mapGetters(["fullNameIndex"]),
    route() {
      return { path: `/places/${this.place.id}` };
    }
  },
  methods: {
    openInNewTab() {
      window.open(this.$router.resolve(this.route).href, "_blank");
    }
  }
};
</script>

<style scoped>
.g-card:hover {
  background: #f7f7f7;
}
</style>
