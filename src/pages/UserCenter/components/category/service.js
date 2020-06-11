/*
* @Author: zp
* @Date:   2019-11-01 15:39:52
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-27 09:10:19
*/
import { request as fetchHelper, constants, } from '@/utils';

const { communityService, } = constants;

export function deleteById(id=''){
    return fetchHelper.delete(`${communityService}/category/delete/${id}`);
}
