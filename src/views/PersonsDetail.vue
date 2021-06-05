<template>
  <div>
    <q-page v-show="!this.$store.getters.loading && loading == false" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">{{ name }}</div>
              <div
                v-if="data.person.birth || data.person.death"
                class="text-subtitle3 text-secondary"
              >
                {{ data.person.birth }} – {{ data.person.death }}
              </div>
              <div v-if="hasAlternativeName" class="text-caption q-tm-sm text-secondary">
                <span>
                  <span class="text-weight-bold">{{ alternativeNameType }}:</span>
                </span>
                <span v-if="alternativeFullName">
                  {{ alternativeFullName }}
                </span>
                <span v-if="alternativeSimpleName">
                  {{ alternativeSimpleName }}
                </span>
              </div>
            </q-card-section>
            <q-card-section>
              <q-chip v-if="roleName && isPerson" id="role" :color="roleClass">
                {{ roleName }}
              </q-chip>
              <q-chip v-if="isOrganisation" id="role" color="blue-1">
                Körperschaft
              </q-chip>
              <a v-if="data.person.idno" :href="authorityUri">
                <q-chip color="blue-1" class="q-ml-none">
                  <q-avatar rounded font-size="11px" color="blue-5" class="text-white">
                    GND
                  </q-avatar>
                  <div class="text-blue text-caption q-pl-sm">
                    {{ authorityUri }}
                  </div>
                </q-chip>
              </a>
            </q-card-section>
            <q-separator dark />
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable :entity-id="entityId" :entity-name="name" entity-type="persons" />
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
import { dataService } from "@/shared";
import personService from "@/services/person-service";

import { QCard, QCardSection, QChip, QPage, QSeparator, QSpinnerOval } from "quasar";

export default {
  name: "PersonsDetail",
  components: {
    QCard,
    QCardSection,
    QChip,
    QPage,
    QSeparator,
    QSpinnerOval,
    MentionsTable
  },
  data() {
    return {
      data: {
        person: {
          persName: "",
          birth: "",
          death: "",
          idno: ""
        }
      },
      loading: true
    };
  },

  computed: {
    ...mapGetters(["fullNameIndex", "persons"]),
    entityId() {
      return this.$route.params.id;
    },
    name() {
      return this.fullNameIndex[this.$route.params.id];
    },
    authorityUri() {
      return this.data.person.idno.length > 1
        ? this.data.person.idno[0]["#text"]
        : this.data.person.idno["#text"];
    },
    entity() {
      if (!this.persons.length) {
        return {};
      }
      return this.persons.find(person => person.id === this.entityId);
    },
    properties() {
      if (!this.persons.length) {
        return {};
      }
      return this.entity.properties;
    },
    isPerson() {
      return this.properties.type === "person";
    },
    isOrganisation() {
      return this.properties.type === "org";
    },
    roleName() {
      if (!this.persons.length) {
        return "";
      }
      return personService.getPersonRoleTranslation(this.properties.role);
    },
    roleClass() {
      return personService.getPersonRoleClass(this.properties.role);
    },
    alternativeNameType() {
      return personService.getPersonAlternativeNameTypeTranslation(
        this.properties.name.altNameType
      );
    },
    hasAlternativeName() {
      if (!this.persons.length) {
        return false;
      }
      return personService.hasAlternativeName(this.entity);
    },
    alternativeFullName() {
      return personService.getAlternativeFullName(this.entity);
    },
    alternativeSimpleName() {
      return this.properties.name.altSimpleName;
    }
  },

  async mounted() {
    await this.loadFullNameIndexAction();
    await this.getItems();
  },

  methods: {
    ...mapActions(["loadLettersAction", "loadFullNameIndexAction"]),
    async getItems() {
      const data = await dataService.getEntity("persons", this.$route.params.id, "json");
      this.data = { ...this.data, ...data };
      this.loading = false;
    }
  }
};
</script>

<style></style>
