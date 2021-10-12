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
              <q-list class="g-card-list">
                <PersonTile :person="props.row"></PersonTile>
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { QPage, QTable } from "quasar";
import PersonTile from "@/components/PersonTile.vue";

export default {
  name: "PersonsIndex",
  components: {
    QPage,
    QTable,
    PersonTile
  },

  data() {
    return {
      filter: "",
      loading: true,
      pagination: {
        rowsPerPage: 32,
        sortBy: "name"
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => {
            return [
              row.properties.name.surname,
              row.properties.name.forename,
              row.properties.name.simpleName,
              row.properties.name.roleName,
              row.properties.name.orgName,
              row.properties.name.fullName,
              row.properties.name.altSurname,
              row.properties.name.altForename,
              row.properties.name.altSimpleName
            ]
              .filter(content => content)
              .join(" ");
          },
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
    await this.loadFullNameIndexAction();
    this.loading = false;
  },
  methods: {
    ...mapActions(["loadFullNameIndexAction"])
  }
};
</script>

<style>
.g-card:hover {
  background: #f7f7f7;
}

.g-card-list {
  height: 5.5em;
}
</style>
