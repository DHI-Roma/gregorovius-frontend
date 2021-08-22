<template>
  <div>
    <q-page v-show="!loading" padding>
      <div class="row justify-center">
        <div v-if="data.teiHeader" class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
          <q-card class="q-pa-xl" flat>
            <div v-if="editor" class="text-caption text-right q-tm-sm text-secondary">
              Hrsg. <span id="editor">{{ editor }}</span>
            </div>
            <div v-if="responsible" class="text-caption text-right q-tm-sm text-secondary">
              Mitarb. <span id="responsible">{{ responsible }}</span>
            </div>
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
              @click="openUrl(`http://gregorovius-edition.dhi-roma.it/api/letters/${letterId}`)"
            />
          </div>
          <div class="row">
            <q-splitter
              v-model="splitterModel"
              :limits="splitterLimits"
              after-class="overflow-auto"
              :separator-class="splitterSeparatorClass"
              @input="onSeparatorChange"
            >
              <template v-slot:before>
                <LettersText />
              </template>
              <template v-slot:after>
                <Comment />
              </template>
            </q-splitter>
          </div>
        </q-card>
      </div>
      <div class="row justify-center">
        <q-card class="col-md-8 col-12 q-pa-xl q-mb-xl" bordered flat>
          <strong>Zitierhinweis</strong>
          <div class="q-mt-sm">
            {{ citation }}
            <a :href="location">{{ location }}</a>
          </div>
          <q-btn
            class="q-mt-sm"
            icon="content_paste"
            color="secondary"
            :label="copyCitationLabel"
            @click="copyCitation">
          </q-btn>
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
import { mapGetters } from "vuex";
import { basePathLetters } from "../router";
import LettersText from "@/components/LettersText.vue";
import Comment from "@/components/Comment.vue";
import axios from "axios";
import { dataService } from "@/shared";
import letterService from "@/services/letter-service";
import { API } from "@/shared/config";
import {
  copyToClipboard,
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
  QChip,
  QSplitter
} from "quasar";

const TAB_TEXTGRUNDLAGE = "tgl";
const SPLITTER_SIZE_START = 100;

const FG_03_03_SHOULD_DISPLAY_EDITOR = true;

export default {
  name: "Item",
  components: {
    Comment,
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
    QChip,
    QSplitter
  },
  data() {
    return {
      data: [],
      loading: true,
      tab: "reg",
      msDesc: "",
      supplement: "",
      physDesc: "",
      splitterModel: SPLITTER_SIZE_START,
      copyCitationLabel: "kopieren"
    };
  },
  computed: {
    letterId() {
      return this.$route.params.id;
    },
    titleMain() {
      return letterService.getTitle(this.data);
    },
    titleSecondary() {
      return letterService.getSecondaryTitle(this.data);
    },
    activeComment() {
      return this.$store.getters.activeComment;
    },
    splitterLimits() {
      if (this.activeComment.id) {
        return [50, 75];
      }

      return [100, 100];
    },
    splitterSeparatorClass() {
      if (this.activeComment.id) {
        return "";
      }
      return "separator-hidden";
    },
    editor() {
      if (!FG_03_03_SHOULD_DISPLAY_EDITOR) {
        return "";
      }

      return letterService.getEditor(this.data);
    },
    responsible() {
      if (!FG_03_03_SHOULD_DISPLAY_EDITOR) {
        return "";
      }

      return letterService.getResponsible(this.data);
    },

    citation() {
      return letterService.getCitationRecommendation(this.data);
    },

    location() {
      return window.location;
    },

    ...mapGetters(["activeComment"])
  },

  mounted() {
    this.initializeComponent();
  },

  watch: {
    "$route.params.id": {
      handler: function(oldId, newId) {
        if (oldId !== newId) {
          this.initializeComponent();
        }
      }
    }
  },

  methods: {
    async initializeComponent() {
      await this.getItems();
      await this.getXSLT("LettersMsDesc", "msDesc");
      this.loading = false;

      if (!this.hasAbstracts()) {
        this.tab = TAB_TEXTGRUNDLAGE;
      }

      if (this.$route.params.commentId) {
        const commentReference = document.querySelector(
          `.g-comment-orig[commentId="${this.$route.params.commentId}"]`
        );
        const comment = {
          id: commentReference.getAttribute("commentId"),
          text: commentReference.getAttribute("commentText"),
          offset: 0
        };

        this.$store.dispatch("setActiveComment", comment);

        setTimeout(() => {
          const commentReference = document.querySelector(
            `.g-comment-orig[commentId="${this.$route.params.commentId}"]`
          );
          const commentHtml = document.querySelector(`#comment-${this.$route.params.commentId}`);
          comment.offsetTop = commentReference.offsetTop;
          comment.text = commentHtml.innerHTML;

          this.$store.dispatch("setActiveComment", comment);
        }, 0);
      }
    },

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
        const response = await axios.get(`${API}${basePathLetters}/${this.letterId}`, {
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
      this[targetProp] = await dataService.XSLTransform(
        `${basePathLetters}/${this.letterId}`,
        fileName
      );
    },

    openUrl(url) {
      url ? window.open(url) : null;
    },
    onSeparatorChange(value) {
      this.updateCommentPosition();
    },
    updateCommentPosition() {
      if (!this.activeComment.id) {
        return;
      }

      const activeCommentReference = document.querySelector(
        `.g-comment-orig[commentId="${this.activeComment.id}"]`
      );

      const commentUpdate = { ...this.activeComment };
      commentUpdate.offsetTop = activeCommentReference.offsetTop;
      this.$store.dispatch("setActiveComment", commentUpdate);
    },
    copyCitation() {
      const citation = this.citation + this.location;
      copyToClipboard(citation)
        .then(() => {
          this.copyCitationLabel = "kopiert";
          setTimeout(() => {
            this.copyCitationLabel = "kopieren";
          }, 3000);
        })
        .catch(() => console.log("Something went wrong while copying to clipboard."));
    }
  }
};
</script>
