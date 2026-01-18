<template>
  <div>
    <q-page v-show="!storeLoading && !loading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">{{ name }}</div>
              <div
                v-if="alternativeName"
                id="alternative-name"
                class="text-subtitle3 text-secondary"
              >
                {{ alternativeName }}
              </div>
            </q-card-section>
            <q-card-section>
              <q-chip v-if="placeTypeName" :color="placeTypeClass">{{ placeTypeName }}</q-chip>
              <div v-if="data.place && data.place.idno" class="inline-block">
                <a id="geonames-uri" :href="authorityUri">
                  <q-chip color="blue-1" class="q-ml-none">
                    <q-avatar rounded font-size="11px" color="blue-5" class="text-white">
                      GEO
                    </q-avatar>
                    <div class="text-blue text-caption q-pl-sm">
                      {{ authorityUri }}
                    </div>
                  </q-chip>
                </a>
              </div>
            </q-card-section>
            <q-separator dark />
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable :entity-id="entityId" :entity-name="name" entity-type="places" />
        </div>
      </div>
    </q-page>
    <q-page v-show="storeLoading || loading">
      <div class="q-pt-xl row justify-center">
        <q-spinner-oval color="primary" size="5em" />
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import MentionsTable from "src/components/MentionsTable.vue";
import { dataService } from "src/shared";
import placeService from "src/services/place-service";

export default defineComponent({
  name: "PlacesDetail",
  components: {
    MentionsTable,
  },

  setup() {
    const store = useMainStore();
    const route = useRoute();
    const { fullNameIndex, places, loading: storeLoading } = storeToRefs(store);

    const data = ref([]);
    const loading = ref(true);

    const entityId = computed(() => route.params.id);

    const properties = computed(() => {
      if (!places.value.length) return null;
      const place = places.value.find((p) => p.id === entityId.value);
      return place?.properties;
    });

    const name = computed(() => {
      if (!properties.value) return "";
      const fullName = fullNameIndex.value[route.params.id];
      if (fullName) return fullName;
      return properties.value.name.toponym;
    });

    const authorityUri = computed(() => {
      if (!data.value || !data.value.place?.idno) return "";
      return data.value.place.idno.length > 1
        ? data.value.place.idno[0]["#text"]
        : data.value.place.idno["#text"];
    });

    const placeTypeName = computed(() => {
      if (!properties.value) return "";
      return placeService.getPlaceTypeTranslation(properties.value.type);
    });

    const placeTypeClass = computed(() => {
      if (!properties.value) return "";
      return placeService.getPlaceTypeClass(properties.value.type);
    });

    const alternativeName = computed(() => {
      if (!data.value?.place) return "";
      if (!Array.isArray(data.value.place.placeName)) return "";

      const altName = data.value.place.placeName.find(
        (placeName) => placeName["@type"] === "alt"
      );

      return altName ? altName["#text"] : "";
    });

    async function getItems() {
      const fetchedData = await dataService.getEntity("places", route.params.id, "json");
      data.value = fetchedData;
      loading.value = false;
    }

    onMounted(async () => {
      await Promise.all([
        store.loadFullNameIndex(),
        store.loadEntities(),
        getItems(),
      ]);
    });

    return {
      data,
      loading,
      storeLoading,
      entityId,
      name,
      authorityUri,
      placeTypeName,
      placeTypeClass,
      alternativeName,
    };
  },
});
</script>

<style></style>
