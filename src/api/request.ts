import { Base64 } from 'js-base64';
const baseURL = 'https://meituan.thexxdd.cn/api'
const getToken = (): string => {
    return uni.getStorageSync('token') + ':' || ''
}
export const request = (url: string, data: {} = {}, method: 'GET' | 'POST' = 'GET') => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseURL + url,
            data,
            method,
            header: {
                Authorization: 'Basic ' + Base64.encode(getToken())
            },
            success: (res: any) => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else if (res.statusCode === 401) {
                    // 表示没有权限
                    console.log(res)
                    // 跳转到登录界面
                    uni.navigateTo({
                        url:'/pages/login/login'
                    })
                    reject(res)
                } else if (res.statusCode === 500) {
                    uni.showToast({
                        title: '服务器发生未知错误',
                        icon: 'none'
                    })
                    reject(res)
                } else if (res.statusCode === 202) {
                    uni.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                    reject(res)
                }
                else {
                    reject(res)
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}