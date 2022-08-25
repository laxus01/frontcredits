<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-autocomplete
          @change="viewDate()"
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
      <v-col v-if="stateDate" cols="2">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="postBalance.date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="postBalance.date"
              label="Fecha*"
              persistent-hint
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
            ></v-text-field>
          </template>
          <v-date-picker v-model="postBalance.date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancelar </v-btn>
            <v-btn
              text
              color="primary"
              @click="
                $refs.menu.save(postBalance.date)
                getDailyBalance()
              "
            >
              Seleccionar
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model="totalCredits"
          ref="name"
          label="Total Prestamos"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="totalPaids"
          ref="name"
          label="Total Abonos"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-text-field
          ref="name"
          label="Base"
          v-model="postBalance.base"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          ref="name"
          label="Gastos"
          v-model="postBalance.bills"
          v-on:keyup="calculateDelivery()"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          ref="name"
          label="Entrega"
          v-model="postBalance.delivery"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn depressed rounded color="primary" @click="saveBalance()">
          <v-icon left dark> file_download_done </v-icon>
          GUARDAR
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="300">
        <v-card>
          <v-card-title class="text-h5">¡Upsss!</v-card-title>
          <v-card-text>Debes llenar los campos obligatorios!</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios"

const shortid = require("shortid")

export default {
  data() {
    return {
      stateDate: false,
      paiment: [],
      menu: false,
      dialog: false,
      text: true,
      postBalance: {
        payment_id: "",
        date: "",
        total_credits: "",
        total_paids: "",
        base: "",
        bills: "",
        delivery: "",
      },
      items: [],
      totalCredits: "",
      totalPaids: "",
    }
  },
  methods: {
    viewDate() {
      this.stateDate = true;
    },
    async getPayments() {
      let data = await axios.get("api/payments")
      this.items = await data.data.desserts
    },
    async getDailyBalance() {
      let paymentId = this.paiment.id
      let dataCredits = await axios.get(
        `api/credits/totalCredits/paymentId/${paymentId}/date/${this.postBalance.date}`
      )
      this.totalCredits = this.convert(await dataCredits.data.totalCredits[0].total)
      let dataPaids = await axios.get(
        `api/credits/totalPaids/paymentId/${paymentId}/date/${this.postBalance.date}`
      )
      this.totalPaids = this.convert(await dataPaids.data.totalPaids[0].total)
    },
    calculateDelivery() {
      this.postBalance.delivery =
        this.postBalance.total_paids +
        this.postBalance.base * 1000 -
        (this.postBalance.total_credits + this.postBalance.bills * 1000)
    },
    async saveBalance() {
      if (this.postBalance.date === "" || this.postBalance.paid === "") {
        this.text = false
        this.dialog = true
      } else {
        await this.setValuePostBalance()
        await axios
          .post("api/credits/paid/saveDailyBalance", this.postBalance)
          .then(async (result) => {
            if (result) {
              location.reload();
            }
          })
      }
    },
    setValuePostBalance() {
      this.postBalance.id = shortid.generate()
      this.postBalance.payment_id = this.paiment.id
      this.postBalance.total_credits = this.totalCredits.replace(/\./g, '')
      this.postBalance.total_paids = this.totalPaids.replace(/\./g, '')
    },
    convert(num) {
      if(!isNaN(num)){
          num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g,'$1.');
          num = num.split("").reverse().join("").replace(/^[\.]/, "");
          return num;
      }
    },
  },
  created() {
    this.getPayments()
  },
}
</script>

<style></style>
