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
                @update:model-value="getSearchResults()"
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
              @update-selection="applyRouteParams"
            />
            <select-auto-complete
              ref="placeSentAutocomplete"
              label="Schreibort"
              entity="placeSent"
              :options="uniquePlacesSent"
              @update-selection="applyRouteParams"
            />
            <select-auto-complete
              ref="placeReceivedAutocomplete"
              label="Empfangsort"
              entity="placeReceived"
              :options="uniquePlacesReceived"
              @update-selection="applyRouteParams"
            />
            <select-years
              label="Jahre"
              entity="years"
              :options="yearsInLetters"
              @update-selection="applyRouteParams"
            />
          </div>
        </q-card>
      </div>
      <div class="q-pa-md col-12 col-md-9">
        <q-table
          ref="tableRef"
          :rows="letterEntries"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :filter-method="filterLetters"
          v-model:pagination="pagination"
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
              @click="openItem('default', props.row.id)"
              @click.middle="openItem('tab', props.row.id)"
            >
              <q-menu touch-position context-menu>
                <q-list dense style="min-width: 100px">
                  <q-item v-close-popup clickable @click="openItem('tab', props.row.id)">
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
                  @click.stop="props.expand = !props.expand"
                />
              </q-td>
              <q-td key="date" :props="props">{{ formatDate(props.row.properties.date) }}</q-td>
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
                    {{ searchResult.following }}"
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
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMainStore } from 'src/stores/main';
import { storeToRefs } from 'pinia';
import { dataService } from 'src/shared';
import tableService from 'src/services/table-service';
import SelectAutoComplete from 'src/components/SelectAutoComplete.vue';
import MultipleSelectAutoComplete from 'src/components/MultipleSelectAutoComplete.vue';
import SelectYears from 'src/components/SelectYears.vue';

