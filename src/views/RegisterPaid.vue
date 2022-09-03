<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Registrar Pagos</v-banner
      >
    <SavePaid class="top"/>
    </v-card>
  </v-container>
</template>

<script>
import SavePaid from "../components/SavePaid.vue";

export default {
    name: 'CreatePayment',
  data() {
      return {}
  },
  components: {
    SavePaid,
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