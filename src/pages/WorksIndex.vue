<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-xl" flat>
        <q-separator dark />
        <q-tabs v-model="tab" class="text-primary">
          <q-tab label="Werkregister Gregorovius" name="wgr" />
          <q-tab label="Übersetzungen" name="ueb" />
          <q-tab label="Werke anderer Autoren" name="waa" />
          <q-tab label="Sekundärliteratur" name="skl" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="wgr">
            <works-index-table type="gregoroviusMain" />
          </q-tab-panel>
          <q-tab-panel name="ueb">
            <works-index-table type="gregoroviusTranslation" />
          </q-tab-panel>
          <q-tab-panel name="waa">
            <works-index-table type="othersMain" />
          </q-tab-panel>
          <q-tab-panel name="skl">
            <works-index-table type="secondary" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useMainStore } from 'src/stores/main';
import WorksIndexTable from 'src/components/WorksIndexTable.vue';

export default defineComponent({
  name: 'WorksIndex',

  components: {
    WorksIndexTable,
  },

  setup() {
    const store = useMainStore();
    const tab = ref('wgr');

    async function getItems() {
      if (store.works.length === 0) {
        await store.loadWorks();
      }
    }

    onMounted(() => {
      getItems();
    });

    return {
      tab,
    };
  },
});
</script>

<style></style>
