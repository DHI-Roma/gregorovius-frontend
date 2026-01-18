<template>
  <div>
    <q-page v-show="!storeLoading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">
                Mehrfache Indizierung von Werken
              </div>
            </q-card-section>
            <q-card-section v-for="title in titles" :key="title">
              <v-runtime-template :template="title" />
            </q-card-section>
            <q-separator dark />
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable
            :entity-id="ids.join(' ')"
            entity-name="Diese Sammlung von Titeln"
            entity-type="works"
          />
        </div>
      </div>
    </q-page>
    <q-page v-show="storeLoading">
      <div class="q-pt-xl row justify-center">
        <q-spinner-hourglass color="primary" size="5em" />
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useAttrs } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";
import { dataService } from "src/shared";
import MentionsTable from "src/components/MentionsTable.vue";

export default defineComponent({
  name: "WorksDetailMultiple",
  components: {
    MentionsTable,
    VRuntimeTemplate,
  },

  setup() {
    const store = useMainStore();
    const attrs = useAttrs();
    const { loading: storeLoading } = storeToRefs(store);

    const titles = ref([]);

    const ids = computed(() => {
      return attrs.ids ? attrs.ids.split(",") : [];
    });

    async function getXSLT(fileName, id) {
      try {
        const result = await dataService.XSLTransform(`works/${id}`, fileName);
        titles.value.push(result);
      } catch (error) {
        console.error(error);
      }
    }

    onMounted(() => {
      ids.value.forEach(async (id) => {
        await getXSLT("WorkTitle", id);
      });
    });

    return {
      titles,
      ids,
      storeLoading,
    };
  },
});
</script>

<style></style>
