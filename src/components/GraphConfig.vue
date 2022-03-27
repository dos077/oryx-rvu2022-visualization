<template>
  <v-expansion-panel key="models" expaned>
    <v-expansion-panel-header>Graph Configs</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col>
          <p class="mr-4">Losses Count</p>
          <v-btn-toggle mandatory color="blue">
            <v-btn small
              @click="$store.commit('setCountMethod', 'daily')"
            >
              daily
            </v-btn>
            <v-btn small
              @click="$store.commit('setCountMethod', 'total')"
            >
              total
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col>
          <p class="mr-4">Moving Average</p>
          <v-btn-toggle mandatory color="yellow darken-3">
            <v-btn small
              @click="$store.commit('setSmaPeriod', 3)"
            >
              3
            </v-btn>
            <v-btn small
              @click="$store.commit('setSmaPeriod', 7)"
            >
              7
            </v-btn>
          </v-btn-toggle>
        </v-col>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Date Range"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
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
        <v-col>
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
  }),
  computed: {
    ...mapState(['dateRange']),
    dateRangeText() {
      return `${this.dateRange[0]} ~ ${this.dateRange[1]}`;
    },
  },
  methods: {
    updateRange(val) {
      this.$store.commit('setDateRange', val);
    },
  },
};
</script>
