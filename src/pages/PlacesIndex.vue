<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        grid
        :rows="places"
        :columns="columns"
        row-key="id"
        :filter="filter"
        v-model:pagination="pagination"
        :loading="loading"
        flat
      >
        <template #top-left>
          <q-input v-model="filter" borderless dense debounce="300" placeholder="Suche">
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card>
              <q-separator />
              <q-list>
                <PlaceTile :place="props.row" />
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useMainStore } from 'src/stores/main';
import { storeToRefs } from 'pinia';
import PlaceTile from 'src/components/PlaceTile.vue';

export default defineComponent({
  name: 'PlacesIndex',

  components: {
    PlaceTile,
  },

  setup() {
    const store = useMainStore();
    const { places } = storeToRefs(store);

    const filter = ref('');
    const loading = ref(true);
    const pagination = ref({
      rowsPerPage: 50,
      sortBy: 'toponym',
    });

    const columns = [
      {
        name: 'toponym',
        required: true,
        label: 'Ortsname',
        align: 'left',
        field: (row) => row.properties.name.toponym,
        sortable: true,
      },
    ];

    async function getItems() {
      await Promise.all([store.loadFullNameIndex(), store.loadEntities()]);
      loading.value = false;
    }

    onMounted(async () => {
      loading.value = true;
      await getItems();
    });

    return {
      places,
      filter,
      loading,
      pagination,
      columns,
    };
  },
});
</script>
