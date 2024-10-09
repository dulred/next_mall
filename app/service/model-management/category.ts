import api from '@/app/lib/axios';

export const category_list = ()=>{
    return api.get('/api/category');
}

export const category_byId = (id:string)=>{
    return api.get(`/api/category/${id}`);
}

export const category_add = (categoryData:any)=>{
    return api.post('/api/category',categoryData);
}

export const category_first = ()=>{
    return api.get('/api/category/first');
}

export const category_second = ()=>{
    return api.get('/api/category/second');
}

export const category_delete = (id:string)=>{
    return api.delete(`/api/category/${id}`);
}

export const category_update = (categoryData:any)=>{
    return api.put('/api/category',categoryData);
}