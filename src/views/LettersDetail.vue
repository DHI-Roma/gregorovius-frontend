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
              <div class="text-h6">
                {{ titleMain }}
              </div>
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
                  <q-chip outline size="sm" color="primary" dense>
DE
</q-chip>
                  {{ getAbstractForLanguage("de") }}
                </div>
                <q-separator v-if="getAbstractCount() > 1" spaced />
                <div v-if="getAbstractForLanguage('en')" id="abstract-en">
                  <q-chip outline size="sm" color="primary" dense>
EN
</q-chip>
                  {{ getAbstractForLanguage("en") }}
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>

      <div class="row justify-center">
        <q-card
          class="col-12 q-pa-xl q-mb-xl"
          :class="isInLandscapeMode ? 'col-md-6' : 'col-md-8'"
          bordered
          flat
        >
          <div class="row justify-end">
            <q-btn
              label="TEI XML"
              flat
              icon="arrow_right_alt"
              color="primary"
              size="md"
              @click="openUrl(`https://gregorovius-edition.dhi-roma.it/api/letters/${letterId}`)"
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
          <div class="row justify-center">
            <q-btn
              v-if="previousLetter"
              flat
              rounded
              size="sm"
              color="primary"
              icon="arrow_back"
              @click="openPreviousLetter()"
            >
              <q-tooltip>
                Vorheriger Brief (chronologisch): {{ previousLetter.properties.title }}
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="previousLetterInSelection && letters.length !== lettersFiltered.length"
              flat
              rounded
              size="sm"
              color="primary"
              icon="arrow_left"
              @click="openPreviousLetterInSelection()"
            >
              <q-tooltip>
                Vorheriger Brief (in Auswahl):
                {{ previousLetterInSelection.properties.title }}
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="nextLetterInSelection && letters.length !== lettersFiltered.length"
              flat
              rounded
              size="sm"
              color="primary"
              icon="arrow_right"
              @click="openNextLetterInSelection()"
            >
              <q-tooltip>
                Nächster Brief (in Auswahl):
                {{ nextLetterInSelection.properties.title }}
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="nextLetter"
              flat
              rounded
              size="sm"
              color="primary"
              icon="arrow_forward"
              @click="openNextLetter()"
            >
              <q-tooltip>
                Nächster Brief (chronologisch): {{ nextLetter.properties.title }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-card>

        <q-card
          v-if="availableFacsimiles"
          class="col-12 q-pa-md q-mb-xl"
          :class="isInLandscapeMode ? 'col-md-6' : 'col-md-4'"
          bordered
          flat
        >
          <q-card-section>
            <q-carousel
              ref="carousel"
              v-model="selectedFacsimileSlide"
              :fullscreen="isFacsimileCarouselFullscreen"
              control-type="flat"
              control-color="primary"
              animated
              navigation
              height="auto"
              transition-prev="slide-right"
              transition-next="slide-left"
              @transition="onSlideChange"
            >
              <template #control>
                <q-carousel-control
                  position="top"
                  :offset="isFacsimileCarouselFullscreen ? [0, 20] : [0, 0]"
                >
                  <div class="row justify-around items-center q-mb-sm">
                    <div>
                      <q-btn
                        round
                        dense
                        color="primary"
                        text-color="white"
                        icon="navigate_before"
                        class="q-mr-sm"
                        @click="openPreviousSlide"
                      />
                      <q-btn
                        round
                        dense
                        color="primary"
                        text-color="white"
                        icon="navigate_next"
                        class="q-mx-sm"
                        @click="openNextSlide"
                      />
                    </div>
                    <div class="row justify-center">
                      <div class="text-subtitle text-black facsimile-label">
                        {{ selectedFacsimileLabel }}
                      </div>
                    </div>
                    <div>
                      <q-btn
                        v-if="$q.screen.gt.xs"
                        round
                        dense
                        color="primary"
                        text-color="white"
                        icon="rotate_left"
                        class="q-mr-sm"
                        @click="applyRotation(90)"
                      />
                      <q-btn
                        v-if="$q.screen.gt.xs"
                        round
                        dense
                        color="primary"
                        text-color="white"
                        icon="rotate_right"
                        class="q-mx-sm"
                        @click="applyRotation(-90)"
                      />
                      <q-btn
                        round
                        dense
                        color="primary"
                        text-color="white"
                        icon="fullscreen"
                        class="q-ml-sm"
                        @click="toggleFacsimileFullscreen"
                      />
                    </div>
                  </div>
                </q-carousel-control>
              </template>

              <q-carousel-slide
                v-for="(img, imgPosition) in availableFacsimiles"
                :key="imgPosition"
                :name="imgPosition"
                class="q-mb-xl q-mt-xl"
              >
                <div class="row justify-center">
                  <q-img
                    v-if="$q.screen.lt.md"
                    :src="getFacsimileSrc(imgPosition)"
                    :width="isFacsimileCarouselFullscreen ? '75%' : '100%'"
                    contain
                  />
                  <vue-photo-zoom-pro
                    v-else
                    type="square"
                    :high-url="getFacsimileSrc(imgPosition)"
                    :width="facsimileZoomWidth"
                    :height="150"
                    :scale="facsimileZoomScale"
                  >
                    <img
                      :id="'facsimile-img-' + imgPosition"
                      :src="getFacsimileSrc(imgPosition)"
                      :class="facsimileClasses"
                      :alt="img.label"
                      class="facsimile-img"
                      @load="applyZoomWidth"
                    />
                  </vue-photo-zoom-pro>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </q-card-section>
        </q-card>
      </div>

      <div class="row justify-center">
        <q-card
          v-if="mentionedEntities.length"
          class="col-md-8 col-12 q-pa-xl q-mb-xl"
          bordered
          flat
        >
          <q-card-section>
            <div class="text-h6">In diesem Brief erwähnte Entitäten</div>
          </q-card-section>
          <q-table grid :data="mentionedEntities" row-key="id" flat :pagination="mentionPagination">
            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <q-card>
                  <q-separator />
                  <MentionsTile :entity="props.row" />
                </q-card>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
      <div class="row justify-center">
        <q-card bordered class="col-md-8 col-12 q-pa-xl q-mb-xl" flat>
          <div class="text-caption q-tm-sm text-secondary">
            Zitierhinweis:
            {{ citation }}
            <a :href="location">{{ location }}</a>
            <q-btn
              class="q-ml-sm"
              icon="content_paste"
              color="secondary"
              size="xs"
              :label="copyCitationLabel"
              @click="copyCitation"
            />
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
import { mapActions, mapGetters } from "vuex";
import { basePathLetters } from "../router";
import LettersText from "@/components/LettersText.vue";
import Comment from "@/components/Comment.vue";
import axios from "axios";
import { dataService } from "@/shared";
import letterService from "@/services/letter-service";
import metaService from "@/services/meta-service";
import { API } from "../../env";
import tableService from "@/services/table-service";

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
  QSplitter,
} from "quasar";
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";
import MentionsTile from "@/components/MentionsTile";
import "vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css";
import VuePhotoZoomPro from "vue-photo-zoom-pro";

