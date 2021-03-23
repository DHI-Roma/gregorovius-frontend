import Vue from "vue";
import Vuex from "vuex";
import { dataService } from "./shared";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    letters: [],
    persons: [],
    places: [],
    works: [],
    fullNameIndex: [],
    selectedRecipient: { label: "", value: "" },
    selectedPlaceReceived: { label: "", value: "" },
    selectedPlaceSent: { label: "", value: "" },
    selectedYears: []
  },
  mutations: {
    SET_LOADING_STATUS(state, loading) {
      state.isLoading = loading;
    },
    GET_LETTERS(state, letters) {
      state.letters = letters;
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
          state.selectedRecipient = newModel;
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
    }
  },
  actions: {
    async loadLettersAction({ commit }) {
      if (this.getters.letters.length === 0) {
        commit("SET_LOADING_STATUS", true);
        const letters = await dataService.getLetters();
        commit("GET_LETTERS", letters);
        commit("SET_LOADING_STATUS", false);
      }
    },
    async loadPersonsAction({ commit }) {
      if (this.getters.persons.length === 0) {
        commit("SET_LOADING_STATUS", true);
        const persons = await dataService.getEntities("persons");
        commit("GET_PERSONS", persons);
        commit("SET_LOADING_STATUS", false);
      }
    },
    async loadPlacesAction({ commit }) {
      if (this.getters.places.length === 0) {
        commit("SET_LOADING_STATUS", true);
        const places = await dataService.getEntities("places");
        commit("GET_PLACES", places);
        commit("SET_LOADING_STATUS", false);
      }
    },
    async loadWorksAction({ commit }) {
      if (this.getters.works.length === 0) {
        commit("SET_LOADING_STATUS", true);
        const works = await dataService.getEntities("works");
        commit("GET_WORKS", works);
        commit("SET_LOADING_STATUS", false);
      }
    },
    async loadFullNameIndexAction({ commit }) {
      await this.dispatch("loadPersonsAction");
      await this.dispatch("loadPlacesAction");
      if (this.getters.fullNameIndex.length === 0) {
        commit("SET_LOADING_STATUS", true);
        const entities = [...this.getters.persons, ...this.getters.places];
        const fullNameIndex = {};
        entities.map(async entity => {
          const targetEntity = entities.find(item => item.id === entity.id);
          fullNameIndex[entity.id] =
            targetEntity.properties.name.toponym || targetEntity.properties.name.fullName || "NN";
        });
        commit("GET_FULLNAME_INDEX", fullNameIndex);
        commit("SET_LOADING_STATUS", false);
      }
    },

    async setSelectedAction({ commit }, payload) {
      commit("SET_SELECTED", payload);
    },

    async setLoadingStatus({ commit }, value) {
      commit("SET_LOADING_STATUS", value);
    }
  },
  getters: {
    letters: state => state.letters,
    persons: state => state.persons,
    places: state => state.places,
    works: state => state.works,
    loading: state => state.isLoading,
    fullNameIndex: state => state.fullNameIndex,
    selectedRecipient: state => state.selectedRecipient,
    selectedPlaceReceived: state => state.selectedPlaceReceived,
    selectedPlaceSent: state => state.selectedPlaceSent,
    selectedYears: state => state.selectedYears
  }
});
