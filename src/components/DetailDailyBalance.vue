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
              @change="stateDate = true"
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
          
        <v-col cols="2" v-if="stateDate">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Fecha*"
                persistent-hint
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                Cancelar
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="
                  $refs.menu.save(date);
                  getDailyBalance(paiment);
                "
              >
                Seleccionar
              </v-btn>
            </v-date-picker>
          </v-menu>
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
    stateDate: false,
    menu: false,
    items: [],
    search: "",
    paiment: [],
    desserts: [],
    date: "",
    headers: [
      {
        text: "Total Creditos",
        align: "start",
        sortable: false,
        value: "total_credits",
      },
      {
        text: "Total Abonos",
        align: "start",
        value: "total_paids",
      },
      {
        text: "Base",
        align: "start",
        value: "base",
        sortable: false,
      },
      {
        text: "Gastos",
        value: "bills",
        align: "start",
        sortable: false,
      },
      {
        text: "Entrega",
        value: "delivery",
        align: "start",
        sortable: false,
      },
    ],
  }),
  methods: {
    async getPayments() {
      let data = await axios.get("api/payments");
      this.items = await data.data.desserts;
    },
    async getDailyBalance(paymentId) {
      let data = await axios.get(
        `api/credits/dailyBalance/paymentId/${paymentId.id}/date/${this.date}`
      );
      let arrayReport = await data.data.report;
      this.desserts = [];
      arrayReport.forEach((report) => {
        this.desserts.push({
          total_credits: this.convert(report.total_credits),
          total_paids: this.convert(report.total_paids),
          delivery: this.convert(report.delivery),
          bills: this.convert(report.bills),
          base: this.convert(report.base),
        });
      });
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
