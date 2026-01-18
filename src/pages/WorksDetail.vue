<template>
  <div>
    <q-page v-show="!storeLoading && !isLoading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <v-runtime-template :template="title" />
            </q-card-section>
            <q-separator dark />
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable
            :entity-id="entityId"
            entity-name="Dieser Titel"
            entity-type="works"
          />
        </div>
      </div>
    </q-page>
    <q-page v-show="storeLoading || isLoading">
      <div class="q-pt-xl row justify-center">
        <q-spinner-oval color="primary" size="5em" />
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import VRuntimeTemplate from "vue3-runtime-template";
import { dataService } from "src/shared";
import MentionsTable from "src/components/MentionsTable.vue";
import { API } from "../../env";

export default defineComponent({
  name: "WorksDetail",
  components: {
    MentionsTable,
    VRuntimeTemplate,
  },

  setup() {
    const store = useMainStore();
    const route = useRoute();
    const { loading: storeLoading } = storeToRefs(store);

    const data = ref([]);
    const title = ref("");
    const isLoading = ref(true);

    const entityId = computed(() => route.params.id);

    async function getItems() {
      try {
        const response = await fetch(`${API}${route.path}`, {
          headers: { Accept: "application/json" },
        });
        data.value = await response.json();
      } catch (error) {
        console.error(error);
      }
    }

    async function getXSLT(fileName) {
      title.value = await dataService.XSLTransform(route.path, fileName);
    }

    onBeforeMount(async () => {
      await getItems();
      await getXSLT("WorkTitle");
      isLoading.value = false;
    });

    return {
      data,
      title,
      isLoading,
      storeLoading,
      entityId,
    };
  },
});
</script>

<style></style>
