<template>
  <v-menu offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" plain :large="isDesktop">
        models<v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-btn @click="removeAll" icon color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn @click="addAll" icon color="green">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-chip-group column>
          <v-chip
            v-for="(model, i) in modelOptions"
            :key="i"
            :class="`yellow ${darkMode? 'darken' : 'lighten'}-3`"
            :outlined="!models.includes(model)"
            @click="toggleModel(model)"
          >
            {{ model }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import { getModels } from '../data/oryxDb';

export default {
  name: 'ModelsPicker',
  data: () => ({
  }),
  computed: {
    ...mapState(['categories', 'models', 'darkMode', 'breakdownSide']),
    modelOptions() {
      const options = [];
      this.categories.forEach((c) => {
        options.push(...getModels(this.breakdownSide, c));
      });
      return options;
    },
    isDesktop() { return this.$vuetify.breakpoint.mdAndUp; },
  },
  methods: {
    toggleModel(model) {
      if (this.models.includes(model)) {
        this.$store.commit('removeModel', model);
      } else {
        this.$store.commit('addModel', model);
      }
      this.$store.commit('updateEntries');
    },
    removeAll() {
      this.models.forEach((c) => {
        this.$store.commit('removeModel', c);
      });
      this.$store.commit('updateEntries');
    },
    addAll() {
      this.modelOptions.forEach((m) => {
        this.$store.commit('addModel', m);
      });
      this.$store.commit('updateEntries');
    },
  },
};
</script>
