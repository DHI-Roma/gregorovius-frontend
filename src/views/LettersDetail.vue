<template>
  <div>
    <q-page
      v-show="!loading"
      padding
    >
      <div class="row justify-center">
        <div
          v-if="data.teiHeader"
          class="col-md-8 col-12 q-py-xl q-gutter-y-lg"
        >
          <q-card
            class="q-pa-xl"
            flat
          >
            <div
              v-if="editor"
              class="text-caption text-right q-tm-sm text-secondary"
            >
              Hrsg. <span id="editor">{{ editor }}</span>
            </div>
            <div
              v-if="responsible"
              class="text-caption text-right q-tm-sm text-secondary"
            >
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
            <q-tabs
              v-model="tab"
              class="text-primary"
            >
              <q-tab
                id="label-tgl"
                label="Textgrundlage"
                name="tgl"
              />
              <q-tab
                v-if="hasAbstracts()"
                id="label-reg"
                label="Regest"
                name="reg"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="tab"
              animated
            >
              <q-tab-panel
                id="panel-tgl"
                name="tgl"
              >
                <v-runtime-template :template="msDesc" />
              </q-tab-panel>
              <q-tab-panel
                v-if="hasAbstracts()"
                id="panel-reg"
                name="reg"
              >
                <div
                  v-if="getAbstractForLanguage('de')"
                  id="abstract-de"
                >
                  <q-chip
                    outline
                    size="sm"
                    color="primary"
                    dense
                  >
                    DE
                  </q-chip>
                  {{ getAbstractForLanguage('de') }}
                </div>
                <q-separator
                  v-if="getAbstractCount() > 1"
                  spaced
                />
                <div
                  v-if="getAbstractForLanguage('en')"
                  id="abstract-en"
                >
                  <q-chip
                    outline
                    size="sm"
                    color="primary"
                    dense
                  >
                    EN
                  </q-chip>
                  {{ getAbstractForLanguage('en') }}
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>

      <div class="row justify-center">
        <q-card
          class="col-md-8 col-12 q-pa-xl q-mb-xl"
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
          class="col-md-4 col-12 q-pa-md q-mb-xl"
          bordered
          flat
        >
          <q-card-section>
            <div class="text-h6">Faksimiles zu diesem Brief</div>
          </q-card-section>
          <q-card-section>
            <q-carousel
              ref="carousel"
              v-model="selectedFacsimileSlide"
              :fullscreen="isFacsimileCarouselFullscreen"
              control-type="flat"
              control-color="primary"
              animated
              navigation
              arrows
              height="auto"
              transition-prev="slide-right"
              transition-next="slide-left"
            >
              <q-carousel-slide
                v-for="(_imgSrc, imgName) in availableFacsimiles"
                :key="imgName"
                :name="imgName"
              >
                <div class="row justify-center">
                  <q-img
                    v-if="$q.screen.lt.md"
                    :src="getFacsimileSrc(imgName)"
                    :width="isFacsimileCarouselFullscreen ? '75%' : '100%'"
                    contain
                  />
                  <vue-photo-zoom-pro
                    v-else
                    type="circle"
                    :high-url="getFacsimileSrc(imgName)"
                  >
                    <img
                      :src="getFacsimileSrc(imgName)"
                      :class="facsimileClasses"
                      :alt="imgName"
                    />
                  </vue-photo-zoom-pro>
                </div>
              </q-carousel-slide>

              <template
                #control
              >
                <q-carousel-control
                  position="top-right"
                  :offset="[18, 18]"
                  class="text-white rounded-borders"
                >
                  <q-btn
                    round
                    dense
                    color="primary"
                    text-color="white"
                    icon="fullscreen"
                    @click="toggleFacsimileFullscreen"
                  />
                </q-carousel-control>
              </template>
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
          <q-table
            grid
            :data="mentionedEntities"
            row-key="id"
            flat
            :pagination="mentionPagination"
          >
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
        <q-card
          bordered
          class="col-md-8 col-12 q-pa-xl q-mb-xl"
          flat
        >
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
        <q-spinner-oval
          color="primary"
          size="5em"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';
import { mapActions, mapGetters } from 'vuex';
import { basePathLetters } from '../router';
import LettersText from '@/components/LettersText.vue';
import Comment from '@/components/Comment.vue';
import axios from 'axios';
import { dataService } from '@/shared';
import letterService from '@/services/letter-service';
import metaService from '@/services/meta-service';
import { API } from '../../env';
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
} from 'quasar';
import { openInNewTabMixin } from '@/mixins/openInNewTabMixin';
import MentionsTile from '@/components/MentionsTile';
import VuePhotoZoomPro from 'vue-photo-zoom-pro';
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css';

