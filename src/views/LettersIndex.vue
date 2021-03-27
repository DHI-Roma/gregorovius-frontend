<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-3">
        <q-card flat class="transparent">
          <div class="q-gutter-sm col justify-center" style="max-width: 500px">
            <div class="q-pa-md">
              <q-input
                v-model="searchInput"
                label="Volltextsuche"
                debounce="300"
                outlined
                @input="getSearchResults()"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <select-auto-complete
              label="Empfänger"
              entity="recipient"
              :options="uniqueRecipients"
            />
            <select-auto-complete
              label="Schreibort"
              entity="placeSent"
              :options="uniquePlacesSent"
            />
            <select-auto-complete
              label="Empfangsort"
              entity="placeReceived"
              :options="uniquePlacesReceived"
            />
            <select-years label="Jahre" entity="years" :options="uniqueYears" />
          </div>
        </q-card>
      </div>
      <div class="q-pa-md col-12 col-md-9">
        <q-table
          :data="letters"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :filter-method="filterLetters"
          :pagination.sync="pagination"
          :loading="loading"
          :visible-columns="visibleColumns"
          binary-state-sort
          flat
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              class="cursor-pointer"
              :class="searchInput ? 'cursor-pointer g-searchrow' : 'cursor-pointer'"
              @click.native="$router.push({ name: 'Brief', params: { id: props.row.id } })"
            >
              <q-menu touch-position context-menu>
                <q-list dense style="min-width: 100px">
                  <q-item v-close-popup clickable @click.native="openItem(props.row.id, 'window')">
                    <q-item-section>In neuem Fenster öffnen</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item v-close-popup clickable @click.native="openItem(props.row.id, 'tab')">
                    <q-item-section>In neuem Tab öffnen</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>

              <q-td key="desc" :props="props">
                {{ props.row.name }}
                <q-btn
                  dense
                  round
                  flat
                  :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'"
                  @click="props.expand = !props.expand"
                />
              </q-td>
              <q-td key="date" :props="props">{{ props.row.properties.date | formatDate }}</q-td>
              <q-td key="recipient" :props="props">{{
                getFullNameArray(props.row.properties.recipient).join("; ")
              }}</q-td>
              <q-td key="placeSent" :props="props">{{
                getFullName(props.row.properties.place.sent, "o. O")
              }}</q-td>
              <q-td key="placeRecv" :props="props">{{
                getFullName(props.row.properties.place.received, "o. O.")
              }}</q-td>
            </q-tr>
            <q-tr v-if="searchInput" :props="props" no-hover>
              <q-td colspan="100%" class="bg-grey-1 text-grey-8">
                <div class="g-searchresult text-left">
                  <q-icon name="search" class="q-mr-md text-primary" />
                  „{{ getKwic(props.row.id).previous }}
                  <div class="g-keyword text-primary text-bold">{{ getKwic(props.row.id).hi }}</div>
                  {{ getKwic(props.row.id).following }}“
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { dataService } from "../shared";
import SelectAutoComplete from "../components/SelectAutoComplete.vue";
import SelectYears from "../components/SelectYears.vue";

