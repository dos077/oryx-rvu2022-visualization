<template>
  <v-expansion-panel key="models" expaned>
    <v-expansion-panel-header>Graph Configs</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col>
          <span class="mr-4">Losses Count</span>
          <v-btn-toggle mandatory color="blue">
            <v-btn small
              @click="$store.commit('setCountMethod', 'total')"
            >
              total
            </v-btn>
            <v-btn small
              @click="$store.commit('setCountMethod', 'daily')"
            >
              daily
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col>
          <span class="mr-4">Moving Average</span>
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
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
