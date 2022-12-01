import { http } from '@/utils/request';
//添加积分
export function Add_Coin(payload) {
    return http.post('/webcoin/webcoin/', payload)
}
//查看积分
export function Look_Coin(params) {
    return http.get('/webcoin/webcoin/', params)
}
//生成邀请码
export function ApiPostInviteCode(payload) {
    return http.post('/webcoin/invite/', payload)
}
//返回邀请码
export function ApiGetInviteCode(params) {
    return http.get('/webcoin/invite/', params)
}