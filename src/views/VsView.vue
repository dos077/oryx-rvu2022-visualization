<template>
  <main-container>
    <template v-slot:secondary>
      <main-card
        title="Russian Invasion of Ukraine 2022"
        titleColor="grey"
        style="min-width: 100%;"
        class="my-4" :noNav="true"
      >
        <template v-slot:tool-title>
          <v-select
            :value="breakdownSide"
            :items="breakdownOptions"
            label="Russian Invasion of Ukraine 2022 - Equipment Losses"
            style="margin-bottom: -24px; max-width: 25em;"
            @input="setBreakdownSide"
          />
        </template>
        <v-expansion-panels accordion multiple v-model="openPanels">
          <info-panel />
          <categories-picker />
          <models-picker />
          <graph-config />
        </v-expansion-panels>
      </main-card>
    </template>
    <template>
      <vs-chart v-if="!breakdownSide" />
      <breakdown-chart v-else />
    </template>
  </main-container>
</template>

<script>
import { mapState } from 'vuex';
import MainContainer from '../components/MainContainer.vue';
import MainCard from '../components/MainCard.vue';
import CategoriesPicker from '../components/CategoriesPicker.vue';
import ModelsPicker from '../components/ModelsPicker.vue';
import GraphConfig from '../components/GraphConfig.vue';
import InfoPanel from '../components/InfoPanel.vue';
import VsChart from '../components/VsChart.vue';
import BreakdownChart from '../components/BreakdownChart.vue';

export default {
  name: 'VsView',
  components: {
    MainContainer,
    MainCard,
    CategoriesPicker,
    ModelsPicker,
    GraphConfig,
    InfoPanel,
    VsChart,
    BreakdownChart,
  },
  data: () => ({
    openPanels: [0],
    breakdownOptions: [
      { value: null, text: 'compare sides' },
      { value: 'Russia', text: 'Russian details' },
      { value: 'Ukraine', text: 'Ukrainian details' },
    ],
  }),
  computed: {
    ...mapState(['entries', 'breakdownSide']),
  },
  watch: {
    breakdownSide(to) {
      const url = new URL(window.location);
      if (to) {
        url.searchParams.set('side', to);
      } else {
        url.searchParams.delete('side');
      }
      window.history.replaceState({}, '', url);
    },
  },
  methods: {
    setBreakdownSide(val) {
      this.$store.commit('setBreakdownSide', val);
    },
  },
  mounted() {
    if (this.$route.query) {
      const { query } = this.$route;
      if (query.side) {
        this.$store.commit('setBreakdownSide', query.side);
      }
    }
  },
};
</script>

<style scoped>
.chart-container {
  height: 100%;
  max-width: 1280px;
  max-height: 640px;
  padding: 12px;
}
</style>
