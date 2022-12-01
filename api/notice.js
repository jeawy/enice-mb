// 消息相关接口 
 
import { http } from '@/utils/request';
//   
 
// 获取 
export function getNotices(params) {
    return http.get('/notice/notice/', params)
}
 
// 删除或者设置为已读
export function updateNotice(data) {
    return http.post('/notice/notice/',data)
}


// 订阅微信通知
export function subNotice(data) {
    // 仅微信小程序 
    // #ifdef MP-WEIXIN
    return http.post('/notice/wx/',data)
    // #endif 
}
 
// 发布通知
export function publishNotice(data) {
    return http.post('/product/products/',data)
}

// 获取通知
export function manageNotice(params) {
    return http.get('/product/products/',params)
}
 