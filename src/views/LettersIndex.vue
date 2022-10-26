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
                debounce="550"
                outlined
                @input="getSearchResults()"
                @keyup.enter="getSearchResults()"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <div v-if="phraseSearchHint" id="phrase-search-hint" class="text-caption text-grey-8">
                {{ phraseSearchHint }}
              </div>
            </div>
            <multiple-select-auto-complete
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
            <select-years label="Jahre" entity="years" :options="yearsInLetters" />
          </div>
        </q-card>
      </div>
      <div class="q-pa-md col-12 col-md-9">
        <q-table
          ref="table"
          :data="letterEntries"
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
              @click.native="openItem('default', props.row.id)"
              @click.middle="openItem('tab', props.row.id)"
            >
              <q-menu touch-position context-menu>
                <q-list dense style="min-width: 100px">
                  <q-item v-close-popup clickable @click.native="openItem('tab', props.row.id)">
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
            <template v-if="searchInput">
              <q-tr
                :props="props"
                no-hover
                v-for="(searchResult, index) in getKwic(props.row.id)"
                :key="searchResult.entity_id + '--' + searchResult.entity_related_id + '--' + index"
              >
                <q-td colspan="100%" class="bg-grey-1 text-grey-8">
                  <div
                    class="g-searchresult text-left"
                    :class="['g-searchresult-' + searchResult.type]"
                  >
                    <q-icon :name="searchResult.icon" class="q-mr-md text-primary" />
                    „{{ searchResult.previous }}
                    <div class="g-keyword text-primary text-bold">
                      {{ searchResult.hi }}
                    </div>
                    {{ searchResult.following }}“
                  </div>
                </q-td>
              </q-tr>
            </template>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { dataService } from "../shared";
import tableService from "@/services/table-service";
import SelectAutoComplete from "../components/SelectAutoComplete.vue";
import MultipleSelectAutoComplete from "../components/MultipleSelectAutoComplete.vue";
import SelectYears from "../components/SelectYears.vue";
import { QCard, QInput, QPage, QTable } from "quasar";

