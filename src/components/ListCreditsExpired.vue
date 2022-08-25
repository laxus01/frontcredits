<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat class="table">
        <v-row>
          <v-col cols="2">
            <v-autocomplete
              @change="getCreditsExpired()"
              :items="items"
              return-object
              label="Cobro*"
              item-value="value"
              item-text="detail"
              no-data-text="Cobro no registrado"
              :menu-props="{ maxHeight: 100 }"
              v-model="paiment"
              outlined
            ></v-autocomplete>
          </v-col>

          <v-spacer></v-spacer>
          <v-col>
            <v-text-field
              prepend-icon="search"
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    items: [],
    search: "",
    paiment: [],
    desserts: [],
    headers: [
      {
        text: "Identificación",
        align: "start",
        sortable: false,
        value: "identification",
      },
      {
        text: "Cliente",
        align: "start",
        value: "name",
      },
      {
        text: "Telefono",
        align: "end",
        value: "phone",
        align: "start",
        sortable: false,
      },
      {
        text: "Dirección",
        value: "direction",
        align: "start",
        sortable: false,
      },
      { text: "Valor", value: "total", align: "start" },
      { text: "Fecha", value: "date", align: "start" },
      { text: "Vencidos", align: "end", value: "days", align: "start" },
    ],
  }),
  methods: {
    async getPayments() {
      let data = await axios.get("api/payments");
      this.items = await data.data.desserts;
    },
    async getCreditsExpired() {
      let data = await axios.get(
        `api/reports/getCreditsExpired/${this.paiment.id}`
      );
      let arrayReport = await data.data.report;
      this.desserts = arrayReport.filter(
        (report) => report.days > report.mode
      );
    },
    convert(num) {
      if (!isNaN(num)) {
        num = num
          .toString()
          .split("")
          .reverse()
          .join("")
          .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
        num = num.split("").reverse().join("").replace(/^[\.]/, "");
        return num;
      }
    },
  },
  created() {
    this.getPayments();
  },
};
</script>

<style>
.table {
  top: 20px;
}
</style>
