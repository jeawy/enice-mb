import { http } from '@/utils/request';

// 提交反馈
export function ApiPostRepair(payload) {
    return http.post('/prorepair/prorepair/', payload);
}
//查看反馈
export function ApiLookRepair(params) {
    return http.get('/prorepair/prorepair/', params)
};
//意见处理
export function ApiPutRepair(payload) {
    return http.post('/prorepair/prorepair/?put', payload);
}
//删除意见
export function ApiDeleteRepair(payload) {
    return http.post('/prorepair/prorepair/?delete', payload);
}