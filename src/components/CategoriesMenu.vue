<template>
  <v-menu offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" plain :large="isDesktop">
        categories<v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-chip-group column>
          <v-chip
            v-for="status in statusOptions"
            :key="status"
            class="blue lighten-1"
            :outlined="!statuses.includes(status)"
            @click="toggleStatus(status)"
          >
            {{ status }}
          </v-chip>
        </v-chip-group>
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
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import { getCategories } from '../data/oryxDb';

export default {
  name: 'CategoriesPicker',
  data: () => ({
    categoryOptions: getCategories(),
    statusOptions: ['destroyed', 'damaged', 'captured', 'abandoned'],
  }),
  computed: {
    ...mapState(['categories', 'statuses']),
    isDesktop() { return this.$vuetify.breakpoint.mdAndUp; },
  },
  watch: {
    categories(to) {
      const url = new URL(window.location);
      if (to.length < this.categoryOptions.length) {
        url.searchParams.set('categories', to.join('~'));
      } else {
        url.searchParams.delete('categories');
      }
      window.history.replaceState({}, '', url);
    },
    statuses(to) {
      const url = new URL(window.location);
      if (to.length < 4) {
        url.searchParams.set('statuses', to.join('~'));
      } else {
        url.searchParams.delete('statuses');
      }
      window.history.replaceState({}, '', url);
    },
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
    toggleStatus(status) {
      if (this.statuses.includes(status)) {
        this.$store.commit('removeStatus', status);
      } else {
        this.$store.commit('addStatus', status);
      }
      this.$store.commit('updateEntries');
    },
  },
  mounted() {
    if (this.$route.query) {
      const { query } = this.$route;
      let change = false;
      if (query.categories) {
        change = true;
        const categories = query.categories.split('~').map((c) => c.trim());
        this.$store.commit('clearCategory');
        categories.forEach((cat) => {
          if (this.categoryOptions.includes(cat)) this.$store.commit('addCategory', cat);
        });
      }
      if (query.statuses) {
        change = true;
        const statuses = query
          .statuses.split('~')
          .map((s) => s.trim());
        this.$store.commit('clearStatus');
        statuses.forEach((status) => {
          if (this.statusOptions.includes(status)) this.$store.commit('addStatus', status);
        });
      }
      if (change) {
        this.$store.commit('updateEntries');
      }
    }
  },
};
</script>
