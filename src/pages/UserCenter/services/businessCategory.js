/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-05 12:18:20
*/
import { utils } from 'suid';
import { constants, } from "@/utils";

const { communityService, } = constants;

const { request } = utils;

const contextPath = '/category';

/** 保存主题分类 */
export async function saveParent(data) {
  const url = `${communityService}${contextPath}/tab/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}


/** 保存业务分类 */
export async function saveChild(data) {
  const url = `${communityService}${contextPath}/biz/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除主题分类 */
export async function delParentRow(params) {
  const url = `${communityService}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 删除业务分类 */
export async function delChildRow(params) {
  const url = `${communityService}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}


