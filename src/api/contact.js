import request from '@/utils/request'

export function getCompanyInfo() {
    return request({
        url: '/conpany_info/findConpanyInfo',
        method: 'get'
    })
}

export function modifyCompanyInfo(data) {
    return request({
        url: '/conpany_info/update',
        method: 'put',
        data: data
    })
}
