import { request, userUtils, constants, } from '@/utils';

const { communityService, } = constants;
const { getCurrentUser, } = userUtils;

/** 获取我发的帖子 */
export const getPosts = (params) => {
  const user = getCurrentUser();
  return request({
    method: 'GET',
    url: `${communityService}/user/${user.userId}/topics`,
    params,
  });
}

/** 获取我收藏的帖子 */
export const getCollects = (params) => {
  const user = getCurrentUser();
  return request({
    url: `${communityService}/user/${user.userId}/collects`,
    params,
    method: 'GET',
  });
}

/** 获取我的评论 */
export const getComments = (params) => {
  const user = getCurrentUser();
  return request({
    url: `${communityService}/user/${user.userId}/comments`,
    method: 'GET',
    params,
  });
}
