<template>
  <q-card class="col-md-8 col-12 q-pa-xl" flat bordered>
    <q-table
      v-if="!loading && letters.length > 0"
      title="Erwähnt in"
      :data="letters"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination.sync="pagination"
      flat
    >
      <template v-slot:top-right>
        <BrowseEntitiesButton
          :entity-ids="[entityId]"
          :route="{ path: `/letters/${letters[0].id}` }"
        ></BrowseEntitiesButton>
      </template>
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          class="cursor-pointer"
          @click.native="$router.push({ path: `/letters/${props.row.id}/filters/${entityId}` })"
          @click.middle="openInNewTab({ path: `/letters/${props.row.id}/filters/${entityId}` })"
          >{{ props.value }}</q-td
        >
        <context-menu
          :route-to-open="$router.resolve({ path: `/letters/${props.row.id}/filters/${entityId}` }).href"
        ></context-menu>
      </template>
    </q-table>
    <q-banner
      v-if="letters.length === 0 && !loading"
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
import ContextMenu from "./ContextMenu.vue";
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";
import BrowseEntitiesButton from "@/components/BrowseEntitiesButton";

export default {
  name: "MentionsTable",
  components: {
    ContextMenu,
    BrowseEntitiesButton
  },
  mixins: [openInNewTabMixin],
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
        rowsPerPage: 10
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
      return this.getMentioned(this.entityType).sort((entityA, entityB) => {
        if (entityA.properties.date > entityB.properties.date) {
          return 1;
        }

        if (entityA.properties.date < entityB.properties.date) {
          return -1;
        }

        return 0;
      });
    }
  },

  async beforeMount() {
    this.loading = true;
    await this.loadEntitiesAction();
    if (this.$store.getters.fullNameIndex.length == 0) {
      await this.loadFullNameIndexAction();
    }
    this.loading = false;
  },

  methods: {
    ...mapActions(["loadLettersAction", "loadEntitiesAction", "loadFullNameIndexAction"]),
    getMentioned(entityName) {
      const { letters } = this.$store.getters;
      const filtered = letters.filter(letter => {
        let entities = letter.properties.mentioned[entityName];
        entities = !entities ? [] : entities;
        return [...entities].some(id => id.includes(this.entityId));
      });
      return filtered;
    }
  }
};
</script>

<style></style>
