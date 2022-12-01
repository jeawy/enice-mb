// 互助相关接口 
 
import { http } from '@/utils/request';
//   
export function updateAid(data){
	return http.post('/aid/aid/',data)
}
  
// 获取 
export function getAids(params) {
    return http.get('/aid/aid/', params)
}

// 广场匿名获取 
export function getAnonymousAids(params) {
    return http.get('/aid/anonymous/', params)
}


// 获取账单 
export function getAidBills(params) {
    return http.get('/aid/order/', params)
}
 