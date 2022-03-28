<template>
  <main-card title="Chart" :noNav="true" titleColor="" style="min-width: 100%;">
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
import { mapSideDates, updated } from '../data/oryxDb';
import { buildVsData } from '../data/chartData';

export default {
  name: 'VsChart',
  components: { MainCard },
  data: () => ({
    chart: null,
    updated: new Date(updated),
  }),
  computed: {
    ...mapState(['entries', 'countMethod', 'smaPeriod', 'dateRange']),
    isTotal() {
      return this.countMethod === 'total';
    },
    chartData() {
      const minDate = new Date(this.dateRange[0]);
      const maxDate = new Date(this.dateRange[1]);
      maxDate.setDate(maxDate.getDate() + 1);
      const entries = this.entries.filter(({ date }) => {
        const time = new Date(date);
        return time >= minDate && time <= maxDate;
      });
      const mapped = mapSideDates(entries);
      const {
        labels, russia, ukraine, rusSma, ukrSma,
      } = buildVsData(mapped, this.isTotal, this.smaPeriod);
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
      );
      return { labels, datasets };
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
      handler(newData) {
        this.chart.data = newData;
        this.chart.update();
      },
    },
  },
  mounted() {
    const ctx = document.getElementById('vsChart');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
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
