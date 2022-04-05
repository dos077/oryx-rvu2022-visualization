<template>
  <main-card
    :noNav="true"
    style="min-width: 100%;"
  >
    <v-card-text>
      <canvas id="comboChart"></canvas>
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
import Chart from 'chart.js/auto';
import { mapState } from 'vuex';
import MainCard from './MainCard.vue';
import { mapSideDates, updated } from '../data/oryxDb';
import { buildVsData, buildBreakdownData } from '../data/chartData';

export default {
  name: 'ComboChart',
  components: { MainCard },
  data: () => ({
    chart: null,
    breakdownChart: null,
    updated: new Date(updated),
  }),
  computed: {
    ...mapState(['categories', 'entries', 'countMethod', 'smaPeriod', 'dateRange', 'darkMode', 'breakdownSide', 'breakdownKey', 'breakdownPercent']),
    isTotal() {
      return this.countMethod === 'total';
    },
    chartOptions() {
      return {
        plugins: {
          legend: {
            labels: { color: this.darkMode ? '#eee' : undefined },
          },
        },
        scales: {
          x: {
            ticks: { color: this.darkMode ? '#eee' : undefined },
            grid: { color: this.darkMode ? '#444' : undefined },
            stacked: !!this.breakdownSide && !this.isTotal,
          },
          y: {
            position: 'right',
            ticks: { color: this.darkMode ? '#eee' : undefined },
            grid: { color: this.darkMode ? '#444' : undefined },
            stacked: !!this.breakdownSide,
            min: this.breakdownSide && this.breakdownPercent ? 0 : undefined,
            max: this.breakdownSide && this.breakdownPercent ? 100 : undefined,
          },
        },
      };
    },
    chartData() {
      if (!this.breakdownSide) {
        const mapped = mapSideDates(this.entries);
        const {
          labels, datasets,
        } = buildVsData(mapped, this.isTotal, this.smaPeriod, this.dateRange);
        return {
          labels,
          datasets,
        };
      }
      const entries = this.entries.filter(({ side }) => side === this.breakdownSide);
      return buildBreakdownData(
        entries,
        this.breakdownKey,
        5,
        this.dateRange,
        this.breakdownPercent,
        this.isTotal,
      );
    },
    updateTime() {
      const ts = this.updated;
      const date = `${ts.getFullYear()}-${ts.getMonth() + 1}-${ts.getDate()}`;
      const hr = `${ts.getHours()}:${ts.getMinutes()}`;
      return `${date} ${hr}`;
    },
    isDesktop() { return this.$vuetify.breakpoint.mdAndUp; },
  },
  watch: {
    chartData: {
      handler({ labels, datasets }) {
        this.chart.data.labels = labels;
        this.chart.data.datasets = datasets;
        this.chart.update();
      },
    },
    chartOptions: {
      handler(to) {
        this.chart.options = to;
        this.chart.update();
      },
    },
  },
  mounted() {
    const ctx = document.getElementById('comboChart');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions,
    });
    if (!this.isDesktop) {
      const maxDate = this.dateRange[1];
      const minTs = new Date(maxDate) - (14 * 24 * 3600 * 1000);
      const minDate = (new Date(minTs)).toISOString().substring(0, 10);
      this.$store.commit('setDateRange', [minDate, maxDate]);
    }
  },
};
</script>
