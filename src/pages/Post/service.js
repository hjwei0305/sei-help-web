import { request, constants, } from '@/utils';

const { communityService, } = constants;

/** 创建话题 */
export const createTopic = (data = {}) => {
  return request.post(`${communityService}/topic/save`, data);
}

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

/** 根据ID获取话题 */
export const findById = (params) => {
  return request({
    url: `${communityService}/topic/findOne`,
    method: 'GET',
    params,
  });
}

/** 获取帖子明细 */
export const getPostDetail = (params) => {
  return request({
    method: 'GET',
    url: `${communityService}/topic/detail`,
    params,
  });
}
