<template>
  <q-item
    class="cursor-pointer g-card"
    @click.native="$router.push(route)"
    @click.middle="openInNewTab(route)"
  >
    <q-item-section>
      <q-item-label>{{ person.properties.name.fullName }}</q-item-label>
      <div
        v-if="person.properties.birth || person.properties.death"
        class="text-subtitle3 text-secondary"
      >
        {{ person.properties.birth }}-{{ person.properties.death }}
      </div>
      <div v-if="hasAlternativeName(person)" class="text-caption q-tm-sm text-secondary">
        <span>
          <span class="text-weight-bold"
            >{{ person.properties.name.altNameSubtype | formatAlternativeNameSubType }}:</span
          >
        </span>
        <span v-if="getAlternativeFullName(person)">
          {{ getAlternativeFullName(person) }}
        </span>
        <span v-if="person.properties.name.altSimpleName">
          {{ person.properties.name.altSimpleName }}
        </span>
      </div>
    </q-item-section>
    <q-chip v-if="isOrganisation(person.properties.type)" size="12px" color="blue-1">
      {{ person.properties.type | formatPersonType }}
    </q-chip>
    <q-chip
      v-if="isPerson(person.properties.type)"
      size="12px"
      :color="getRoleClass(person.properties.role)"
    >
      {{ person.properties.role | formatPersonRole }}
    </q-chip>

    <context-menu :route-to-open="$router.resolve(route).href"></context-menu>
  </q-item>
</template>

<script>
import { QChip, QItem, QItemSection, QItemLabel } from "quasar";
import personService from "@/services/person-service";
import ContextMenu from "./ContextMenu.vue";
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";

export default {
  name: "PersonTile",
  components: {
    QChip,
    QItem,
    QItemSection,
    QItemLabel,
    ContextMenu
  },
  filters: {
    formatPersonType(rawType) {
      return personService.getPersonTypeTranslation(rawType);
    },
    formatPersonRole(rawRole) {
      return personService.getPersonRoleTranslation(rawRole);
    },
    formatAlternativeNameSubType(subType) {
      return personService.getPersonAlternativeNameTypeTranslation(subType);
    }
  },
  mixins: [openInNewTabMixin],
  props: {
    person: {
      type: [Object, Promise],
      required: true,
      default: null
    }
  },
  computed: {
    route() {
      return { path: `/persons/${this.person.id}` };
    }
  },
  methods: {
    isPerson(rawType) {
      return rawType === "person";
    },
    isOrganisation(rawType) {
      return rawType === "org";
    },
    getRoleClass(rawRole) {
      return personService.getPersonRoleClass(rawRole);
    },
    hasDifferentSimpleName(row) {
      return personService.hasDifferentSimpleName(row);
    },
    hasAlternativeName(row) {
      return personService.hasAlternativeName(row);
    },
    getAlternativeFullName(row) {
      return personService.getAlternativeFullName(row);
    }
  }
};
</script>

<style>
.g-card:hover {
  background: #f7f7f7;
}
</style>
