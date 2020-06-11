/*
* @Author: zp
* @Date:   2019-08-09 13:28:03
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-27 09:11:39
*/
import { request as fetchHelper, constants, } from '@/utils';

const { communityService, } = constants;

export function deleteById(param=''){
    return fetchHelper.delete(`${communityService}/delete`, param);
}

/** 保存biz业务分类 */
export function saveBiz(params = {}) {
    return fetchHelper.postJson(`${communityService}/category/biz/save`,JSON.stringify(params));
}

/** 保存话题分类 */
export function saveTab(params = {}) {
    return fetchHelper.postJson(`${communityService}/category/tab/save`,JSON.stringify(params));
}
