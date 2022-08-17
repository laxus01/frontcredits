<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Listado De Pagos </v-banner
      >
    <ListPaidsByDay />
    </v-card>
  </v-container>
</template>

<script>
import ListPaidsByDay from "../components/ListPaidsByDay.vue";

export default {
    name: 'EditPaids',
  data() {
      return {}
  },
  components: {
    ListPaidsByDay,
  },
  props: {

  }
};
</script>

<style>
</style>