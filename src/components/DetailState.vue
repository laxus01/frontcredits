<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-autocomplete
          @change="getActualState()"
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
    </v-row>
    <div class="content">
      <div class="content fourth">
        <div class="content fourth__title">Creditos</div>
        <div class="content fourth__body">
          <div class="content fourth__body--button info">
            $ {{ convert(state.total_credits ? state.total_credits : 0) }}
          </div>
        </div>
      </div>
      <div class="content fourth">
        <div class="content fourth__title">Total</div>
        <div class="content fourth__body">
          <div class="content fourth__body--button primary">
            $ {{ convert(state.total ? state.total : 0) }}
          </div>
        </div>
      </div>
      <div class="content fourth">
        <div class="content fourth__title">Recaudado</div>
        <div class="content fourth__body">
          <div class="content fourth__body--button success">
            $ {{ convert(state.total_paids ? state.total_paids : 0) }}
          </div>
        </div>
      </div>
      <div class="content fourth">
        <div class="content fourth__title">Pendiente</div>
        <div class="content fourth__body">
          <div class="content fourth__body--button error">
            $ {{ convert(state.total && state.total_paids ? state.total - state.total_paids : 0) }}
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    items: [],
    paiment:[],
    state: {
        total: "",
        total_credits: "",
        total_paids: "",
    },
  }),
  methods: {
    async getPayments() {
      let data = await axios.get("api/payments");
      this.items = await data.data.desserts;
    },
    async getActualState() {
      let data = await axios.get(
        `api/credits/getActualState/${this.paiment.id}`
      );
      console.log(data);
      this.state = await data.data.state[0];
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
    this.getPayments();
  },
};
</script>

<style lang="scss">
.content {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;

  &.fourth {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__title {
      height: 20%;
      color: #2e344d;
      font-size: 22px;
    }

    &__body {
      height: 80%;

      &--button {
        height: 150px;
        max-width: 150px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 22px;
      }
    }
  }
}
</style>
