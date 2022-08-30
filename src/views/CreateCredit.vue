<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Listado De Creditos </v-banner
      >
    <ListCredits :payment_id="$route.params.id" class="top"/>
    </v-card>
  </v-container>
</template>

<script>
import ListCredits from "../components/ListCredits.vue";

export default {
    name: 'CreatePayment',
  data() {
      return {}
  },
  components: {
    ListCredits,
  },
  props: {

  }
};
</script>

<style>
.top {
  margin-top: 20px;
}
</style>