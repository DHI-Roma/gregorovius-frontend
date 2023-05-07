<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-3">
        <div
          class="q-gutter-sm col justify-center"
          style="max-width: 500px"
        >
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
                label="von"
                :min-date="fullLettersIndex.date_earliest"
                :max-date="fullLettersIndex.date_latest"
                @update-date="filter.dateFrom = $event"
              />
            </div>

            <div class="col-12 col-md-6">
              <date-picker-input
                label="bis"
                :min-date="fullLettersIndex.date_earliest"
                :max-date="fullLettersIndex.date_latest"
                @update-date="filter.dateTo = $event"
              />
            </div>
          </div>
          <q-toggle
            v-model="filter.highDateCertOnly"
            label="Nur Briefe mit gesicherter Datierung"
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
          <q-toggle
            v-model="filter.isAvailableOnly"
            label="Nur edierte Briefe"
          />
        </div>
      </div>
      <div class="col-12 col-md-9">
        <q-table
          :columns="['_entry']"
          :data="filteredLetters"
          :hide-header="true"
        >
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

export default {
  name: "LettersFullIndex",
  components: { LettersFullIndexEntry, MultipleSelectAutoComplete, QInput, QPage, DatePickerInput },
  data() {
    return {
      filter: {
        fullText: "",
        recipients: [],
        sender: [],
        placesReceived: [],
        placesSent: [],
        holdingLocations: [],
        isAvailableOnly: false,
        highDateCertOnly: false,
        dateFrom: null,
        dateTo: null
      }
    };
  },
  computed: {
    ...mapGetters(["fullLettersIndex"]),
    filteredLetters() {
      if (!this.fullLettersIndex.letters.length) return [];
      return this.fullLettersIndex.letters.filter((letter) => {
        const letterFullText = [
          letter.senders.join(" "),
          letter.recipients.join(" "),
          letter.placename_sent,
          letter.placename_received,
          letter.incipit,
          letter.reference,
          letter.print_reference
        ].join(" ");

        if (
          this.filter.fullText.length &&
          !letterFullText.toLowerCase().includes(this.filter.fullText.toLowerCase())
        ) {
          return false;
        }

        if (
          this.filter.recipients.length &&
          !this.filter.recipients.some((recipient) => letter.recipients.includes(recipient))
        ) {
          return false;
        }

        if (
          this.filter.sender.length &&
          !this.filter.sender.some((sender) => letter.senders.includes(sender))
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

        if (this.filter.isAvailableOnly && letter.status !== "ED") {
          return false;
        }

        if (this.filter.highDateCertOnly && letter.date_cert !== "high") {
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

        return true;
      });
    }
  },
  mounted() {
    this.$store.dispatch("loadEntitiesAction");
  },
  methods: {
    isAfterSelection(letter) {
      const [year, month, day] = this.filter.dateFrom.split('-');
      const letterDateFrom = letter.date_when ?? letter.date_from ?? letter.date_not_before ?? letter.date_to ?? letter.date_not_after ?? null;
      if (!letterDateFrom) return false;

      const [letterYear, letterMonth, letterDay] = letterDateFrom.split('-');

      if (letterYear === '0000') return false;

      if (letterMonth === '00' || letterDay === '00') {
        return letterYear >= year;
      }

      if (year === letterYear) {
        if (month === letterMonth) {
          return letterDay >= day;
        }
        return letterYear >= month;
      }

      return letterYear >= year;
    },
    isBeforeSelection(letter) {
      const [year, month, day] = this.filter.dateTo.split('-');
      const letterDateTo = letter.date_when ?? letter.date_to ?? letter.date_not_after ?? letter.date_from ?? letter.date_not_before ?? null;
      if (!letterDateTo) return false;

      const [letterYear, letterMonth, letterDay] = letterDateTo.split('-');

      if (letterYear === '0000') return false;

      if (letterMonth === '00' || letterDay === '00') {
        return letterYear <= year;
      }

      if (year === letterYear) {
        if (month === letterMonth) {
          return letterDay <= day;
        }
        return letterMonth <= month;
      }

      return letterYear < year;
    }
  }
};
</script>
