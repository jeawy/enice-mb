/**
 *@des 社区管理 
 */
  
 import { http } from '@/utils/request';
// 获取列表
export function getAnonymousCommunities(params){
	return http.get('/community/anonymous/',params)
}

// 获取列表附近的小区列表
export function getNearbyCommunitiesApi(params){
	return http.get('/community/anonymous/',params)
}

// 获取我的关注列表
export function getProprietorCommunities(params){
	return http.get('/community/proprietor/',params)
}
 
// 管理我的关注列表：关注、取消关注
export function manageProprietorCommunities(data){
	return http.post('/community/proprietor/', data)
}
 
 