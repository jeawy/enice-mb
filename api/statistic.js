/**
 *@des 活动
 *@author  zjw
 *@blog  
 *@date  2022年2月19日12:45:49
 */
 import { http } from '@/utils/request';
//统计“我的”页面角标数字
export function ApiStatCount(params) {
    return http.get('/statistic/stat/', params)
} 
//首页图片角标数字
export function ApiStatIconsCount(params) {
    return http.get('/statistic/anonymous/', params)
} 