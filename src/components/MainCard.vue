<template>
  <v-col>
    <v-card flat :outlined="isDesktop" style="min-width: 100%;">
      <v-toolbar
        v-if="title"
        flat
        :color="`${titleColor} ${darkMode ? 'darken' : 'lighten'}-3`"
      >
        <v-app-bar-nav-icon v-if="!noNav" @click="$emit('callDrawer')"></v-app-bar-nav-icon>
        <slot name="tool-title">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </slot>
        <v-spacer></v-spacer>
        <slot name="tool-actions"></slot>
      </v-toolbar>
      <v-expand-transition>
        <slot name="more-actions"></slot>
      </v-expand-transition>
      <slot></slot>
    </v-card>
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MainCard',
  props: ['titleColor', 'title', 'noNav'],
  computed: {
    ...mapState(['darkMode']),
    isDesktop() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
};
</script>
