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
            <multiple-select-auto-complete
              label="Empfänger"
              entity="fli_recipient"
              :options="fullLettersIndex.unique_recipients"
              @update-selection="filter.recipients = $event"
            />
            <multiple-select-auto-complete
              label="Sender"
              entity="fli_sender"
              :options="fullLettersIndex.unique_senders"
              @update-selection="filter.sender = $event"
            />
            <multiple-select-auto-complete
              label="Empfangsort"
              entity="fli_place_received"
              :options="fullLettersIndex.unique_recipient_places"
              @update-selection="filter.placesReceived = $event"
            />
            <multiple-select-auto-complete
              label="Versandort"
              entity="fli_place_sent"
              :options="fullLettersIndex.unique_sender_places"
              @update-selection="filter.placesSent = $event"
            />
            <multiple-select-auto-complete
              label="Aufbewahrungsorte"
              entity="fli_holding_locations"
              :options="fullLettersIndex.aufbewahrungsorte_short"
              @update-selection="filter.holdingLocations = $event"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-9">
        <q-table
          :columns="['_entry']"
          :data="fullLettersIndex.letters"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td>
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
import { QInput, QPage } from 'quasar';
import MultipleSelectAutoComplete from '@/components/MultipleSelectAutoComplete.vue';
import { mapGetters } from 'vuex';
import LettersFullIndexEntry from '@/components/LettersFullIndexEntry.vue';

export default {
  name: 'LettersFullIndex',
  components: { LettersFullIndexEntry, MultipleSelectAutoComplete, QInput, QPage },
  data() {
    return {
      filter: {
        fullText: '',
        recipients: [],
        sender: [],
        placesReceived: [],
        placesSent: [],
        holdingLocations: [],
      },
    };
  },
  computed: {
    ...mapGetters(['fullLettersIndex']),
  },
  mounted() {
    this.$store.dispatch('loadEntitiesAction');
  },
};
</script>
