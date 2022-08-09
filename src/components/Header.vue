<template>
  <div class="header">
    <div class="header__left">
      <h2 class="header__left__title">¡Bienvenido!, JOSE TUÑON</h2>
    </div>
    <div class="header__right">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <div class="circle" v-on="on">
            <v-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-avatar>
          </div>
        </template>
        <v-list dense>
          <v-list-item-group>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  @click="signOut()"
                  v-text="'Salir'"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    hideDetails: true,
    searchText: null,
    items: [
      {
        key: "logout",
        title: "Logout",
      },
    ],
    userRole: null,
  }),
  methods: {
    signOut() {
      window.localStorage.clear()
      this.$router.push('/')
    }
  },
  watch: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;

  &__left {
    width: 50%;
    margin-left: 10px;
    display: flex;
    align-items: center;

    &__title {
      color: #ffffff;
      font-size: 20px;
      font-weight: 300;
      letter-spacing: 0.3px;
    }
  }

  &__right {
    display: flex;
    margin-right: 10px;
    justify-content: end;
    align-items: center;
    width: 50%;
  }

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 50px;
    background-color: #ffffff;
  }
}
</style>
