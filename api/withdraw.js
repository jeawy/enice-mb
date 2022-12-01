// 提现相关相关接口 
 
import { http } from '@/utils/request';
//   发起提现申请
export function requestWithdraw(data){
	return http.post('/withdraw/withdraw/',data)
}
  
// 获取 提现列表
export function getWithdraws(params) {
    return http.get('/withdraw/withdraw/', params)
}
 