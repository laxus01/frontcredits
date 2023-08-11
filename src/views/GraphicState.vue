<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Creditos vencidos </v-banner
      >
    <DetailGraphicState class="top"/>
    </v-card>
  </v-container>
</template>

<script>
import DetailGraphicState from "../components/DetailGraphicState.vue";

export default {
    name: 'EditPaids',
  data() {
      return {}
  },
  components: {
    DetailGraphicState,
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