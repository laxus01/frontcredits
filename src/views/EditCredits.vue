<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Listado De Creditos </v-banner
      >
    <ListCreditsByDay />
    </v-card>
  </v-container>
</template>

<script>
import ListCreditsByDay from "../components/ListCreditsByDay.vue";

export default {
    name: 'EditPaids',
  data() {
      return {}
  },
  components: {
    ListCreditsByDay,
  },
  props: {

  }
};
</script>

<style>
</style>