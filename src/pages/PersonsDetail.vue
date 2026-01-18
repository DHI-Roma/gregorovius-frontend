<template>
  <div>
    <q-page v-show="!storeLoading && !loading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <PersonsTitle :person="data.person" :entity="entity"></PersonsTitle>
        </div>
      </div>
      <div v-if="correspondences.length" id="correspondences" class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <CorrespondenceTable
            :letters="correspondences"
            :recipient-id="entityId"
          ></CorrespondenceTable>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable :entity-id="entityId" :entity-name="entityName" entity-type="persons" />
        </div>
      </div>

      <div v-if="gnd.length" class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-sm">
          <PersonSeeAlsoTable :gnd="gnd"></PersonSeeAlsoTable>
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
import CorrespondenceTable from "src/components/CorrespondenceTable.vue";
import PersonsTitle from "src/components/PersonsTitle.vue";
import { dataService } from "src/shared";
import beaconService from "src/services/beacon-service";
import PersonSeeAlsoTable from "src/components/PersonSeeAlsoTable.vue";

export default defineComponent({
  name: "PersonsDetail",
  components: {
    PersonSeeAlsoTable,
    MentionsTable,
    CorrespondenceTable,
    PersonsTitle,
  },

  setup() {
    const store = useMainStore();
    const route = useRoute();
    const { persons, letters, loading: storeLoading } = storeToRefs(store);

    const data = ref({
      person: {
        persName: "",
        birth: "",
        death: "",
        idno: "",
        note: "",
      },
    });
    const loading = ref(true);
    const entityName = ref("persons");

    const entityId = computed(() => route.params.id);

    const entity = computed(() => {
      if (!persons.value.length) return {};
      return persons.value.find((person) => person.id === entityId.value);
    });

    const gnd = computed(() => {
      if (!persons.value.length) return false;
      if (!beaconService.hasGnd(entity.value)) return false;
      return beaconService.getGnd(entity.value);
    });

    const correspondences = computed(() => {
      if (!letters.value.length) return [];
      return letters.value
        .filter(
          (letter) =>
            letter.properties.sender.includes(entityId.value) ||
            letter.properties.recipient.includes(entityId.value)
        )
        .sort((letterA, letterB) => {
          if (letterA.properties.date > letterB.properties.date) return 1;
          if (letterA.properties.date < letterB.properties.date) return -1;
          return 0;
        });
    });

    async function getItems() {
      const fetchedData = await dataService.getEntity("persons", route.params.id, "json");
      data.value = { ...data.value, ...fetchedData };
      loading.value = false;
    }

    onMounted(async () => {
      await Promise.all([getItems(), store.loadFullNameIndex()]);
    });

    return {
      data,
      loading,
      storeLoading,
      entityName,
      entityId,
      entity,
      gnd,
      correspondences,
    };
  },
});
</script>
