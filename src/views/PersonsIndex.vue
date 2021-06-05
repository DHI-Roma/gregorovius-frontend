<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        grid
        :data="persons"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :pagination.sync="pagination"
        :loading="this.$store.getters.loading"
        flat
      >
        <template v-slot:top-left>
          <q-input v-model="filter" borderless dense debounce="300" placeholder="Suche">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card>
              <q-separator />
              <q-list>
                <q-item
                  class="cursor-pointer g-card"
                  @click.native="$router.push({ path: `/persons/${props.row.id}` })"
                >
                  <q-item-section>
                    <q-item-label>{{ props.row.properties.name.fullName }}</q-item-label>
                    <div
                      v-if="hasDifferentSimpleName(props.row)"
                      class="text-subtitle3 text-secondary"
                    >
                      {{ props.row.properties.name.simpleName }}
                    </div>
                    <div
                      v-if="hasAlternativeName(props.row)"
                      class="text-caption q-tm-sm text-secondary"
                    >
                      <span>
                        <span class="text-weight-bold"
                          >{{
                            props.row.properties.name.altNameSubtype | formatAlternativeNameSubType
                          }}:</span
                        >
                      </span>
                      <span v-if="getAlternativeFullName(props.row)">
                        {{ getAlternativeFullName(props.row) }}
                      </span>
                      <span v-if="props.row.properties.name.altSimpleName">
                        {{ props.row.properties.name.altSimpleName }}
                      </span>
                    </div>
                  </q-item-section>
                  <q-chip
                    v-if="isOrganisation(props.row.properties.type)"
                    size="12px"
                    color="blue-1"
                  >
                    {{ props.row.properties.type | formatPersonType }}
                  </q-chip>
                  <q-chip
                    v-if="isPerson(props.row.properties.type)"
                    size="12px"
                    :color="getRoleClass(props.row.properties.role)"
                  >
                    {{ props.row.properties.role | formatPersonRole }}
                  </q-chip>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { QPage, QTable } from "quasar";

import personService from "@/services/person-service";

export default {
  name: "PersonsIndex",
  components: {
    QPage,
    QTable
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

  data() {
    return {
      filter: "",
      loading: true,
      pagination: {
        rowsPerPage: 50,
        sortBy: "name"
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => {
            return [
              row.properties.name.surname,
              row.properties.name.forename,
              row.properties.name.simpleName,
              row.properties.name.roleName,
              row.properties.name.orgName,
              row.properties.name.fullName,
              row.properties.name.altSurname,
              row.properties.name.altForename,
              row.properties.name.altSimpleName
            ]
              .filter(content => content)
              .join(" ");
          },
          sortable: true
        }
      ],
      data: []
    };
  },

  computed: {
    persons() {
      return this.$store.getters.persons;
    }
  },
  async mounted() {
    await this.loadFullNameIndexAction();
    this.loading = false;
  },
  methods: {
    ...mapActions(["loadFullNameIndexAction"]),
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
