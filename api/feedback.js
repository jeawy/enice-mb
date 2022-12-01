import { http } from '@/utils/request';

// 提交反馈
export function ApiPostFeedback(payload) {
    return http.post('/feedback/feedback/', payload);
}
//查看反馈
export function ApiLookFeedback(params) {
    return http.get('/feedback/feedback/', params)
};
//意见处理
export function ApiPutFeedback(payload) {
    return http.post('/feedback/feedback/?put', payload);
}
//删除意见
export function ApiDeleteFeedback(payload) {
    return http.post('/feedback/feedback/?delete', payload);
}