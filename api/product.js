 
 
import { http } from '@/utils/request';
// 发起预约
export function postSchedule(data){
	return http.post('/book/books/',data)
}
 
// 找阿姨列表
const categoryList = '/product/productsapi/';
//返回轨迹信息
export function categoryListMapApi(params) {
    return http.get('/product/productsmapapi/', params)
};

export function getNoticesApi(params, isLogin=false) {
    if (!isLogin  ){
        return http.get('/product/anonymous/', params) 
    }
    else{
        return http.get('/product/products/', params) 
    }
    
};

  
export {
    categoryList,  
};
