import api from '@/app/lib/axios';

export const goods_new = ()=>{
    return api.get('/api/ntk/goods/new');
}

export const goods_jinpin = ()=>{
    return api.get('/api/ntk/goods/jinpin');
}

export const goods_top = ()=>{
    return api.get('/api/ntk/goods/top');
}

export const goods_list_byCategoryId = (id:string)=>{
    return api.get(`/api/goods/categoryType/${id}`);
}

export const update_goods_config = (configData:any)=>{
    return api.put('/api/goods/config',configData);
}