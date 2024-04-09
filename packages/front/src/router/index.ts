import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/login/LoginPage.vue'
import HomePage from '@/views/home/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/problems',
    name: 'Problems',
    component: () => import('@/views/problem/archive/ProblemArchivePage.vue'),
  },
  {
    path: '/contest',
    name: 'Contest',
    component: () => import('@/views/contest/ContestPage.vue'),
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('@/views/forum/ForumPage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/AboutPage.vue'),
  },
  {
    path: '/problem',
    children: [
      {
        path: 'manage',
        name: 'ProblemManage',
        component: () => import('@/views/problem/manage/ProblemManagePage.vue'),
      },
      {
        path: 'solve/:qid',
        name: 'ProblemSolve',
        component: () => import('@/views/problem/solve/ProblemSolvePage.vue'),
      },
      {
        path: 'create',
        name: 'ProblemCreate',
        component: () => import('@/views/problem/create/ProblemCreatePage.vue'),
      },
    ],
  },
  {
    path: '/person/setting',
    name: 'PersonSetting',
    component: () => import('@/views/person/setting/PersonSettingPage.vue'),
  },
  {
    path: '/bulletin',
    children: [
      {
        path: '',
        name: 'Bulletin',
        component: () => import('@/views/bulletin/BulletinPage.vue'),
      },
      {
        path: 'item/:id',
        name: 'BulletinItem',
        component: () => import('@/views/bulletin/BulletinItemPage.vue'),
      },
      {
        path: 'setting',
        name: 'BulletinSetting',
        component: () => import('@/views/bulletin/BulletinSettingPage.vue'),
      },
      {
        path: 'create',
        name: 'BulletinCreate',
        component: () => import('@/views/bulletin/BulletinCreatePage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes],
})

router.beforeEach((to, _, next) => {
  if (to.name !== 'Login' && !localStorage.getItem('token')) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
