<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Creditos vencidos </v-banner
      >
    <ListCreditsExpired class="top"/>
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
.top {
  margin-top: 20px;
}
</style>