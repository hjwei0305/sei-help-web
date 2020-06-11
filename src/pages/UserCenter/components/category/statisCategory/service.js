import { request as fetchHelper, constants, } from '@/utils';

const { communityService, } = constants;

export function save(params = {}) {
    return fetchHelper.postJson(`${communityService}/category/statis/save`,JSON.stringify(params));
}

export function list(param = {}){
    return fetchHelper.get(`${communityService}/category/statis/list`, param);
}
