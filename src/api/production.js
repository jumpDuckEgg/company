import request from '@/utils/request'

export function addProduction(data) {
    return request({
        url: '/item_info/create',
        method: 'post',
        data: data
    })
}

export function deleteProduction(data) {
    return request({
        url: '/item_info/delete',
        method: 'delete',
        data: data
    })
}
export function updateProduction(data) {
    return request({
        url: '/item_info/update',
        method: 'put',
        data: data
    })
}

export function getProduction(data) {
    return request({
        url: '/item_info/findPage',
        method: 'get',
        params: data
    })
}