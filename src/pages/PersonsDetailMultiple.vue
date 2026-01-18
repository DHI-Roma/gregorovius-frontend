<template>
  <div>
    <q-page v-show="!storeLoading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section v-if="personsData.length === entities.length">
              <div class="text-h6">
                Mehrfache Indizierung von Personen
              </div>
              <div v-for="(entity, index) in entities" :key="entity.id">
                <PersonsTitle
                  :entity="entity"
                  :person="getPersonById(entity.id)"
                  :is-list="true"
                ></PersonsTitle>
                <q-separator v-if="index < entities.length - 1" spaced></q-separator>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable
            :entity-id="entityIds.join(' ')"
            entity-name="Diese Sammlung von Personen"
            entity-type="persons"
          />
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
import { useAttrs } from "vue";
import MentionsTable from "src/components/MentionsTable.vue";
import PersonsTitle from "src/components/PersonsTitle.vue";
import { dataService } from "src/shared";

export default defineComponent({
  name: "PersonsDetailMultiple",
  components: {
    PersonsTitle,
    MentionsTable,
  },

  setup() {
    const store = useMainStore();
    const attrs = useAttrs();
    const { persons, loading: storeLoading } = storeToRefs(store);

    const loading = ref(false);
    const personsData = ref([]);

    const entityIds = computed(() => {
      return [...new Set(attrs.ids.split(","))];
    });

    const entities = computed(() => {
      if (!persons.value.length) return [];
      const entityList = [];
      entityIds.value.forEach((entityId) => {
        const entity = persons.value.find((person) => person.id === entityId);
        if (entity) entityList.push(entity);
      });
      return entityList;
    });

    async function getItem(entityId) {
      const data = await dataService.getEntity("persons", entityId, "json");
      return data;
    }

    function getPersonById(entityId) {
      return personsData.value.find((person) => person["@xml:id"] === entityId);
    }

    onMounted(async () => {
      if (!persons.value.length) {
        await store.loadFullNameIndex();
      }
      entityIds.value.forEach((entityId) => {
        getItem(entityId).then((data) => {
          personsData.value.push(data.person);
        });
      });
    });

    return {
      loading,
      storeLoading,
      personsData,
      entityIds,
      entities,
      getPersonById,
    };
  },
});
</script>
