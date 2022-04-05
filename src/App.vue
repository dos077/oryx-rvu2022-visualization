<template>
  <v-app>
    <v-app-bar app absolute hide-on-scroll>
      <v-toolbar-title>
        2022 Russian invasion of Ukraine
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon  @click="$store.commit('toggleInfo')">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>

      <v-btn icon @click="$store.commit('toggleDarkMode')">
        <v-icon>
          mdi-brightness-6
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
    <info-panel />
  </v-app>
</template>

<script>
import InfoPanel from './components/InfoPanel.vue';

export default {
  name: 'App',
  components: { InfoPanel },
  data: () => ({
    //
  }),
};
</script>
