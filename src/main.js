import Clipboard from 'v-clipboard';
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Clipboard);

new Vue({
  render: h => h(App),
}).$mount('#app');
