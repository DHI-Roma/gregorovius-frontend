<template>
  <div>
    <q-page v-show="!this.$store.getters.loading && loading == false" padding>
      <div class="row justify-center">
        <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">{{ name }}</div>
              <div
                v-if="alternativeName"
                id="alternative-name"
                class="text-subtitle3 text-secondary"
              >
                {{ alternativeName }}
              </div>
            </q-card-section>
            <q-card-section>
              <q-chip v-if="placeTypeName" :color="placeTypeClass">{{ placeTypeName }}</q-chip>
              <div v-if="data.place.idno" class="inline-block">
                <a id="geonames-uri" :href="authorityUri">
                  <q-chip color="blue-1" class="q-ml-none">
                    <q-avatar rounded font-size="11px" color="blue-5" class="text-white">
                      GEO
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
          <MentionsTable :entity-id="entityId" :entity-name="name" entity-type="places" />
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
import { mapActions, mapGetters } from "vuex";
import MentionsTable from "@/components/MentionsTable";
import { dataService } from "@/shared";
import placeService from "@/services/place-service";
import { QSpinnerOval, QPage, QSeparator, QAvatar, QChip, QCard, QCardSection } from "quasar";

export default {
  name: "PlacesDetail",
  components: {
    MentionsTable,
    QSpinnerOval,
    QPage,
    QSeparator,
    QAvatar,
    QChip,
    QCard,
    QCardSection
  },
  data() {
    return {
      data: [],
      loading: true
    };
  },

  computed: {
    ...mapGetters(["fullNameIndex", "places"]),
    entityId() {
      return this.$route.params.id;
    },
    name() {
      const fullName = this.fullNameIndex[this.$route.params.id];

      if (fullName) {
        return fullName;
      }

      return this.properties.name.toponym;
    },
    authorityUri() {
      if (!this.data.place.idno) {
        return "";
      }

      return this.data.place.idno.length > 1
        ? this.data.place.idno[0]["#text"]
        : this.data.place.idno["#text"];
    },
    properties() {
      return this.places.find(place => place.id === this.entityId).properties;
    },
    placeTypeName() {
      return placeService.getPlaceTypeTranslation(this.properties.type);
    },
    placeTypeClass() {
      return placeService.getPlaceTypeClass(this.properties.type);
    },
    alternativeName() {
      if (!Array.isArray(this.data.place.placeName)) {
        return "";
      }

      const alternativeName = this.data.place.placeName.find(
        placeName => placeName["@type"] === "alt"
      );

      if (alternativeName) {
        return alternativeName["#text"];
      }

      return "";
    }
  },

  async mounted() {
    await Promise.all([
      this.getItems(),
      this.loadFullNameIndexAction()
    ]);
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
