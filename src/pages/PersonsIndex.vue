<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        grid
        :rows="persons"
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
              <q-list class="g-card-list">
                <PersonTile :person="props.row" />
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
import PersonTile from 'src/components/PersonTile.vue';

export default defineComponent({
  name: 'PersonsIndex',

  components: {
    PersonTile,
  },

  setup() {
    const store = useMainStore();
    const { persons } = storeToRefs(store);

    const filter = ref('');
    const loading = ref(true);
    const pagination = ref({
      rowsPerPage: 32,
      sortBy: 'name',
    });

    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: (row) => {
          return [
            row.properties.name.surname,
            row.properties.name.forename,
            row.properties.name.simpleName,
            row.properties.name.roleName,
            row.properties.name.orgName,
            row.properties.name.fullName,
            row.properties.name.altSurname,
            row.properties.name.altForename,
            row.properties.name.altSimpleName,
          ]
            .filter((content) => content)
            .join(' ');
        },
        sortable: true,
      },
    ];

    onMounted(async () => {
      await store.loadFullNameIndex();
      loading.value = false;
    });

    return {
      persons,
      filter,
      loading,
      pagination,
      columns,
    };
  },
});
</script>

<style scoped>
.g-card:hover {
  background: #f7f7f7;
}
</style>
