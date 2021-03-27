<template>
  <div>
    <q-page v-show="!this.$store.getters.loading" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <v-runtime-template :template="title" />
            </q-card-section>
            <q-separator dark />
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable
            :entity-id="this.$route.params.id"
            entity-name="Dieser Titel"
            entity-type="works"
          />
        </div>
      </div>
    </q-page>
    <q-page v-show="this.$store.getters.loading">
      <div class="q-pt-xl row justify-center">
        <q-spinner-oval color="primary" size="5em" />
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
  name: "PersonsDetail",
  components: {
    MentionsTable,
    VRuntimeTemplate
  },
  data() {
    return {
      data: [],
      title: ""
    };
  },
  computed: {
    name() {
      return this.data;
    }
  },

  created() {
    this.getItems();
    this.getXSLT("WorkTitle", "title");
  },

  methods: {
    async getItems() {
      try {
        const response = await fetch(`${API}${this.$route.path}`, {
          headers: { Accept: "application/json" }
        });
        const data = await response.json();
        this.data = data;
      } catch (error) {
        console.error(error);
      }
    },
    async getXSLT(fileName, targetProp) {
      this[targetProp] = await dataService.XSLTransform(this.$route.path, fileName);
    }
  }
};
</script>

<style></style>
