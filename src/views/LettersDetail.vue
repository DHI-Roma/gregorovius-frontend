<template>
  <div>
    <q-page v-show="!loading" padding>
      <div class="row justify-center">
        <div v-if="data.teiHeader" class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <q-card-section>
              <div class="text-h6">{{ titleMain }}</div>
              <div class="text-subtitle3 text-secondary">
                {{ titleSecondary }}
              </div>
            </q-card-section>
            <q-separator dark />
            <q-tabs v-model="tab" class="text-primary">
              <q-tab id="label-tgl" label="Textgrundlage" name="tgl" />
              <q-tab v-if="hasAbstracts()" id="label-reg" label="Regest" name="reg" />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel id="panel-tgl" name="tgl">
                <v-runtime-template :template="msDesc" />
              </q-tab-panel>
              <q-tab-panel v-if="hasAbstracts()" id="panel-reg" name="reg">
                <div v-if="getAbstractForLanguage('de')" id="abstract-de">
                  <q-chip outline size="sm" color="primary" dense>DE</q-chip>
                  {{ getAbstractForLanguage("de") }}
                </div>
                <q-separator v-if="getAbstractCount() > 1" spaced />
                <div v-if="getAbstractForLanguage('en')" id="abstract-en">
                  <q-chip outline size="sm" color="primary" dense>EN</q-chip>
                  {{ getAbstractForLanguage("en") }}
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
      <div class="row justify-center">
        <q-card class="col-md-8 col-12 q-pa-xl q-mb-xl" bordered flat>
          <div class="row justify-end">
            <q-btn
              label="TEI XML"
              flat
              icon="arrow_right_alt"
              color="primary"
              size="md"
              @click="openUrl(`http://gregorovius-edition.dhi-roma.it/api${$route.path}`)"
            />
          </div>
          <div class="row">
            <LettersText />
          </div>
        </q-card>
      </div>
    </q-page>
    <q-page v-show="loading">
      <div class="q-pt-xl row justify-center">
        <q-spinner-oval color="primary" size="5em" />
      </div>
    </q-page>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import LettersText from "@/components/LettersText.vue";
import axios from "axios";
import { dataService } from "@/shared";
import { API } from "@/shared/config";
import {
  QCard,
  QPage,
  QBtn,
  QSpinnerOval,
  QTabPanels,
  QTabPanel,
  QSeparator,
  QTabs,
  QTab,
  QCardSection,
  QChip
} from "quasar";

const TAB_TEXTGRUNDLAGE = "tgl";

export default {
  name: "Item",
  components: {
    LettersText,
    VRuntimeTemplate,
    QCard,
    QPage,
    QBtn,
    QSpinnerOval,
    QTabPanels,
    QTabPanel,
    QSeparator,
    QTabs,
    QTab,
    QCardSection,
    QChip
  },
  data() {
    return {
      data: [],
      loading: true,
      tab: "reg",
      msDesc: "",
      supplement: "",
      physDesc: ""
    };
  },
  computed: {
    // Splits the title and returns the first part.
    titleMain() {
      const title = this.data.teiHeader.fileDesc.titleStmt.title.replace(/[\n ]+/g, " ");
      return title.split(/\. (?=([A-Z][a-zà-ý]*|St\.)( [a-zà-ý]*)?( [A-Z][a-zà-ý]*)?,)/)[0];
    },
    // Splits the title and returns the second part.
    // Is different than titleMain because of lookbehind limitations.
    titleSecondary() {
      const title = this.data.teiHeader.fileDesc.titleStmt.title.replace(/[\n ]+/g, " ");
      const secondPart = title.split(
        / .?.? ?[A-Z][a-zà-ý)]*( [a-zà-ý]*)?( [A-Z][a-zà-ý]*)?(-[A-Z][-a-zà-ý]*)?(\(\?\))?\./
      );
      return secondPart[secondPart.length - 1];
    }
  },

  async mounted() {
    await this.getItems();
    await this.getXSLT("LettersMsDesc", "msDesc");
    this.loading = false;

    if (!this.hasAbstracts()) {
      this.tab = TAB_TEXTGRUNDLAGE;
    }
  },

  methods: {
    getAbstractCount() {
      const abstractsWithText = this.data.teiHeader.profileDesc.abstract.p.filter(abstract => {
        return abstract.hasOwnProperty("#text");
      });

      return abstractsWithText.length;
    },
    hasAbstracts() {
      return this.getAbstractCount() > 0;
    },
    getAbstractForLanguage(language) {
      try {
        const abstractObject = this.data.teiHeader.profileDesc.abstract.p.filter(abstract => {
          return abstract["@xml:lang"] === language;
        })[0];
        return abstractObject["#text"];
      } catch {
        return "";
      }
    },
    async getItems() {
      try {
        const response = await axios.get(`${API}${this.$route.path}`, {
          headers: { Accept: "application/json" }
        });
        this.data = response.data;
        if (response.status === 404) {
          this.$router.push({ path: "/404" });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getXSLT(fileName, targetProp) {
      this[targetProp] = await dataService.XSLTransform(this.$route.path, fileName);
    },
    openUrl(url) {
      url ? window.open(url) : null;
    }
  }
};
</script>

<style></style>
