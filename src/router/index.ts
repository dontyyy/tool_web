import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    // alias: ['/login1','/login2'],   // 别名，可以定义很多个
    component: () => import('@/views/login.vue'),
    // 重定向
    // redirect: '/welcome',
    // redirect: to => {
    //   return {
    //     path: '/',
    //     query: {
    //       name: '登录111'
    //     }
    //   }
    // },
    children: [
      // {
      //   path: '/welcome',
      //   name: 'welcome',
      //   component: () => import('../views/welcome.vue')    // component: import('../views/reg.vue')
      // }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home.vue'),
    children: []
  },
  {
    path: '/three',
    name: 'three',
    component: () => import('@/views/three/three.vue'),
    children: []
  },
  {
    path: '/three1',
    name: 'three1',
    component: () => import('@/views/three/three_1.vue'),
    children: []
  },
  {
    path: '/three2',
    name: 'three2',
    component: () => import('@/views/three/three_2.vue'),
    children: []
  },
  {
    path: '/three3',
    name: 'three3',
    component: () => import('@/views/three/three_3.vue'),
    children: []
  },
  {
    path: '/three4',
    name: 'three4',
    component: () => import('@/views/three/three_4.vue'),
    children: []
  },
  {
    path: '/three5',
    name: 'three5',
    component: () => import('@/views/three/three_5.vue'),
    children: []
  },
  {
    path: '/three6',
    name: 'three6',
    component: () => import('@/views/three/three_6.vue'),
    children: []
  },
  {
    path: '/three7',
    name: 'three7',
    component: () => import('@/views/three/three_7.vue'),
    children: []
  },
  {
    path: '/three8',
    name: 'three8',
    component: () => import('@/views/three/three_8.vue'),
    children: []
  },
  {
    path: '/three9',
    name: 'three9',
    component: () => import('@/views/three/three_9.vue'),
    children: []
  },
  {
    path: '/three10',
    name: 'three10',
    component: () => import('@/views/three/three_10.vue'),
    children: []
  },
  {
    path: '/echart',
    name: 'echart',
    component: () => import('@/views/echart/echart.vue'),
    children: []
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router