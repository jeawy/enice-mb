/**
 *@des 社区管理 
 */
  
 import { http } from '@/utils/request';
// 获取我的房产列表
export function getMyRooms(params){
	return http.get('/building/room/?minerooms',params)
}
 
 
// 管理我的关注列表：关注、取消关注
export function manageProprietorCommunities(data){
	return http.post('/community/proprietor/', data)
}
 
 