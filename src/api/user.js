import request from '@/utils/request'

export function getUsersByPage(data) {
    return request({
        url: '/user/findPage',
        method: 'get',
        params: data
    })
}

export function createdUser(data) {
    return request({
        url: '/user/create',
        method: 'post',
        data: {
            userName: data.name,
            password: data.password,
            type: data.type,
            remark: data.remark
        }
    })
}

export function removeUser(ids) {
    return request({
        url: '/user/delete',
        method: 'delete',
        data: ids
    })
}

export function modifyUser(data) {
    return request({
        url: '/user/update',
        method: 'put',
        data: data
    })
}
export function modifyPassword(password, userId) {
    return request({
        url: '/user/updatePassword',
        method: 'post',
        data: {
            password,
            userId
        }
    })
}
