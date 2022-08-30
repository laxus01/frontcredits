<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Estado Actual</v-banner
      >
    <DetailState class="top"/>
    </v-card>
  </v-container>
</template>

<script>
import DetailState from "../components/DetailState.vue";

export default {
    name: 'CreatePayment',
  data() {
      return {}
  },
  components: {
    DetailState,
  },
};
</script>

<style>
.top {
  margin-top: 20px;
}
</style>