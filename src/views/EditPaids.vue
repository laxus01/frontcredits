<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Listado de pagos </v-banner
      >
    <ListPaidsByDay class="top"/>
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
.top {
  margin-top: 20px;
}
</style>