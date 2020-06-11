import { request, constants, } from '@/utils';

const { communityService, } = constants;

/** 获取帖子明细 */
export const getPostDetail = (params) => {
  return request({
    method: 'GET',
    url: `${communityService}/topic/detail`,
    params,
  });
}

/** 创建评论 */
export const createComment = (data={}) => {
  return request.post(`${communityService}/comment/save`, data);
}

/** 更新评论 */
export const updateComment = (data={}) => {
  return request.post(`${communityService}/comment/update`, data);
}

/** 删除评论 */
export const deleteComment = (params={}) => {
  return request.delete(`${communityService}/comment/delete/${params.id}`);
}

/** 点赞 */
export const likeComment = (params={}) => {
  return request.post(`${communityService}/comment/like`, params);
}

/** 取消点赞 */
export const dislikeComment = (params={}) => {
  return request.post(`${communityService}/comment/dislike`, params);
}

/** 评论加精 */
export const goodComment = (params={}) => {
  return request.post(`${communityService}/comment/good/${params.id}`);
}

  /** 删除话题 */
export const deleteTopic = (params={}) => {
  return request.delete(`${communityService}/topic/delete/${params.id}`);
}

/** 置顶话题 */
export const topTopic = (params={}) => {
  return request.post(`${communityService}/topic/top/${params.id}`);
}

/** 置精话题 */
export const goodTopic = (params={}) => {
  return request.post(`${communityService}/topic/good/${params.id}`);
}

/** 收藏话题 */
export const saveCollect = (params={}) => {
  return request.post(`${communityService}/collect/save`, params);
}

/** 删除收藏 */
export const delCollect = (params={}) => {
  return request.delete(`${communityService}/collect/deleteByTopicId/${params.topicId}`);
}
