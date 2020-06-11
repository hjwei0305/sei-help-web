import pwa from './en-US/pwa';
import login from './en-US/login';

export default {
  "app.request.error": "Interface request exception",
  "app.request.401": "Session exception",
  "app.request.401。message": "The current session timed out or failed, Please log in again",
  "app.loading": 'loading',
  ...pwa,
  ...login,
};