export default {
  name: "LettersIndex",
  components: {
    MultipleSelectAutoComplete,
    SelectAutoComplete,
    SelectYears,
    QCard,
    QInput,
    QPage,
    QTable
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
      uniqueYears: [],
      filter: {
        recipient: [],
        placeSent: "",
        placeReceived: "",
        years: [],
        resp: "",
        searchResults: []
      },
      loading: this.$store.getters.loading,
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
    ...mapGetters([
      "fullNameIndex",
      "letters",
      "yearsInLetters",
      "selectedRecipients",
      "selectedPlaceSent",
      "selectedPlaceReceived",
      "selectedYears"
    ]),
    letterEntries() {
      if (!this.letters.length || !Object.entries(this.fullNameIndex).length) {
        return [];
      }

      return this.letters;
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

    phraseSearchHint() {
      const quoteCount = (this.searchInput.match(/"/g) || []).length;

      if (quoteCount === 0) {
        return "";
      }

      if (quoteCount % 2 === 1) {
        return `Ungerade Anzahl an Anführungszeichen (") entdeckt. Möchten Sie eine Phrasensuche auszuführen?`;
      }

      return "Phrasensuche aktiviert";
    }
  },
  watch: {
    selectedRecipients: function(newValue) {
      this.applyMultiRouteParams("recipient", newValue);
    },
    selectedPlaceSent: function(newValue) {
      this.applySingleRouteParam("placeSent", newValue);
    },
    selectedPlaceReceived: function(newValue) {
      this.applySingleRouteParam("placeReceived", newValue);
    },
    selectedYears: function(newValue) {
      this.applyMultiRouteParams("years", newValue);
    }
  },
  created() {
    for (const [paramKey, paramValue] of Object.entries(this.$route.query)) {
      if (paramKey === "years" || paramKey === "recipient") {
        try {
          this.setSelectedAction({
            entity: paramKey,
            value: paramValue.split(",").filter(entry => entry.length > 0)
          });
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

    this.$watch(
      () => {
        return this.$refs.table.filteredSortedRows;
      },
      filteredSortedRows => {
        this.setLettersFiltered(filteredSortedRows);
      }
    );

    await Promise.all([
      this.$store.dispatch("loadFullNameIndexAction"),
      this.loadAll(),
    ]);
  },
  methods: {
    ...mapActions([
      "loadEntitiesAction",
      "setLoadingStatus",
      "setSelectedAction",
      "setLettersFiltered"
    ]),

    async getSearchResults() {
      this.loading = true;
      try {
        const responseLetters = await dataService.getSearchResults("letters", this.searchInput);
        const responseComments = await dataService.getSearchResults("comments", this.searchInput);

        const resultsLetters = responseLetters.results.map(result => {
          return {
            ...result,
            type: "letter",
            icon: "search"
          };
        });

        const resultsComments = responseComments.results.map(result => {
          return {
            ...result,
            type: "comment",
            icon: "comment"
          };
        });

        const results = [].concat(resultsLetters).concat(resultsComments);

        this.filter.searchResults = results ? results : [];
      } catch (error) {
        this.filter.searchResults = [];
      }
      this.loading = false;
    },

    applySingleRouteParam(entityKey, payload) {
      if (!Object.keys(this.$route.query).length) {
        return;
      }
      this.filter[entityKey] = payload.value;
      if (payload.value == "") {
        var newQuery = { ...this.$route.query };
        delete newQuery[entityKey];
        this.$router.push({ query: newQuery });
      } else {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            [entityKey]: payload.value
          })
        });
      }
    },

    applyMultiRouteParams(entityKey, payload) {
      if (!Object.keys(this.$route.query).length) {
        return;
      }
      this.filter[entityKey] = payload.value;
      if (!payload.length) {
        var newQuery = { ...this.$route.query };
        delete newQuery[entityKey];
        this.$router.push({ query: newQuery });
      } else {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            [entityKey]: payload.join()
          })
        });
      }
    },

    async loadAll() {
      await this.loadEntitiesAction();
      this.resetFilter();
    },

    resetFilter() {
      this.filter.recipient = this.$route.query.recipient || [];
      this.filter.placeSent = this.$route.query.placeSent || "";
      this.filter.placeReceived = this.$route.query.placeReceived || "";
      this.filter.years = this.$route.query.years || [];
      this.filter.resp = this.$route.query.resp || "";

      if (!this.filter.recipient.length) {
        this.setSelectedAction({
          entity: "recipient",
          value: []
        });
      }

      if (!this.filter.placeSent.value) {
        this.setSelectedAction({
          entity: "placeSent",
          value: ""
        });
      }

      if (!this.filter.placeReceived.value) {
        this.setSelectedAction({
          entity: "placeReceived",
          value: ""
        });
      }

      if (!this.filter.years.length) {
        this.setSelectedAction({
          entity: "years",
          value: []
        });
      }
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
      return this.filter.searchResults.filter(result => {
        if (result.entity_related_id) {
          return result.entity_related_id === entityId;
        }
        return result.entity_id === entityId;
      });
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
      const optionIds = this[entityName].map(entity =>
        tableService.traverseObject(entity, propertyName)
      );
      const uniqueIds = [...new Set(optionIds)].filter(id => id !== null);
      const idNameMap = uniqueIds.map(id => ({
        label: this.getFullName(id, "NN"),
        value: id
      }));
      return idNameMap;
    },

    filterLetters(rows, terms) {
      rows = tableService.filterByRecipients(rows, this.selectedRecipients);

      if (this.selectedPlaceSent.value) {
        rows = rows.filter(r =>
          tableService.hasValue(r, "place.sent", this.selectedPlaceSent.value)
        );
      }

      if (this.selectedPlaceReceived.value) {
        rows = rows.filter(r =>
          tableService.hasValue(r, "place.received", this.selectedPlaceReceived.value)
        );
      }

      if (this.selectedYears.length) {
        rows = rows.filter(r =>
          !r.properties.date ? false : this.selectedYears.includes(r.properties.date.slice(0, 4))
        );
      }

      if (terms.resp !== "") {
        rows = rows.filter(r =>
          !r.properties.resp ? false : r.properties.resp.includes(terms.resp)
        );
      }

      if (this.searchInput) {
        const ids = terms.searchResults.map(result => {
          if (result.entity_related_id) {
            return result.entity_related_id;
          }
          return result.entity_id;
        });
        rows = rows.filter(r => ids.includes(r.id));
      }

      return rows;
    },

    openItem(target, id) {
      const kwicEntry = this.getKwic(id)[0];
      let name = "Brief";
      let params = {
        id: id
      };

      if (kwicEntry && kwicEntry.type === "comment") {
        name = "Brief und Kommentar";
        params = {
          id: kwicEntry.entity_related_id,
          commentId: kwicEntry.entity_id
        };
      }

      const routeData = this.$router.resolve({ name, params });
      switch (target) {
        case "default":
          this.$router.push({ name, params });
          break;
        case "tab":
        case "window":
          window.open(routeData.href, "_blank");
          break;
      }
    },
    loadQueryToStore() {}
  }
};
</script>

<style lang="stylus" scoped>
.g-searchresult
  font-family: Cardo
  font-size: 1.2em

.g-searchresult-comment
  font-family: 'IBMPlexSans'
  font-size: 1em
  padding-left: 1em

.g-searchrow td
  border-bottom: 0 !important

.g-keyword
  display: inline
</style>
