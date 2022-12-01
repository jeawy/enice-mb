// 收支记录相关接口 
 
import { http } from '@/utils/request';
 
// 获取个人收支统计
export function getIncomesApi(params) {
    return http.get('/incomes/incomes/?total=1', params)
}

export function getIncomesListApi(params) {
    return http.get('/incomes/incomes/', params)
}
