<template>
  <q-item
    class="cursor-pointer g-card"
    @click.native="$router.push({ path: `/places/${place.id}` })"
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
  </q-item>
</template>

<script>
import { mapGetters } from "vuex";

import { QChip, QItem, QItemLabel, QItemSection } from "quasar";
import placeService from "@/services/place-service";

export default {
  name: "PlaceTile",
  components: {
    QChip,
    QItem,
    QItemLabel,
    QItemSection
  },
  filters: {
    formatPlaceType(rawType) {
      return placeService.getPlaceTypeTranslation(rawType);
    },
    getTypeChipColor(rawType) {
      return placeService.getPlaceTypeClass(rawType);
    }
  },
  props: {
    place: {
      type: [Object, Promise],
      required: true,
      default: null
    }
  },
  computed: {
    ...mapGetters(["fullNameIndex"])
  }
};
</script>

<style>
.g-card:hover {
  background: #f7f7f7;
}
</style>
