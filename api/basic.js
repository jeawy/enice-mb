 
import { http } from '@/utils/request';   
  
// 支付
const payCreate = '/bill/bills/';

// 充值配置
const wechatConfig = '/tiny-shop/v1/third-party/wechat-js-sdk';

// 公告 
// 公告详情 

export function getWeixinPhoneNumber(data) {
    return http.post('/users/wx/', data)
};

export {     
    payCreate, 
    wechatConfig 
};
