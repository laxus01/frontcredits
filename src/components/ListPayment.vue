<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              rounded
              color="blue darken-3"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Registrar
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Detalle*"
                      hint="Digite el nombre de la ruta de su cobro"
                      persistent-hint
                      v-model="editedItem.detail"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Valor Inicial*"
                      hint="Digite el valor con el que inicio el cobro"
                      persistent-hint
                      v-model="editedItem.initial_value"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="editedItem.date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.date"
                          label="Fecha*"
                          hint="Seleccione la fecha con la que inicio el cobro"
                          persistent-hint
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.date"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancelar
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(editedItem.date)"
                        >
                          Seleccionar
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Esta seguro de eliminar este cobro?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Eliminar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
      <v-icon small class="mr-2" @click="deleteItem(item)"> delete </v-icon>
      <v-icon small @click="handleClick(item)"> paid </v-icon>
    </template>
  </v-data-table>
</template>

<script>
const shortid = require("shortid");
import axios from "axios";
//import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    menu: false,
    date: "",
    search: "",
    dialog: false,
    dialogDelete: false,
    desserts: [],
    headers: [
      {
        text: "Cobro",
        align: "start",
        sortable: false,
        value: "detail",
      },
      { text: "Fecha", value: "date" },
      { text: "Valor Inicial", value: "initial_value" },
      { text: "Acción", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      detail: "",
      date: "",
      initial_value: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cobro" : "Editar Cobro";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async getPayments() {
      let data = await axios.get("api/payments");
      let payments = await data.data.desserts;
      this.desserts = [];
      payments.forEach((payments) => {
        this.desserts.push({
          date: payments.date,
          detail: payments.detail,
          id: payments.id,
          initial_value: this.convert(payments.initial_value),
        });
      });
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deletePayment(this.editedItem);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.updatePayment(this.editedItem);
      } else {
        const id = shortid.generate();
        this.setPayment(this.editedItem, id);
      }
      this.close();
    },

    handleClick(value) {
      this.$router.push(`create-credit/${value.id}`);
    },
    async deletePayment(editedItem) {
      axios
        .put(`api/payments/inactivate/${editedItem.id}`)
        .then(() => {
          this.getPayments();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async updatePayment(editedItem) {
      axios
        .put(`api/payments/update/${editedItem.id}`, {
          date: editedItem.date,
          detail: editedItem.detail,
          initial_value: editedItem.initial_value.replace(/\./g, ''),
        })
        .then(() => {
          this.getPayments();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async setPayment(editedItem, id) {
      axios
        .post(`api/payments`, {
          id: id,
          date: editedItem.date,
          detail: editedItem.detail,
          initial_value: editedItem.initial_value,
        })
        .then(() => {
          this.getPayments();
        })
        .catch((err) => {
          console.log(err);
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
