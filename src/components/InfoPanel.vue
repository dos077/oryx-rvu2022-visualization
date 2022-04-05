<template>
<v-overlay :value="infoOn">
  <v-card style="max-width: 40rem;" :light="!darkMode" ma-4>
    <v-card-title>
      Project Info
      <v-spacer />
      <v-btn icon @click="$store.commit('toggleInfo')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
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
        Source code:
        <a href="https://github.com/dos077/oryx-rvu2022-visualization" class="mx-2">
          github
        </a>
      </p>
    </v-card-text>
  </v-card>
</v-overlay>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InfoPanel',
  computed: {
    ...mapState(['infoOn', 'darkMode']),
  },
  methods: {
  },
};
</script>
