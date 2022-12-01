 
 
import { http } from '@/utils/request';
// 提交订单
export function postPaidOrder(data){
	return http.post('/paidservice/order/',data)
}
  
//返回有偿服务列表
export function getPaidservice(params) {
    return http.get('/paidservice/paidservice/', params)
}

export function getPaidMoney(params) {
    return http.get('/paidservice/order/', params)
}
 