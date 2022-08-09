<!-- <template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
    >
      <v-spacer></v-spacer>
      <v-layout :class="$style.container" align-center column>
        <v-flex>
          <v-avatar>
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-avatar>
        </v-flex>
        <v-flex>
          <p class="primary--text mt-3 headline">JOSE TUÑON</p>
        </v-flex>
      </v-layout>
      <Menu />
    </v-navigation-drawer>
    <v-app-bar clipped-left color="blue darken-3" dark fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema De Creditos</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-main>
  </v-app>
</template>-->

<template>
  <v-app id="inspire">
    <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import Menu from "./components/Menu.vue";

export default {
  name: "App",
  data() {
    return {
      drawer: null,
      token: ""
    };
  },
  components: {
    Menu,
  },
  methods: {
    ...mapActions(["getPayments"]),
    /* getToken() {
      this.token = window.localStorage.getItem('authToken')
    }   */
  },
  created() {
    this.getPayments()
    //this.getToken()
  },
};
</script>

<style module>
.container {
  margin-top: 80px;
}
</style>
