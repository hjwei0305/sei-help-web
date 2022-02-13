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
    title: '帮助中心',
    routes: [
      { _title: 'dashboard', path: '/dashboard', component: './Dashboard' },
      { _title: 'sso', path: '/sso', component: './Sso' },
      { _title: 'homepage', path: '/homepage', component: './HomePage' },
      { _title: 'usercenter', path: '/usercenter', component: './UserCenter' },
      // { title: '话题', path: '/article', component: './Article' },
      { _title: '贴子明细', path: '/postDetail/:id', component: './PostDetail' },
      { _title: '创建新帖', path: '/post/create', component: './Post' },
      { _title: '编辑新帖', path: '/post/edit/:id', component: './Post/edit' },
    ],
  },
];

