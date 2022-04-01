<template>
  <v-expansion-panel key="Categories">
    <v-expansion-panel-header>
      Project Info
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <p>
        Interactive graph of equipment losses in Russian invasion of Ukraine 2022. Data from <a href="https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html">Oryx Blog</a>. This is a hobyist project, data is not officially provided or verified.
      </p>
      <p>
        Donate to humanitarian aid for Ukraine:
        <a href="https://help.gov.ua/en" class="mx-2">
          help.gov.ua
        </a>
      </p>
      <p>
        Support Oryx:
        <a href="https://www.patreon.com/oryxspioenkop" class="mx-2">
          patreon.com
        </a>
      </p>
      <p>
        Source code:
        <a href="https://github.com/dos077/oryx-rvu2022-visualization" class="mx-2">
          github
        </a>
      </p>
      <p>
        A few presets for quick breakdowns according to military bracnhes
      </p>
      <p>
        <v-btn @click="armourPreset" class="ma-2">Armours</v-btn>
        <v-btn @click="artilleryPreset" class="ma-2">Artilleries</v-btn>
        <v-btn @click="airPreset" class="mxa-2">Air & Anti-Air</v-btn>
        <v-btn @click="logiPreset" class="ma-2">Logistics</v-btn>
      </p>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'InfoPanel',
  methods: {
    armourPreset() {
      this.$store.commit('clearCategory');
      ['Tanks', 'Armoured Fighting Vehicles', 'Infantry Fighting Vehicles', 'Armoured Personnel Carriers'].forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
    artilleryPreset() {
      this.$store.commit('clearCategory');
      ['Towed Artillery', 'Self-Propelled Artillery', 'Multiple Rocket Launchers'].forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
    airPreset() {
      this.$store.commit('clearCategory');
      ['Surface-To-Air Missile Systems', 'Radars', 'Aircraft', 'Helicopters'].forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
    logiPreset() {
      this.$store.commit('clearCategory');
      ['Logistics Trains', 'Trucks, Vehicles and Jeeps', 'Engineering Vehicles'].forEach((cat) => {
        this.$store.commit('addCategory', cat);
      });
      this.$store.commit('updateEntries');
    },
  },
};
</script>
