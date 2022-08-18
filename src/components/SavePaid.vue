<template>
  <v-container>
    <v-dialog v-model="dialog2" max-width="500px">
      <FormCredit
        :payment_id="payment_id"
        :next="credit.next"
        :previous="credit.previous"
        :current="credit.id"
        :final="final"
        @closeModalCredit="closeModalCredit"
      />
    </v-dialog>
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
        ></v-autocomplete>
      </v-col>
      <v-col cols="2" v-if="stateDate">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="postPaid.date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="postPaid.date"
              label="Fecha*"
              persistent-hint
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="postPaid.date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancelar </v-btn>
            <v-btn
              text
              color="primary"
              @click="
                $refs.menu.save(postPaid.date);
                getCreditInitial(paiment);
              "
            >
              Seleccionar
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2">
        <v-btn
          v-if="add"
          @click="dialog2 = !dialog2"
          class="mx-2"
          fab
          dark
          small
          color="primary"
        >
          <v-icon dark> person_add_alt_1 </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-text-field
          ref="name"
          label="Cliente"
          v-model="credit.name"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          ref="name"
          label="Valor Prestamo"
          v-model="credit.value"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          ref="name"
          label="Saldo Pendiente"
          v-model="credit.balance"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-text-field
          ref="name"
          label="Dias Retraso"
          v-model="delayDays"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          ref="name"
          label="Total Abonos"
          v-model="credit.total_paid"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          ref="name"
          label="Valor Abono*"
          v-model="postPaid.value"
          v-on:keyup.enter="savePaid()"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn depressed rounded color="primary" @click="savePaid()">
          <v-icon left dark> file_download_done </v-icon>
          GUARDAR
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7" align="center">
        <v-btn
          class="mx-2"
          :disabled="!previous"
          @click="getCurrentCredit(0)"
          fab
          dark
          small
          color="primary"
        >
          <v-icon dark> arrow_back </v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          :disabled="!next"
          @click="getCurrentCredit(1)"
          fab
          dark
          small
          color="primary"
        >
          <v-icon dark> arrow_forward </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="300">
        <v-card>
          <v-card-title class="text-h5"> ¡Upsss! </v-card-title>
          <v-card-text>Debes llenar los campos obligatorios.</v-card-text>
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
import FormCredit from "../components/FormCredit";
import axios from "axios";
import moment from "moment";

const shortid = require("shortid");

export default {
  data() {
    return {
      stateDate: false,
      add: false,
      next: false,
      previous: false,
      final: false,
      delayDays: "",
      paiment: "",
      payment_id: "",
      postPaid: {
        id: "",
        credit_id: "",
        date: "",
        value: "",
      },
      credit: {
        id: "",
        name: "",
        value: "",
        delay: "",
        total: "",
        balance: "",
        next: "",
        previous: "",
        current: "",
        total_paid: "",
      },
      items: [],
      date: "",
      menu: false,
      dialog: false,
      dialog2: false,
    };
  },
  components: {
    FormCredit,
  },
  methods: {
    viewDate() {
      this.stateDate = true;
    },
    async getPayments() {
      let data = await axios.get("api/payments");
      this.items = await data.data.desserts;
    },
    async getCreditInitial(paiment) {
      this.payment_id = paiment.id;
      if (!paiment.id) {
        this.dialog = true;
      } else {
        this.add = true;
        this.next = true;
        const paimentId = paiment.id;
        let data = await axios.get(`api/credits/initial/${paimentId}`);
        this.credit = await data.data.credit[0];
        await this.calculateDelay();
      }
    },
    async getCurrentCredit(direction) {
      this.next = true;
      this.previous = true;
      const creditId =
        direction === 0 ? this.credit.previous : this.credit.next;
      let data = await axios.get(`api/credits/current/${creditId}`);
      this.credit = await data.data.credit[0];
      await this.calculateDelay();

      if (direction === 0 && this.credit.previous === "0") {
        this.previous = false;
      } else if (direction === 1 && this.credit.next === "0") {
        this.next = false;
      }
    },
    async savePaid() {
      if (this.postPaid.date === "" || this.postPaid.paid === "") {
        this.dialog = true;
      } else {
        await this.setValuePostPaid();
        await axios
          .post("api/credits/paid", this.postPaid)
          .then(async (result) => {
            if (result) {
              let x = this.postPaid.value * 1000;
              if (x >= this.credit.balance) {
                await this.updatePrevious(this.credit.previous);
                await this.updateNext(this.credit.next);
                await this.inactivateCredit(this.credit.id);
              }
              if (this.credit.next === "0") {
                location.reload();
              } else {
                await this.getCurrentCredit(1);
              }
            }
          });
      }
    },
    async updatePrevious(creditId) {
      axios
        .put(`api/credits/previous/${creditId}`, {
          next: this.credit.next,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async updateNext(creditId) {
      axios
        .put(`api/credits/next/${creditId}`, {
          previous: this.credit.previous,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async inactivateCredit(creditId) {
      axios
        .put(`api/credits/inactivate/${creditId}`)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setValuePostPaid() {
      this.postPaid.id = shortid.generate();
      this.postPaid.credit_id = this.credit.id;
    },
    closeModalCredit() {
      this.dialog2 = false;
    },
    calculateDelay() {
      let limitDate = moment(this.credit.date)
        .add(this.credit.mode, "d")
        .format("YYYY-MM-DD");
      let currentDate = moment().format("YYYY-MM-DD");
      this.delayDays =
        currentDate > limitDate ? moment(currentDate).diff(limitDate, "d") : 0;
    },
  },
  created() {
    this.getPayments();
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
};
</script>

<style>
.toolbar {
  width: 50%;
}
</style>
