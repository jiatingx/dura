import Vue from "vue"
import App from "./App.vue"
import router from "./router"

import { createPinia, PiniaVuePlugin } from "pinia"

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
import "uno.css"

new Vue({
  router,
  pinia,
  // i18n,
  render: h => h(App),
}).$mount("#app")
