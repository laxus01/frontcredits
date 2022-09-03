<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Balance Diario</v-banner
      >
    <DetailDailyBalance class="top"/>
    </v-card>
  </v-container>
</template>

<script>
import DetailDailyBalance from "../components/DetailDailyBalance.vue";

export default {
    name: 'DailyBalance',
  data() {
      return {}
  },
  components: {
    DetailDailyBalance,
  },
};
</script>

<style>
.top {
  margin-top: 20px;
}
</style>