<template>
  <q-card class="col-md-8 col-12 q-pa-xl" flat bordered>
    <q-table
      v-if="loading == false && letters.length > 0"
      title="Erwähnt in"
      :data="letters"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination.sync="pagination"
      flat
    >
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          class="cursor-pointer"
          @click.native="$router.push({ path: `/letters/${props.row.id}` })"
          >{{ props.value }}</q-td
        >
      </template>
    </q-table>
    <q-banner
      v-if="letters.length == 0 && loading == false"
      class="bg-warning text-center"
      inline-actions
      rounded
    >
      {{ entityName }} wird in keinem Brief erwähnt.
    </q-banner>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "MentionsTable",
  props: {
    entityType: {
      type: String,
      required: true
    },
    entityName: {
      type: String,
      required: false,
      default: "Diese Entität"
    },
    entityId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      filter: "",
      loading: true,
      pagination: {
        rowsPerPage: 10,
        sortBy: "title"
      },
      columns: [
        {
          name: "title",
          required: true,
          align: "left",
          field: row => row.properties.title
        }
      ],
      data: []
    };
  },

  computed: {
    fullNameIndex() {
      return this.$store.getters.fullNameIndex;
    },
    letters() {
      return this.getMentioned(this.entityType);
    }
  },

  async beforeMount() {
    if (this.$store.getters.letters.length == 0) {
      await this.loadLettersAction();
    }
    if (this.$store.getters.fullNameIndex.length == 0) {
      await this.loadFullNameIndexAction();
    }
  },

  methods: {
    ...mapActions(["loadLettersAction", "loadFullNameIndexAction"]),
    getMentioned(entityName) {
      this.loading = true;
      const { letters } = this.$store.getters;
      const filtered = letters.filter(letter => {
        let entities = letter.properties.mentioned[entityName];
        entities = !entities ? [] : entities;
        return [...entities].some(id => id.includes(this.entityId));
      });
      this.loading = false;
      return filtered;
    }
  }
};
</script>

<style></style>
