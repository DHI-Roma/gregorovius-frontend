<template>
  <q-card flat>
    <q-card-section>
      <div class="row q-mb-md">
        <div class="col-6">
          <q-badge
            v-if="entry.lfdnr"
            class="q-mr-sm"
          >
            #{{ entry.lfdnr }}
          </q-badge>
          <q-badge v-if="entry.xml_id">{{ entry.xml_id }}</q-badge>
        </div>
        <div class="col-6 text-right">
          <q-icon
            :name="entry.status === 'ED' ? 'check_circle' : 'cancel'"
            :color="entry.status === 'ED' ? 'primary' : 'red'"
            size="sm"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4">
          <div>
            <div class="text-caption text-uppercase text-bold text-grey">
              <q-icon name="event" />
              Versanddatum
            </div>
            {{ dateEstimate }}
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            <q-icon name="send" />
            Absender
          </div>
          <div v-for="sender in entry.senders">
            {{ sender }}
          </div>
          <div
            v-if="entry.placename_sent"
            class="text-italic"
          >{{ entry.placename_sent }}</div>

        </div>
        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            <q-icon name="mark_email_read" />
            Empfänger
          </div>
          <div v-for="recipient in entry.recipients">
            {{ recipient }}
          </div>
          <div
            v-if="entry.placename_received"
            class="text-italic"
          >{{ entry.placename_received }}</div>
        </div>
      </div>
      <div
        class="row q-my-md"
      >
        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            Incipit
          </div>
          <div>
            {{ entry.incipit ? entry.incipit : '-' }}
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            Umfang
          </div>
          <div>
            {{ entry.scope ? entry.scope : '-' }}
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            Handschrift- oder Abschriftennachweis
          </div>
          <div class="text-wrap">
            {{ entry.reference ? entry.reference : '-' }}
          </div>
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            Drucknachweis
          </div>
          <div>
            {{ entry.print_reference ? entry.print_reference : '-' }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator v-if="entry.status === 'ED'" />
    <q-card-actions v-if="entry.status === 'ED'">
      <q-space />
      <q-btn
        flat
        dense
        color="primary"
        label="Brief öffnen"
        @click="$router.push({ name: 'Brief', params: { id: entry.xml_id } })"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'LettersFullIndexEntry',
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dateEstimate() {
      if (this.entry.date_when) {
        return this.toDate(this.entry.date_when);
      }

      let dateFromRaw = this.entry?.date_from ?? this.entry?.date_not_before ?? null;
      let dateToRaw = this.entry?.date_to ?? this.entry?.date_not_after ?? null;

      let dateFrom = '';
      if (dateFromRaw) {
        dateFrom = this.toDate(dateFromRaw);
      }
      dateFrom += ' - ';

      let dateTo = '';
      if (dateToRaw) {
        dateTo = this.toDate(dateToRaw);
      }

      return dateFrom + dateTo;
    },
  },
  methods: {
    toDate(dateString) {
      const [year, month, day] = dateString.split('-');
      if (month === '00' && day === '00') {
        return year;
      }
      if (dateString) {
        return new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' })
          .format(Date.parse(dateString));
      }

      return '';
    },
  }
};
</script>

<style lang="stylus" scoped>
.text-wrap
  white-space: initial
</style>
