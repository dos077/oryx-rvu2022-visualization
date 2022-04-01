<template>
  <v-expansion-panel key="models" expaned>
    <v-expansion-panel-header>Graph Configs</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row justify="start">
        <v-col cols="auto" v-if="!breakdownSide">
          <span class="mr-4">Losses Count</span>
          <v-btn-toggle color="blue" :value="countToggle">
            <v-btn
              @click="$store.commit('setCountMethod', 'daily')"
            >
              daily
            </v-btn>
            <v-btn
              @click="$store.commit('setCountMethod', 'total')"
            >
              total
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto" v-if="!breakdownSide">
          <span class="mr-4">Moving Average</span>
          <v-btn-toggle mandatory color="yellow darken-3" :value="smaToggle">
            <v-btn
              @click="$store.commit('setSmaPeriod', 3)"
            >
              3
            </v-btn>
            <v-btn
              @click="$store.commit('setSmaPeriod', 7)"
            >
              7
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto" v-if="breakdownSide">
          <span class="mr-4">Breakdown By</span>
          <v-btn-toggle color="blue" :value="keyToggle">
            <v-btn
              v-for="key in keyOptions" :key="key"
              @click="$store.commit('setBreakdownKey', key)"
            >
              {{ key }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto" v-if="breakdownSide">
          <span class="mr-4">Normalize Data</span>
          <v-btn-toggle color="yellow" :value="breakdownPercent ? 1 : 0">
            <v-btn
              @click="$store.commit('setBreakdownPercent', false)"
            >
              false
            </v-btn>
            <v-btn
              @click="$store.commit('setBreakdownPercent', true)"
            >
              true
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="dateRangeText"
                label="Date Range"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                append-icon="mdi-restore"
                @click:append="resetRange"
              ></v-text-field>
            </template>
            <v-date-picker
              :value="dateRange"
              @input="updateRange"
              range
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="dateMenu = false"
              >
                Close
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'GraphConfig',
  data: () => ({
    dateMenu: false,
    keyOptions: ['status', 'category', 'model'],
  }),
  computed: {
    ...mapState(['dateRange', 'countMethod', 'smaPeriod', 'breakdownSide', 'breakdownKey', 'breakdownPercent']),
    dateRangeText() {
      return `${this.dateRange[0]} ~ ${this.dateRange[1]}`;
    },
    countToggle() {
      if (this.countMethod === 'daily') return 0;
      return 1;
    },
    smaToggle() {
      if (this.smaPeriod === 3) return 0;
      return 1;
    },
    keyToggle() {
      const { keyOptions, breakdownKey } = this;
      return keyOptions.findIndex((k) => k === breakdownKey);
    },
  },
  watch: {
    countMethod(to) {
      const url = new URL(window.location);
      if (to === 'daily') {
        url.searchParams.delete('count');
      } else {
        url.searchParams.set('count', to);
      }
      window.history.replaceState({}, '', url);
    },
    smaPeriod(to) {
      const url = new URL(window.location);
      if (to === 3) {
        url.searchParams.delete('sma');
      } else {
        url.searchParams.set('sma', to);
      }
      window.history.replaceState({}, '', url);
    },
    breakdownKey(to) {
      const url = new URL(window.location);
      if (to === 'status') {
        url.searchParams.delete('key');
      } else {
        url.searchParams.set('key', to);
      }
      window.history.replaceState({}, '', url);
    },
    breakdownPercent(to) {
      const url = new URL(window.location);
      if (to) {
        url.searchParams.set('percent', 1);
      } else {
        url.searchParams.delete('percent');
      }
      window.history.replaceState({}, '', url);
    },
  },
  methods: {
    updateRange(val) {
      const dates = val.sort((a, b) => new Date(a) - new Date(b));
      this.$store.commit('setDateRange', dates);
    },
    resetRange() {
      this.$store.commit('resetDateRange');
    },
  },
  mounted() {
    if (this.$route.query) {
      const { query } = this.$route;
      let change = false;
      if (query.count) {
        change = true;
        this.$store.commit('setCountMethod', query.count);
      }
      if (query.sma) {
        change = true;
        this.$store.commit('setSmaPeriod', query.sma);
      }
      if (query.key) {
        this.$store.commit('setBreakdownKey', query.key);
      }
      if (query.percent) {
        this.$store.commit('setBreakdownPercent', true);
      }
      if (change) {
        this.$store.commit('updateEntries');
      }
    }
  },
};
</script>
