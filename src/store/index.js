import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUserId: null
  },
  mutations: {
    SET_CURENT_USER_ID: (state, data) => (state.currentUserId = data)
  },
  actions: {},
  modules: {},
});
