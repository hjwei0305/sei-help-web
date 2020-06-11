import { request, constants, } from '@/utils';

const { communityService, } = constants;

/** 获取分类 */
export const getCategory = (params={}) => {
  return request.get(`${communityService}/category/tab/list`, params);;
}

/** 统计分类 */
export const getStaticCategory = (params={}) => {
  return request.get(`${communityService}/category/statis/list`, params);
}

/** 获取业务分类 */
export const getBusinessCategory = (tabId='') => {
  return request.get(`${communityService}/category/biz/list/${tabId}`);
}

/** 分页查询话题 */
export const getTopicsByPage = (params={}) => {
  return request({
    url: `${communityService}/index/`,
    method: 'GET',
    params,
  });
}

/** 获取本周热贴 */
export const getHotPosts= () => {
  return request.get(`${communityService}/topic/hot`);
}

/** 获取联系负责人 */
export const getContacts= () => {
  return request.get(`${communityService}/contractInfo/findAllUnfrozen`);
}
