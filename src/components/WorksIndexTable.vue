<template>
  <q-table
    :rows="works"
    :columns="columns"
    row-key="id"
    :filter="filter"
    v-model:pagination="pagination"
    :loading="storeLoading"
    flat
  >
    <template #body-cell="props">
      <q-td
        :props="props"
        class="cursor-pointer"
        @click="router.push({ path: `/works/${props.row.id}` })"
        @click.middle="openInNewTab({ path: `/works/${props.row.id}` })"
        >{{ props.value }}</q-td
      >
      <context-menu
        :route-to-open="router.resolve({ path: `/works/${props.row.id}` }).href"
      ></context-menu>
    </template>
    <template #top-left>
      <q-input v-model="filter" borderless dense debounce="300" placeholder="Suche">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import ContextMenu from "./ContextMenu.vue";

export default defineComponent({
  name: "WorksIndexTable",
  components: {
    ContextMenu,
  },

  props: {
    type: {
      type: String,
      default: "",
      required: true,
    },
  },

  setup(props) {
    const store = useMainStore();
    const router = useRouter();
    const { works: allWorks, loading: storeLoading } = storeToRefs(store);

    const filter = ref("");
    const pagination = ref({
      rowsPerPage: 10,
      sortBy: "title",
    });

    const columns = [
      {
        name: "title",
        required: true,
        label: "Titel",
        align: "left",
        field: (row) => row.properties.title,
        sortable: true,
      },
    ];

    const works = computed(() => {
      return allWorks.value.filter((w) => w.properties.type === props.type);
    });

    function openInNewTab(route) {
      const resolved = router.resolve(route);
      window.open(resolved.href, "_blank");
    }

    return {
      router,
      filter,
      pagination,
      columns,
      works,
      storeLoading,
      openInNewTab,
    };
  },
});
</script>

<style></style>
