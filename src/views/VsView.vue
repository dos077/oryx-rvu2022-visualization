<template>
  <main-container>
    <template v-slot:secondary>
      <main-card
        title="Filters"
        titleColor="grey lighten-2"
        style="min-width: 100%;"
        class="my-4" :noNav="true"
      >
        <v-expansion-panels accordion multiple>
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

export default {
  name: 'VsView',
  components: {
    MainContainer,
    MainCard,
    CategoriesPicker,
    ModelsPicker,
    GraphConfig,
    VsChart,
  },
  data: () => ({
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
