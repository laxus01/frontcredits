<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="Usuario"
                    type="text"
                    v-model="postLogin.login"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="postLogin.password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      postLogin: {
        login: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      await axios
        .post("http://localhost:8084/users", this.postLogin)
        .then(async (result) => {
          if (result) {
            const authToken = result.data.res.token
            window.localStorage.setItem('authToken', authToken)
            debugger
            this.$router.push('/dashboard')
          }
        });
    },
  },

  props: {
    source: String,
  },
};
</script>

<style></style>
