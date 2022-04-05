<template>
  <v-menu offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" plain :large="isDesktop">
        Dates<v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-date-picker
      :value="dateRange"
      @input="updateRange"
      range
    >
      <v-btn
        text
        color="red"
        @click="resetRange"
      >
        All
      </v-btn>
      <v-btn
        text
        @click="setOneMonth"
      >
        1m
      </v-btn>
      <v-btn
        text
        @click="setTwoWeeks"
      >
        2w
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import { updated } from '../data/oryxDb';

export default {
  name: 'DateMenu',
  computed: {
    ...mapState(['dateRange']),
    isDesktop() { return this.$vuetify.breakpoint.mdAndUp; },
  },
  methods: {
    updateRange(val) {
      const dates = val.sort((a, b) => new Date(a) - new Date(b));
      this.$store.commit('setDateRange', dates);
    },
    setTwoWeeks() {
      const minDate = new Date(updated);
      minDate.setDate(minDate.getDate() - 14);
      const maxDate = new Date(updated);
      this.$store.commit(
        'setDateRange',
        [minDate.toISOString().slice(0, 10), maxDate.toISOString().slice(0, 10)],
      );
    },
    setOneMonth() {
      const minDate = new Date(updated);
      minDate.setMonth(minDate.getMonth() - 1);
      const maxDate = new Date(updated);
      this.$store.commit(
        'setDateRange',
        [minDate.toISOString().slice(0, 10), maxDate.toISOString().slice(0, 10)],
      );
    },
    resetRange() {
      this.$store.commit('resetDateRange');
    },
  },
};
</script>
