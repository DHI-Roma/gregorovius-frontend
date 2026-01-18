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
              before-class="text-panel"
              after-class="overflow-auto comment-panel"
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
                  <div v-else :class="facsimileClasses.join(' ') + ' facsimile-wrapper'">
                    <vue-image-zoomer
                      :regular="getFacsimileSrc(imgPosition)"
                      :zoom="getFacsimileSrc(imgPosition)"
                      :zoom-amount="facsimileZoomScale"
                      :zoom-width="facsimileZoomWidth"
                      :img-id="'facsimile-img-' + imgPosition"
                      img-class="facsimile-img"
                      :alt="img.label"
                      @regular-loaded="applyZoomWidth"
                    />
                  </div>
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
          <q-table grid :rows="mentionedEntities" row-key="id" flat :pagination="mentionPagination">
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
import { defineComponent, ref, computed, watch, onMounted, nextTick } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";
import { useMainStore } from "src/stores/main";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useQuasar, copyToClipboard } from "quasar";
import { basePathLetters } from "../router";
import LettersText from "src/components/LettersText.vue";
import Comment from "src/components/Comment.vue";
import axios from "axios";
import { dataService } from "src/shared";
import letterService from "src/services/letter-service";
// import metaService from "src/services/meta-service";
import { API } from "../../env";
import tableService from "src/services/table-service";
import MentionsTile from "src/components/MentionsTile.vue";
import { VueImageZoomer } from "vue-image-zoomer";
import "vue-image-zoomer/dist/style.css";

const TAB_TEXTGRUNDLAGE = "tgl";
const SPLITTER_SIZE_START = 100;

const FG_03_03_SHOULD_DISPLAY_EDITOR = true;

