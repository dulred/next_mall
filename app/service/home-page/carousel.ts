import api from '@/app/lib/axios';

export const carousel_list = ()=>{
    return api.get('/api/carousel');
}
export const carousel_upload = (formData:any)=>{
    return api.post('/api/carousel',formData);
}

export const carousel_update = (formData:any)=>{
    return api.put('/api/carousel',formData);
}

export const carousel_update_rank = (formData:any)=>{
    return api.put('/api/carousel/rank',formData);
}

export const carousel_delete = (id:string)=>{
    return api.delete(`/api/carousel/${id}`);
}