export default defineComponent({
  name: 'LettersIndex',

  components: {
    MultipleSelectAutoComplete,
    SelectAutoComplete,
    SelectYears,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useMainStore();

    const {
      fullNameIndex,
      sortedLetters: letters,
      yearsInLetters,
      selectedRecipients,
      selectedPlaceSent,
      selectedPlaceReceived,
      selectedYears,
      loading: storeLoading,
    } = storeToRefs(store);

    const tableRef = ref(null);
    const placeSentAutocomplete = ref(null);
    const placeReceivedAutocomplete = ref(null);

    const searchInput = ref('');
    const loading = ref(false);
    const visibleColumns = ref(['date', 'recipient', 'placeSent', 'placeRecv']);
    const pagination = ref({
      rowsPerPage: 20,
      sortBy: 'date',
    });
    const filter = ref({
      recipient: [],
      placeSent: '',
      placeReceived: '',
      years: [],
      resp: '',
      searchResults: [],
    });

    const columns = computed(() => [
      {
        name: 'date',
        required: true,
        label: 'Schreibdatum',
        align: 'left',
        field: (row) => (row.properties.date ? new Date(row.properties.date) : new Date('2000')),
        sortable: true,
      },
      {
        name: 'recipient',
        required: true,
        label: 'Empfänger',
        align: 'left',
        field: (row) => getFullNameArray(row.properties.recipient),
        sortable: true,
      },
      {
        name: 'placeSent',
        required: true,
        label: 'Schreibort',
        align: 'left',
        field: (row) => getFullName(row.properties.place.sent, 'o. O.'),
        sortable: true,
      },
      {
        name: 'placeRecv',
        required: true,
        label: 'Empfangsort',
        align: 'left',
        field: (row) => getFullName(row.properties.place.received, 'o. O.'),
        sortable: true,
      },
      {
        name: 'resp',
        label: 'resp',
        field: (row) => row.properties.resp,
      },
    ]);

    // Watch store loading state
    watch(storeLoading, (newValue) => {
      loading.value = newValue;
    });

    // Watch table filtered rows
    watch(
      () => tableRef.value?.filteredSortedRows,
      (filteredSortedRows) => {
        if (filteredSortedRows) {
          store.setLettersFiltered(filteredSortedRows);
        }
      }
    );

    const letterEntries = computed(() => {
      if (!letters.value.length || !Object.entries(fullNameIndex.value).length) {
        return [];
      }
      return letters.value;
    });

    const uniqueRecipients = computed(() => getArrayOptions('letters', 'recipient'));
    const uniquePlacesSent = computed(() => getOptions('letters', 'place.sent'));
    const uniquePlacesReceived = computed(() => getOptions('letters', 'place.received'));

    const phraseSearchHint = computed(() => {
      const quoteCount = (searchInput.value.match(/"/g) || []).length;
      if (quoteCount === 0) return '';
      if (quoteCount % 2 === 1) {
        return 'Ungerade Anzahl an Anführungszeichen (") entdeckt. Möchten Sie eine Phrasensuche auszuführen?';
      }
      return 'Phrasensuche aktiviert';
    });

    const queryParams = computed(() => {
      const query = {};
      if (selectedRecipients.value.length) {
        query.recipient = selectedRecipients.value.join();
      }
      if (selectedPlaceSent.value.value) {
        query.placeSent = selectedPlaceSent.value.value;
      }
      if (selectedPlaceReceived.value.value) {
        query.placeReceived = selectedPlaceReceived.value.value;
      }
      if (selectedYears.value.length) {
        query.selectedYears = selectedYears.value.join();
      }
      return query;
    });

    // Format date method (replaces Vue 2 filter)
    function formatDate(isoDate) {
      const date = isoDate ? new Date(isoDate) : new Date('2000');
      if (date.getFullYear() !== 2000) {
        return date.toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return 'o. D.';
    }

    function getFullName(id, altName) {
      const fullName = fullNameIndex.value[id];
      return fullName || altName;
    }

    function getFullNameArray(nameIdArray) {
      if (nameIdArray) {
        return nameIdArray.map((r) => getFullName(r, 'NN'));
      }
      return [];
    }

    function getArrayOptions(entityName, propertyName) {
      const entities = entityName === 'letters' ? letters.value : [];
      const optionIds = [].concat.apply(
        [],
        entities.map((e) => {
          const stack = propertyName.split('.');
          let output = e.properties;
          while (stack.length > 1) {
            output = output[stack.shift()];
          }
          return output[stack.shift()];
        })
      );
      const uniqueIds = [...new Set(optionIds)].filter((id) => id !== null);
      return uniqueIds.map((id) => ({
        label: getFullName(id, 'NN'),
        value: id,
      }));
    }

    function getOptions(entityName, propertyName) {
      const entities = entityName === 'letters' ? letters.value : [];
      const optionIds = entities.map((entity) => tableService.traverseObject(entity, propertyName));
      const uniqueIds = [...new Set(optionIds)].filter((id) => id !== null);
      return uniqueIds.map((id) => ({
        label: getFullName(id, 'NN'),
        value: id,
      }));
    }

    function getKwic(entityId) {
      return filter.value.searchResults.filter((result) => {
        if (result.entity_related_id) {
          return result.entity_related_id === entityId;
        }
        return result.entity_id === entityId;
      });
    }

    async function loadRouteParams() {
      for (const [paramKey, paramValue] of Object.entries(route.query)) {
        if (paramKey === 'years' || paramKey === 'recipient') {
          try {
            store.setSelected({
              entity: paramKey,
              value: paramValue.split(',').filter((entry) => entry.length > 0),
            });
          } catch (error) {
            console.log(error);
          }
        }
        if (paramKey === 'placeSent') {
          store.setSelected({ entity: paramKey, value: paramValue });
          placeSentAutocomplete.value?.setModel({
            value: paramValue,
            label: fullNameIndex.value[paramValue],
          });
        }
        if (paramKey === 'placeReceived') {
          store.setSelected({ entity: paramKey, value: paramValue });
          placeReceivedAutocomplete.value?.setModel({
            value: paramValue,
            label: fullNameIndex.value[paramValue],
          });
        }
      }
    }

    async function getSearchResults() {
      loading.value = true;
      try {
        const responseLetters = await dataService.getSearchResults('letters', searchInput.value);
        const responseComments = await dataService.getSearchResults('comments', searchInput.value);

        const resultsLetters = responseLetters.results.map((result) => ({
          ...result,
          type: 'letter',
          icon: 'search',
        }));

        const resultsComments = responseComments.results.map((result) => ({
          ...result,
          type: 'comment',
          icon: 'comment',
        }));

        filter.value.searchResults = [...resultsLetters, ...resultsComments];
      } catch (error) {
        filter.value.searchResults = [];
      }
      loading.value = false;
    }

    function applyRouteParams() {
      const href = router.resolve({ query: queryParams.value }).href;
      window.history.pushState({}, null, href);
    }

    async function loadAll() {
      await store.loadEntities();
      resetFilter();
    }

    function resetFilter() {
      filter.value.recipient = route.query.recipient || [];
      filter.value.placeSent = route.query.placeSent || '';
      filter.value.placeReceived = route.query.placeReceived || '';
      filter.value.years = route.query.years || [];
      filter.value.resp = route.query.resp || '';

      if (!filter.value.recipient.length) {
        store.setSelected({ entity: 'recipient', value: [] });
      }
      if (!filter.value.placeSent) {
        store.setSelected({ entity: 'placeSent', value: '' });
      }
      if (!filter.value.placeReceived) {
        store.setSelected({ entity: 'placeReceived', value: '' });
      }
      if (!filter.value.years.length) {
        store.setSelected({ entity: 'years', value: [] });
      }
    }

    function filterLetters(rows, terms) {
      let filteredRows = tableService.filterByRecipients(rows, selectedRecipients.value);

      if (selectedPlaceSent.value.value) {
        filteredRows = filteredRows.filter((r) =>
          tableService.hasValue(r, 'place.sent', selectedPlaceSent.value.value)
        );
      }

      if (selectedPlaceReceived.value.value) {
        filteredRows = filteredRows.filter((r) =>
          tableService.hasValue(r, 'place.received', selectedPlaceReceived.value.value)
        );
      }

      if (selectedYears.value.length) {
        filteredRows = filteredRows.filter((r) =>
          !r.properties.date ? false : selectedYears.value.includes(r.properties.date.slice(0, 4))
        );
      }

      if (terms.resp !== '') {
        filteredRows = filteredRows.filter((r) =>
          !r.properties.resp ? false : r.properties.resp.includes(terms.resp)
        );
      }

      if (searchInput.value) {
        const ids = terms.searchResults.map((result) =>
          result.entity_related_id ? result.entity_related_id : result.entity_id
        );
        filteredRows = filteredRows.filter((r) => ids.includes(r.id));
      }

      return filteredRows;
    }

    function openItem(target, id) {
      const kwicEntry = getKwic(id)[0];
      let name = 'Brief';
      let params = { id };

      if (kwicEntry && kwicEntry.type === 'comment') {
        name = 'Brief und Kommentar';
        params = {
          id: kwicEntry.entity_related_id,
          commentId: kwicEntry.entity_id,
        };
      }

      const routeData = router.resolve({
        name,
        params,
        query: queryParams.value,
      });

      switch (target) {
        case 'default':
          router.push({ name, params, query: queryParams.value });
          break;
        case 'tab':
        case 'window':
          window.open(routeData.href, '_blank');
          break;
      }
    }

    onMounted(async () => {
      await Promise.all([store.loadFullNameIndex(), loadAll()]);
      await loadRouteParams();
    });

    return {
      // Refs
      tableRef,
      placeSentAutocomplete,
      placeReceivedAutocomplete,
      searchInput,
      loading,
      visibleColumns,
      pagination,
      filter,
      columns,
      // Computed
      letterEntries,
      uniqueRecipients,
      uniquePlacesSent,
      uniquePlacesReceived,
      yearsInLetters,
      phraseSearchHint,
      // Methods
      formatDate,
      getFullName,
      getFullNameArray,
      getKwic,
      getSearchResults,
      applyRouteParams,
      filterLetters,
      openItem,
    };
  },
});
</script>

<style lang="scss" scoped>
.g-searchresult {
  font-family: Cardo;
  font-size: 1.2em;
}

.g-searchresult-comment {
  font-family: 'IBMPlexSans';
  font-size: 1em;
  padding-left: 1em;
}

.g-searchrow td {
  border-bottom: 0 !important;
}

.g-keyword {
  display: inline;
}
</style>
