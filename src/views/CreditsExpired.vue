<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Creditos Vencidos </v-banner
      >
    <ListCreditsExpired />
    </v-card>
  </v-container>
</template>

<script>
import ListCreditsExpired from "../components/ListCreditsExpired.vue";

export default {
    name: 'EditPaids',
  data() {
      return {}
  },
  components: {
    ListCreditsExpired,
  },
  props: {

  }
};
</script>

<style>
</style>