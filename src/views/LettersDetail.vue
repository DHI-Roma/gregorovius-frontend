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
              <q-tooltip
                >Vorheriger Brief (chronologisch): {{ previousLetter.properties.title }}</q-tooltip
              >
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
              <q-tooltip
                >Vorheriger Brief (in Auswahl):
                {{ previousLetterInSelection.properties.title }}</q-tooltip
              >
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
              <q-tooltip
                >Nächster Brief (in Auswahl):
                {{ nextLetterInSelection.properties.title }}</q-tooltip
              >
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
              <q-tooltip
                >Nächster Brief (chronologisch): {{ nextLetter.properties.title }}</q-tooltip
              >
            </q-btn>
          </div>
        </q-card>
      </div>
      <div class="row justify-center">
        <q-card class="col-md-8 col-12 q-pa-xl q-mb-xl" bordered flat>
          <q-tabs v-model="mentionTab" class="text-primary">
            <q-tab v-if="mentionedPersonEntities.length" name="persons" label="Erwähnte Personen" />
            <q-tab v-if="mentionedPlaceEntites.length" name="places" label="Erwähnte Orte" />
            <q-tab v-if="mentionedWorkEntities.length" name="works" label="Erwähnte Werke" />
          </q-tabs>
          <q-separator dark />
          <q-tab-panels v-model="mentionTab" animated>
            <q-tab-panel v-if="mentionedPersonEntities.length" name="persons">
              <q-table
                grid
                :data="mentionedPersonEntities"
                row-key="id"
                flat
                :pagination="mentionPagination"
              >
                <template v-slot:item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
                    <q-card>
                      <q-separator />
                      <q-list class="g-card-list mention">
                        <PersonTile :person="props.row"></PersonTile>
                      </q-list>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </q-tab-panel>
            <q-tab-panel v-if="mentionedPlaceEntites.length" name="places">
              <q-table
                grid
                :data="mentionedPlaceEntites"
                row-key="id"
                flat
                :pagination="mentionPagination"
              >
                <template v-slot:item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
                    <q-card>
                      <q-separator />
                      <q-list class="g-card-list mention">
                        <PlaceTile :place="props.row"></PlaceTile>
                      </q-list>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel v-if="mentionedWorkEntities.length" name="works">
              <q-table
                :data="mentionedWorkEntities"
                :columns="mentionedWorksTableColumns"
                row-key="id"
                flat
                :pagination="mentionPagination"
              >
                <template v-slot:body-cell="props">
                  <q-td
                    :props="props"
                    class="cursor-pointer"
                    @click.native="$router.push({ path: `/works/${props.row.id}` })"
                    >{{ props.value }}</q-td
                  >
                  <context-menu
                    :route-to-open="$router.resolve({ path: `/works/${props.row.id}` }).href"
                  ></context-menu>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
      <div class="row justify-center">
        <q-card class="col-md-8 col-12 q-pa-xl q-mb-xl" bordered flat>
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
            >
            </q-btn>
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
import PersonTile from "@/components/PersonTile.vue";
import PlaceTile from "@/components/PlaceTile.vue";
import axios from "axios";
import { dataService } from "@/shared";
import letterService from "@/services/letter-service";
import metaService from "@/services/meta-service";
import { API } from "../../env";
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
import ContextMenu from "../components/ContextMenu.vue";
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";

const TAB_TEXTGRUNDLAGE = "tgl";
const SPLITTER_SIZE_START = 100;

const FG_03_03_SHOULD_DISPLAY_EDITOR = true;

