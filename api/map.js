 
 
import { http } from '@/utils/request';
// 发起预约
export function postSchedule(data){
	return http.post('/book/books/',data)
}
  
//返回将坐标信息转换为地址信息
export function getAddress(params) {
    return http.get('/map/google/', params)
};

  
export {
    
};
