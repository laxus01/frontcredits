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
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :return-value.sync="date2"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date2"
                label="Fecha*"
                persistent-hint
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker v-model="date2" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu2 = false">
                Cancelar
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="
                  $refs.menu2.save(date2);
                  getPaidsByDay();
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
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Modificar Pago</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Cliente*"
                      persistent-hint
                      v-model="editedItem.name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Valor"
                      hint="Modifique el valor del pago"
                      persistent-hint
                      v-model="editedItem.value"
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
                          hint="Modifique la fecha del pago"
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
              >Esta seguro de eliminar este pago?</v-card-title
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
    </template>
  </v-data-table>
</template>

<script>
const shortid = require("shortid");
import axios from "axios";

export default {
  data: () => ({
    stateDate: false,
    menu: false,
    menu2: false,
    date: "",
    date2: "",
    paiment: [],
    search: "",
    dialog: false,
    dialogDelete: false,
    desserts: [],
    items: [],
    headers: [
      {
        text: "Cliente",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Valor Pagado", value: "value" },
      { text: "Fecha", value: "date" },
      { text: "Acción", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      name: "",
      date: "",
      value: "",
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    viewDate() {
      this.stateDate = true;
    },
    async getPayments() {
      let data = await axios.get("api/payments");
      this.items = await data.data.desserts;
    },
    async getPaidsByDay() {
      let data = await axios.get(
        `api/credits/getPaidsByDay/paymentId/${this.paiment.id}/date/${this.date2}`
      );
      let paids = await data.data.paids;
      this.desserts = [];
      paids.forEach((paids) => {
        this.desserts.push({
          credit_id: paids.credit_id,
          next: paids.next,
          previous: paids.previous,
          balance: paids.balance,
          id: paids.id,
          name: paids.name,
          value: this.convert(paids.value),
          oldValue: paids.value,
          date: paids.date,
          state: paids.state,
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
      this.deletePaid(this.editedItem);
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
        this.updatePaid(this.editedItem);
        this.close();
      }
    },
    async updatePaid(editedItem) {
      let value = editedItem.value * 1000;
      let newValue = value > editedItem.oldValue ? value - editedItem.oldValue : value;
      let balance = editedItem.balance;
      axios
        .put(`api/credits/updatePaid/${editedItem.id}`, {
          date: editedItem.date,
          value: editedItem.value.replace(/\./g, ''),
        })
        .then(async () => {
          if (newValue >= balance) {
            await this.updatePrevious(editedItem.previous, editedItem.next);
            await this.updateNext(editedItem.next, editedItem.previous);
            await this.inactivateCredit(editedItem.credit_id);
          }
          await this.getPaidsByDay();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async deletePaid(editedItem) {
      axios
        .delete(`api/credits/deletePaid/${editedItem.id}`)
        .then(async () => {
          if(editedItem.state === 0) {
            await this.updatePrevious(editedItem.previous, editedItem.credit_id);
            await this.updateNext(editedItem.next, editedItem.credit_id);
            await this.activateCredit(editedItem.credit_id);
          }
          await this.getPaidsByDay();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async updatePrevious(creditId, next) {
      axios
        .put(`api/credits/previous/${creditId}`, {
          next: next,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async updateNext(creditId, previous) {
      axios
        .put(`api/credits/next/${creditId}`, {
          previous: previous,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async activateCredit(creditId) {
      axios
        .put(`api/credits/activate/${creditId}`)
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