export default defineComponent({
  name: "LettersDetail",
  components: {
    MentionsTile,
    Comment,
    LettersText,
    VRuntimeTemplate,
    VueImageZoomer,
  },

  setup() {
    const store = useMainStore();
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();

    const {
      activeComment,
      letters,
      lettersFiltered,
      facsimiles,
      selectedRecipients,
      selectedPlaceSent,
      selectedPlaceReceived,
      selectedYears,
      persons,
      places,
      works,
    } = storeToRefs(store);

    // Refs
    const carousel = ref(null);
    const data = ref([]);
    const loading = ref(true);
    const tab = ref("reg");
    const msDesc = ref("");
    const splitterModel = ref(SPLITTER_SIZE_START);
    const copyCitationLabel = ref("kopieren");
    const mentionPagination = ref({ rowsPerPage: 0, sortBy: "name" });
    const mentionedEntityIdsInOrder = ref([]);
    const selectedFacsimileSlide = ref("0");
    const isFacsimileCarouselFullscreen = ref(false);
    const facsimileRotation = ref(0);
    const facsimileZoomWidth = ref(0);

    // Computed
    const letterId = computed(() => route.params.id);
    const titleMain = computed(() => letterService.getTitle(data.value));
    const titleSecondary = computed(() => letterService.getSecondaryTitle(data.value));

    const splitterLimits = computed(() => {
      if (activeComment.value.id) {
        return [50, 75];
      }
      return [100, 100];
    });

    const splitterSeparatorClass = computed(() => {
      if (activeComment.value.id) {
        return "";
      }
      return "separator-hidden";
    });

    const editor = computed(() => {
      if (!FG_03_03_SHOULD_DISPLAY_EDITOR) return "";
      return letterService.getEditor(data.value);
    });

    const responsible = computed(() => {
      if (!FG_03_03_SHOULD_DISPLAY_EDITOR) return "";
      return letterService.getResponsible(data.value);
    });

    const citation = computed(() => letterService.getCitationRecommendation(data.value));
    const location = computed(() => window.location.protocol + "//" + window.location.host + window.location.pathname);

    const letterEntity = computed(() => letters.value.find((letter) => letter.id === letterId.value));

    const mentionedPersonEntities = computed(() => {
      if (!persons.value.length || !letterEntity.value) return [];

      const personsEntityIds = letterEntity.value.properties.mentioned.persons
        .flat()
        .join(" ")
        .split(" ");

      return persons.value
        .filter((person) => personsEntityIds.find((id) => id === person.id))
        .sort((a, b) => a.properties.name.fullName > b.properties.name.fullName);
    });

    const mentionedPlaceEntites = computed(() => {
      if (!places.value.length || !letterEntity.value) return [];

      const placeEntityIds = letterEntity.value.properties.mentioned.places
        .flat()
        .join(" ")
        .split(" ");

      return places.value
        .filter((place) => placeEntityIds.find((id) => id === place.id))
        .sort((a, b) => a.properties.name.toponym > b.properties.name.toponym);
    });

    const mentionedWorkEntities = computed(() => {
      if (!works.value.length || !letterEntity.value) return [];

      const workEntityIds = letterEntity.value.properties.mentioned.works
        .flat()
        .join(" ")
        .split(" ");

      return works.value.filter((work) => workEntityIds.find((id) => id === work.id));
    });

    const mentionedEntities = computed(() => {
      return [
        ...mentionedPersonEntities.value,
        ...mentionedPlaceEntites.value,
        ...mentionedWorkEntities.value,
      ].sort((a, b) => {
        const posA = mentionedEntityIdsInOrder.value.indexOf(a.id);
        const posB = mentionedEntityIdsInOrder.value.indexOf(b.id);
        return posA - posB;
      });
    });

    const currentLetterIndex = computed(() => letters.value.findIndex((l) => l.id === letterId.value));
    const currentLetterIndexInSelection = computed(() => lettersFiltered.value.findIndex((l) => l.id === letterId.value));

    const nextLetter = computed(() => {
      if (currentLetterIndex.value + 1 > letters.value.length - 1) return false;
      return letters.value[currentLetterIndex.value + 1];
    });

    const previousLetter = computed(() => {
      if (currentLetterIndex.value - 1 < 0) return false;
      return letters.value[currentLetterIndex.value - 1];
    });

    const nextLetterInSelection = computed(() => {
      if (currentLetterIndexInSelection.value + 1 > lettersFiltered.value.length - 1) return false;
      return lettersFiltered.value[currentLetterIndexInSelection.value + 1];
    });

    const previousLetterInSelection = computed(() => {
      if (currentLetterIndexInSelection.value - 1 < 0) return false;
      return lettersFiltered.value[currentLetterIndexInSelection.value - 1];
    });

    const availableFacsimiles = computed(() => facsimiles.value[letterId.value] ?? null);

    const hasLandscapeImage = computed(() => {
      if (!availableFacsimiles.value) return false;
      for (const facsimile of Object.values(availableFacsimiles.value)) {
        if (facsimile.name.includes("_quer_")) return true;
      }
      return false;
    });

    const showLandscapeFacsimile = computed(() => {
      if (!availableFacsimiles.value) return false;
      return hasLandscapeImage.value;
    });

    const isInLandscapeMode = computed(() => {
      if ([90, 270].includes(facsimileRotation.value) && !hasLandscapeImage.value) {
        return !showLandscapeFacsimile.value;
      }
      return showLandscapeFacsimile.value;
    });

    const facsimileClasses = computed(() => {
      if (isFacsimileCarouselFullscreen.value) return ["facsimile-fullscreen"];

      const orientationClass = isInLandscapeMode.value ? "facsimile-landscape" : "";
      if ($q.screen.gt.lg) return ["facsimile-lg", orientationClass];
      if ($q.screen.gt.md) return ["facsimile-md", orientationClass];
      return ["facsimile-sm", orientationClass];
    });

    const selectedFacsimileLabel = computed(() => {
      if (!availableFacsimiles.value || !Object.values(availableFacsimiles.value).length) return "";
      return availableFacsimiles.value[parseInt(selectedFacsimileSlide.value)]?.label ?? "";
    });

    const facsimileZoomScale = computed(() => {
      if (isFacsimileCarouselFullscreen.value && !isInLandscapeMode.value) return 1.5;
      return 2;
    });

    // Methods
    function getAbstractCount() {
      if (!data.value?.teiHeader?.profileDesc?.abstract?.p) return 0;
      return data.value.teiHeader.profileDesc.abstract.p.filter((abstract) => Object.hasOwn(abstract, "#text")).length;
    }

    function hasAbstracts() {
      return getAbstractCount() > 0;
    }

    function getAbstractForLanguage(language) {
      try {
        const abstractObject = data.value.teiHeader.profileDesc.abstract.p.filter(
          (abstract) => abstract["@xml:lang"] === language
        )[0];
        return abstractObject["#text"];
      } catch {
        return "";
      }
    }

    async function getItems() {
      try {
        const response = await axios.get(`${API}${basePathLetters}/${letterId.value}`, {
          headers: { Accept: "application/json" },
        });
        data.value = response.data;
        if (response.status === 404) {
          router.push({ path: "/404" });
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function getXSLT(fileName, targetRef) {
      const result = await dataService.XSLTransform(`${basePathLetters}/${letterId.value}`, fileName);
      if (targetRef === "msDesc") msDesc.value = result;
    }

    function openUrl(url) {
      if (url) window.open(url);
    }

    function updateCommentPosition() {
      if (!activeComment.value.id) return;

      const activeCommentReference = document.querySelector(`.g-comment-orig[commentId="${activeComment.value.id}"]`);
      const commentHtml = document.querySelector(`#comment-${activeComment.value.id}`);

      const commentUpdate = {
        ...activeComment.value,
        text: commentHtml.innerHTML,
        offsetTop: activeCommentReference.offsetTop,
      };
      store.setActiveComment(commentUpdate);
    }

    function onSeparatorChange() {
      updateCommentPosition();
    }

    function copyCitationHandler() {
      const citationText = citation.value + location.value;
      copyToClipboard(citationText)
        .then(() => {
          copyCitationLabel.value = "kopiert";
          setTimeout(() => {
            copyCitationLabel.value = "kopieren";
          }, 3000);
        })
        .catch(() => console.log("Something went wrong while copying to clipboard."));
    }

    async function openPreviousLetter() {
      store.unselectComment();
      await router.push({ name: "Brief", params: { id: previousLetter.value.id } });
    }

    async function openNextLetter() {
      store.unselectComment();
      await router.push({ name: "Brief", params: { id: nextLetter.value.id } });
    }

    async function openPreviousLetterInSelection() {
      store.unselectComment();
      let name = "Brief";
      const params = { id: previousLetterInSelection.value.id };

      if (route.params.entityIds) {
        name = "Briefe mit vorhandenen Entitaeten";
        params.entityIds = route.params.entityIds;
      }

      await router.push({ name, params, query: route.query });
    }

    async function openNextLetterInSelection() {
      store.unselectComment();
      let name = "Brief";
      const params = { id: nextLetterInSelection.value.id };

      if (route.params.entityIds) {
        name = "Briefe mit vorhandenen Entitaeten";
        params.entityIds = route.params.entityIds;
      }

      await router.push({ name, params, query: route.query });
    }

    function setMentionedEntityIdsInOrder() {
      setTimeout(() => {
        const entityIds = [];
        const editionText = document.querySelector(".g-edition-text");
        if (!editionText) return;

        const entityIdsFromDomNodes = editionText.querySelectorAll(".g-entity-link[entity-id]");
        entityIdsFromDomNodes.forEach((node) => {
          const ids = node.getAttribute("entity-id").split(" ");
          entityIds.push(...ids);
        });

        mentionedEntityIdsInOrder.value = entityIds;
      });
    }

    function getFacsimileSrc(imgName) {
      return `${API}/facsimiles/${letterId.value}/${imgName}/${facsimileRotation.value}`;
    }

    function toggleFacsimileFullscreen() {
      isFacsimileCarouselFullscreen.value = !isFacsimileCarouselFullscreen.value;
    }

    function applyRotation(rotation) {
      facsimileRotation.value += rotation;
      while (facsimileRotation.value < 0) facsimileRotation.value += 360;
      while (facsimileRotation.value >= 360) facsimileRotation.value -= 360;
    }

    function applyZoomWidth() {
      const facsimileImage = document.querySelector("#facsimile-img-" + selectedFacsimileSlide.value);
      if (!facsimileImage) return;

      if (facsimileImage.clientWidth <= 0) {
        setTimeout(() => applyZoomWidth(), 250);
        return;
      }

      if (isFacsimileCarouselFullscreen.value && !isInLandscapeMode.value) {
        facsimileZoomWidth.value = facsimileImage.clientWidth * 1.5;
      } else if (isFacsimileCarouselFullscreen.value) {
        const additionalWidth = (window.innerWidth - facsimileImage.clientWidth) / 2 - 50;
        facsimileZoomWidth.value = facsimileImage.clientWidth + additionalWidth;
      } else {
        facsimileZoomWidth.value = facsimileImage.clientWidth;
      }
    }

    function openPreviousSlide() {
      facsimileRotation.value = 0;
      carousel.value.previous();
      nextTick(() => applyZoomWidth());
    }

    function openNextSlide() {
      facsimileRotation.value = 0;
      carousel.value.next();
      nextTick(() => applyZoomWidth());
    }

    function onSlideChange() {
      facsimileRotation.value = 0;
      nextTick(() => applyZoomWidth());
    }

    async function filterLetterFromMentions() {
      const entityIds = route.params.entityIds.split(",");
      const filteredLetters = letters.value.filter((letter) => {
        for (const entityId of entityIds) {
          const mentionedPersonEntityIds = letterService.flattenMentions(letter.properties.mentioned.persons);
          if (mentionedPersonEntityIds.includes(entityId)) return true;

          const mentionedPlaceEntityIds = letterService.flattenMentions(letter.properties.mentioned.places);
          if (mentionedPlaceEntityIds.includes(entityId)) return true;

          const mentionedWorkEntityIds = letterService.flattenMentions(letter.properties.mentioned.works);
          if (mentionedWorkEntityIds.includes(entityId)) return true;
        }
        return false;
      });

      store.setLettersFiltered(filteredLetters);
    }

    async function filterLettersFromQueryParams() {
      if (lettersFiltered.value.length) return;
      if (!Object.entries(route.query).length) return;

      let filteredLetters = letters.value;

      if (selectedRecipients.value.length) {
        filteredLetters = tableService.filterByRecipients(filteredLetters, selectedRecipients.value);
      }

      if (selectedPlaceSent.value?.value) {
        filteredLetters = filteredLetters.filter((letter) =>
          tableService.hasValue(letter, "place.sent", selectedPlaceSent.value.value)
        );
      }

      if (selectedPlaceReceived.value?.value) {
        filteredLetters = filteredLetters.filter((letter) =>
          tableService.hasValue(letter, "place.received", selectedPlaceReceived.value.value)
        );
      }

      if (selectedYears.value.length) {
        filteredLetters = filteredLetters.filter((letter) =>
          !letter.properties.date ? false : selectedYears.value.includes(letter.properties.date.slice(0, 4))
        );
      }

      store.setLettersFiltered(filteredLetters);
    }

    async function loadRouteParams() {
      for (const [paramKey, paramValue] of Object.entries(route.query)) {
        if (["years", "selectedYears", "recipient"].includes(paramKey)) {
          try {
            store.setSelected({
              entity: paramKey,
              value: paramValue.split(",").filter((entry) => entry.length > 0),
            });
          } catch (error) {
            console.log(error);
          }
        }
        if (paramKey === "placeSent") {
          store.setSelected({ entity: paramKey, value: paramValue });
        }
        if (paramKey === "placeReceived") {
          store.setSelected({ entity: paramKey, value: paramValue });
        }
      }
    }

    async function initializeActiveComment() {
      const commentReference = document.querySelector(`.g-comment-orig[commentId="${route.params.commentId}"]`);
      const commentHtml = document.querySelector(`#comment-${route.params.commentId}`);
      const comment = {
        id: commentReference.getAttribute("commentId"),
        text: commentHtml.innerHTML,
        offset: 0,
      };

      store.setActiveComment(comment);

      setTimeout(() => {
        const commentRef = document.querySelector(`.g-comment-orig[commentId="${route.params.commentId}"]`);
        const commentEl = document.querySelector(`#comment-${route.params.commentId}`);
        comment.offsetTop = commentRef.offsetTop;
        comment.text = commentEl.innerHTML;
        store.setActiveComment(comment);
      }, 0);
    }

    async function initializeComponent() {
      await Promise.allSettled([
        getItems(),
        getXSLT("LettersMsDesc", "msDesc"),
        store.loadEntities(),
      ]);

      await loadRouteParams();

      if (!hasAbstracts()) {
        tab.value = TAB_TEXTGRUNDLAGE;
      }

      if (!route.params.entityIds && !Object.entries(route.query).length) {
        store.setLettersFiltered([]);
      }

      if (route.params.entityIds) {
        await filterLetterFromMentions();
      } else if (Object.entries(route.query).length) {
        await filterLettersFromQueryParams();
      }

      // metaService.setMetaTitle(titleMain.value + ". " + titleSecondary.value);
      // metaService.setMetaAuthors([editor.value, ...letterService.getResponsibleList(data.value)]);
      // metaService.refreshZotero();

      if (route.params.commentId) {
        await initializeActiveComment();
      }
      setMentionedEntityIdsInOrder();

      loading.value = false;
    }

    // Watchers
    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        initializeComponent();
      }
    });

    watch(availableFacsimiles, (newValue) => {
      if (newValue) {
        selectedFacsimileSlide.value = Object.keys(newValue).sort()[0];
      }
    });

    watch(selectedFacsimileSlide, () => {
      nextTick(() => applyZoomWidth());
    }, { immediate: true });

    watch(facsimileRotation, () => {
      nextTick(() => applyZoomWidth());
    }, { immediate: true });

    watch(isFacsimileCarouselFullscreen, () => {
      nextTick(() => applyZoomWidth());
    }, { immediate: true });

    // Lifecycle
    onMounted(() => {
      initializeComponent();
    });

    return {
      // Refs
      carousel,
      data,
      loading,
      tab,
      msDesc,
      splitterModel,
      copyCitationLabel,
      mentionPagination,
      selectedFacsimileSlide,
      isFacsimileCarouselFullscreen,
      facsimileRotation,
      facsimileZoomWidth,
      // Store refs
      activeComment,
      letters,
      lettersFiltered,
      // Computed
      letterId,
      titleMain,
      titleSecondary,
      splitterLimits,
      splitterSeparatorClass,
      editor,
      responsible,
      citation,
      location,
      mentionedEntities,
      nextLetter,
      previousLetter,
      nextLetterInSelection,
      previousLetterInSelection,
      availableFacsimiles,
      isInLandscapeMode,
      facsimileClasses,
      selectedFacsimileLabel,
      facsimileZoomScale,
      // Methods
      hasAbstracts,
      getAbstractForLanguage,
      getAbstractCount,
      openUrl,
      onSeparatorChange,
      copyCitation: copyCitationHandler,
      openPreviousLetter,
      openNextLetter,
      openPreviousLetterInSelection,
      openNextLetterInSelection,
      getFacsimileSrc,
      toggleFacsimileFullscreen,
      applyRotation,
      applyZoomWidth,
      openPreviousSlide,
      openNextSlide,
      onSlideChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.facsimile-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.facsimile-lg {
  max-width: 350px;

  &.facsimile-landscape {
    max-width: 500px;
  }
}

.facsimile-md {
  max-width: 280px;

  &.facsimile-landscape {
    max-width: 400px;
  }
}

.facsimile-sm {
  max-width: 200px;

  &.facsimile-landscape {
    max-width: 300px;
  }
}

.facsimile-control-offset {
  margin-bottom: 2rem;
}

.facsimile-fullscreen {
  max-width: none;
  max-height: calc(95vh - 5rem);
}

.facsimile-wrapper :deep(.facsimile-img) {
  max-width: 100%;
  height: auto;
}

:deep(.text-panel),
:deep(.comment-panel) {
  position: relative;
}
</style>
