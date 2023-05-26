<template>
  <q-card flat>
    <q-card-section>
      <div class="row q-mb-md">
        <div class="col-12 q-pr-sm text-right">
          <q-btn
            v-if="entry.status === 'ED'"
            flat
            dense
            color="primary"
            label="Brief öffnen"
            @click="$router.push({ name: 'Brief', params: { id: entry.xml_id } })"
          />
          <q-icon
            :name="entry.status === 'ED' ? 'check_circle' : 'cancel'"
            :color="entry.status === 'ED' ? 'primary' : 'red'"
            size="sm"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4 q-pr-sm">
          <div>
            <div class="text-caption text-uppercase text-bold text-grey">
              <q-icon name="event" />
              Versanddatum
            </div>
            <div class="text-wrap">
              <span class="text-bold">{{ dateEstimate }}</span>
              <span v-if="entry.date_cert !== 'high'"> (ungesichert)</span>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4 q-pr-sm">
          <div class="text-caption text-uppercase text-bold text-grey">
            <q-icon name="send" />
            Absender
          </div>
          <div
            v-for="(sender, index) in entry.senders"
            :key="index"
            class="text-wrap text-bold"
          >
            {{ sender }}
          </div>
          <div v-if="entry.placename_sent" class="text-wrap">
            {{ entry.placename_sent }}
          </div>
        </div>
        <div class="col-12 col-md-4 q-pr-sm">
          <div class="text-caption text-uppercase text-bold text-grey">
            <q-icon name="mark_email_read" />
            Empfänger
          </div>
          <div v-for="(recipient, index) in entry.recipients" :key="index" class="text-wrap text-bold">
            {{ recipient }}
          </div>
          <div v-if="entry.placename_received" class="text-wrap">
            {{ entry.placename_received }}
          </div>
        </div>
      </div>
      <div class="row q-my-md">
        <div class="col-12 col-md-4 q-pr-sm">
          <div class="text-caption text-uppercase text-bold text-grey">
Incipit
</div>
          <div class="text-wrap">
            {{ entry.incipit ? entry.incipit : "-" }}
          </div>
        </div>

        <div class="col-12 col-md-4 q-pr-sm">
          <div class="text-caption text-uppercase text-bold text-grey">
Umfang
</div>
          <div class="text-wrap">
            {{ entry.scope ? entry.scope : "-" }}
          </div>
        </div>

        <div class="col-12 col-md-4 q-pr-sm">
          <div class="text-caption text-uppercase text-bold text-grey">
            Handschrift- oder Abschriftennachweis
          </div>
          <div class="text-wrap">
            {{ entry.reference ? entry.reference : "-" }}
          </div>
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-12 col-md-4 q-pr-sm">
          <div class="text-caption text-uppercase text-bold text-grey">
Drucknachweis
</div>
          <div class="text-wrap">
            {{ entry.print_reference ? entry.print_reference : "-" }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "LettersFullIndexEntry",
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dateEstimate() {
      const dateWhen = this.entry?.date_when || "";
      if (dateWhen.startsWith("0000")) {
        return "undatiert";
      }

      if (dateWhen) {
        return this.toDate(this.entry.date_when);
      }

      let dateFromRaw = null;
      let dateToRaw = null;
      let prependNotBefore = "";
      let prependNotAfter = "";
      let combiner = " ";

      if (this.entry.date_from) {
        dateFromRaw = this.entry.date_from;
      } else if (this.entry.date_not_before) {
        dateFromRaw = this.entry.date_not_before;
        prependNotBefore = "nicht vor ";
      }

      if (this.entry.date_to) {
        dateToRaw = this.entry.date_to;
      } else if (this.entry.date_not_after) {
        dateToRaw = this.entry.date_not_after;
        prependNotAfter = "nicht nach ";
      }

      let dateFrom = "";
      if (dateFromRaw) {
        dateFrom = this.toDate(dateFromRaw);
      }

      let dateTo = "";
      if (dateToRaw) {
        dateTo = this.toDate(dateToRaw);
      }

      if (!dateTo && !dateFrom) {
        return "undatiert";
      }

      if (dateFrom && dateTo) {
        combiner = " - ";
      }

      return prependNotBefore + dateFrom + combiner + prependNotAfter + dateTo;
    },
  },
  methods: {
    toDate(dateString) {
      const [year, month, day] = dateString.split("-");
      if (month === "00" && day === "00") {
        return year;
      }

      if (month === "99" && day === "99") {
        return year;
      }

      if (year === "0000" || year === "9999") {
        return "undatiert";
      }

      try {
        if (dateString) {
          return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(
            Date.parse(dateString)
          );
        }
      } catch (e) {
        return dateString;
      }

      return "";
    },
  },
};
</script>

<style lang="stylus" scoped>
.text-wrap
  white-space: initial
</style>
