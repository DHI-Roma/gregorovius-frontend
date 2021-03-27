<template>
  <div>
    <q-page v-show="!this.$store.getters.loading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">
                Mehrfache Indizierung von Werken
              </div>
            </q-card-section>
            <q-card-section v-for="title in titles" :key="title">
              <v-runtime-template :template="title" />
            </q-card-section>
            <q-separator dark />
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable
            :entity-id="ids.join(' ')"
            entity-name="Diese Sammlung von Titeln"
            entity-type="works"
          />
        </div>
      </div>
    </q-page>
    <q-page v-show="this.$store.getters.loading">
      <div class="q-pt-xl row justify-center">
        <q-spinner-hourglass color="primary" size="5em" />
      </div>
    </q-page>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import { dataService } from "@/shared";
import MentionsTable from "@/components/MentionsTable";
import { API } from "@/shared/config";

export default {
  name: "WorksDetailMultiple",
  components: {
    MentionsTable,
    VRuntimeTemplate
  },
  data() {
    return {
      data: [],
      titles: []
    };
  },
  computed: {
    ids() {
      return this.$attrs.ids.split(",");
    },
    name() {
      return this.data;
    }
  },

  async created() {
    this.ids.map(async id => await this.getXSLT("WorkTitle", "titles", id));
  },

  methods: {
    async getItem(id) {
      try {
        const response = await fetch(`${API}/works/${id}`, {
          headers: { Accept: "application/json" }
        });
        const data = await response.json();
        this.data.push(data);
      } catch (error) {
        console.error(error);
      }
    },
    async getXSLT(fileName, targetProp, id) {
      try {
        this[targetProp].push(await dataService.XSLTransform(`works/${id}`, fileName));
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style></style>
