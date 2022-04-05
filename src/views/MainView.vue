<template>
  <main-container>
    <template v-slot:controls>
      <control-panel />
    </template>
    <template>
      <combo-chart />
    </template>
    <template v-slot:secondary>
      <quick-sets />
    </template>
  </main-container>
</template>

<script>
import { mapState } from 'vuex';
import MainContainer from '../components/MainContainer.vue';
import ComboChart from '../components/ComboChart.vue';
import ControlPanel from '../components/ControlPanel.vue';
import QuickSets from '../components/QuickSets.vue';

export default {
  name: 'VsView',
  components: {
    MainContainer,
    ComboChart,
    ControlPanel,
    QuickSets,
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
    ...mapState(['entries', 'breakdownSide', 'darkMode']),
    isDesktop() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
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
    darkMode: {
      immediate: true,
      handler(to) {
        this.$vuetify.theme.dark = to;
      },
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
