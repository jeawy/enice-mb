/**
 *@des 登记管理 
 */
 
import { http } from '@/utils/request';
// 发起登记
export function postSchedule(data){
	return http.post('/book/books/',data)
}

// 发起登记\ 
export function postRecord(data){
	return http.post('/record/record/',data)
}

// 获得用户登记情况
export function getUserInfos(params){
    return http.get('/record/userinfo/',params)
}

// 用户登记
export function fillupRecord(data, isLogin){
	if (isLogin){
		// 登录用户进行登记
		return http.post('/record/userinfo/',data)
	}
	else{
		// 匿名用户进行登记
		return http.post('/record/userinfo/anonymous/',data)
	}
	
}


// 用户登记
export function getExcel(params){ 
	// 匿名用户进行登记
	return http.get('/record/userinfo/anonymous/',params) 
}


// 获取列表
export function getAnonymousRecord(params){
	return http.get('/record/anonymous/',params)
}

// 获取列表
export function getRecord(params, hasLogin = true){
	if(hasLogin){
		return http.get('/record/record/',params)
	}
	else{
		return http.get('/record/anonymous/',params)
	}
	
}

 