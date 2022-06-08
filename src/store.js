import Vue from "vue";
import Vuex from "vuex";
import { dataService } from "./shared";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    loadingStatus: {
      letters: false,
      persons: false,
      places: false,
      works: false,
      fullNameIndex: false
    },
    letters: [],
    lettersFiltered: [],
    persons: [],
    places: [],
    works: [],
    fullNameIndex: [],
    selectedRecipients: [],
    selectedPlaceReceived: { label: "", value: "" },
    selectedPlaceSent: { label: "", value: "" },
    selectedYears: [],
    activeComment: {
      id: "",
      text: ""
    }
  },
  mutations: {
    SET_LOADING_STATUS(state, loading) {
      state.isLoading = loading;
    },
    SET_NAMED_LOADING_STATUS(state, { entity, loading }) {
      state.loadingStatus[entity] = loading
    },
    GET_LETTERS(state, letters) {
      state.letters = letters;
    },
    SET_LETTERS_FILTERED(state, letters) {
      state.lettersFiltered = letters;
    },
    GET_PERSONS(state, persons) {
      state.persons = persons;
    },
    GET_PLACES(state, places) {
      state.places = places;
    },
    GET_WORKS(state, works) {
      state.works = works;
    },
    GET_FULLNAME_INDEX(state, fullNameIndex) {
      state.fullNameIndex = fullNameIndex;
    },
    SET_SELECTED(state, payload) {
      const newModel = { label: state.fullNameIndex[payload.value], value: payload.value };
      switch (payload.entity) {
        case "recipient":
          state.selectedRecipients = payload.value;
          break;
        case "placeReceived":
          state.selectedPlaceReceived = newModel;
          break;
        case "placeSent":
          state.selectedPlaceSent = newModel;
          break;
        case "years":
          state.selectedYears = payload.value;
          break;
        default:
          break;
      }
    },
    SET_ACTIVE_COMMENT(state, comment) {
      state.activeComment = comment;
    }
  },
  actions: {
    async loadLettersAction({ commit }) {
      if (this.getters.letters.length === 0 && !this.getters.loadingStatusLetters) {
        commit("SET_LOADING_STATUS", true);
        commit("SET_NAMED_LOADING_STATUS", { entity: "letters", loading: true })
        const letters = await dataService.getLetters();
        commit("GET_LETTERS", letters);
        commit("SET_LOADING_STATUS", false);
        commit("SET_NAMED_LOADING_STATUS", { entity: "letters", loading: false })
      }
    },
    async loadPersonsAction({ commit }) {
      if (this.getters.persons.length === 0 && !this.getters.loadingStatusPersons) {
        commit("SET_LOADING_STATUS", true);
        commit("SET_NAMED_LOADING_STATUS", { entity: "persons", loading: true })
        const persons = await dataService.getEntities("persons");
        commit("GET_PERSONS", persons);
        commit("SET_LOADING_STATUS", false);
        commit("SET_NAMED_LOADING_STATUS", { entity: "persons", loading: false })
      }
    },
    async loadPlacesAction({ commit }) {
      if (this.getters.places.length === 0 && !this.getters.loadingStatusPlaces) {
        commit("SET_LOADING_STATUS", true);
        commit("SET_NAMED_LOADING_STATUS", { entity: "places", loading: true })
        const places = await dataService.getEntities("places");
        commit("GET_PLACES", places);
        commit("SET_LOADING_STATUS", false);
        commit("SET_NAMED_LOADING_STATUS", { entity: "places", loading: false })
      }
    },
    async loadWorksAction({ commit }) {
      if (this.getters.works.length === 0 && !this.loadingStatusWorks) {
        commit("SET_LOADING_STATUS", true);
        commit("SET_NAMED_LOADING_STATUS", { entity: "works", loading: true })
        const works = await dataService.getEntities("works");
        commit("GET_WORKS", works);
        commit("SET_LOADING_STATUS", false);
        commit("SET_NAMED_LOADING_STATUS", { entity: "works", loading: false })
      }
    },
    async loadFullNameIndexAction({ commit }) {
      await Promise.all([
        this.dispatch("loadPersonsAction"),
        this.dispatch("loadPlacesAction")
      ]);
      if (this.getters.fullNameIndex.length === 0) {
        commit("SET_LOADING_STATUS", true);
        let fullNameIndex = {};
        const entities = [...this.getters.persons, ...this.getters.places];
        entities.map(async entity => {
          const targetEntity = entities.find(item => item.id === entity.id);
          fullNameIndex[entity.id] =
            targetEntity.properties.name.toponym || targetEntity.properties.name.fullName || "NN";
        });
        commit("GET_FULLNAME_INDEX", fullNameIndex);
        commit("SET_LOADING_STATUS", false);
      }
    },

    async loadEntitiesAction() {
      const dispatchers = [];
      if (this.getters.letters.length === 0) {
        dispatchers.push(this.dispatch("loadLettersAction"));
      }

      if (this.getters.persons.length === 0) {
        dispatchers.push(this.dispatch("loadPersonsAction"));
      }

      if (this.getters.places.length === 0) {
        dispatchers.push(this.dispatch("loadPlacesAction"));
      }

      if (this.getters.works.length === 0) {
        dispatchers.push(this.dispatch("loadWorksAction"));
      }

      await Promise.all(dispatchers);
    },

    async setSelectedAction({ commit }, payload) {
      commit("SET_SELECTED", payload);
    },

    async setLoadingStatus({ commit }, value) {
      commit("SET_LOADING_STATUS", value);
    },

    async setActiveComment({ commit }, comment) {
      commit("SET_ACTIVE_COMMENT", comment);
    },

    async unselectComment({ commit }) {
      commit("SET_ACTIVE_COMMENT", {});
    },

    async setLettersFiltered({ commit }, letters) {
      commit("SET_LETTERS_FILTERED", letters);
    },
  },
  getters: {
    letters: state =>
      state.letters.sort((letterA, letterB) => letterA.properties.date > letterB.properties.date),
    lettersFiltered: state =>
      state.lettersFiltered.sort(
        (letterA, letterB) => letterA.properties.date > letterB.properties.date
      ),
    persons: state => state.persons,
    places: state => state.places,
    works: state => state.works,
    loading: state => state.isLoading ||
      state.loadingStatus.letters ||
      state.loadingStatus.persons ||
      state.loadingStatus.places ||
      state.loadingStatus.works ||
      state.loadingStatus.fullNameIndex,
    fullNameIndex: state => state.fullNameIndex,
    selectedRecipients: state => state.selectedRecipients,
    selectedPlaceReceived: state => state.selectedPlaceReceived,
    selectedPlaceSent: state => state.selectedPlaceSent,
    selectedYears: state => state.selectedYears,
    activeComment: state => state.activeComment,
    loadingStatusLetters: state => state.loadingStatus.letters,
    loadingStatusPersons: state => state.loadingStatus.persons,
    loadingStatusPlaces: state => state.loadingStatus.places,
    loadingStatusWorks: state => state.loadingStatus.works,
  }
});
