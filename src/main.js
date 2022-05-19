import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from "@/firebaseConfig";

import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)

Vue.config.productionTip = false
let app

auth.onAuthStateChanged(()=>{
  if (!app) {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }  
});

