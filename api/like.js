// 点赞或者取消赞
import { http } from '@/utils/request';
//  点赞或者取消赞 
export function updateLikeApi(data){
	return http.post('/like/like/',data)
}
  
// 获取点赞列表 
export function getLikesApi(params) {
    return http.get('/like/anonymous/', params)
}
  
// 获取阅读数
export function getCountApi(params) {
    return http.get('/like/count/', params)
}
 