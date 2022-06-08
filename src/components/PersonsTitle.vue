<template>
  <q-card v-if="properties" :class="wrapperClass" flat>
    <q-card-section>
      <div :class="titleClass">
        <a
          v-if="isList"
          class="cursor-pointer"
          @click="$router.push({ name: 'Person', params: { id: entity.id } })"
        >
          {{ name }}
        </a>
        <span v-else>{{ name }}</span>
      </div>
      <div v-if="person.birth || person.death" class="text-subtitle3 text-secondary">
        {{ person.birth }} – {{ person.death }}
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
    <q-card-section :class="contextClass">
      <q-chip v-if="roleName && isPerson" id="role" :color="roleClass">
        {{ roleName }}
      </q-chip>
      <q-chip v-if="isOrganisation" id="role" color="blue-1">
        Körperschaft
      </q-chip>
      <a v-if="person.idno" :href="authorityUri">
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
    <q-card-section v-if="hasNote" id="note">
      {{ person.note }}
    </q-card-section>
    <q-separator dark />
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import personService from "@/services/person-service";

import { QAvatar, QCard, QCardSection, QChip, QSeparator } from "quasar";

import dataService from "@/shared";

export default {
  name: "PersonsTitle",
  components: {
    QAvatar,
    QCard,
    QCardSection,
    QChip,
    QSeparator
  },
  props: {
    entity: {
      type: Object,
      required: true
    },
    person: {
      type: [Object, Promise],
      required: true,
      default: null
    },
    isList: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters(["fullNameIndex", "persons", "letters"]),
    titleClass() {
      return this.isList ? "" : "text-h6";
    },
    wrapperClass() {
      return this.isList ? "" : "q-pa-xl";
    },
    contextClass() {
      return this.isList ? "context-small" : "";
    },
    name() {
      const fullName = this.fullNameIndex[this.entity.id];

      if (fullName) {
        return fullName;
      }

      return this.properties.name.fullName;
    },
    authorityUri() {
      return this.person.idno.length > 1 ? this.person.idno[0]["#text"] : this.person.idno["#text"];
    },
    properties() {
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
      const subTypeName = personService.getPersonAlternativeNameTypeTranslation(
        this.properties.name.altNameSubtype
      );

      if (subTypeName !== personService.DEFAULT_ALTERNATIVE_NAME_TYPE_TRANSLATION) {
        return subTypeName;
      }

      return personService.getPersonAlternativeNameTypeTranslation(
        this.properties.name.altNameType
      );
    },
    hasNote() {
      if (!this.person.note) {
        return false;
      }
      return true;
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
  methods: {
    async getItem(entityId) {
      const data = await dataService.getEntity("persons", entityId, "json");
      return data.person;
    }
  }
};
</script>

<style lang="stylus" scoped>
#note
  font-family: "IBMPlexSans"
  line-height: 1.5
  font-size: 14px

.context-small
  margin-top: 0
  padding-top: 0
</style>
