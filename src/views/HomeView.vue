<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar color="blue darken-3" dark fixed>
                <v-toolbar-title>Usuario Registrado</v-toolbar-title>
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
              <div class="footer">
                <div class="footer__left">
                  <v-alert v-if="error" dense outlined type="error">
                    Error de usuario o Contraseña
                  </v-alert>
                </div>
                <div class="footer__right">
                  <v-btn
                    large
                    elevation="5"
                    color="blue darken-3"
                    dark
                    @click="login()"
                    >Iniciar Sesión</v-btn
                  >
                </div>
              </div>
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
      error: false,
      postLogin: {
        login: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      await axios
        .post("users", this.postLogin)
        .then(async (result) => {
          if (result) {
            const authToken = result.data.res.token;
            const name = result.data.res.name;
            window.localStorage.setItem("authToken", authToken);
            window.localStorage.setItem("nameUser", name);
            this.$router.push("/dashboard");
          }
        })
        .catch((err) => {
          this.error = true;
          console.log(err);
        });
    },
  },

  props: {
    source: String,
  },
};
</script>

<style lang="scss">
.footer {
  padding: 10px;
  display: flex;
  width: 100%;

  &__left {
    display: flex;
    width: 50%;
  }

  &__right {
    display: flex;
    justify-content: end;
    width: 50%;
  }
}
</style>
