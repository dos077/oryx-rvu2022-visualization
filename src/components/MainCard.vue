<template>
  <v-card flat :outlined="isDesktop" :tile="!isDesktop">
    <v-toolbar flat :color="`${titleColor} lighten-4`">
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
</template>

<script>
export default {
  name: 'MainCard',
  props: ['titleColor', 'title', 'noNav'],
  computed: {
    isDesktop() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
};
</script>
