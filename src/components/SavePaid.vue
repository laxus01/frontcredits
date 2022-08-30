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
    <div v-if="!balance">
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
                outlined
              ></v-text-field>
            </template>
            <v-date-picker v-model="postPaid.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                Cancelar
              </v-btn>
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
        <v-col cols="4">
          <v-text-field
            ref="name"
            label="Cliente"
            v-model="credit.name"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2" align="center">
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
        <v-col cols="2" align="center">
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
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Total Pago"
            v-model="credit.total"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Valor Prestamo"
            v-model="credit.value"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Saldo Pendiente"
            v-model="credit.balance"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Dias Retraso"
            v-model="delayDays"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Total Abonos"
            v-model="credit.total_paid"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Valor Abono*"
            v-model="postPaid.value"
            v-on:keyup.enter="savePaid()"
            outlined
            append-icon="file_download_done"
            @click:append="savePaid()"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
    <div v-if="balance">
      <v-row>
        <v-col cols="2">
          <v-text-field
            v-model="totalCredits"
            ref="name"
            label="Total Prestamos"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="totalPaids"
            ref="name"
            label="Total Abonos"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Base"
            v-model="postBalance.base"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Gastos"
            v-model="postBalance.bills"
            v-on:keyup="calculateDelivery()"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            ref="name"
            label="Entrega"
            v-model="postBalance.delivery"
            outlined
            v-on:keyup.enter="saveBalance()"
            append-icon="file_download_done"
            @click:append="saveBalance()"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
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
      balance: false,
      totalCredits: "",
      totalPaids: "",
      postBalance: {
        payment_id: "",
        date: "",
        total_credits: "",
        total_paids: "",
        base: "",
        bills: "",
        delivery: "",
      },

      stateDate: true,
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
        let credit = await data.data.credit;
        this.calculateDelay(credit);
      }
    },
    async getCurrentCredit(direction) {
      this.next = true;
      this.previous = true;
      const creditId =
        direction === 0 ? this.credit.previous : this.credit.next;
      let data = await axios.get(`api/credits/current/${creditId}`);
      let credit = await data.data.credit;
      this.calculateDelay(credit);

      if (direction === 0 && this.credit.previous === "0") {
        this.previous = false;
      } else if (direction === 1 && this.credit.next === "0") {
        this.next = false;
      }
    },
    async savePaid() {
      let paid = this.postPaid.value * 1000;
      let balance = this.credit.balance.replace(/\./g, "");
      if (this.postPaid.date === "" || this.postPaid.paid === "") {
        this.dialog = true;
      } else {
        this.setValuePostPaid();
        await axios
          .post("api/credits/paid", this.postPaid)
          .then((result) => {
            if (result) {
              if (paid >= balance) {
                this.updatePrevious(this.credit.previous);
                this.updateNext(this.credit.next);
                this.inactivateCredit(this.credit.id);
              }
              if (this.credit.next === "0") {
                this.balance = !this.balance;
                this.getDailyBalance();
              } else {
                this.getCurrentCredit(1);
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
    calculateDelay(credit) {
      let newCredit = [];
      credit.forEach((item) => {
        newCredit.push({
          balance: this.convert(item.balance),
          date: item.date,
          id: item.id,
          mode: item.mode,
          name: item.name,
          next: item.next,
          previous: item.previous,
          total: item.total,
          total_paid: this.convert(item.total_paid),
          value: this.convert(item.value),
        });
      });
      this.credit = newCredit[0];
      let limitDate = moment(this.credit.date)
        .add(this.credit.mode, "d")
        .format("YYYY-MM-DD");
      let currentDate = moment().format("YYYY-MM-DD");
      this.delayDays =
        currentDate > limitDate ? moment(currentDate).diff(limitDate, "d") : 0;
    },

    async getDailyBalance() {
      let paymentId = this.paiment.id;
      let dataCredits = await axios.get(
        `api/credits/totalCredits/paymentId/${paymentId}/date/${this.postPaid.date}`
      );
      this.totalCredits = this.convert(
        await dataCredits.data.totalCredits[0].total
      );

      let dataPaids = await axios.get(
        `api/credits/totalPaids/paymentId/${paymentId}/date/${this.postPaid.date}`
      );
      this.totalPaids = this.convert(await dataPaids.data.totalPaids[0].total);
    },
    calculateDelivery() {
      this.postBalance.delivery =
        this.postBalance.total_paids +
        this.postBalance.base * 1000 -
        (this.postBalance.total_credits + this.postBalance.bills * 1000);
    },
    async saveBalance() {
      this.setValuePostBalance();
      await axios
        .post("api/credits/paid/saveDailyBalance", this.postBalance)
        .then(async (result) => {
          if (result) {
            location.reload();
          }
        });
    },
    setValuePostBalance() {
      this.postBalance.id = shortid.generate();
      this.postBalance.payment_id = this.paiment.id;
      this.postBalance.date = this.postPaid.date;
      this.postBalance.total_credits = this.totalCredits.replace(/\./g, "");
      this.postBalance.total_paids = this.totalPaids.replace(/\./g, "");
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
.toolbar {
  width: 50%;
}
</style>
