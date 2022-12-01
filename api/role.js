/**
 *@des 角色管理 
 */
 
import { http } from '@/utils/request';
 
// 获得用户角色
export function getRole(params){
    return http.get('/role/role/',params)
}
 