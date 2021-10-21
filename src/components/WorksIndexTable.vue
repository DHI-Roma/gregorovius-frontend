<template>
  <q-table
    :data="works"
    :columns="columns"
    row-key="id"
    :filter="filter"
    :pagination.sync="pagination"
    :loading="loading"
    flat
  >
    <template v-slot:body-cell="props">
      <q-td
        :props="props"
        class="cursor-pointer"
        @click.native="$router.push({ path: `/works/${props.row.id}` })"
        @click.middle="openInNewTab({ path: `/works/${props.row.id}` })"
        >{{ props.value }}</q-td
      >
      <context-menu
        :route-to-open="$router.resolve({ path: `/works/${props.row.id}` }).href"
      ></context-menu>
    </template>
    <template v-slot:top-left>
      <q-input v-model="filter" borderless dense debounce="300" placeholder="Suche">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script>
import ContextMenu from "./ContextMenu.vue";
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";
export default {
  name: "WorksIndexTable",
  components: {
    ContextMenu
  },
  mixins: [openInNewTabMixin],
  props: {
    type: {
      type: String,
      default: "",
      required: true
    }
  },
  data() {
    return {
      filter: "",
      loading: this.$store.state.isLoading,
      pagination: {
        rowsPerPage: 10,
        sortBy: "title"
      },
      columns: [
        {
          name: "title",
          required: true,
          label: "Titel",
          align: "left",
          field: row => row.properties.title,
          sortable: true
        }
      ],
      data: []
    };
  },
  computed: {
    works() {
      return this.$store.getters.works.filter(w => w.properties.type === this.$props.type);
    }
  },
  beforeMount() {
    this.$store.watch(
      (state, getters) => getters.loading,
      newValue => {
        this.loading = newValue;
      }
    );
  }
};
</script>

<style></style>
