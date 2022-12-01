import { http } from '@/utils/request';
 
export function ApiPostCollection(payload) {
    return http.post('/collection/collection/', payload);
} 
export function ApigetCollections(params) {
    return http.get('/collection/collection/', params)
}
 