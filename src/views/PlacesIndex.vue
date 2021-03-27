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
                <q-item
                  class="cursor-pointer g-card"
                  @click.native="$router.push({ path: `/places/${props.row.id}` })"
                >
                  <q-item-section>
                    <q-item-label>{{ fullNameIndex[props.row.id] }}</q-item-label>
                  </q-item-section>
                  <q-chip
                    v-if="false"
                    size="12px"
                    :color="props.row.properties.type | getTypeChipColor"
                  >
                    {{ props.row.properties.type | formatPlaceType }}
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
  name: "PlacesIndex",
  filters: {
    formatPlaceType(rawType) {
      if (rawType === "mythological") {
        return "Mythischer Ort";
      }
      if (rawType === "building") {
        return "Gebäude";
      }
      if (rawType === "monument") {
        return "Monument";
      }
      if (rawType === "river") {
        return "Gewässer";
      }
      if (rawType === "mountains") {
        return "Gebirge";
      }
      if (rawType === "settlement") {
        return "Siedlung";
      }
      if (rawType === "district") {
        return "Stadtviertel";
      }
      return rawType;
    },
    getTypeChipColor(rawType) {
      if (rawType === "mythological") {
        return "pink-1";
      }
      if (rawType === "building") {
        return "green-1";
      }
      if (rawType === "monument") {
        return "cyan-1";
      }
      if (rawType === "river") {
        return "blue-1";
      }
      if (rawType === "mountains") {
        return "grey-2";
      }
      if (rawType === "settlement") {
        return "brown-1";
      }
      if (rawType === "district") {
        return "yellow-1";
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
    fullNameIndex() {
      return this.$store.getters.fullNameIndex;
    },
    places() {
      return this.$store.getters.places;
    }
  },

  async mounted() {
    this.getItems();
  },

  methods: {
    async getItems() {
      await this.$store.dispatch("loadFullNameIndexAction");
      await this.$store.dispatch("loadPlacesAction");
      this.loading = false;
    }
  }
};
</script>

<style>
.g-card:hover {
  background: #f7f7f7;
}
</style>
