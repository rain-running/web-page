import { createRouter, createWebHistory } from 'vue-router'
//import ChatWeb from './views/ChatWeb.vue'

const routes = [
  {
    path: '/',
    name: 'ChatWeb',
    //component: ChatWeb
    redirect: '/my-project'

  },
  {
    path: '/my-project',
    component: () => import('./views/ChatWeb.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router