<template>
  <q-item :to="route" class="g-card">
    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
    <q-chip
      v-if="place.properties.type"
      size="12px"
      :color="getTypeChipColor(place.properties.type)"
    >
      {{ formatPlaceType(place.properties.type) }}
    </q-chip>
  </q-item>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import placeService from "src/services/place-service";

export default defineComponent({
  name: "PlaceTile",

  props: {
    place: {
      type: [Object, Promise],
      required: true,
      default: null,
    },
  },

  setup(props) {
    const store = useMainStore();
    const router = useRouter();
    const { fullNameIndex } = storeToRefs(store);

    function formatPlaceType(rawType) {
      return placeService.getPlaceTypeTranslation(rawType);
    }

    function getTypeChipColor(rawType) {
      return placeService.getPlaceTypeClass(rawType);
    }

    const route = computed(() => {
      return { path: `/places/${props.place.id}` };
    });

    const name = computed(() => {
      const fullName = fullNameIndex.value[props.place.id];
      if (fullName) return fullName;
      return props.place.properties.name.toponym;
    });

    return {
      router,
      route,
      name,
      formatPlaceType,
      getTypeChipColor,
    };
  },
});
</script>

<style scoped>
.g-card:hover {
  background: #f7f7f7;
}
</style>
