/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-05 10:55:33
*/
import { utils } from 'suid';
import { constants, } from "@/utils";

const { communityService, } = constants;

const { request } = utils;

const contextPath = '/contractInfo';

/** 保存 */
export async function save (data) {
  const url = `${communityService}${contextPath}/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del (params) {
  const url = `${communityService}${contextPath}/delete/${params.id}`
  return request.delete(url);
}
