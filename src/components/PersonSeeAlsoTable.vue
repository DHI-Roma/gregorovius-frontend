<template>
  <q-card v-if="references.entries.length" class="col-md-8 col-12 q-pa-xl" flat bordered>
    <q-table
      title="Referenzen in anderen Datenquellen"
      :data="references.entries"
      :columns="columns"
      :pagination="pagination"
      dense
    >
      <template v-slot:body-cell="props">
        <q-td class="cursor-pointer" :props="props" @click="openEntry(props.row.url)">
          <span>
            <q-tooltip>
              {{ props.row.long }}
            </q-tooltip>

            {{ props.value }}
          </span>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import beaconService from "@/services/beacon-service";
export default {
  name: "PersonSeeAlsoTable",
  props: {
    gnd: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      references: [],
      columns: [
        {
          name: "source",
          required: true,
          align: "left",
          field: entry => entry.short
        }
      ],
      pagination: {
        rowsPerPage: 10,
        sortBy: "source"
      }
    };
  },
  mounted() {
    this.getSeeAlsoEntries();
  },
  methods: {
    async getSeeAlsoEntries() {
      this.references = await beaconService.getSeeAlsoEntries(this.gnd);
    },
    openEntry(url) {
      window.open(url, "_blank");
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
