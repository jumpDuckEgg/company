import request from '@/utils/request'

export function deleteFile(data) {
    return request({
        url: '/file/delete',
        method: 'delete',
        data: data
    })
}


export function getSQLFile(data) {
    return request({
        url: '/file/findPage',
        method: 'get',
        params: data
    })
}

export function addSQLFile() {
    return request({
        url: '/file/backUp',
        method: 'post',
        data:{}
    })
}

export function resetSQLFile(data) {
    return request({
        url: '/file/restore',
        method: 'post',
        params:data
    })
}