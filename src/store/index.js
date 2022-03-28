import Vue from 'vue';
import Vuex from 'vuex';
import oryxDb, { getCategories, getModels, updated } from '../data/oryxDb';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    db: oryxDb,
    filters: [],
    categories: getCategories(),
    statuses: ['destroyed', 'damaged', 'captured', 'abandoned'],
    models: getModels(),
    entries: [...oryxDb],
    countMethod: 'daily',
    smaPeriod: 3,
    dateRange: ['2022-02-24', (new Date(updated)).toISOString().substr(0, 10)],
  },
  mutations: {
    addCategory(state, toAdd) {
      if (!state.categories.includes(toAdd)) {
        state.categories.push(toAdd);
        state.models.push(...getModels(null, toAdd));
      }
    },
    removeCategory(state, toRemove) {
      if (state.categories.find((category) => category === toRemove)) {
        state.categories = state.categories.filter((category) => category !== toRemove);
        state.models = [];
        state.categories.forEach((category) => {
          state.models.push(...getModels(null, category));
        });
      }
    },
    clearCategory(state) {
      state.categories = [];
    },
    addModel(state, toAdd) {
      if (!state.models.includes(toAdd)) state.models.push(toAdd);
    },
    removeModel(state, toRemove) {
      state.models = state.models.filter((model) => model !== toRemove);
    },
    addStatus(state, toAdd) {
      if (!state.statuses.includes(toAdd)) state.statuses.push(toAdd);
    },
    removeStatus(state, toRemove) {
      state.statuses = state.statuses.filter((status) => status !== toRemove);
    },
    updateEntries(state) {
      const entries = [];
      const { categories, models, statuses } = state;
      oryxDb.forEach((entry) => {
        if (
          categories.includes(entry.category)
          && models.includes(entry.model)
          && statuses.includes(entry.status)
        ) entries.push(entry);
      });
      state.entries = entries;
    },
    addFilter(state, toAdd) {
      if (!state.filters.some(({ id }) => toAdd.id === id)) {
        state.filters.push(toAdd);
      }
    },
    removeSelection(state, removeId) {
      state.filters = state.filters.filter(({ id }) => id !== removeId);
    },
    setCountMethod(state, val) {
      state.countMethod = val;
    },
    setSmaPeriod(state, val) {
      state.smaPeriod = val;
    },
    setDateRange(state, val) {
      state.dateRange = val;
    },
  },
  actions: {
  },
  modules: {
  },
});