export default {
  name: "Item",
  components: {
    Comment,
    LettersText,
    PersonTile,
    PlaceTile,
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
    ContextMenu
  },
  mixins: [openInNewTabMixin],
  data() {
    return {
      data: [],
      loading: true,
      tab: "reg",
      mentionTab: "persons",
      msDesc: "",
      supplement: "",
      physDesc: "",
      splitterModel: SPLITTER_SIZE_START,
      copyCitationLabel: "kopieren",
      mentionPagination: {
        rowsPerPage: 16,
        sortBy: "name"
      },
      mentionedWorksTableColumns: [
        {
          name: "type",
          required: true,
          label: "Typ",
          align: "left",
          field: row => this.getWorkType(row.properties.type),
          sortable: true
        },
        {
          name: "title",
          required: true,
          label: "Titel",
          align: "left",
          field: row => row.properties.title,
          sortable: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["activeComment", "letters", "lettersFiltered"]),

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

    letterEntity() {
      return this.letters.find(letter => letter.id === this.letterId);
    },

    mentionedPersonEntities() {
      if (!this.persons.length) {
        return [];
      }

      return this.persons
        .filter(person => {
          const matches = this.letterEntity.properties.mentioned.persons.find(
            mentionedPersonId => mentionedPersonId === person.id
          );
          return matches ? true : false;
        })
        .sort((personA, personB) => {
          personA.properties.name.fullName > personB.properties.name.fullName;
        });
    },

    mentionedPlaceEntites() {
      if (!this.places.length) {
        return [];
      }

      return this.places
        .filter(place => {
          const matches = this.letterEntity.properties.mentioned.places.find(
            mentionedPlaceId => mentionedPlaceId === place.id
          );
          return matches ? true : false;
        })
        .sort((placeA, placeB) => placeA.properties.name.toponym > placeB.properties.name.toponym);
    },

    mentionedWorkEntities() {
      if (!this.works.length) {
        return [];
      }

      return this.works.filter(work => {
        const matches = this.letterEntity.properties.mentioned.works.find(
          mentionedWorkId => mentionedWorkId === work.id
        );
        return matches ? true : false;
      });
    },

    ...mapGetters(["activeComment", "letters", "persons", "places", "works"]),
    currentLetterIndex() {
      return this.letters.findIndex(letter => letter.id === this.letterId);
    },

    currentLetterIndexInSelection() {
      return this.lettersFiltered.findIndex(letter => letter.id === this.letterId);
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
    }
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
    ...mapActions(["loadEntitiesAction", "setSelectedEntityIds", "setLettersFiltered"]),
    async initializeComponent() {
      await this.getItems();
      await this.getXSLT("LettersMsDesc", "msDesc");
      await this.loadEntitiesAction();
      this.loading = false;

      if (!this.hasAbstracts()) {
        this.tab = TAB_TEXTGRUNDLAGE;
      }

      metaService.setMetaTitle(this.titleMain + ". " + this.titleSecondary);
      metaService.setMetaAuthors([this.editor, ...letterService.getResponsibleList(this.data)]);
      metaService.refreshZotero();

      if (this.$route.params.commentId) {
        await this.initializeActiveComment();
      }

      if (this.$route.params.entityIds) {
        const entityIds = this.$route.params.entityIds.split(",");
        const filteredLetters = this.letters.filter(letter => {
          let hasMatch = false;
          entityIds.forEach(entityId => {
            if (letter.properties.mentioned.persons.includes(entityId)) {
              hasMatch = true;
              return;
            }

            if (letter.properties.mentioned.places.includes(entityId)) {
              hasMatch = true;
              return;
            }

            if (letter.properties.mentioned.works.includes(entityId)) {
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
      const comment = {
        id: commentReference.getAttribute("commentId"),
        text: commentReference.getAttribute("commentText"),
        offset: 0
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
      this.$router.push({
        name: "Brief",
        params: {
          id: this.previousLetter.id
        }
      });
    },
    async openNextLetter() {
      this.$router.push({
        name: "Brief",
        params: {
          id: this.nextLetter.id
        }
      });
    },
    async openPreviousLetterInSelection() {
      this.$router.push({
        name: "Brief",
        params: {
          id: this.previousLetterInSelection.id
        }
      });
    },
    async openNextLetterInSelection() {
      this.$router.push({
        name: "Brief",
        params: {
          id: this.nextLetterInSelection.id
        }
      });
    }
  }
};
</script>

<style>
.g-card:hover {
  background: #f7f7f7;
}

.g-card-list.mention {
  height: 7.5em;
}
</style>
