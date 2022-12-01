import { http } from '@/utils/request';
 
//查看手机号码
export function getCars(params) {
    return http.get('/car/car/', params)
}

export function getCarPhone(params) {
    return http.get('/car/anonymous/', params)
}
//查看绑卡
export function bindCars(data) {
    return http.post('/car/car/', data);
}
//删除绑定
export function unbindCars(data) {
    return http.post('/car/car/', data);
}