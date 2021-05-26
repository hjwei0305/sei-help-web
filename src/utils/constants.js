import { base } from '../../public/app.config.json';
const { MOCK, NODE_ENV,  } = process.env;

const getServerPath = function () {
  if (NODE_ENV !== 'production') {
    if (MOCK === 'true') {
      return '/mocker.api';
    } else {
      return '/service.api'
    }
  }
  return '';
}

const BASE_DOMAIN = '/';

const GATEWAY = '';

const APP_BASE = base;

const LOCAL_PATH = NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH = getServerPath();

const CONST_GLOBAL = {
  SESSION: '_s',
  TOKEN_KEY: 'x-sid',
  AUTH: 'AUTH',
  POLICY: 'POLICY',
  CURRENT_LOCALE: 'sei_locale',
  CURRENT_USER: 'CURRENT_USER',
  FEATURE_KEY: 'FEATURE_KEY',
  AUTHORIZATION: 'Authorization',
  AUTHORYS: 'authorys',
};

const AUTH_POLICY = {
  USER: 'NormalUser',
  TENANT_ADMIN: 'TenantAdmin',
  ADMIN: 'GlobalAdmin',
};


/** 升级的常量放到这里 */

export const HOST = '';

export const CONTEXTPATH = NODE_ENV === 'development' ? '/api-gateway' : '/api-gateway'; // '/api-gateway';

export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const BASEURL = `${HOST}${CONTEXTPATH}`;

export const authApiUrl = "/sei-auth";
export const basicApiUrl = "/sei-basic";
export const communityService = `${SERVER_PATH}${BASEURL}/sei-help`;

export const SEIAUTHSERVICE = `${SERVER_PATH}${BASEURL}/sei-auth`;
export const SEIEDMSERVICE = `${SERVER_PATH}${BASEURL}/edm-service`;

/** 升级的常量放到这里 */

export {
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  AUTH_POLICY,
  CONST_GLOBAL,
};