const TAB_TEXTGRUNDLAGE = 'tgl';
const SPLITTER_SIZE_START = 100;

const FG_03_03_SHOULD_DISPLAY_EDITOR = true;

export default {
  name: 'Item',
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
      tab: 'reg',
      mentionTab: 'all',
      msDesc: '',
      supplement: '',
      physDesc: '',
      splitterModel: SPLITTER_SIZE_START,
      copyCitationLabel: 'kopieren',
      mentionPagination: {
        rowsPerPage: 0,
        sortBy: 'name',
      },
      mentionedEntityIdsInOrder: [],
      selectedFacsimileSlide: '1',
      isFacsimileCarouselFullscreen: false,
    };
  },
  computed: {
    ...mapGetters(['activeComment', 'letters', 'lettersFiltered', 'facsimiles']),

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
        return '';
      }
      return 'separator-hidden';
    },
    editor() {
      if (!FG_03_03_SHOULD_DISPLAY_EDITOR) {
        return '';
      }

      return letterService.getEditor(this.data);
    },
    responsible() {
      if (!FG_03_03_SHOULD_DISPLAY_EDITOR) {
        return '';
      }

      return letterService.getResponsible(this.data);
    },

    citation() {
      return letterService.getCitationRecommendation(this.data);
    },

    location() {
      return window.location;
    },

    letterEntity() {
      return this.letters.find((letter) => letter.id === this.letterId);
    },

    mentionedPersonEntities() {
      if (!this.persons.length) {
        return [];
      }

      const personsEntityIds = this.letterEntity.properties.mentioned.persons
        .flat()
        .join(' ')
        .split(' ');

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
      const placeEntityIds = this.letterEntity.properties.mentioned.places
        .flat()
        .join(' ')
        .split(' ');

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

      return this.works.filter((work) => {
        const workEntityIds = this.letterEntity.properties.mentioned.works
          .flat()
          .join(' ')
          .split(' ');
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

    ...mapGetters(['activeComment', 'letters', 'persons', 'places', 'works']),
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
    facsimileClasses() {
      if (this.isFacsimileCarouselFullscreen) {
        return ['facsimile-fullscreen'];
      }
      if (this.$q.screen.gt.lg) {
        return ['facsimile-lg'];
      }

      if (this.$q.screen.gt.md) {
        return ['facsimile-md'];
      }
      return ['facsimile-sm'];
    },
  },

  watch: {
    '$route.params.id': {
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
  },

  mounted() {
    this.initializeComponent();
  },

  methods: {
    ...mapActions(['loadEntitiesAction', 'setSelectedEntityIds', 'setLettersFiltered']),
    async initializeComponent() {
      await this.getItems();
      await this.getXSLT('LettersMsDesc', 'msDesc');
      await this.loadEntitiesAction();
      this.loading = false;

      if (!this.hasAbstracts()) {
        this.tab = TAB_TEXTGRUNDLAGE;
      }

      metaService.setMetaTitle(this.titleMain + '. ' + this.titleSecondary);
      metaService.setMetaAuthors([this.editor, ...letterService.getResponsibleList(this.data)]);
      metaService.refreshZotero();

      if (this.$route.params.commentId) {
        await this.initializeActiveComment();
      }
      this.setMentionedEntityIdsInOrder();
      if (this.$route.params.entityIds) {
        const entityIds = this.$route.params.entityIds.split(',');
        const filteredLetters = this.letters.filter((letter) => {
          let hasMatch = false;
          entityIds.forEach((entityId) => {
            const mentionedPersonEntityIds = letterService.flattenMentions(
              letter.properties.mentioned.persons
            );
            if (mentionedPersonEntityIds.includes(entityId)) {
              hasMatch = true;
              return;
            }

            const mentionedPlaceEntityIds = letterService.flattenMentions(
              letter.properties.mentioned.places
            );
            if (mentionedPlaceEntityIds.includes(entityId)) {
              hasMatch = true;
              return;
            }

            const mentionedWorkEntityIds = letterService.flattenMentions(
              letter.properties.mentioned.works
            );
            if (mentionedWorkEntityIds.includes(entityId)) {
              hasMatch = true;
            }
          });

          return hasMatch;
        });

        await this.setLettersFiltered(filteredLetters);
      }
    },
    async initializeActiveComment() {
      const commentReference = document.querySelector(
        `.g-comment-orig[commentId="${this.$route.params.commentId}"]`
      );
      const commentHtml = document.querySelector(`#comment-${this.$route.params.commentId}`);
      const comment = {
        id: commentReference.getAttribute('commentId'),
        text: commentHtml.innerHTML,
        offset: 0,
      };

      await this.$store.dispatch('setActiveComment', comment);

      setTimeout(() => {
        const commentReference = document.querySelector(
          `.g-comment-orig[commentId="${this.$route.params.commentId}"]`
        );
        const commentHtml = document.querySelector(`#comment-${this.$route.params.commentId}`);
        comment.offsetTop = commentReference.offsetTop;
        comment.text = commentHtml.innerHTML;

        this.$store.dispatch('setActiveComment', comment);
      }, 0);
    },

    getAbstractCount() {
      const abstractsWithText = this.data.teiHeader.profileDesc.abstract.p.filter((abstract) => {
        return abstract.hasOwnProperty('#text');
      });

      return abstractsWithText.length;
    },
    hasAbstracts() {
      return this.getAbstractCount() > 0;
    },
    getAbstractForLanguage(language) {
      try {
        const abstractObject = this.data.teiHeader.profileDesc.abstract.p.filter((abstract) => {
          return abstract['@xml:lang'] === language;
        })[0];
        return abstractObject['#text'];
      } catch {
        return '';
      }
    },
    async getItems() {
      try {
        const response = await axios.get(`${API}${basePathLetters}/${this.letterId}`, {
          headers: { Accept: 'application/json' },
        });
        this.data = response.data;
        if (response.status === 404) {
          this.$router.push({ path: '/404' });
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
      this.$store.dispatch('setActiveComment', commentUpdate);
    },
    copyCitation() {
      const citation = this.citation + this.location;
      copyToClipboard(citation)
        .then(() => {
          this.copyCitationLabel = 'kopiert';
          setTimeout(() => {
            this.copyCitationLabel = 'kopieren';
          }, 3000);
        })
        .catch(() => console.log('Something went wrong while copying to clipboard.'));
    },
    getWorkType(type) {
      switch (type) {
        case 'gregoroviusMain':
          return 'Werkregister Gregorovius';
        case 'gregoroviusTranslation':
          return 'Übersetzungen';
        case 'othersMain':
          return 'Werke anderer Autoren';
        case 'secondary':
          return 'Sekundärliteratur';
        default:
          return 'Unbekannt';
      }
    },
    async openPreviousLetter() {
      await this.$store.dispatch('unselectComment');
      await this.$router.push({
        name: 'Brief',
        params: {
          id: this.previousLetter.id,
        },
      });
    },
    async openNextLetter() {
      await this.$store.dispatch('unselectComment');
      await this.$router.push({
        name: 'Brief',
        params: {
          id: this.nextLetter.id,
        },
      });
    },
    async openPreviousLetterInSelection() {
      await this.$store.dispatch('unselectComment');
      await this.$router.push({
        name: 'Brief',
        params: {
          id: this.previousLetterInSelection.id,
        },
      });
    },
    async openNextLetterInSelection() {
      await this.$store.dispatch('unselectComment');
      await this.$router.push({
        name: 'Brief',
        params: {
          id: this.nextLetterInSelection.id,
        },
      });
    },
    setMentionedEntityIdsInOrder() {
      setTimeout(() => {
        const entityIds = [];
        const entityIdsFromDomNodes = document
          .querySelector('.g-edition-text')
          .querySelectorAll('.g-entity-link[entity-id]');

        entityIdsFromDomNodes.forEach((node) => {
          const ids = node.getAttribute('entity-id').split(' ');
          entityIds.push(...ids);
        });

        this.mentionedEntityIdsInOrder = entityIds;
      });
    },

    getFacsimileSrc(imgName) {
      return `${API}/facsimiles/${this.letterId}/${imgName}`;
    },
    toggleFacsimileFullscreen() {
      this.isFacsimileCarouselFullscreen = !this.isFacsimileCarouselFullscreen;
    },
  },
};
</script>

<style lang="stylus" scoped>
.facsimile-lg
  max-width: 475px
  max-height: 700px

.facsimile-md
  max-width: 350px
  max-height: 600px

.facsimile-sm
  max-width: 225px
  max-height: 500px

.facsimile-fullscreen
  max-width: auto
  max-height: 95vh
</style>
