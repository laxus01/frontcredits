<template>
  <v-container>
    <v-dialog v-model="dialog2" max-width="500px">
      <FormCredit
        :payment_id="payment_id"
        :final="final"
        @closeModalCredit="closeModalCredit"
        @getCredits="getCredits"
      />
    </v-dialog>
    <v-btn
      @click="dialog2 = !dialog2"
      class="mx-2"
      fab
      dark
      small
      color="primary"
    >
      <v-icon dark> person_add_alt_1 </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="credits"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar class="toolbar" flat>
          <v-text-field
            v-model="search"
            prepend-icon="search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Esta seguro de eliminar este credito?</v-card-title
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
      <!-- <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="deleteItem(item)"> delete </v-icon>
      </template> -->
    </v-data-table>
  </v-container>
</template>

<script>
import FormCredit from "../components/FormCredit";
import axios from "axios";

const shortid = require("shortid");

export default {
  data() {
    return {
      creditId: "",
      credits: [],
      dialog2: false,
      final: true,
      date: "",
      search: "",
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: "Cliente", align: "start", value: "name" },
        { text: "Total", value: "total" },
        { text: "Fecha", value: "date" },
      ],
    };
  },
  props: {
    payment_id: "",
  },
  components: {
    FormCredit,
  },
  methods: {
    async getCredits() {
      let data = await axios.get(`api/credits/${this.payment_id}`);
      this.credits = await data.data.credits;
    },
    async deleteCredit(creditId) {
      await axios
        .delete(`api/credits/${creditId}`)
        .then((result) => {
          if (result) {
            this.getCredits();
          }
        });
    },
    closeModalClient() {
      this.dialog = false;
    },
    closeModalCredit() {
      this.dialog2 = false;
    },
    deleteItem(item) {
      this.creditId = item.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteCredit(this.creditId);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
    },
  },
  created() {
    this.getCredits();
  },
};
</script>

<style>
.toolbar {
  margin-top: 10px;
  width: 50%;
}
</style>
