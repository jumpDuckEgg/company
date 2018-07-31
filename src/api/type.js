import request from '@/utils/request'

export function addType(data) {
    return request({
        url: '/dic_info/create',
        method: 'post',
        data: data
    })
}

export function deleteType(data) {
    return request({
        url: '/dic_info/delete',
        method: 'delete',
        data: data
    })
}
export function updateType(data) {
    return request({
        url: '/dic_info/update',
        method: 'put',
        data: data
    })
}

export function getType(data) {
    return request({
        url: '/dic_info/findPage',
        method: 'get',
        params: data
    })
}