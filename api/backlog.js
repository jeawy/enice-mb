import { http } from '@/utils/request';
 
export function ApiPostBacklogs(payload) {
    return http.post('/backlog/backlogs/', payload);
} 
export function ApiLookBacklogs(params) {
    return http.get('/backlog/backlogs/', params)
}; 
export function ApiPutBacklogs(payload) {
    return http.post('/backlog/backlogs/?put', payload);
} 
export function ApiDeleteBacklogs(payload) {
    return http.post('/backlog/backlogs/?delete', payload);
}