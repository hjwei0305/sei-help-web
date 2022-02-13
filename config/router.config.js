export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    title: '用户登录',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { title: '登录', path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { title: '帮助中心', path: '/dashboard', component: './Dashboard' },
      { title: '帮助中心', path: '/sso', component: './Sso' },
      { title: '帮助中心', path: '/homepage', component: './HomePage' },
      { title: '帮助中心', path: '/usercenter', component: './UserCenter' },
      // { title: '话题', path: '/article', component: './Article' },
      { title: '帮助中心', path: '/postDetail/:id', component: './PostDetail' },
      { title: '帮助中心', path: '/post/create', component: './Post' },
      { title: '帮助中心', path: '/post/edit/:id', component: './Post/edit' },
    ],
  },
];

