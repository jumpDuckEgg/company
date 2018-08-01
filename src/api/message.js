import request from '@/utils/request'

export function addMessage(data) {
    return request({
        url: '/message_info/create',
        method: 'post',
        data: data
    })
}

export function deleteMessage(data) {
    return request({
        url: '/message_info/delete',
        method: 'delete',
        data: data
    })
}
export function updateMessage(data) {
    return request({
        url: '/message_info/update',
        method: 'put',
        data: data
    })
}

export function getMessage(data) {
    return request({
        url: '/message_info/findPage',
        method: 'get',
        params: data
    })
}
