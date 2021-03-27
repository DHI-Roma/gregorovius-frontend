<template>
  <div>
    <q-page v-show="!this.$store.getters.loading && loading == false" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">{{ name }}</div>
              <div class="text-subtitle3 text-secondary"></div>
            </q-card-section>
            <q-separator dark />
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-pb-xl q-gutter-y-lg">
          <MentionsTable
            :entity-id="this.$route.params.id"
            :entity-name="name"
            entity-type="places"
          />
        </div>
      </div>
    </q-page>
    <q-page v-show="this.$store.getters.loading || loading == true">
      <div class="q-pt-xl row justify-center">
        <q-spinner-oval color="primary" size="5em" />
      </div>
    </q-page>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MentionsTable from "@/components/MentionsTable";
import { dataService } from "@/shared";

export default {
  name: "PersonsDetail",
  components: { MentionsTable },
  data() {
    return {
      data: [],
      loading: true
    };
  },

  computed: {
    name() {
      return this.$store.getters.fullNameIndex[this.$route.params.id];
    }
  },

  async mounted() {
    if (this.$store.getters.fullNameIndex.length == 0) {
      await this.loadFullNameIndexAction();
    }
    await this.getItems();
  },

  methods: {
    ...mapActions(["loadLettersAction", "loadFullNameIndexAction"]),
    async getItems() {
      const data = await dataService.getEntity("places", this.$route.params.id, "json");
      this.data = data;
      this.loading = false;
    }
  }
};
</script>

<style></style>
