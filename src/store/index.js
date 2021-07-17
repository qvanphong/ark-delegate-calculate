import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    async getTopDelegate() {
      const response = await axios.get(
        "https://arkdelegates.live/api/delegates?limit=51"
      );
      return response.data.data;
    },
  },
  modules: {},
});
