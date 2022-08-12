<template>
  <v-list dense>
    <template>
      <v-list-item to="/register-paid">
        <v-list-item-action>
          <v-icon>payments</v-icon>
        </v-list-item-action>
        <v-list-item-title> Pagos </v-list-item-title>
      </v-list-item>
      <v-list-item to="/create-payment">
        <v-list-item-action>
          <v-icon>paid</v-icon>
        </v-list-item-action>
        <v-list-item-title> Mis Cobros </v-list-item-title>
      </v-list-item>
      <v-list-item to="/balance-payment">
        <v-list-item-action>
          <v-icon>assignment</v-icon>
        </v-list-item-action>
        <v-list-item-title> Balance Diario </v-list-item-title>
      </v-list-item>
      <v-list-item to="/balance-payment">
        <v-list-item-action>
          <v-icon>auto_awesome_motion</v-icon>
        </v-list-item-action>
        <v-list-item-title> Informes </v-list-item-title>
      </v-list-item>
      <v-list-item to="/balance-payment">
        <v-list-item-action>
          <v-icon>assessment</v-icon>
        </v-list-item-action>
        <v-list-item-title> Estadisticas </v-list-item-title>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {};
  },
};
</script>

<style scoped></style>