const TAB_TEXTGRUNDLAGE = "tgl";
const SPLITTER_SIZE_START = 100;

const FG_03_03_SHOULD_DISPLAY_EDITOR = true;

export default {
  name: "Item",
  components: {
    MentionsTile,
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
    QSplitter,
    VuePhotoZoomPro,
  },
  mixins: [openInNewTabMixin],
  data() {
    return {
      data: [],
      loading: true,
      tab: "reg",
      mentionTab: "all",
      msDesc: "",
      supplement: "",
      physDesc: "",
      splitterModel: SPLITTER_SIZE_START,
      copyCitationLabel: "kopieren",
      mentionPagination: {
        rowsPerPage: 0,
        sortBy: "name",
      },
      mentionedEntityIdsInOrder: [],
      selectedFacsimileSlide: "0",
      isFacsimileCarouselFullscreen: false,
      facsimileRotation: 0,
      facsimileZoomWidth: 0,
    };
  },
  computed: {
    ...mapGetters([
      "activeComment",
      "letters",
      "lettersFiltered",
      "facsimiles",
      "selectedRecipients",
      "selectedPlaceSent",
      "selectedPlaceReceived",
      "selectedYears",
    ]),

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
      return window.location.protocol + "//" + window.location.host + window.location.pathname
    },

    letterEntity() {
      return this.letters.find((letter) => letter.id === this.letterId);
    },

    mentionedPersonEntities() {
      if (!this.persons.length) {
        return [];
      }

      if (!this.letterEntity) {
        return [];
      }

      const personsEntityIds = this.letterEntity.properties.mentioned.persons
        .flat()
        .join(" ")
        .split(" ");

      return this.persons
        .filter((person) => {
          const matches = personsEntityIds.find(
            (mentionedPersonId) => mentionedPersonId === person.id
          );
          return !!matches;
        })
        .sort((personA, personB) => {
          personA.properties.name.fullName > personB.properties.name.fullName;
        });
    },

    mentionedPlaceEntites() {
      if (!this.places.length) {
        return [];
      }

      if (!this.letterEntity) {
        return [];
      }

      const placeEntityIds = this.letterEntity.properties.mentioned.places
        .flat()
        .join(" ")
        .split(" ");

      return this.places
        .filter((place) => {
          const matches = placeEntityIds.find((mentionedPlaceId) => mentionedPlaceId === place.id);
          return matches ? true : false;
        })
        .sort((placeA, placeB) => placeA.properties.name.toponym > placeB.properties.name.toponym);
    },

    mentionedWorkEntities() {
      if (!this.works.length) {
        return [];
      }

      if (!this.letterEntity) {
        return [];
      }

      return this.works.filter((work) => {
        const workEntityIds = this.letterEntity.properties.mentioned.works
          .flat()
          .join(" ")
          .split(" ");
        const matches = workEntityIds.find((mentionedWorkId) => mentionedWorkId === work.id);
        return matches ? true : false;
      });
    },

    mentionedEntities() {
      return [
        ...this.mentionedPersonEntities,
        ...this.mentionedPlaceEntites,
        ...this.mentionedWorkEntities,
      ].sort((entityA, entityB) => {
        const positionInSortedListA = this.mentionedEntityIdsInOrder.indexOf(entityA.id);
        const positionInSortedListB = this.mentionedEntityIdsInOrder.indexOf(entityB.id);

        if (positionInSortedListA > positionInSortedListB) {
          return 1;
        }

        if (positionInSortedListA < positionInSortedListB) {
          return -1;
        }

        return 0;
      });
    },

    ...mapGetters(["activeComment", "letters", "persons", "places", "works"]),
    currentLetterIndex() {
      return this.letters.findIndex((letter) => letter.id === this.letterId);
    },

    currentLetterIndexInSelection() {
      return this.lettersFiltered.findIndex((letter) => letter.id === this.letterId);
    },

    nextLetter() {
      if (this.currentLetterIndex + 1 > this.letters.length - 1) {
        return false;
      }
      return this.letters[this.currentLetterIndex + 1];
    },
    previousLetter() {
      if (this.currentLetterIndex - 1 < 0) {
        return false;
      }
      return this.letters[this.currentLetterIndex - 1];
    },

    nextLetterInSelection() {
      if (this.currentLetterIndexInSelection + 1 > this.lettersFiltered.length - 1) {
        return false;
      }
      return this.lettersFiltered[this.currentLetterIndexInSelection + 1];
    },

    previousLetterInSelection() {
      if (this.currentLetterIndexInSelection - 1 < 0) {
        return false;
      }
      return this.lettersFiltered[this.currentLetterIndexInSelection - 1];
    },
    availableFacsimiles() {
      return this.facsimiles[this.letterId] ?? null;
    },
    hasLandscapeImage() {
      for (const facsimile of Object.values(this.availableFacsimiles)) {
        if (facsimile.name.includes("_quer_")) {
          return true;
        }
      }

      return false;
    },
    showLandscapeFacsimile() {
      if (!this.availableFacsimiles) {
        return false;
      }

      return this.hasLandscapeImage;
    },
    isInLandscapeMode() {
      if ([90, 270].includes(this.facsimileRotation) && !this.hasLandscapeImage) {
        return !this.showLandscapeFacsimile;
      }
      return this.showLandscapeFacsimile;
    },
    facsimileClasses() {
      if (this.isFacsimileCarouselFullscreen) {
        return ["facsimile-fullscreen"];
      }

      const orientationClass = this.isInLandscapeMode ? "facsimile-landscape" : "";

      if (this.$q.screen.gt.lg) {
        return ["facsimile-lg", orientationClass];
      }

      if (this.$q.screen.gt.md) {
        return ["facsimile-md", orientationClass];
      }
      return ["facsimile-sm", orientationClass];
    },
    selectedFacsimileLabel() {
      if (!Object.values(this.availableFacsimiles).length) {
        return "";
      }

      return this.availableFacsimiles[parseInt(this.selectedFacsimileSlide)].label;
    },
    facsimileZoomScale() {
      if (this.isFacsimileCarouselFullscreen && !this.isInLandscapeMode) {
        return 1.5;
      }
      return 2;
    },
  },

  watch: {
    "$route.params.id": {
      handler: function (oldId, newId) {
        if (oldId !== newId) {
          this.initializeComponent();
        }
      },
    },
    availableFacsimiles(newValue) {
      if (newValue) {
        this.selectedFacsimileSlide = Object.keys(newValue).sort()[0];
      }
    },
    selectedFacsimileSlide: {
      immediate: true,
      handler: function () {
        this.$nextTick(() => {
          this.applyZoomWidth();
        });
      },
    },
    facsimileRotation: {
      immediate: true,
      handler: function () {
        this.$nextTick(() => {
          this.applyZoomWidth();
        });
      },
    },
    isFacsimileCarouselFullscreen: {
      immediate: true,
      handler: function () {
        this.$nextTick(() => {
          this.applyZoomWidth();
        });
      },
    },
  },

  mounted() {
    this.initializeComponent();
  },

  methods: {
    ...mapActions([
      "loadEntitiesAction",
      "setSelectedEntityIds",
      "setLettersFiltered",
      "setSelectedAction",
    ]),
    async initializeComponent() {
      await Promise.allSettled([
        this.getItems(),
        this.getXSLT("LettersMsDesc", "msDesc"),
        this.loadEntitiesAction(),
      ]);

      await this.loadRouteParams();

      if (!this.hasAbstracts()) {
        this.tab = TAB_TEXTGRUNDLAGE;
      }

      if (!this.$route.params.entityIds && !Object.entries(this.$route.query).length) {
        await this.setLettersFiltered([]);
      }

      if (this.$route.params.entityIds) {
        await this.filterLetterFromMentions();
      } else if (Object.entries(this.$route.query).length) {
        await this.filterLettersFromQueryParams();
      }

      metaService.setMetaTitle(this.titleMain + ". " + this.titleSecondary);
      metaService.setMetaAuthors([this.editor, ...letterService.getResponsibleList(this.data)]);
      metaService.refreshZotero();

      if (this.$route.params.commentId) {
        await this.initializeActiveComment();
      }
      this.setMentionedEntityIdsInOrder();

      this.loading = false;
    },
    async filterLetterFromMentions() {
      const entityIds = this.$route.params.entityIds.split(",");
      const filteredLetters = this.letters.filter((letter) => {
        for (const entityId of entityIds) {
          const mentionedPersonEntityIds = letterService.flattenMentions(
            letter.properties.mentioned.persons
          );
          if (mentionedPersonEntityIds.includes(entityId)) {
            return true;
          }

          const mentionedPlaceEntityIds = letterService.flattenMentions(
            letter.properties.mentioned.places
          );
          if (mentionedPlaceEntityIds.includes(entityId)) {
            return true;
          }

          const mentionedWorkEntityIds = letterService.flattenMentions(
            letter.properties.mentioned.works
          );
          if (mentionedWorkEntityIds.includes(entityId)) {
            return true;
          }
        }

        return false;
      });

      await this.setLettersFiltered(filteredLetters);
    },
    async filterLettersFromQueryParams() {
      if (this.lettersFiltered.length) {
        return;
      }

      if (!Object.entries(this.$route.query).length) {
        return;
      }

      let filteredLetters = this.letters;

      if (this.selectedRecipients.length) {
        filteredLetters = tableService.filterByRecipients(filteredLetters, this.selectedRecipients);
      }

      if (this.selectedPlaceSent.value) {
        filteredLetters = filteredLetters.filter((letter) =>
          tableService.hasValue(letter, "place.sent", this.selectedPlaceSent.value)
        );
      }

      if (this.selectedPlaceReceived.value) {
        filteredLetters = filteredLetters.filter((letter) =>
          tableService.hasValue(letter, "place.received", this.selectedPlaceReceived.value)
        );
      }

      if (this.selectedYears.length) {
        filteredLetters = filteredLetters.filter((letter) =>
          !letter.properties.date ? false : this.selectedYears.includes(letter.properties.date.slice(0, 4))
        );
      }

      await this.setLettersFiltered(filteredLetters);
    },
    async loadRouteParams() {
      for (const [paramKey, paramValue] of Object.entries(this.$route.query)) {
        if (["years", "selectedYears", "recipient"].includes(paramKey)) {
          try {
            await this.setSelectedAction({
              entity: paramKey,
              value: paramValue.split(",").filter((entry) => entry.length > 0),
            });
          } catch (error) {
            console.log(error);
          }
        }
        if (paramKey === "placeSent") {
          await this.setSelectedAction({ entity: paramKey, value: paramValue });
        }
        if (paramKey === "placeReceived") {
          await this.setSelectedAction({ entity: paramKey, value: paramValue });
        }
      }
    },
    async initializeActiveComment() {
      const commentReference = document.querySelector(
        `.g-comment-orig[commentId="${this.$route.params.commentId}"]`
      );
      const commentHtml = document.querySelector(`#comment-${this.$route.params.commentId}`);
      const comment = {
        id: commentReference.getAttribute("commentId"),
        text: commentHtml.innerHTML,
        offset: 0,
      };

      await this.$store.dispatch("setActiveComment", comment);

      setTimeout(() => {
        const commentReference = document.querySelector(
          `.g-comment-orig[commentId="${this.$route.params.commentId}"]`
        );
        const commentHtml = document.querySelector(`#comment-${this.$route.params.commentId}`);
        comment.offsetTop = commentReference.offsetTop;
        comment.text = commentHtml.innerHTML;

        this.$store.dispatch("setActiveComment", comment);
      }, 0);
    },

    getAbstractCount() {
      const abstractsWithText = this.data.teiHeader.profileDesc.abstract.p.filter((abstract) => {
        return abstract.hasOwnProperty("#text");
      });

      return abstractsWithText.length;
    },
    hasAbstracts() {
      return this.getAbstractCount() > 0;
    },
    getAbstractForLanguage(language) {
      try {
        const abstractObject = this.data.teiHeader.profileDesc.abstract.p.filter((abstract) => {
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
          headers: { Accept: "application/json" },
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
    onSeparatorChange() {
      this.updateCommentPosition();
    },
    updateCommentPosition() {
      if (!this.activeComment.id) {
        return;
      }

      const activeCommentReference = document.querySelector(
        `.g-comment-orig[commentId="${this.activeComment.id}"]`
      );

      const commentHtml = document.querySelector(`#comment-${this.activeComment.id}`);

      const commentUpdate = {
        ...this.activeComment,
        text: commentHtml.innerHTML,
      };
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
    },
    getWorkType(type) {
      switch (type) {
        case "gregoroviusMain":
          return "Werkregister Gregorovius";
        case "gregoroviusTranslation":
          return "Übersetzungen";
        case "othersMain":
          return "Werke anderer Autoren";
        case "secondary":
          return "Sekundärliteratur";
        default:
          return "Unbekannt";
      }
    },
    async openPreviousLetter() {
      await this.$store.dispatch("unselectComment");
      await this.$router.push({
        name: "Brief",
        params: {
          id: this.previousLetter.id,
        },
      });
    },
    async openNextLetter() {
      await this.$store.dispatch("unselectComment");
      await this.$router.push({
        name: "Brief",
        params: {
          id: this.nextLetter.id,
        },
      });
    },
    async openPreviousLetterInSelection() {
      await this.$store.dispatch("unselectComment");
      let name = "Brief";
      const params = {
        id: this.previousLetterInSelection.id,
      };

      if (this.$route.params.entityIds) {
        name = "Briefe mit vorhandenen Entitaeten";
        params.entityIds = this.$route.params.entityIds;
      }

      await this.$router.push({
        name,
        params,
        query: this.$route.query,
      });
    },
    async openNextLetterInSelection() {
      await this.$store.dispatch("unselectComment");

      let name = "Brief";
      const params = {
        id: this.nextLetterInSelection.id,
      };

      if (this.$route.params.entityIds) {
        name = "Briefe mit vorhandenen Entitaeten";
        params.entityIds = this.$route.params.entityIds;
      }
      await this.$router.push({
        name,
        params,
        query: this.$route.query,
      });
    },
    setMentionedEntityIdsInOrder() {
      setTimeout(() => {
        const entityIds = [];
        const entityIdsFromDomNodes = document
          .querySelector(".g-edition-text")
          .querySelectorAll(".g-entity-link[entity-id]");

        entityIdsFromDomNodes.forEach((node) => {
          const ids = node.getAttribute("entity-id").split(" ");
          entityIds.push(...ids);
        });

        this.mentionedEntityIdsInOrder = entityIds;
      });
    },

    getFacsimileSrc(imgName) {
      return `${API}/facsimiles/${this.letterId}/${imgName}/${this.facsimileRotation}`;
    },
    toggleFacsimileFullscreen() {
      this.isFacsimileCarouselFullscreen = !this.isFacsimileCarouselFullscreen;
    },
    applyRotation(rotation) {
      this.facsimileRotation += rotation;

      while (this.facsimileRotation < 0) {
        this.facsimileRotation += 360;
      }

      while (this.facsimileRotation >= 360) {
        this.facsimileRotation -= 360;
      }
    },
    openPreviousSlide() {
      this.facsimileRotation = 0;
      this.$refs.carousel.previous();
      this.$nextTick(() => {
        this.applyZoomWidth();
      });
    },
    openNextSlide() {
      this.facsimileRotation = 0;
      this.$refs.carousel.next();
      this.$nextTick(() => {
        this.applyZoomWidth();
      });
    },
    onSlideChange() {
      this.facsimileRotation = 0;
      this.$nextTick(() => {
        this.applyZoomWidth();
      });
    },
    applyZoomWidth() {
      const facsimileImage = document.querySelector(
        "#facsimile-img-" + this.selectedFacsimileSlide
      );
      if (!facsimileImage) {
        return;
      }

      if (facsimileImage.clientWidth <= 0) {
        setTimeout(() => {
          this.applyZoomWidth();
        }, 250);
        return;
      }

      if (this.isFacsimileCarouselFullscreen && !this.isInLandscapeMode) {
        this.facsimileZoomWidth = facsimileImage.clientWidth * 1.5;
        return;
      } else if (this.isFacsimileCarouselFullscreen) {
        const additionalWidth = (window.innerWidth - facsimileImage.clientWidth) / 2 - 50;
        this.facsimileZoomWidth = facsimileImage.clientWidth + additionalWidth;
        return;
      }

      this.facsimileZoomWidth = facsimileImage.clientWidth;
    },
  },
};
</script>

<style lang="stylus" scoped>
.facsimile-lg
  max-width: 475px
  max-height: 700px

  &.facsimile-landscape
    max-width: 700px

.facsimile-md
  max-width: 350px
  max-height: 600px

  &.facsimile-landscape
    max-width: 600px

.facsimile-sm
  max-width: 225px
  max-height: 500px

  &.facsimile-landscape
    max-width: 400px

.facsimile-control-offset
  margin-bottom: 2rem

.facsimile-fullscreen
  max-width: auto
  max-height: (95vh - 5rem)

.facsimile-img
  widtH: 100%
</style>
