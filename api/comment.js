// 评论相关接口 
 
import { http } from '@/utils/request';
//   
export function addCommentApi(data){
	return http.post('/comment/comment/',data)
}

export function deleteCommentApi(data){
	return http.post('/comment/comment/',data)
}
 
// 匿名获取 
export function getCommentsApi(params) {
    return http.get('/comment/anonymous/', params)
}

 