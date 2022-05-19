<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/todos">Todos</router-link> |
      <router-link to="/done">Done</router-link>

    <login-button/>
    </nav>
    <router-view/>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          Built by Regina Ni. <br>
          See the <a href="https://github.com/reginanee"> GitHub repository</a> for more info.
        </p>
      </div>
    </footer>
    
  </div>
</template>

<script>
import { auth } from "@/firebaseConfig";

import LoginButton from './components/LoginButton.vue'
export default {
  components: { LoginButton },
  beforeCreate: function() {

    auth.getRedirectResult().then(result=>{
      if (result.user) {
        console.log('result: ', result)
        this.$router.push("/todos")
      } 
    }).catch(() => {
      this.$router.push("/itsAllForNothing")
    })
  }
}
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: #2c3e50;
}

nav {
  text-align: center;
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
