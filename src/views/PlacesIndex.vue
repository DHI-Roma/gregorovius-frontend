<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        grid
        :data="places"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :pagination.sync="pagination"
        :loading="loading"
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
                <PlaceTile :place="props.row"></PlaceTile>
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import PlaceTile from "@/components/PlaceTile.vue";
export default {
  name: "PlacesIndex",
  components: {
    PlaceTile
  },
  data() {
    return {
      filter: "",
      loading: true,
      pagination: {
        rowsPerPage: 50,
        sortBy: "toponym"
      },
      columns: [
        {
          name: "toponym",
          required: true,
          label: "Ortsname",
          align: "left",
          field: row => row.properties.name.toponym,
          sortable: true
        }
      ],
      data: []
    };
  },

  computed: {
    ...mapGetters(["places"])
  },

  async mounted() {
    this.loading = true;
    await this.getItems();
  },

  methods: {
    async getItems() {
      await Promise.all([
        this.$store.dispatch("loadFullNameIndexAction"),
        this.$store.dispatch("loadEntitiesAction")
      ]);
      this.loading = false;
    }
  }
};
</script>
