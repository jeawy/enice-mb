// 物业费相关接口 
 
import { http } from '@/utils/request';
// 更新账单金额：预付物业费、非固定收费等
export function updateFees(data){
	return http.post('/bill/order/',data)
}
  
// 获取账单（固定收费以及非固定收费 
export function getFeeBills(params) {
    return http.get('/bill/order/', params)
}

 