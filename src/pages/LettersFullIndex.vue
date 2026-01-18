<template>
  <q-page v-if="fullLettersIndex" padding>
    <div class="row">
      <div class="col-12 col-md-3">
        <div class="q-gutter-sm col justify-center" style="max-width: 500px">
          <div class="q-pa-md">
            <q-input
              v-model="filter.fullText"
              label="Metadaten durchsuchen"
              debounce="550"
              outlined
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <date-picker-input
                ref="dateFromPicker"
                label="von"
                :min-date="fullLettersIndex.date_earliest"
                :max-date="fullLettersIndex.date_latest"
                @update-date="setDateFromFilter"
              />
            </div>

            <div class="col-12 col-md-6">
              <date-picker-input
                ref="dateToPicker"
                label="bis"
                :min-date="fullLettersIndex.date_earliest"
                :max-date="fullLettersIndex.date_latest"
                @update-date="setDateToFilter"
              />
            </div>
          </div>
          <select-years
            ref="yearsSelect"
            label="Jahre"
            entity="fli_years"
            :options="fullLettersIndex.unique_years"
            @update-selection="setYearFilter"
          />
          <multiple-select-auto-complete
            label="Sender"
            entity="fli_sender"
            :options="fullLettersIndex.unique_senders"
            :reload-options="false"
            @update-selection="filter.sender = $event"
          />
          <multiple-select-auto-complete
            label="Empfänger"
            entity="fli_recipient"
            :options="fullLettersIndex.unique_recipients"
            :reload-options="false"
            @update-selection="filter.recipients = $event"
          />
          <multiple-select-auto-complete
            label="Versandort"
            entity="fli_place_sent"
            :options="fullLettersIndex.unique_sender_places"
            :reload-options="false"
            @update-selection="filter.placesSent = $event"
          />
          <multiple-select-auto-complete
            label="Empfangsort"
            entity="fli_place_received"
            :options="fullLettersIndex.unique_recipient_places"
            :reload-options="false"
            @update-selection="filter.placesReceived = $event"
          />
          <multiple-select-auto-complete
            label="Aufbewahrungsorte"
            entity="fli_holding_locations"
            :options="fullLettersIndex.aufbewahrungsorte_short"
            :reload-options="false"
            @update-selection="filter.holdingLocations = $event"
          />
          <select-auto-complete
            label="Bearbeitungsstatus"
            entity="fli_status"
            :options="statusFilterOptions"
            @update-selection="filter.status = $event"
          />
        </div>
      </div>
      <div class="col-12 col-md-9">
        <q-table :columns="['_entry']" :rows="filteredLetters" :hide-header="true">
          <template #body="props">
            <q-tr :props="props">
              <q-td :no-hover="true">
                <letters-full-index-entry :entry="props.row" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useMainStore } from 'src/stores/main';
import { storeToRefs } from 'pinia';
import MultipleSelectAutoComplete from 'src/components/MultipleSelectAutoComplete.vue';
import LettersFullIndexEntry from 'src/components/LettersFullIndexEntry.vue';
import DatePickerInput from 'src/components/DatePickerInput.vue';
import SelectYears from 'src/components/SelectYears.vue';
import SelectAutoComplete from 'src/components/SelectAutoComplete.vue';

export default defineComponent({
  name: 'LettersFullIndex',

  components: {
    SelectAutoComplete,
    SelectYears,
    LettersFullIndexEntry,
    MultipleSelectAutoComplete,
    DatePickerInput,
  },

  setup() {
    const store = useMainStore();
    const { fullLettersIndex } = storeToRefs(store);

    const dateFromPicker = ref(null);
    const dateToPicker = ref(null);
    const yearsSelect = ref(null);

    const filter = ref({
      fullText: '',
      recipients: [],
      sender: [],
      placesReceived: [],
      placesSent: [],
      holdingLocations: [],
      status: null,
      dateFrom: null,
      dateTo: null,
      years: [],
    });

    const yearsFilter = ref([]);

    const statusFilterOptions = [
      { label: 'Alle', value: null },
      { label: 'Nur edierte Briefe', value: 'ED' },
      { label: 'Nur nicht editierte Briefe', value: 'UN' },
    ];

    function isAfterSelection(letter) {
      const letterDateFrom = letter.date_index;
      if (!letterDateFrom) return false;

      const [letterYear] = letterDateFrom.split('-');
      if (!letterYear.startsWith('1')) return false;

      return filter.value.dateFrom <= letterDateFrom;
    }

    function isBeforeSelection(letter) {
      const letterDateTo = letter.date_index;
      if (!letterDateTo) return false;

      const [letterYear] = letterDateTo.split('-');
      if (!letterYear.startsWith('1')) return false;

      return filter.value.dateTo >= letterDateTo;
    }

    const filteredLetters = computed(() => {
      if (!fullLettersIndex.value?.letters?.length) return [];

      return fullLettersIndex.value.letters.filter((letter) => {
        const letterFullText = [
          letter.senders.join(' '),
          letter.recipients.join(' '),
          letter.placename_sent,
          letter.placename_received,
          letter.incipit,
          letter.reference,
          letter.print_reference,
        ].join(' ');

        if (
          filter.value.fullText.length &&
          !letterFullText.toLowerCase().includes(filter.value.fullText.toLowerCase())
        ) {
          return false;
        }

        if (
          filter.value.recipients.length &&
          !filter.value.recipients.some((recipient) => letter.recipient_names.includes(recipient))
        ) {
          return false;
        }

        if (
          filter.value.sender.length &&
          !filter.value.sender.some((sender) => letter.sender_names.includes(sender))
        ) {
          return false;
        }

        if (
          filter.value.placesSent.length &&
          !filter.value.placesSent.some((place) => letter.placename_sent.includes(place))
        ) {
          return false;
        }

        if (
          filter.value.placesReceived.length &&
          !filter.value.placesReceived.some((place) => letter.placename_received.includes(place))
        ) {
          return false;
        }

        if (
          filter.value.holdingLocations.length &&
          !filter.value.holdingLocations.some((holdingLocation) =>
            letter.reference.includes(holdingLocation)
          )
        ) {
          return false;
        }

        if (filter.value?.status?.value && letter.status !== filter.value.status.value) {
          return false;
        }

        if (filter.value.dateFrom && filter.value.dateTo) {
          return isAfterSelection(letter) && isBeforeSelection(letter);
        }

        if (filter.value.dateFrom) {
          return isAfterSelection(letter);
        }

        if (filter.value.dateTo) {
          return isBeforeSelection(letter);
        }

        if (yearsFilter.value.length) {
          return yearsFilter.value.some((year) => letter.relevant_years.includes(year));
        }

        return true;
      });
    });

    function setDateFromFilter(dateFrom) {
      filter.value.dateFrom = dateFrom;
      if (!dateFrom) return;
      yearsFilter.value = [];
      yearsSelect.value?.setSelected?.([]);
    }

    function setDateToFilter(dateTo) {
      filter.value.dateTo = dateTo;
      if (!dateTo) return;
      yearsFilter.value = [];
      yearsSelect.value?.setSelected?.([]);
    }

    function setYearFilter(years) {
      yearsFilter.value = years;
      dateFromPicker.value?.clearDateInput?.();
      dateToPicker.value?.clearDateInput?.();
    }

    onMounted(() => {
      store.loadEntities();
    });

    return {
      fullLettersIndex,
      filter,
      statusFilterOptions,
      filteredLetters,
      dateFromPicker,
      dateToPicker,
      yearsSelect,
      setDateFromFilter,
      setDateToFilter,
      setYearFilter,
    };
  },
});
</script>
