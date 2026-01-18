<template>
  <q-item
    clickable
    class="cursor-pointer g-card"
    @click="router.push(route)"
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
            >{{ formatAlternativeNameSubType(person.properties.name.altNameSubtype) }}:</span
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
      {{ formatPersonType(person.properties.type) }}
    </q-chip>
    <q-chip
      v-if="isPerson(person.properties.type)"
      size="12px"
      :color="getRoleClass(person.properties.role)"
    >
      {{ formatPersonRole(person.properties.role) }}
    </q-chip>

    <context-menu :route-to-open="router.resolve(route).href"></context-menu>
  </q-item>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import personService from "src/services/person-service";
import ContextMenu from "./ContextMenu.vue";

export default defineComponent({
  name: "PersonTile",
  components: {
    ContextMenu,
  },
  props: {
    person: {
      type: [Object, Promise],
      required: true,
      default: null,
    },
  },

  setup(props) {
    const router = useRouter();

    const route = computed(() => ({ path: `/persons/${props.person.id}` }));

    function openInNewTab(routeObj) {
      window.open(router.resolve(routeObj).href, "_blank");
    }

    function isPerson(rawType) {
      return rawType === "person";
    }

    function isOrganisation(rawType) {
      return rawType === "org";
    }

    function getRoleClass(rawRole) {
      return personService.getPersonRoleClass(rawRole);
    }

    function hasAlternativeName(row) {
      return personService.hasAlternativeName(row);
    }

    function getAlternativeFullName(row) {
      return personService.getAlternativeFullName(row);
    }

    function formatPersonType(rawType) {
      return personService.getPersonTypeTranslation(rawType);
    }

    function formatPersonRole(rawRole) {
      return personService.getPersonRoleTranslation(rawRole);
    }

    function formatAlternativeNameSubType(subType) {
      return personService.getPersonAlternativeNameTypeTranslation(subType);
    }

    return {
      router,
      route,
      openInNewTab,
      isPerson,
      isOrganisation,
      getRoleClass,
      hasAlternativeName,
      getAlternativeFullName,
      formatPersonType,
      formatPersonRole,
      formatAlternativeNameSubType,
    };
  },
});
</script>

<style scoped>
.g-card:hover {
  background: #f7f7f7;
}
</style>
