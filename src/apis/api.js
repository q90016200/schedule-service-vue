// 封裝axios，設置攔截器，統一管理錯誤
import axios from 'axios'

axios.defaults.timeout = 5000;
const instance = axios.create({
    baseURL: import.meta.env.API_DOMAIN
});

// request 攔截器
instance.interceptors.request.use((config) => {
    // Do something before request is sent
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

// 異常處理
// Add a response interceptor - response 攔截器
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response.status);
    return response
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    let response = error.response
    console.log(`response status:${response.status}`);
    /*

    switch (error.response.status) {
        // 如果響應中的 http code 為 401，那麼則此用戶可能 token 失效了之類的
        case 401:
            // 判斷一下響應中是否有 token，如果有就直接使用此 token 替換掉本地的 token。你可以根據你的業務需求自己編寫更新 token 的邏輯
            var token = response.headers.authorization
            if (token) {
                // 如果 header 中存在 token，那麼觸發 refreshToken 方法，替換本地的 token
                this.$store.dispatch('refreshToken', token)
            } else {
                return this.$store.dispatch('logout')
            }
        break
        // // 如果響應中的 http code 為 400，那麼就彈出一條錯誤提示給用戶
        // case 400:
        //     return this.$Message.error(error.response.data.error)
        // break
    }
    */
    return Promise.reject(error);
});

// export default function (method, url, data = null) {
//     method = method.toLowerCase();
//     if (method == 'post') {
//         return instance.post(url, data)
//     } else if (method == 'get') {
//         return instance.get(url, { params: data })
//     } else if (method == 'delete') {
//         return instance.delete(url, { params: data })
//     } else if (method == 'put') {
//         return instance.put(url, data)
//     } else {
//         console.error('未知的 method' + method)
//     }
// }


// export function defaultsHeadersCommon(token) {
//     if (token) {
//         axios.defaults.headers.common['Authorization'] = { 'Authorization': `bearer ${token}` };
//     } else {
//         axios.defaults.headers.common['Authorization'] = "";
//     }
// }


export const queryJob = data => instance.get("/job", data)