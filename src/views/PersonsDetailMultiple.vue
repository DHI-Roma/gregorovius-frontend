<template>
  <div>
    <q-page v-show="!this.$store.getters.loading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">
                Mehrfache Indizierung von Personen
              </div>
              <div v-for="(entity, index) in entities" :key="entity.id">
                <PersonsTitle
                  :entity="entity"
                  :person="getItem(entity.id)"
                  :is-list="true"
                ></PersonsTitle>
                <q-separator v-if="index < entities.length - 1" spaced></q-separator>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable
            :entity-id="entityIds.join(' ')"
            entity-name="Diese Sammlung von Personen"
            entity-type="persons"
          />
        </div>
      </div>
    </q-page>
    <q-page v-show="this.$store.getters.loading || loading == true">
      <div class="q-pt-xl row justify-center">
        <q-spinner-oval color="primary" size="5em" />
      </div>
    </q-page>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import MentionsTable from "@/components/MentionsTable";
import PersonsTitle from "@/components/PersonsTitle";
import { QCard, QCardSection, QPage, QSeparator, QSpinnerOval } from "quasar";

import { dataService } from "@/shared";

export default {
  name: "PersonsDetailMultiple",
  components: {
    QCard,
    QCardSection,
    QPage,
    QSeparator,
    QSpinnerOval,
    PersonsTitle,
    MentionsTable
  },
  data() {
    return {
      loading: false,
      personsData: []
    };
  },
  computed: {
    ...mapGetters(["fullNameIndex", "persons", "letters"]),
    entityIds() {
      return [...new Set(this.$attrs.ids.split(","))];
    },
    entities() {
      if (!this.persons.length) {
        return [];
      }
      const entities = [];
      this.entityIds.forEach(entityId => {
        const entity = this.persons.find(person => person.id === entityId);
        entities.push(entity);
      });

      return entities;
    }
  },
  async mounted() {
    if (!this.persons.length) {
      await this.loadFullNameIndexAction();
    }
  },

  methods: {
    ...mapActions(["loadFullNameIndexAction"]),
    async getItem(entityId) {
      const data = await dataService.getEntity("persons", entityId, "json");
      return data;
    }
  }
};
</script>
