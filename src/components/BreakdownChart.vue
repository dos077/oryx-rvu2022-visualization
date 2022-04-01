<template>
  <main-card
    :title="dynamicTitle"
    :noNav="true"
    titleColor="grey"
    style="min-width: 100%;"
  >
    <v-card-text>
      <canvas id="breakdownChart"></canvas>
    </v-card-text>
    <v-footer>
      <v-spacer />
      <span class="caption">
        last update <b>{{ updateTime }}</b>
      </span>
    </v-footer>
  </main-card>
</template>

<script>
import { mapState } from 'vuex';
import Chart from 'chart.js/auto';
import MainCard from './MainCard.vue';
import { updated } from '../data/oryxDb';
import { buildTotalBreakdown } from '../data/chartData';

export default {
  name: 'BreakdownChart',
  components: { MainCard },
  data: () => ({
    chart: null,
    updated: new Date(updated),
  }),
  computed: {
    ...mapState(['entries', 'dateRange', 'breakdownSide', 'breakdownKey', 'breakdownPercent']),
    chartData() {
      const entries = this.entries.filter(({ side }) => side === this.breakdownSide);
      return buildTotalBreakdown(
        entries,
        this.breakdownKey,
        5,
        this.dateRange,
        this.breakdownPercent,
      );
    },
    updateTime() {
      const ts = this.updated;
      const date = `${ts.getFullYear()}-${ts.getMonth() + 1}-${ts.getDate()}`;
      const hr = `${ts.getHours()}:${ts.getMinutes()}`;
      return `${date} ${hr}`;
    },
    dynamicTitle() {
      const { breakdownSide, breakdownKey } = this;
      return `${breakdownSide} losses - by ${breakdownKey}`;
    },
  },
  watch: {
    chartData(newData) {
      this.chart.data = newData;
      this.chart.update();
    },
    breakdownPercent(to) {
      if (to) {
        this.chart.options.scales.y.min = 0;
        this.chart.options.scales.y.max = 100;
      } else {
        this.chart.options.scales.y.min = undefined;
        this.chart.options.scales.y.max = undefined;
      }
      this.chart.update();
    },
  },
  mounted() {
    const ctx = document.getElementById('breakdownChart');
    const options = {
      scales: {
        y: { stacked: true },
      },
    };
    if (this.breakdownPercent) {
      options.scales.y.min = 0;
      options.scales.y.max = 100;
    }
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options,
    });
  },
};
</script>
