<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Mis Cobros</v-banner
      >
    <ListPayment />
    </v-card>
  </v-container>
</template>

<script>
import ListPayment from "../components/ListPayment.vue";

export default {
    name: 'CreatePayment',
  data() {
      return {}
  },
  components: {
    ListPayment,
  },
};
</script>

<style>
</style>
