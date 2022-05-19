import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IdeaView from '../views/IdeaView.vue'
import GetIdeaView from '../views/GetIdeaView.vue'
import DoneView from '../views/DoneView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import CategoriesView from '../views/CategoriesView.vue'

import {auth} from "@/firebaseConfig.js"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/todo/:ideaId',
    name: 'ideaView',
    component: IdeaView,
    props:true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/todos/:categoryId',
    name: 'categoriesView',
    component: CategoriesView,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/todos',
    name: 'todos',
    component: GetIdeaView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/done',
    name: 'done',
    component: DoneView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '*',
    name: '404',
    component: NotFoundView,
    meta: {
      requiresAuth: false
    }
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  // const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (to.meta.requiresAuth && !auth.currentUser) {
    alert("Please log in. Thanks.")
    console.log("Redirect to the root page.")
    next('/') // redirect to the root page
    // could also just fire off a redirect login here, or redirect based on a meta property!
  } else {
    next()
  }
})


export default router
