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
          ><router-link
            :to="{ path: `/letters/${props.row.id}`, query: { recipient: recipientId } }"
            class="g-row-link"
            @click.stop
            >{{ props.value }}</router-link
          ></q-td
        >
      </template>
    </q-table>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CorrespondenceTable",

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

    const pagination = ref({ rowsPerPage: 10 });
    const columns = [
      {
        name: "title",
        required: true,
        align: "left",
        field: (row) => row.properties.title,
      },
    ];

    return {
      pagination,
      columns,
    };
  },
});
</script>

<style></style>
