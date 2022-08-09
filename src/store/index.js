import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  
  state: {
    desserts: [],
  },
  getters: {},
  mutations: {
    getPayments(state, payload) {
      state.desserts = payload;
    },
    setPayment(state, payload) {
      state.desserts.push(payload);
    },
    deletePayment(state, payload) {
      state.desserts = state.desserts.filter((item) => item.id !== payload);
    },
    updatePayment(state, payload) {
      state.desserts = state.desserts.map((item) =>
        item.id === payload.id ? payload : item
      );
    },
  },

  actions: {
    //Payments
    async getPayments({ commit }) {
      try {
        const res = await fetch("http://localhost:8084/api/payments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataDB = await res.json();
        const arrayPayments = [];
        for (let id in dataDB.desserts) {
          arrayPayments.push(dataDB.desserts[id]);
        }
        commit("getPayments", arrayPayments);
      } catch (error) {
        console.log(error);
      }
    },
    async setPayment({ commit }, payment) {
      try {
        await fetch("http://localhost:8084/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payment),
        });
        commit("setPayment", payment);
      } catch (error) {
        console.log(error);
      }
    },
    async deletePayment({ commit }, payment) {
      try {
        await fetch(`http://localhost:8084/api/payments/${payment.id}`, {
          method: "DELETE",
        });
        commit("deletePayment", payment.id);
      } catch (error) {
        console.log(error);
      }
    },
    async updatePayment({ commit }, payment) {
      try {
        await fetch(`http://localhost:8084/api/payments/${payment.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payment),
        });
        commit("updatePayment", payment);
      } catch (error) {
        console.log(error);
      }
    },
  },

  modules: {},
});