export default {
  name: "LettersIndex",
  components: {
    SelectAutoComplete,
    SelectYears
  },
  filters: {
    formatDate(isoDate) {
      const date = isoDate ? new Date(isoDate) : new Date("2000");
      if (date.getFullYear() != "2000") {
        return date.toLocaleDateString("de-DE", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      } else {
        return "o. D.";
      }
    }
  },
  data() {
    return {
      searchInput: "",
      model: "",
      visibleColumns: ["date", "recipient", "placeSent", "placeRecv"],
      filter: {
        recipient: "",
        placeSent: "",
        placeReceived: "",
        years: [],
        resp: "",
        searchResults: []
      },
      loading: this.$store.state.isLoading,
      pagination: {
        rowsPerPage: 20,
        sortBy: "date"
      },
      columns: [
        {
          name: "date",
          required: true,
          label: "Schreibdatum",
          align: "left",
          field: row => (row.properties.date ? new Date(row.properties.date) : new Date("2000")),
          sortable: true
        },
        {
          name: "recipient",
          required: true,
          label: "Empfänger",
          align: "left",
          field: row => this.getFullNameArray(row.properties.recipient),
          sortable: true
        },
        {
          name: "placeSent",
          required: true,
          label: "Schreibort",
          align: "left",
          field: row => this.getFullName(row.properties.place.sent, "o. O."),
          sortable: true
        },
        {
          name: "placeRecv",
          required: true,
          label: "Empfangsort",
          align: "left",
          field: row => this.getFullName(row.properties.place.received, "o. O."),
          sortable: true
        },
        {
          name: "resp",
          label: "resp",
          field: row => row.properties.resp
        }
      ],
      data: []
    };
  },

  computed: {
    fullNameIndex() {
      return this.$store.getters.fullNameIndex;
    },

    letters() {
      return this.$store.getters.letters;
    },

    uniqueRecipients() {
      return this.getArrayOptions("letters", "recipient");
    },

    uniquePlacesSent() {
      return this.getOptions("letters", "place.sent");
    },

    uniquePlacesReceived() {
      return this.getOptions("letters", "place.received");
    },

    uniqueYears() {
      const years = this.letters.map(e => {
        if (e.properties.date !== null) {
          return e.properties.date.slice(0, 4);
        }
      });
      return [...new Set(years)].filter(year => year !== undefined).sort();
    }
  },
  created() {
    for (const [paramKey, paramValue] of Object.entries(this.$route.query)) {
      if (paramKey === "years") {
        try {
          this.setSelectedAction({ entity: paramKey, value: paramValue.split(",") });
        } catch (error) {
          console.log(error);
        }
      } else {
        this.setSelectedAction({ entity: paramKey, value: paramValue });
      }
    }
  },
  async mounted() {
    this.$store.watch(
      (state, getters) => getters.loading,
      newValue => {
        this.loading = newValue;
      }
    );
    await this.$store.dispatch("loadFullNameIndexAction");
    this.loadAll();
  },
  methods: {
    ...mapActions(["loadLettersAction", "setLoadingStatus", "setSelectedAction"]),

    async getSearchResults() {
      this.loading = true;
      try {
        const { results } = await dataService.getSearchResults("letters", this.searchInput);
        this.filter.searchResults = results ? results : [];
      } catch (error) {
        console.log(error);
        this.filter.searchResults = [];
      }
      this.loading = false;
    },

    loadAll() {
      ["recipient", "placeReceived", "placeSent"].map(this.watchQueryParam);
      this.watchQueryParamYears();
      if (this.$store.getters.letters.length == 0) {
        this.loadLettersAction();
      }
      this.filter.recipient = this.$route.query.recipient || "";
      this.filter.placeSent = this.$route.query.placeSent || "";
      this.filter.placeReceived = this.$route.query.placeReceived || "";
      this.filter.years = this.$route.query.years || [];
      this.filter.resp = this.$route.query.resp || "";
    },

    getFullName(id, altName) {
      const fullName = this.fullNameIndex[id];
      return fullName || altName;
    },

    getFullNameArray(nameIdArray) {
      if (nameIdArray) {
        return nameIdArray.map(r => this.getFullName(r, "NN"));
      }
      return [];
    },

    getKwic(entityId) {
      return this.filter.searchResults.find(result => result.entity_id === entityId);
    },

    getArrayOptions(entityName, propertyName) {
      // Get a set of possible values from an array property
      const optionIds = [].concat.apply(
        [],
        this[entityName].map(e => {
          const stack = propertyName.split(".");
          var output = e.properties;
          while (stack.length > 1) {
            output = output[stack.shift()];
          }
          return output[stack.shift()];
        })
      );
      const uniqueIds = [...new Set(optionIds)].filter(id => id !== null);
      const idNameMap = uniqueIds.map(id => ({
        label: this.getFullName(id, "NN"),
        value: id
      }));
      return idNameMap;
    },

    getOptions(entityName, propertyName) {
      // Get a set of possible values from a string property
      const optionIds = this[entityName].map(e => {
        const stack = propertyName.split(".");
        var output = e.properties;
        while (stack.length > 1) {
          output = output[stack.shift()];
        }
        return output[stack.shift()];
      });
      const uniqueIds = [...new Set(optionIds)].filter(id => id !== null);
      const idNameMap = uniqueIds.map(id => ({
        label: this.getFullName(id, "NN"),
        value: id
      }));
      return idNameMap;
    },

    hasValue(item, property, value) {
      // Check if a property (Array or String) contains or is equal to a value
      const stack = property.split(".");
      var prop = item.properties;
      while (stack.length > 1) {
        prop = prop[stack.shift()];
      }
      prop = prop[stack.shift()];

      if (prop instanceof Array) {
        return prop.includes(value);
      }
      return prop === value;
    },

    filterItems(objectArray, property, value) {
      const filtered = objectArray.filter(item => this.hasValue(item, property, value));
      return filtered;
    },

    filterLetters(rows, terms) {
      if (terms.recipient !== "") {
        rows = rows.filter(r => this.hasValue(r, "recipient", terms.recipient));
      }
      if (terms.placeSent !== "") {
        rows = rows.filter(r => this.hasValue(r, "place.sent", terms.placeSent));
      }
      if (terms.placeReceived !== "") {
        rows = rows.filter(r => this.hasValue(r, "place.received", terms.placeReceived));
      }
      if (terms.years.length > 0) {
        rows = rows.filter(r =>
          !r.properties.date ? false : terms.years.includes(r.properties.date.slice(0, 4))
        );
      }
      if (terms.resp !== "") {
        rows = rows.filter(r =>
          !r.properties.resp ? false : r.properties.resp.includes(terms.resp)
        );
      }
      if (this.searchInput) {
        const ids = terms.searchResults.map(result => result.entity_id);
        rows = rows.filter(r => ids.includes(r.id));
      }
      return rows;
    },

    watchQueryParam(entityKey) {
      const selectedEntityKey = "selected" + entityKey[0].toUpperCase() + entityKey.slice(1);
      this.$store.watch(
        (state, getters) => getters[selectedEntityKey],
        newValue => {
          this.filter[entityKey] = newValue.value;
          if (newValue.value == "") {
            var newQuery = { ...this.$route.query };
            delete newQuery[entityKey];
            this.$router.push({ query: newQuery });
          } else {
            this.$router.push({
              query: Object.assign({}, this.$route.query, { [entityKey]: newValue.value })
            });
          }
        }
      );
    },

    watchQueryParamYears() {
      this.$store.watch(
        (state, getters) => getters.selectedYears,
        newValue => {
          this.filter.years = newValue;
          if (newValue == []) {
            var newQuery = { ...this.$route.query };
            delete newQuery.years;
            this.$router.push({ query: newQuery });
          } else {
            this.$router.push({
              query: Object.assign({}, this.$route.query, { years: newValue.join() })
            });
          }
        }
      );
    },

    openItem(id, target) {
      let routeData = this.$router.resolve({ name: "Brief", params: { id: id } });
      switch (target) {
        case "tab":
          window.open(routeData.href, "_blank");
          break;
        case "window": {
          const width = window.outerWidth;
          const height = window.outerHeight;
          const strWindowFeatures = `resizable,location=yes,height=${height},width=${width},scrollbars=yes,status=yes`;
          window.open(routeData.href, "_blank", strWindowFeatures);
          break;
        }
      }
    },
    loadQueryToStore() {}
  }
};
</script>

<style>
.g-searchresult {
  font-family: Cardo;
  font-size: 1.2em;
}
.g-searchrow td {
  border-bottom: 0 !important;
}
.g-keyword {
  display: inline;
}
</style>
