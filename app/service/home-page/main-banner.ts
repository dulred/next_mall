import api from '@/app/lib/axios';

export const sw_all = ()=>{
    return api.get( '/api/sw');
}

export const sw_upload = (formData:any)=>{
     return api.post('/api/sw', formData);
}

export const sw_update = (formData:any)=>{
    return api.put('/api/sw', formData);
}

export const sw_update_status = (formData:any)=>{
    return api.put('/api/sw/selected', formData);
}