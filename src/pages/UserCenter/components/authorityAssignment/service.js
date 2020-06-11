import { request as fetchHelper, constants, } from '@/utils';
const { communityService, } = constants;

export function save(params = {}) {
    return fetchHelper.postJson(`${communityService}/userAuthority/save`,JSON.stringify(params));
}

export function deleteByAccount(account=''){
    return fetchHelper.delete(`${communityService}/userAuthority/delete/${account}`);
}

export function findAll(){
    return fetchHelper.delete(`${communityService}/userAuthority/findAll`);
}

export function findAllAuthority(){
    return fetchHelper.get(`${communityService}/userAuthority/findAllAuthority`);
}
