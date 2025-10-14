import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/pages/HomeView.vue'
import ChatroomView from '@/pages/ChatroomView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Home", component: HomeView },
    { path: "/chat/:roomId", name: "ChatRoom", component: ChatroomView, props: true },
  ],
})

export default router
