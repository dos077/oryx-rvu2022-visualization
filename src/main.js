import Vue from 'vue';
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

if (!window.ResizeObserver) window.ResizeObserver = Polyfill;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
