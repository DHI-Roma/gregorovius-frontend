<template>
  <q-card flat>
    <q-card-section>
      <div class="row q-mb-md">
        <div class="col-12 text-right">
          <q-btn
            v-if="entry.status === 'ED'"
            flat
            dense
            color="primary"
            label="Brief öffnen"
            @click="$router.push({ name: 'Brief', params: { id: entry.xml_id } })"
          >
            <context-menu :route-to-open="$router.resolve({ name: 'Brief', params: { id: entry.xml_id } }).href"/>
          </q-btn>
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
            <div class="text-wrap text-bigger">
              <span class="text-bold">{{ dateEstimate }}</span>
              <span v-if="entry.date_cert === 'low' && entry.date_when"> (ungesichert)</span>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            <q-icon name="send" />
            Absender
          </div>
          <div
            v-for="(sender, index) in entry.senders"
            :key="index"
            class="text-wrap text-bold text-bigger"
          >
            {{ sender.name }}

            <letters-full-index-entry-person-context-menu
              v-if="hasAdditionalInformation(sender)"
              :person="sender"
            ></letters-full-index-entry-person-context-menu>

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
          <div
            v-for="(recipient, index) in entry.recipients"
            :key="index"
            class="text-wrap text-bold text-bigger"
          >
            {{ recipient.name }}

            <letters-full-index-entry-person-context-menu
              v-if="hasAdditionalInformation(recipient)"
              :person="recipient"
            ></letters-full-index-entry-person-context-menu>
          </div>
          <div v-if="entry.placename_received" class="text-wrap">
            {{ entry.placename_received }}
          </div>
        </div>
      </div>
      <div class="row q-my-md">
        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">Drucknachweis</div>
          <div class="text-wrap">
            {{ entry.print_reference ? entry.print_reference : "-" }}
          </div>
        </div>

        <div class="col-12 col-md-4">
          <template v-if="entry.scope">
            <div class="text-caption text-uppercase text-bold text-grey">
              Umfang
            </div>
            <div class="text-wrap">
              {{ entry.scope }}
            </div>
          </template>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-caption text-uppercase text-bold text-grey">
            Aufbewahrungsort (Archiv / Sammlung)
          </div>
          <div class="text-wrap">
            {{ entry.reference ? entry.reference : "-" }}
          </div>
        </div>
      </div>
      <div v-if="entry.incipit" class="row q-mt-sm">
        <div class="col-12 col-md-4 q-pr-sm">
          <div class="text-caption text-uppercase text-bold text-grey">Incipit</div>
          <div class="text-wrap">
            {{ entry.incipit }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { QMenu, QBtn, QChip, QAvatar } from "quasar";
import LettersFullIndexEntryPersonContextMenu
  from "@/components/LettersFullIndexEntryPersonContextMenu.vue";
import ContextMenu from "@/components/ContextMenu.vue";
export default {
  name: "LettersFullIndexEntry",
  components: {
    LettersFullIndexEntryPersonContextMenu,
    QAvatar,
    QChip,
    QMenu,
    QBtn,
    ContextMenu,
  },
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  computed: {
    dateEstimate() {
      const dateWhen = this.entry?.date_when || "";
      if (dateWhen === "0000-00-00") {
        return "undatiert";
      }
      // if (dateWhen.startsWith("0000")) {
      //   return "undatiert";
      // }

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
        if (day !== "00" && month !== "00") {
          const dateLong = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(
            Date.parse(`2000-${month}-${day}`)
          );
          return dateLong.replace(" 2000", ", ohne Jahr");
        }
        return "undatiert";
      }

      if (day === "00") {
        dateString = `${year}-${month}-01`;
        const monthLong = new Intl.DateTimeFormat("de-DE", { month: "long" }).format(
          Date.parse(dateString)
        );

        return `${monthLong} ${year}`;
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
    hasAdditionalInformation(person) {
      return person.gnd || person.birth || person.death || person.date_special;
    }
  }
};
</script>

<style lang="stylus" scoped>
.text-wrap
  white-space: initial
  padding-right: 1rem

.text-bigger
  font-size: 1.3em
</style>
