<template>
  <q-item
    clickable
    class="cursor-pointer g-card"
    @click="router.push(route)"
    @click.middle="openInNewTab(route)"
  >
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
    <context-menu :route-to-open="router.resolve(route).href"></context-menu>
  </q-item>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import placeService from "src/services/place-service";
import ContextMenu from "./ContextMenu.vue";

export default defineComponent({
  name: "PlaceTile",
  components: {
    ContextMenu,
  },

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

    function openInNewTab(route) {
      const resolved = router.resolve(route);
      window.open(resolved.href, "_blank");
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
      openInNewTab,
    };
  },
});
</script>

<style scoped>
.g-card:hover {
  background: #f7f7f7;
}
</style>
