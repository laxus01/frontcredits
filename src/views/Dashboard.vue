<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <Header />
    </div>
    <div class="dashboard__content">
      <div class="dashboard__content__left">
        <Menu />
      </div>
      <div class="dashboard__content__right">
        <v-container fluid>
          <v-row>
            <v-col class="pl-6 pr-10">
              <router-view />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu";
import Header from "../components/Header";

export default {
  components: {
    Menu,
    Header,
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  &__header {
    width: 100%;
    height: 70px;
    background-color: #1565c0;
  }

  &__content {
    height: calc(100% - 70px);
    display: flex;

    &__left {
      width: 250px;
      height: 100%;
    }

    &__right {
      width: calc(100% - 250px);
      height: 100%;
      background: #f5f5f5;
    }
  }
}
</style>
