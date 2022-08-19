<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-autocomplete
          @change="getGraphicState()"
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
      <Doughnut
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
        ref="pie"
      />
    </div>
  </v-container>
</template>

<script>
import axios from "axios"
import { Doughnut } from "vue-chartjs/legacy"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: "DoughnutChart",
  components: {
    Doughnut,
  },
  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      items: [],
      paiment: [],
      state: false,
      chartData: {
        labels: ["Creditos Buenos", "Creditos Malos"],
        datasets: [
          {
            backgroundColor: ["#2196F3", "#FF5252"],
            data: [100, 0],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  methods: {
    async getPayments() {
      let data = await axios.get("api/payments")
      this.items = await data.data.desserts
    },
    async getGraphicState() {
      let data = await axios.get(
        `api/reports/getCreditsExpired/${this.paiment.id}`
      );
      let arrayReport = await data.data.report;
      let creditsExpired = arrayReport.filter(
        (report) => report.days > report.mode
      );
      this.chartData.datasets[0].data = []
      this.chartData.datasets[0].data[0] = arrayReport.length - creditsExpired.length
      this.chartData.datasets[0].data[1] = creditsExpired.length
    },
  },
  created() {
    this.getPayments()
  },
}
</script>

<style lang="scss">
.content {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
