<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        grid
        :data="persons"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :pagination.sync="pagination"
        :loading="this.$store.getters.loading"
        flat
      >
        <template v-slot:top-left>
          <q-input v-model="filter" borderless dense debounce="300" placeholder="Suche">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card>
              <q-separator />
              <q-list>
                <q-item
                  class="cursor-pointer g-card"
                  @click.native="$router.push({ path: `/persons/${props.row.id}` })"
                >
                  <q-item-section>
                    <q-item-label>{{ props.row.properties.name.fullName }}</q-item-label>
                  </q-item-section>
                  <q-chip
                    size="12px"
                    :color="props.row.properties.type === 'org' ? 'blue-1' : 'orange-1'"
                  >
                    {{ props.row.properties.type | formatPersonType }}
                  </q-chip>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PersonsIndex",
  filters: {
    formatPersonType(rawType) {
      if (rawType === "org") {
        return "Körperschaft";
      }
      if (rawType === "person") {
        return "Person";
      }
      return rawType;
    }
  },

  data() {
    return {
      filter: "",
      loading: true,
      pagination: {
        rowsPerPage: 50,
        sortBy: "name"
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row =>
            row.properties.name.orgName ||
            row.properties.name.simpleName ||
            row.properties.name.surname,
          sortable: true
        }
      ],
      data: []
    };
  },

  computed: {
    persons() {
      return this.$store.getters.persons;
    }
  },

  async mounted() {
    await this.$store.dispatch("loadFullNameIndexAction");
    this.loading = false;
  }
};
</script>

<style>
.g-card:hover {
  background: #f7f7f7;
}
</style>
