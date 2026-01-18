<template>
  <q-card class="col-md-8 col-12 q-pa-xl" flat bordered>
    <q-table
      v-if="letters.length > 0"
      title="Korrespondenzen"
      :rows="letters"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      flat
    >
      <template #body-cell="props">
        <q-td
          :props="props"
          class="cursor-pointer"
          @click="$router.push({ path: `/letters/${props.row.id}`, query: { recipient: recipientId } })"
          @click.middle="openInNewTab({ path: `/letters/${props.row.id}`, query: { recipient: recipientId } })"
          >{{ props.value }}</q-td
        >
        <context-menu
          :route-to-open="$router.resolve({ path: `/letters/${props.row.id}`, query: { recipient: recipientId } }).href"
        ></context-menu>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import ContextMenu from "src/components/ContextMenu.vue";

export default defineComponent({
  name: "CorrespondenceTable",
  components: {
    ContextMenu,
  },

  props: {
    letters: {
      type: Array,
      required: true,
    },
    recipientId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const router = useRouter();

    const pagination = ref({ rowsPerPage: 10 });
    const columns = [
      {
        name: "title",
        required: true,
        align: "left",
        field: (row) => row.properties.title,
      },
    ];

    function openInNewTab(route) {
      const resolved = router.resolve(route);
      window.open(resolved.href, "_blank");
    }

    return {
      pagination,
      columns,
      openInNewTab,
    };
  },
});
</script>

<style></style>
