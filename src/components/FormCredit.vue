<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{
        state ? "Registrar Credito" : "Registrar Cliente"
      }}</span>
    </v-card-title>

    <v-card-text v-if="!state">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Identificación*"
              hint="Digite la identificación del cliente"
              persistent-hint
              v-model.trim="dataClient.identification"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Nombre*"
              hint="Digite el nombre del cliente"
              v-model.trim="dataClient.name"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Telefono*"
              hint="Digite el telefono del cliente"
              v-model="dataClient.phone"
              persistent-hint
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Dirección*"
              hint="Digite la dirección del cliente"
              v-model="dataClient.direction"
              persistent-hint
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text v-if="state">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              prepend-icon="person"
              @click:prepend="state = !state"
              :items="items"
              return-object
              label="Cliente*"
              hint="Seleccione el cliente"
              persistent-hint
              item-value="value"
              item-text="name"
              no-data-text="Cliente no registrado"
              :menu-props="{ maxHeight: 100 }"
              v-model="client"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              ref="name"
              label="Valor Prestamo*"
              hint="Digite el valor del prestamo"
              persistent-hint
              v-model="postCredit.value"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              ref="name"
              label="Valor Abono*"
              hint="Digite el valor del abono"
              persistent-hint
              v-model="postPaid.value"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="postCredit.date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="postCredit.date"
                  label="Fecha*"
                  hint="Seleccione la fecha"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="postCredit.date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancelar
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(postCredit.date)"
                >
                  Seleccionar
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-select
              v-model="postCredit.mode"
              :items="['30', '40', '60']"
              label="Dias*"
            ></v-select>
          </v-col>
          <v-col>
            <v-checkbox v-model="final" label="Ultimo Credito"></v-checkbox>
          </v-col>
          <!-- <v-col cols="12">
            <v-alert
              color="red"
              dismissible
              outlined
              text
              type="error"
            >
              Debes llenar los campos obligatorios 
            </v-alert>
          </v-col> -->
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
      <v-btn
        v-if="state"
        :disabled="validatePostCredit()"
        color="blue darken-1"
        text
        @click="save"
      >
        Guardar</v-btn
      >
      <v-btn
        v-if="!state"
        :disabled="validateDataClient()"
        color="blue darken-1"
        text
        @click="save2"
      >
        Guardar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import moment from "moment";

const shortid = require("shortid");

export default {
  data() {
    return {
      //alert: true,
      state: true,
      creditFinal: "",
      dataClient: {
        id: "",
        identification: "",
        name: "",
        phone: "",
        direction: "",
      },
      postCredit: {
        id: "",
        payment_id: "",
        value: "",
        paid: "",
        date: "",
        next: "",
        previous: "",
        mode: "",
      },
      postPaid: {
        id: "",
        credit_id: "",
        date: "",
        value: "",
      },
      client: "",
      items: [],
      menu: false,
    };
  },
  props: {
    payment_id: "",
    next: "",
    previous: "",
    current: "",
    final: false,
    lengthCredits: true,
  },
  methods: {
    async getClients() {
      let data = await axios.get("clients");
      this.items = await data.data.clients;
    },
    close() {
      if (this.state) {
        this.$emit("closeModalCredit");
        this.clearFormCredit();
      } else {
        this.state = !this.state;
      }
    },
    async save() {
      await this.saveCredits();
    },
    async save2() {
      await this.saveClient();
      await this.clearFormClient();
    },
    clearFormCredit() {
      this.postCredit = {
        id: "",
        payment_id: "",
        value: "",
        paid: "",
        date: "",
      };
      this.postPaid = {
        value: "",
      };
    },
    clearFormClient() {
      this.dataClient = {
        id: "",
        identification: "",
        name: "",
        phone: "",
        direction: "",
      };
    },
    async saveCredits() {
      if (this.final) {
        await this.getCreditFinal();
        await this.setValuePostCredit();
        await this.updatePrevious(this.creditFinal);
      } else {
        await this.setValuePostCredit();
        await this.updatePrevious(this.previous);
        await this.updateNext();
      }
      this.saveCredit();
    },
    async saveCredit() {
      await axios
        .post("credits", this.postCredit)
        .then(async (result) => {
          if (result) {
            await this.setValuePostPaid();
            await this.savePaid();
            await this.clearFormCredit();
          }
        });
    },
    async savePaid() {
      console.log(this.postPaid);
      await axios
        .post("credits/paid", this.postPaid)
        .then((result) => {
          if (result) {
            this.$emit("closeModalCredit");
            this.$emit("getCredits");
          }
        });
    },
    async getCreditFinal() {
      await axios
        .get(`credits/final/${this.payment_id}`)
        .then((res) => {
          if (res.data.creditFinal.length > 0) {
            this.creditFinal = res.data.creditFinal[0].id;
          } else {
            this.creditFinal = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setValuePostCredit() {
      this.postCredit.id = shortid.generate();
      this.postCredit.payment_id = this.payment_id;
      this.postCredit.client_id = this.client.id;
      this.postCredit.next = this.final ? 0 : this.current;
      this.postCredit.previous = this.final ? this.creditFinal : this.previous;
      this.postCredit.register_date = moment().format("YYYY-MM-DD HH:mm:ss");
    },
    setValuePostPaid() {
      this.postPaid.id = shortid.generate();
      this.postPaid.credit_id = this.postCredit.id;
      this.postPaid.date = this.postCredit.date;
    },
    async saveClient() {
      this.dataClient.id = shortid.generate();
      axios
        .post("clients", this.dataClient)
        .then((result) => {
          if (result) {
            this.getClients();
            this.state = !this.state;
          }
        });
    },
    async updatePrevious(creditId) {
      axios
        .put(`credits/previous/${creditId}`, {
          next: this.postCredit.id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async updateNext() {
      axios
        .put(`credits/next/${this.current}`, {
          previous: this.postCredit.id,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validatePostCredit() {
      if (
        this.postCredit.value === "" ||
        this.postCredit.date === "" ||
        this.client === "" ||
        this.postCredit.mode === "" ||
        this.postPaid.value === ""
      ) {
        return true;
      }
    },
    validateDataClient() {
      if (
        this.dataClient.identification === "" ||
        this.dataClient.name === ""
      ) {
        return true;
      }
    },
  },
  created() {
    this.getClients();
  },
  return: {},
};
</script>

<style></style>
