import { request as fetchHelper, constants, } from '@/utils';
const { communityService, } = constants;

export function save(params = {}) {
    return fetchHelper.postJson(`${communityService}/contractInfo/save`,JSON.stringify(params));
}

export function deleteById(id=''){
    return fetchHelper.delete(`${communityService}/contractInfo/delete/${id}`);
}

export function list(param = {}){
    return fetchHelper.get(`${communityService}/contractInfo/findAll`, param);
}
