<template>
  <main-card
    :noNav="true"
    style="min-width: 100%;"
  >
    <v-card-text>
      <canvas id="comboChart"></canvas>
    </v-card-text>
      <v-divider />
    <v-card-actions>
      <v-spacer />
      <span class="caption mx-4">
        last update <b>{{ updateTime }}</b>
      </span>
      <v-btn icon plain small color="blue" @click="exportChart" :disabled="pictureMode">
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-card-actions>
  </main-card>
</template>

<script>
import Chart from 'chart.js/auto';
import { mapState } from 'vuex';
import MainCard from './MainCard.vue';
import { mapSideDates, updated, getCategories } from '../data/oryxDb';
import { buildVsData, buildBreakdownData, breakDownEntries } from '../data/chartData';

export default {
  name: 'ComboChart',
  components: { MainCard },
  data: () => ({
    chart: null,
    updated: new Date(updated),
    pictureMode: false,
  }),
  computed: {
    ...mapState(['categories', 'entries', 'countMethod', 'smaPeriod', 'dateRange', 'darkMode', 'breakdownSide', 'breakdownKey', 'breakdownPercent']),
    isTotal() {
      return this.countMethod === 'total';
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
    chartOptions() {
      return {
        aspectRatio: this.$vuetify.breakpoint.smAndUp ? undefined : 1,
        plugins: {
          title: {
            display: true,
            text: this.dynamicTitle,
            color: this.darkMode ? '#eee' : undefined,
          },
          legend: {
            labels: { color: this.darkMode ? '#ccc' : undefined },
          },
          background: {
            draw: this.pictureMode,
            color: this.darkMode ? '#111' : '#fff',
          },
        },
        scales: {
          x: {
            ticks: { color: this.darkMode ? '#ccc' : undefined },
            grid: { color: this.darkMode ? '#444' : undefined },
            stacked: !!this.breakdownSide && !this.isTotal,
          },
          y: {
            position: 'right',
            ticks: { color: this.darkMode ? '#ccc' : undefined },
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
    isDesktop() {
      return this.$vuetify.breakpoint.smAndUp;
    },
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
    isDesktop(to) {
      if (to) this.chart.options.aspectRatio = 2;
      else this.chart.options.aspectRatio = 1;
      this.chart.resize();
    },
  },
  methods: {
    async exportChart() {
      this.pictureMode = true;
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 200));
      const canvas = document.querySelector('#comboChart');
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

      const element = document.createElement('a');
      const filename = 'rvu2022.png';
      element.setAttribute('href', image);
      element.setAttribute('download', filename);

      element.click();
      this.pictureMode = false;
    },
  },
  mounted() {
    const ctx = document.getElementById('comboChart');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions,
      plugins: [
        {
          id: 'background',
          beforeDraw: (chart, args, opts) => {
            if (opts.draw) {
              const context = chart.canvas.getContext('2d');
              context.save();
              context.globalCompositeOperation = 'destination-over';
              context.fillStyle = opts.color;
              context.fillRect(0, 0, chart.width, chart.height);
              context.restore();
            }
          },
        },
      ],
    });
    if (this.$vuetify.breakpoint.smAndDown) {
      const maxDate = this.dateRange[1];
      const minTs = new Date(maxDate) - (14 * 24 * 3600 * 1000);
      const minDate = (new Date(minTs)).toISOString().substring(0, 10);
      this.$store.commit('setDateRange', [minDate, maxDate]);
    } else if (this.$vuetify.breakpoint.mdAndDown) {
      const minDate = new Date(updated);
      minDate.setMonth(minDate.getMonth() - 1);
      const maxDate = new Date(updated);
      this.$store.commit(
        'setDateRange',
        [minDate.toISOString().slice(0, 10), maxDate.toISOString().slice(0, 10)],
      );
    }
  },
};
</script>
