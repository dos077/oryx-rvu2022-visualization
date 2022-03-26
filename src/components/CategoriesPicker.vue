<template>
  <v-expansion-panel key="Categories">
    <v-expansion-panel-header>
      Category
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-btn @click="removeAll" icon color="red">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn @click="addAll" icon color="green">
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <v-chip-group column>
        <v-chip
          v-for="category in categoryOptions"
          :key="category"
          class="blue lighten-2"
          :outlined="!categories.includes(category)"
          @click="toggleCategory(category)"
        >
          {{ category }}
        </v-chip>
      </v-chip-group>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex';
import { getCategories } from '../data/oryxDb';

export default {
  name: 'CategoriesPicker',
  data: () => ({
    categoryOptions: getCategories(),
  }),
  computed: {
    ...mapState(['categories']),
  },
  methods: {
    toggleCategory(category) {
      if (this.categories.includes(category)) {
        this.$store.commit('removeCategory', category);
      } else {
        this.$store.commit('addCategory', category);
      }
      this.$store.commit('updateEntries');
    },
    removeAll() {
      this.categories.forEach((c) => {
        this.$store.commit('removeCategory', c);
      });
      this.$store.commit('updateEntries');
    },
    addAll() {
      this.categoryOptions.forEach((c) => {
        this.$store.commit('addCategory', c);
      });
      this.$store.commit('updateEntries');
    },
  },
};
</script>
