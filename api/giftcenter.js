import { http } from '@/utils/request';
//查看礼品详情
export function look_GiftDetail(params){
	return http.get('/gift/gift/',params)
}
//查看里边
export function getGifts(params){
	return http.get('/gift/anonymous/',params)
}
//查看礼品规格
export function look_GiftSpecifications(params){
	return http.get('/gift/specifications/',params)
}
//添加订单
export function Create_Order(payload){
	return http.post('/gift/bill/?',payload)
}
//查看订单详情
export function ApiLookOrder(params){
	return http.get('/gift/bill/?', params)
}
//删除订单
export function ApiDeleteOrder(payload){
	return http.post('/gift/bill/',payload)
}
//更新快递信息
export function Update_Logistics(payload){
	return http.post('/gift/bill/?put',payload)
}
//查看礼品分类
export function look_GiftCategory(params){
	return http.get('/gift/category/',params)
}
//按照年度，月度里程排行榜赠送礼物
export function give_Gift(payload){
	return http.post('/gift/gift/',payload)
}
//查看月度和年度礼品榜
export function get_GiftRank(params){
	return http.get('/gift/gift/',params)
}
//新增商品的购买方式
export function ApiPutPurchase(payload){
	return http.post('/gift/purchase_way/',payload)
}
//查询订单状态数量
export function ApiGetOrderNum(params){
	return http.get('/gift/bill/?',params)
}
//查询对应状态下的订单详情
export function ApiGetOrder(params){
	return http.get('/gift/bill/?',params)
}
//查询是否有新品上架
export function ApiGetNewTag(params){
	return http.get('/gift/gift/?newtag', params)
}