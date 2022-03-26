<template>
  <v-expansion-panel key="models" expaned>
    <v-expansion-panel-header>Models</v-expansion-panel-header>
    <v-expansion-panel-content>
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
          class="yellow lighten-2"
          :outlined="!models.includes(model)"
          @click="toggleModel(model)"
        >
          {{ model }}
        </v-chip>
      </v-chip-group>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex';
import { getModels } from '../data/oryxDb';

export default {
  name: 'CategoriesPicker',
  data: () => ({
  }),
  computed: {
    ...mapState(['categories', 'models']),
    modelOptions() {
      const options = [];
      this.categories.forEach((c) => {
        options.push(...getModels(null, c));
      });
      return options;
    },
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
