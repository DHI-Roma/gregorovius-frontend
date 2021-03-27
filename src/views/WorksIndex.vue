<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-xl" flat>
        <q-separator dark />
        <q-tabs v-model="tab" class="text-primary">
          <q-tab label="Werkregister Gregorovius" name="wgr" />
          <q-tab label="Übersetzungen" name="ueb" />
          <q-tab label="Werke anderer Autoren" name="waa" />
          <q-tab label="Zeitgenössische Quellen" name="zgq" />
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
          <q-tab-panel name="zgq">
            <works-index-table type="contemporarySources" />
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
import { mapActions } from "vuex";
import WorksIndexTable from "@/components/WorksIndexTable";

export default {
  name: "ItemsList",
  components: { WorksIndexTable },
  data() {
    return {
      tab: "wgr",
      data: []
    };
  },
  async mounted() {
    this.getItems();
  },
  methods: {
    ...mapActions(["setLoadingStatus"]),
    async getItems() {
      if (this.$store.getters.works.length == 0) {
        await this.$store.dispatch("loadWorksAction");
      }
      this.loading = false;
      // try {
      //   const response = await fetch(`${API}${this.$route.path}`);
      //   const data = await response.json();
      //   this.data = data;
      // } catch (error) {
      //   console.error(error);
      // }
      // this.setLoadingStatus(false);
    }
  }
};
</script>

<style></style>
