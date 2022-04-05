<template>
  <main-card
    :title="dynamicTitle"
    :noNav="true"
    titleColor="grey"
    style="min-width: 100%;"
  >
    <v-card-text>
      <canvas id="vsChart"></canvas>
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
import { mapSideDates, updated, getCategories } from '../data/oryxDb';
import { buildVsData, breakDownEntries } from '../data/chartData';

export default {
  name: 'VsChart',
  components: { MainCard },
  data: () => ({
    chart: null,
    breakdownChart: null,
    updated: new Date(updated),
  }),
  computed: {
    ...mapState(['categories', 'entries', 'countMethod', 'smaPeriod', 'dateRange', 'darkMode']),
    isTotal() {
      return this.countMethod === 'total';
    },
    chartData() {
      const mapped = mapSideDates(this.entries);
      const {
        labels, datasets,
      } = buildVsData(mapped, this.isTotal, this.smaPeriod, this.dateRange);
      /*
      const datasets = [];
      if (!this.isTotal) {
        datasets.push(
          {
            label: 'Rus-SMA',
            data: rusSma,
            borderColor: '#f99fa8',
            borderDash: [5, 5],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
          {
            label: 'Ukr - SMA',
            data: ukrSma,
            borderColor: '#66b0ff ',
            borderDash: [5, 5],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
        );
      }
      datasets.push(
        {
          label: 'Russia',
          data: russia,
          borderColor: '#DB0D20',
          backgroundColor: '#db0d20',
          type: this.isTotal ? 'line' : 'bar',
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
        },
        {
          label: 'Ukraine',
          data: ukraine,
          borderColor: '#005BBB ',
          backgroundColor: '#005BBB ',
          type: this.isTotal ? 'line' : 'bar',
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
        },
      ); */
      return {
        labels,
        datasets,
        options: {
          plugins: {
            legend: {
              labels: { color: this.darkMode ? '#eee' : undefined },
            },
          },
          scales: {
            x: {
              ticks: { color: this.darkMode ? '#eee' : undefined },
              grid: { color: this.darkMode ? '#444' : undefined },
            },
            y: {
              ticks: { color: this.darkMode ? '#eee' : undefined },
              grid: { color: this.darkMode ? '#444' : undefined },
            },
          },
        },
      };
    },
    updateTime() {
      const ts = this.updated;
      const date = `${ts.getFullYear()}-${ts.getMonth() + 1}-${ts.getDate()}`;
      const hr = `${ts.getHours()}:${ts.getMinutes()}`;
      return `${date} ${hr}`;
    },
    dynamicTitle() {
      const { categories, entries } = this;
      if (!categories || categories.length === 0) return 'No Data';
      if (categories.length === getCategories().length) return 'All Equipment Losses';
      const breakdown = breakDownEntries(entries, 'category');
      let title = '';
      const catArr = Object.keys(breakdown);
      catArr
        .sort((a, b) => breakdown[b].length - breakdown[a].length)
        .slice(0, 3)
        .forEach((name) => { title += `${name}/`; });
      return catArr.length > 3
        ? `${title}etc.`
        : title.slice(0, title.length - 1);
    },
    isDesktop() { return this.$vuetify.breakpoint.mdAndUp; },
  },
  watch: {
    chartData: {
      handler(newData) {
        this.chart.data = newData;
        this.chart.update();
      },
    },
    darkMode(to) {
      this.chart.options.plugins.legend.labels.color = to ? '#eee' : undefined;
      this.chart.options.scales.x.ticks.color = to ? '#eee' : undefined;
      this.chart.options.scales.x.grid.color = to ? '#444' : undefined;
      this.chart.options.scales.y.ticks.color = to ? '#eee' : undefined;
      this.chart.options.scales.y.grid.color = to ? '#444' : undefined;
      this.chart.update();
    },
  },
  mounted() {
    const ctx = document.getElementById('vsChart');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
    });
    /* const ctxb = document.getElementById('breakdownChart');
    this.breakdownChart = new Chart(ctxb, {
      type: 'line',
      data: this.breakdownData,
      options: {
        scales: {
          y: { stacked: true },
        },
      },
    }); */
    if (!this.isDesktop) {
      const maxDate = this.dateRange[1];
      const minTs = new Date(maxDate) - (14 * 24 * 3600 * 1000);
      const minDate = (new Date(minTs)).toISOString().substring(0, 10);
      this.$store.commit('setDateRange', [minDate, maxDate]);
    }
  },
};
</script>
