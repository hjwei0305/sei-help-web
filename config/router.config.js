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
    title: '业务页面',
    routes: [
      { title: 'dashboard', path: '/dashboard', component: './Dashboard' },
      { title: 'sso', path: '/sso', component: './Sso' },
      { title: 'homepage', path: '/homepage', component: './HomePage' },
      { title: 'usercenter', path: '/usercenter', component: './UserCenter' },
      // { title: '话题', path: '/article', component: './Article' },
      { title: '贴子明细', path: '/postDetail/:id', component: './PostDetail' },
      { title: '创建新帖', path: '/post/create', component: './Post' },
      { title: '编辑新帖', path: '/post/edit/:id', component: './Post/edit' },
    ],
  },
];

