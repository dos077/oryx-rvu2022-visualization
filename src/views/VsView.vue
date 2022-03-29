<template>
  <main-container>
    <template v-slot:secondary>
      <main-card
        title="Russian Invasion of Ukraine 2022"
        titleColor=""
        style="min-width: 100%;"
        class="my-4" :noNav="true"
      >
        <v-expansion-panels accordion multiple v-model="openPanels">
          <info-panel />
          <categories-picker />
          <models-picker />
          <graph-config />
        </v-expansion-panels>
      </main-card>
    </template>
    <template>
      <vs-chart />
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
import VsChart from '../components/VsChart.vue';
import InfoPanel from '../components/InfoPanel.vue';

export default {
  name: 'VsView',
  components: {
    MainContainer,
    MainCard,
    CategoriesPicker,
    ModelsPicker,
    GraphConfig,
    VsChart,
    InfoPanel,
  },
  data: () => ({
    openPanels: [0],
  }),
  computed: {
    ...mapState(['entries']),
  },
  methods: {
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
