<template>
  <v-container :fluid="!isDesktop"
    style="max-width: 1280px; margin: 0 auto; padding: 12px 20px;"
    :pa-0="!isDesktop">
    <v-row :no-gutters="!isDesktop">
      <slot name="secondary"></slot>
    </v-row>
    <v-row :no-gutters="!isDesktop">
      <slot></slot>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'MainContainer',
  computed: {
    isDesktop() { return this.$vuetify.breakpoint.mdAndUp; },
  },
};
</script>
