<template>
  <div>
    <q-page v-show="!this.$store.getters.loading && loading == false" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">{{ name }}</div>
              <div
                v-if="data.person.birth || data.person.death"
                class="text-subtitle3 text-secondary"
              >
                {{ data.person.birth }} – {{ data.person.death }}
              </div>
            </q-card-section>
            <q-card-section>
              <div v-if="data.person.idno">
                <a :href="authorityUri">
                  <q-chip color="blue-1" class="q-ml-none">
                    <q-avatar rounded font-size="11px" color="blue-5" class="text-white">
                      GND
                    </q-avatar>
                    <div class="text-blue text-caption q-pl-sm">
                      {{ authorityUri }}
                    </div>
                  </q-chip>
                </a>
              </div>
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
            entity-type="persons"
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
      data: {
        person: {
          persName: "",
          birth: "",
          death: "",
          idno: ""
        }
      },
      loading: true
    };
  },

  computed: {
    name() {
      return this.$store.getters.fullNameIndex[this.$route.params.id];
    },
    authorityUri() {
      return this.data.person.idno.length > 1
        ? this.data.person.idno[0]["#text"]
        : this.data.person.idno["#text"];
    }
  },

  async mounted() {
    await this.loadFullNameIndexAction();
    await this.getItems();
  },

  methods: {
    ...mapActions(["loadLettersAction", "loadFullNameIndexAction"]),
    async getItems() {
      const data = await dataService.getEntity("persons", this.$route.params.id, "json");
      this.data = { ...this.data, ...data };
      this.loading = false;
    }
  }
};
</script>

<style></style>
