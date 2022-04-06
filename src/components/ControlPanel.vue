<template>
<div style="min-width: 100%">
  <main-card>
    <v-tabs :value="tabSelected">
      <v-tab @click="$store.commit('setBreakdownSide', null)">
        Comparison
      </v-tab>
      <v-tab @click="$store.commit('setBreakdownSide', 'Russia')">
        Russian Losses
      </v-tab>
      <v-tab @click="$store.commit('setBreakdownSide', 'Ukraine')">
        Ukrainian Losses
      </v-tab>
    </v-tabs>
  </main-card>
  <main-card>
    <categories-menu />
    <models-menu />
    <date-menu />
    <graph-menu />
  </main-card>
</div>
</template>

<script>
import { mapState } from 'vuex';
import MainCard from './MainCard.vue';
import CategoriesMenu from './CategoriesMenu.vue';
import ModelsMenu from './ModelsMenu.vue';
import GraphMenu from './GraphMenu.vue';
import DateMenu from './DateMenu.vue';

export default {
  name: 'ControlPanel',
  components: {
    MainCard, CategoriesMenu, ModelsMenu, GraphMenu, DateMenu,
  },
  computed: {
    ...mapState(['breakdownSide']),
    tabSelected() {
      if (this.breakdownSide === 'Russia') return 1;
      if (this.breakdownSide === 'Ukraine') return 2;
      return 0;
    },
  },
  methods: {
  },
};
</script>
