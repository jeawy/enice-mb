 
import {
	http
} from '@/utils/request';
// 查询预约列表
export function queryScheduleList() {
	return http.get('/book/books/')
}
//查看用户
export function search_users(params){
	return http.get('/users/list/',{params});
} 
// stripe信用卡支付
export const paystripe = data => http.post('/pay/stripe/', data)

const ADDRESS_PATH = '/address/addresses/'
// 查新地址列表
export const queryAddressList = () => http.get(ADDRESS_PATH)
// 添加地址
export const addAddress = data => http.post(ADDRESS_PATH, data)
// 删除地址
export const deleteAddress = data => http.delete(ADDRESS_PATH+'?delete', data)
// 获取省份列表
export const queryProvinceList = () => http.get('/area/get_provice_list/')
// 获取省份下城市列表
export const queryCityList = (params) => http.get('/area/get_city_list',params)
// 获取区县列表
export const queryCountyList = (params) => http.get('/area/get_county_list/',params)

// 个人信息
const memberInfo = '/users/list/?mine=';
// 个人信息修改
const memberUpdate = '/users/list/';

// 上传图片
const uploadImage = '/users/portrait_backimage/';
// 收货地址列表
//const addressList = '/tiny-shop/v1/member/address/index';
const addressList = '/address/addresses/'; 
// 获取我的订单
//const orderList = '/tiny-shop/v1/member/order/index';
const orderList = '/bill/bills/'; 
// 获取订单详情
const orderDetail = '/bill/bills/';
// 删除已关闭订单
//const orderDelete = '/tiny-shop/v1/member/order/delete';
const orderDelete = '/bill/bills/'
  
export {
	memberInfo,
	memberUpdate,   
	orderList, 
	orderDetail,
	orderDelete,   
	uploadImage, 
};
