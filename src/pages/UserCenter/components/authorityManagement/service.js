/*
* @Author: zp
* @Date:   2019-08-09 13:28:03
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-05 10:04:49
*/
import { request as fetchHelper, constants, } from '@/utils';
const { communityService, } = constants;

/** 获取数据字字段类别 */
export function findAllDataDict(param=''){
    return fetchHelper.get(`${communityService}/dataDict/findAll`, param);
}

/** 新增数据字典类别 */
export function saveDataDict(param=''){
    return fetchHelper.postJson(`${communityService}/dataDict/save`, param);
}

/** 删除数据字典类别 */
export function deleteDataDict(id=''){
    return fetchHelper.delete(`${communityService}/dataDict/delete/${id}`);
}

/** 根据字段类别代码，获取字典项目 */
export function getDataDictItems(param=''){
    return fetchHelper.get(`${communityService}/dataDictItem/getDataDictItems`, param);
}

/** 新增数据字典项目 */
export function saveDictItem(param=''){
    return fetchHelper.postJson("/dataDict/saveDictItem", param);
}

/** 删除数据字典类别 */
export function deleteDictItem(id=''){
    return fetchHelper.delete(`${communityService}/dataDict/deleteDictItem/${id}`);
}
