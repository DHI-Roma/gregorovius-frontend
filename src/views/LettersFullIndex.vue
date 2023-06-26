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
              <template v-slot:append>
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
        <q-table :columns="['_entry']" :data="filteredLetters" :hide-header="true">
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
import { QInput, QPage } from "quasar";
import MultipleSelectAutoComplete from "@/components/MultipleSelectAutoComplete.vue";
import { mapGetters } from "vuex";
import LettersFullIndexEntry from "@/components/LettersFullIndexEntry.vue";
import DatePickerInput from "@/components/DatePickerInput.vue";
import SelectYears from "@/components/SelectYears.vue";
import SelectAutoComplete from "@/components/SelectAutoComplete.vue";

export default {
  name: "LettersFullIndex",
  components: {
    SelectAutoComplete,
    SelectYears,
    LettersFullIndexEntry,
    MultipleSelectAutoComplete,
    QInput,
    QPage,
    DatePickerInput,
  },
  data() {
    return {
      filter: {
        fullText: "",
        recipients: [],
        sender: [],
        placesReceived: [],
        placesSent: [],
        holdingLocations: [],
        status: null,
        dateFrom: null,
        dateTo: null,
        years: [],
      },
      yearsFilter: [],
      statusFilterOptions: [
        {
          label: "Alle",
          value: null,
        },
        {
          label: "Nur edierte Briefe",
          value: "ED",
        },
        {
          label: "Nur nicht editierte Briefe",
          value: "UN",
        },
      ],
      uniqueRecipients: [],
      uniqueSenders: [],
      uniqueSenderPlaces: [],
      uniqueRecipientPlaces: [],
      uniqueYears: [],
      uniqueHoldingLocations: [],
    };
  },
  computed: {
    ...mapGetters(["fullLettersIndex"]),
    filteredLetters() {
      if (!this.fullLettersIndex?.letters.length) return [];
      return this.fullLettersIndex.letters.filter((letter) => {
        const letterFullText = [
          letter.senders.join(" "),
          letter.recipients.join(" "),
          letter.placename_sent,
          letter.placename_received,
          letter.incipit,
          letter.reference,
          letter.print_reference,
        ].join(" ");

        if (
          this.filter.fullText.length &&
          !letterFullText.toLowerCase().includes(this.filter.fullText.toLowerCase())
        ) {
          return false;
        }

        if (
          this.filter.recipients.length &&
          !this.filter.recipients.some((recipient) => letter.recipient_names.includes(recipient))
        ) {
          return false;
        }

        if (
          this.filter.sender.length &&
          !this.filter.sender.some((sender) => letter.sender_names.includes(sender))
        ) {
          return false;
        }

        if (
          this.filter.placesSent.length &&
          !this.filter.placesSent.some((place) => letter.placename_sent.includes(place))
        ) {
          return false;
        }

        if (
          this.filter.placesReceived.length &&
          !this.filter.placesReceived.some((place) => letter.placename_received.includes(place))
        ) {
          return false;
        }

        if (
          this.filter.holdingLocations.length &&
          !this.filter.holdingLocations.some((holdingLocation) =>
            letter.reference.includes(holdingLocation)
          )
        ) {
          return false;
        }

        if (this.filter?.status?.value && letter.status !== this.filter.status.value) {
          return false;
        }

        if (this.filter.dateFrom && this.filter.dateTo) {
          return this.isAfterSelection(letter) && this.isBeforeSelection(letter);
        }

        if (this.filter.dateFrom) {
          return this.isAfterSelection(letter);
        }

        if (this.filter.dateTo) {
          return this.isBeforeSelection(letter);
        }

        if (this.yearsFilter.length) {
          return this.yearsFilter.some((year) => letter.relevant_years.includes(year));
        }

        return true;
      });
    },
  },
  watch: {
    filteredLetters: {
      deep: true,
      immediate: true,
      handler() {
        return false;
        // if (!this.filteredLetters.length && this.fullLettersIndex) {
        //   this.uniqueSenders = this.fullLettersIndex.unique_senders;
        //   this.uniqueRecipients = this.fullLettersIndex.unique_recipients;
        //   this.uniqueSenderPlaces = this.fullLettersIndex.unique_sender_places;
        //   this.uniqueRecipientPlaces = this.fullLettersIndex.unique_recipient_places;
        //   this.uniqueYears = this.fullLettersIndex.unique_years;
        //   this.uniqueHoldingLocations = this.fullLettersIndex.aufbewahrungsorte_short;
        //   return;
        // }
        // const recipients = [];
        // const senders = [];
        // const placesSent = [];
        // const placesReceived = [];
        // const relevantYears = [];
        // const holdingLocations = [];
        //
        // this.filteredLetters.forEach((letter) => {
        //   letter.recipient_names.forEach((recipient) => {
        //     if (!recipients.includes(recipient)) {
        //       recipients.push(recipient);
        //     }
        //   });
        //   letter.sender_names.forEach((sender) => {
        //     if (!senders.includes(sender)) {
        //       senders.push(sender);
        //     }
        //   });
        //
        //   letter.relevant_years.forEach((year) => {
        //     if (!relevantYears.includes(year)) {
        //       relevantYears.push(year);
        //     }
        //   });
        //
        //   letter.relevant_holding_locations.forEach((holdingLocation) => {
        //     if (!holdingLocations.includes(holdingLocation)) {
        //       holdingLocations.push(holdingLocation);
        //     }
        //   });
        //   if (!placesSent.includes(letter.placename_sent)) {
        //     placesSent.push(letter.placename_sent);
        //   }
        //   if (!placesReceived.includes(letter.placename_received)) {
        //     placesReceived.push(letter.placename_received);
        //   }
        // });
        //
        // this.uniqueSenders = senders.sort();
        // this.uniqueRecipients = recipients.sort();
        // this.uniqueSenderPlaces = placesSent.sort();
        // this.uniqueRecipientPlaces = placesReceived.sort();
        // this.uniqueYears = relevantYears.sort();
        // this.uniqueHoldingLocations = holdingLocations.sort();
      },
    },
  },
  mounted() {
    this.$store.dispatch("loadEntitiesAction");
  },
  methods: {
    isAfterSelection(letter) {
      const letterDateFrom = letter.date_index;
      if (!letterDateFrom) return false;

      const [letterYear] = letterDateFrom.split("-");

      if (!letterYear.startsWith("1")) return false;

      return this.filter.dateFrom <= letterDateFrom;
    },
    isBeforeSelection(letter) {
      const letterDateTo = letter.date_index;
      if (!letterDateTo) return false;

      const [letterYear] = letterDateTo.split("-");

      if (!letterYear.startsWith("1")) return false;

      return this.filter.dateTo >= letterDateTo;
    },
    setDateFromFilter(dateFrom) {
      this.filter.dateFrom = dateFrom;
      if (!dateFrom) return;
      this.yearsFilter = [];
      this.$refs.yearsSelect.setSelected([]);
    },
    setDateToFilter(dateTo) {
      this.filter.dateTo = dateTo;
      if (!dateTo) return;
      this.yearsFilter = [];
      this.$refs.yearsSelect.setSelected([]);
    },
    setYearFilter(years) {
      this.yearsFilter = years;
      this.$refs.dateFromPicker.clearDateInput();
      this.$refs.dateToPicker.clearDateInput();
    },
  },
};
</script>
