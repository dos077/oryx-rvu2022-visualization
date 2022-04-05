<template>
  <main-card>
    <v-btn @click="armourPreset" plain :large="isDesktop" :disabled="armourSelected">
      Armours
    </v-btn>
    <v-btn @click="artilleryPreset" plain :large="isDesktop" :disabled="artillerySelected">
      Artilleries
    </v-btn>
    <v-btn @click="airPreset" plain :large="isDesktop" :disabled="airSelected">
      Air & Anti-Air
    </v-btn>
    <v-btn @click="logiPreset" plain :large="isDesktop" :disabled="logiSelected">
      Logistics
    </v-btn>
  </main-card>
</template>

<script>
import { mapState } from 'vuex';
import MainCard from './MainCard.vue';

const armours = ['Tanks', 'Armoured Fighting Vehicles', 'Infantry Fighting Vehicles', 'Armoured Personnel Carriers'];
const artilleries = ['Towed Artillery', 'Self-Propelled Artillery', 'Multiple Rocket Launchers'];
const airs = ['Surface-To-Air Missile Systems', 'Radars', 'Aircraft', 'Helicopters'];
const logis = ['Trucks, Vehicles and Jeeps', 'Engineering Vehicles'];

export default {
  name: 'QuickSets',
  components: { MainCard },
  computed: {
    ...mapState(['categories']),
    armourSelected() {
      return this.categories.length === armours.length
        && armours.every((cat) => this.categories.includes(cat));
    },
    artillerySelected() {
      return this.categories.length === artilleries.length
        && artilleries.every((cat) => this.categories.includes(cat));
    },
    airSelected() {
      return this.categories.length === airs.length
        && airs.every((cat) => this.categories.includes(cat));
    },
    logiSelected() {
      return this.categories.length === logis.length
        && logis.every((cat) => this.categories.includes(cat));
    },
    isDesktop() { return this.$vuetify.breakpoint.mdAndUp; },
  },
  methods: {
    armourPreset() {
      this.$store.commit('clearCategory');
      armours.forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
    artilleryPreset() {
      this.$store.commit('clearCategory');
      artilleries.forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
    airPreset() {
      this.$store.commit('clearCategory');
      airs.forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
    logiPreset() {
      this.$store.commit('clearCategory');
      logis.forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
  },
};
</script>
