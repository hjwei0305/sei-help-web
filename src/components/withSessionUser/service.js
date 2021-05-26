import { request, constants, userUtils, } from "@/utils";
const { communityService, SEIAUTHSERVICE, SEIBASICSERVICE } = constants;

const { getCurrentUser, } = userUtils;

/** 单点接口 */
export const checkAuth = (params={}) => {
  return request.post(`${communityService}/ssoLogin`, params);
}

/**
 * 单点登录获取用户信息
 * @param {object} data 参数
 */
export const getUserByXsid = params =>
  request.get(`${SEIAUTHSERVICE}/auth/getSessionUser?sid=${params.sid}`, params, false, {
    headers: {
      'x-sid': params.sid,
    }
  });

  export const getAuthorizedFeatures = () => {
    const user = getCurrentUser();
    return request.get(`${SEIBASICSERVICE}/user/getUserAuthorizedFeatureMaps?userId=${user.userId}`);
  }
