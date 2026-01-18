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
import { defineComponent, computed } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import personService from "src/services/person-service";

export default defineComponent({
  name: "PersonsTitle",

  props: {
    entity: {
      type: Object,
      required: true,
    },
    person: {
      type: [Object, Promise],
      required: true,
      default: null,
    },
    isList: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup(props) {
    const store = useMainStore();
    const { fullNameIndex, persons } = storeToRefs(store);

    const titleClass = computed(() => (props.isList ? "" : "text-h6"));
    const wrapperClass = computed(() => (props.isList ? "" : "q-pa-xl"));
    const contextClass = computed(() => (props.isList ? "context-small" : ""));

    const properties = computed(() => props.entity?.properties);

    const name = computed(() => {
      const fullName = fullNameIndex.value[props.entity.id];
      if (fullName) return fullName;
      return properties.value?.name?.fullName || "";
    });

    const authorityUri = computed(() => {
      if (!props.person?.idno) return "";
      return props.person.idno.length > 1
        ? props.person.idno[0]["#text"]
        : props.person.idno["#text"];
    });

    const isPerson = computed(() => properties.value?.type === "person");
    const isOrganisation = computed(() => properties.value?.type === "org");

    const roleName = computed(() => {
      if (!persons.value.length) return "";
      return personService.getPersonRoleTranslation(properties.value?.role);
    });

    const roleClass = computed(() => {
      return personService.getPersonRoleClass(properties.value?.role);
    });

    const alternativeNameType = computed(() => {
      const subTypeName = personService.getPersonAlternativeNameTypeTranslation(
        properties.value?.name?.altNameSubtype
      );

      if (subTypeName !== personService.DEFAULT_ALTERNATIVE_NAME_TYPE_TRANSLATION) {
        return subTypeName;
      }

      return personService.getPersonAlternativeNameTypeTranslation(
        properties.value?.name?.altNameType
      );
    });

    const hasNote = computed(() => !!props.person?.note);

    const hasAlternativeName = computed(() => {
      if (!persons.value.length) return false;
      return personService.hasAlternativeName(props.entity);
    });

    const alternativeFullName = computed(() => {
      return personService.getAlternativeFullName(props.entity);
    });

    const alternativeSimpleName = computed(() => {
      return properties.value?.name?.altSimpleName;
    });

    return {
      titleClass,
      wrapperClass,
      contextClass,
      properties,
      name,
      authorityUri,
      isPerson,
      isOrganisation,
      roleName,
      roleClass,
      alternativeNameType,
      hasNote,
      hasAlternativeName,
      alternativeFullName,
      alternativeSimpleName,
    };
  },
});
</script>

<style lang="scss" scoped>
#note {
  font-family: "IBMPlexSans";
  line-height: 1.5;
  font-size: 14px;
}

.context-small {
  margin-top: 0;
  padding-top: 0;
}
</style>
