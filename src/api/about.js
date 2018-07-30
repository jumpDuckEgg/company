import request from '@/utils/request'

export function getAboutInfo() {
    return request({
        url: '/about_info/findAbout',
        method: 'get'
    })
}

export function modifyAboutInfo(data) {
    return request({
        url: '/about_info/update',
        method: 'put',
        data: data
    })
}
