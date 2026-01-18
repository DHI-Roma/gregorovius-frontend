<template>
  <q-card class="col-md-8 col-12 q-pa-xl" flat bordered>
    <q-table
      v-if="!loading && letters.length > 0"
      title="Erwähnt in"
      :rows="letters"
      :columns="columns"
      :loading="loading"
      row-key="id"
      v-model:pagination="pagination"
      flat
    >
      <template #top-right>
        <BrowseEntitiesButton
          :entity-ids="[entityId]"
          :route="{ path: `/letters/${letters[0].id}` }"
        ></BrowseEntitiesButton>
      </template>
      <template #body-cell="props">
        <q-td
          :props="props"
          class="cursor-pointer"
          @click="$router.push({ path: `/letters/${props.row.id}/filters/${entityId}` })"
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
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import ContextMenu from "./ContextMenu.vue";
import BrowseEntitiesButton from "src/components/BrowseEntitiesButton.vue";

export default defineComponent({
  name: "MentionsTable",
  components: {
    ContextMenu,
    BrowseEntitiesButton,
  },

  props: {
    entityType: {
      type: String,
      required: true,
    },
    entityName: {
      type: String,
      required: false,
      default: "Diese Entität",
    },
    entityId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useMainStore();
    const router = useRouter();
    const { fullNameIndex, letters: storeLetters } = storeToRefs(store);

    const loading = ref(true);
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

    function getMentioned(entityName) {
      const filtered = storeLetters.value.filter((letter) => {
        let entities = letter.properties.mentioned[entityName];
        entities = !entities ? [] : entities;
        return [...entities].some((id) => id.includes(props.entityId));
      });
      return filtered;
    }

    const letters = computed(() => {
      return getMentioned(props.entityType).sort((entityA, entityB) => {
        if (entityA.properties.date > entityB.properties.date) return 1;
        if (entityA.properties.date < entityB.properties.date) return -1;
        return 0;
      });
    });

    onBeforeMount(async () => {
      loading.value = true;
      await store.loadEntities();
      if (Object.keys(fullNameIndex.value).length === 0) {
        await store.loadFullNameIndex();
      }
      loading.value = false;
    });

    return {
      loading,
      pagination,
      columns,
      letters,
      openInNewTab,
    };
  },
});
</script>

<style></style>
