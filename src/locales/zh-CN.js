import pwa from './zh-CN/pwa';
import login from './zh-CN/login';

export default {
  "app.request.error":"接口请求异常",
  "app.request.401": "会话异常",
  "app.request.401.message": "当前会话超时或失效，请重新登录",
  "app.loading": '加载中...',
  ...pwa,
  ...login,
};
