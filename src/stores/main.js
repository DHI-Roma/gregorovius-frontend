import { defineStore } from 'pinia';
import { dataService } from 'src/shared';
import { sortLetterByDate } from 'src/services/sort-service';

export const useMainStore = defineStore('main', {
  state: () => ({
    isLoading: false,
    loadingStatus: {
      letters: false,
      persons: false,
      places: false,
      works: false,
      fullNameIndex: false,
      fullLettersIndex: false,
    },
    letters: [],
    lettersFiltered: [],
    fullLettersIndex: null,
    persons: [],
    places: [],
    works: [],
    facsimiles: {},
    fullNameIndex: [],
    selectedRecipients: [],
    selectedPlaceReceived: { label: '', value: '' },
    selectedPlaceSent: { label: '', value: '' },
    selectedYears: [],
    activeComment: {
      id: '',
      text: '',
    },
  }),

  getters: {
    sortedLetters: (state) => [...state.letters].sort(sortLetterByDate),
    sortedLettersFiltered: (state) => [...state.lettersFiltered].sort(sortLetterByDate),
    yearsInLetters: (state) => {
      const years = state.letters.map((e) => {
        if (e.properties.date !== null) {
          return e.properties.date.slice(0, 4);
        }
        return undefined;
      });
      return [...new Set(years)].filter((year) => year !== undefined).sort();
    },
    loading: (state) =>
      state.isLoading ||
      state.loadingStatus.letters ||
      state.loadingStatus.persons ||
      state.loadingStatus.places ||
      state.loadingStatus.works ||
      state.loadingStatus.fullNameIndex ||
      state.loadingStatus.fullLettersIndex,
  },

  actions: {
    setLoadingStatus(loading) {
      this.isLoading = loading;
    },

    setNamedLoadingStatus(entity, loading) {
      this.loadingStatus[entity] = loading;
    },

    async loadFacsimiles() {
      this.isLoading = true;
      this.loadingStatus.facsimiles = true;
      const facsimiles = await dataService.getFacsimiles();
      this.facsimiles = facsimiles;
      this.isLoading = false;
      this.loadingStatus.facsimiles = false;
    },

    async loadLetters() {
      if (this.letters.length === 0 && !this.loadingStatus.letters) {
        this.isLoading = true;
        this.loadingStatus.letters = true;
        const letters = await dataService.getLetters();
        this.letters = letters;
        this.isLoading = false;
        this.loadingStatus.letters = false;
      }
    },

    async loadPersons() {
      if (this.persons.length === 0 && !this.loadingStatus.persons) {
        this.isLoading = true;
        this.loadingStatus.persons = true;
        const persons = await dataService.getEntities('persons');
        this.persons = persons;
        this.isLoading = false;
        this.loadingStatus.persons = false;
      }
    },

    async loadPlaces() {
      if (this.places.length === 0 && !this.loadingStatus.places) {
        this.isLoading = true;
        this.loadingStatus.places = true;
        const places = await dataService.getEntities('places');
        this.places = places;
        this.isLoading = false;
        this.loadingStatus.places = false;
      }
    },

    async loadWorks() {
      if (this.works.length === 0 && !this.loadingStatus.works) {
        this.isLoading = true;
        this.loadingStatus.works = true;
        const works = await dataService.getEntities('works');
        this.works = works;
        this.isLoading = false;
        this.loadingStatus.works = false;
      }
    },

    async loadFullNameIndex() {
      await Promise.all([this.loadPersons(), this.loadPlaces()]);
      if (Object.entries(this.fullNameIndex).length === 0) {
        this.isLoading = true;
        const fullNameIndex = {};
        const entities = [...this.persons, ...this.places];
        entities.forEach((entity) => {
          const targetEntity = entities.find((item) => item.id === entity.id);
          fullNameIndex[entity.id] =
            targetEntity.properties.name.toponym ||
            targetEntity.properties.name.fullName ||
            'NN';
        });
        this.fullNameIndex = fullNameIndex;
        this.isLoading = false;
      }
    },

    async loadEntities() {
      const dispatchers = [];
      if (this.letters.length === 0) {
        dispatchers.push(this.loadLetters());
      }

      if (this.persons.length === 0) {
        dispatchers.push(this.loadPersons());
      }

      if (this.places.length === 0) {
        dispatchers.push(this.loadPlaces());
      }

      if (this.works.length === 0) {
        dispatchers.push(this.loadWorks());
      }

      if (Object.keys(this.facsimiles).length === 0) {
        dispatchers.push(this.loadFacsimiles());
      }

      if (!this.fullLettersIndex) {
        dispatchers.push(this.loadFullLettersIndex());
      }

      await Promise.allSettled(dispatchers);
    },

    async loadFullLettersIndex() {
      if (this.fullLettersIndex) {
        return;
      }

      this.isLoading = true;
      this.loadingStatus.fullLettersIndex = true;
      const index = await dataService.getFullLettersIndex();
      this.fullLettersIndex = index;
      this.loadingStatus.fullLettersIndex = false;
      this.isLoading = false;
    },

    setSelected(payload) {
      const newModel = {
        label: this.fullNameIndex[payload.value],
        value: payload.value,
      };
      switch (payload.entity) {
        case 'recipient':
          this.selectedRecipients = payload.value;
          break;
        case 'placeReceived':
          this.selectedPlaceReceived = newModel;
          break;
        case 'placeSent':
          this.selectedPlaceSent = newModel;
          break;
        case 'years':
        case 'selectedYears':
          this.selectedYears = payload.value;
          break;
        default:
          break;
      }
    },

    setActiveComment(comment) {
      this.activeComment = comment;
    },

    unselectComment() {
      this.activeComment = {
        id: '',
        text: '',
      };
    },

    setLettersFiltered(letters) {
      this.lettersFiltered = letters;
    },
  },
});
