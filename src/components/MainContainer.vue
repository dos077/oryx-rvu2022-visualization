<template>
  <v-container :fluid="!isDesktop"
    :pa-0="!isDesktop" :my-4="isDesktop">
    <v-row :no-gutters="!isDesktop">
      <slot name="controls"></slot>
    </v-row>
    <v-row :no-gutters="!isDesktop">
      <slot></slot>
    </v-row>
    <v-row>
      <slot name="secondary"></slot>
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
