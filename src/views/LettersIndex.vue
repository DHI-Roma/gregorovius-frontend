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
              :class="
                searchInput ? 'cursor-pointer g-searchrow' : 'cursor-pointer'
              "
              @click.native="openItem('default', props.row.id)"
            >
              <q-menu touch-position context-menu>
                <q-list dense style="min-width: 100px">
                  <q-item
                    v-close-popup
                    clickable
                    @click.native="openItem('window', props.row.id)"
                  >
                    <q-item-section>In neuem Fenster öffnen</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item
                    v-close-popup
                    clickable
                    @click.native="openItem('tab', props.row.id)"
                  >
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
              <q-td key="date" :props="props">{{
                props.row.properties.date | formatDate
              }}</q-td>
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
                    <q-icon
                      :name="searchResult.icon"
                      class="q-mr-md text-primary"
                    />
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
import { mapActions } from "vuex";
import { dataService } from "../shared";
import tableService from "@/services/table-service";
import SelectAutoComplete from "../components/SelectAutoComplete.vue";
import SelectYears from "../components/SelectYears.vue";
import {
  QCard,
  QInput,
  QPage,
  QTable
} from "quasar";

export default {
  name: "LettersIndex",
  components: {
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
          year: "numeric",
        });
      } else {
        return "o. D.";
      }
    },
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
        searchResults: [],
      },
      loading: this.$store.state.isLoading,
      pagination: {
        rowsPerPage: 20,
        sortBy: "date",
      },
      columns: [
        {
          name: "date",
          required: true,
          label: "Schreibdatum",
          align: "left",
          field: (row) =>
            row.properties.date
              ? new Date(row.properties.date)
              : new Date("2000"),
          sortable: true,
        },
        {
          name: "recipient",
          required: true,
          label: "Empfänger",
          align: "left",
          field: (row) => this.getFullNameArray(row.properties.recipient),
          sortable: true,
        },
        {
          name: "placeSent",
          required: true,
          label: "Schreibort",
          align: "left",
          field: (row) => this.getFullName(row.properties.place.sent, "o. O."),
          sortable: true,
        },
        {
          name: "placeRecv",
          required: true,
          label: "Empfangsort",
          align: "left",
          field: (row) =>
            this.getFullName(row.properties.place.received, "o. O."),
          sortable: true,
        },
        {
          name: "resp",
          label: "resp",
          field: (row) => row.properties.resp,
        },
      ],
      data: [],
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
      const years = this.letters.map((e) => {
        if (e.properties.date !== null) {
          return e.properties.date.slice(0, 4);
        }
      });
      return [...new Set(years)].filter((year) => year !== undefined).sort();
    },
  },
  created() {
    for (const [paramKey, paramValue] of Object.entries(this.$route.query)) {
      if (paramKey === "years") {
        try {
          this.setSelectedAction({
            entity: paramKey,
            value: paramValue.split(","),
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
      (newValue) => {
        this.loading = newValue;
      }
    );
    await this.$store.dispatch("loadFullNameIndexAction");
    this.loadAll();
  },
  methods: {
    ...mapActions([
      "loadLettersAction",
      "setLoadingStatus",
      "setSelectedAction",
    ]),

    async getSearchResults() {
      this.loading = true;
      try {
        const responseLetters = await dataService.getSearchResults(
          "letters",
          this.searchInput
        );
        const responseComments = await dataService.getSearchResults(
          "comments",
          this.searchInput
        );

        const resultsLetters = responseLetters.results.map((result) => {
          return {
            ...result,
            type: "letter",
            icon: "search",
          };
        });

        const resultsComments = responseComments.results.map((result) => {
          return {
            ...result,
            type: "comment",
            icon: "comment",
          };
        });

        const results = [].concat(resultsLetters).concat(resultsComments);

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
        return nameIdArray.map((r) => this.getFullName(r, "NN"));
      }
      return [];
    },

    getKwic(entityId) {
      return this.filter.searchResults.filter((result) => {
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
        this[entityName].map((e) => {
          const stack = propertyName.split(".");
          var output = e.properties;
          while (stack.length > 1) {
            output = output[stack.shift()];
          }
          return output[stack.shift()];
        })
      );
      const uniqueIds = [...new Set(optionIds)].filter((id) => id !== null);
      const idNameMap = uniqueIds.map((id) => ({
        label: this.getFullName(id, "NN"),
        value: id,
      }));

      return idNameMap;
    },

    getOptions(entityName, propertyName) {
      // Get a set of possible values from a string property
      const optionIds = this[entityName].map((entity) => tableService.traverseObject(entity, propertyName));
      const uniqueIds = [...new Set(optionIds)].filter((id) => id !== null);
      const idNameMap = uniqueIds.map((id) => ({
        label: this.getFullName(id, "NN"),
        value: id,
      }));
      return idNameMap;
    },

    filterLetters(rows, terms) {
      if (terms.recipient !== "") {
        rows = rows.filter((r) =>
          tableService.hasValue(r, "recipient", terms.recipient)
        );
      }
      if (terms.placeSent !== "") {
        rows = rows.filter((r) =>
          tableService.hasValue(r, "place.sent", terms.placeSent)
        );
      }
      if (terms.placeReceived !== "") {
        rows = rows.filter((r) =>
          tableService.hasValue(r, "place.received", terms.placeReceived)
        );
      }
      if (terms.years.length > 0) {
        rows = rows.filter((r) =>
          !r.properties.date
            ? false
            : terms.years.includes(r.properties.date.slice(0, 4))
        );
      }
      if (terms.resp !== "") {
        rows = rows.filter((r) =>
          !r.properties.resp ? false : r.properties.resp.includes(terms.resp)
        );
      }
      if (this.searchInput) {
        const ids = terms.searchResults.map((result) => {
          if (result.entity_related_id) {
            return result.entity_related_id;
          }
          return result.entity_id;
        });
        rows = rows.filter((r) => ids.includes(r.id));
      }
      console.log(rows);
      return rows;
    },

    watchQueryParam(entityKey) {
      const selectedEntityKey =
        "selected" + entityKey[0].toUpperCase() + entityKey.slice(1);
      this.$store.watch(
        (state, getters) => getters[selectedEntityKey],
        (newValue) => {
          this.filter[entityKey] = newValue.value;
          if (newValue.value == "") {
            var newQuery = { ...this.$route.query };
            delete newQuery[entityKey];
            this.$router.push({ query: newQuery });
          } else {
            this.$router.push({
              query: Object.assign({}, this.$route.query, {
                [entityKey]: newValue.value,
              }),
            });
          }
        }
      );
    },

    watchQueryParamYears() {
      this.$store.watch(
        (state, getters) => getters.selectedYears,
        (newValue) => {
          this.filter.years = newValue;
          if (newValue == []) {
            var newQuery = { ...this.$route.query };
            delete newQuery.years;
            this.$router.push({ query: newQuery });
          } else {
            this.$router.push({
              query: Object.assign({}, this.$route.query, {
                years: newValue.join(),
              }),
            });
          }
        }
      );
    },

    openItem(target, id) {
      const kwicEntry = this.getKwic(id)[0];
      let name = "Brief";
      let params = {
        id: id,
      };

      if (kwicEntry && kwicEntry.type === "comment") {
        name = "Brief und Kommentar";
        params = {
          id: kwicEntry.entity_related_id,
          commentId: kwicEntry.entity_id,
        };
      }

      const routeData = this.$router.resolve({ name, params });
      switch (target) {
        case "default":
          this.$router.push({ name, params });
          break;
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
    loadQueryToStore() {},
  },
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

