// 互助相关接口 
 
import { http } from '@/utils/request';
//   
export function updateExchanges(data){
	return http.post('/exchanges/exchanges/',data)
}
  
// 获取 
export function getExchanges(params) {
    return http.get('/exchanges/exchanges/', params)
}

// 广场匿名获取 
export function getAnonymousExchanges(params) {
    return http.get('/exchanges/anonymous/', params)
}


// 获取账单 
export function getExchangeBills(params) {
    return http.get('/exchanges/order/', params)
}
 