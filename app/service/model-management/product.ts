import api from '@/app/lib/axios';

export const goods_all = () => {
    return api.post('/api/goods/all',{
        page:1,
        pageSize:10
    });
}

export const tmp_goods_upload =(formData:any)=>{
    return api.post('/api/upload/tmp/main',formData);
}


export const goods_add =(goodsData:any)=>{
    return api.post('/api/goods',goodsData);
}

export const goods_byId =(id:string)=>{
    return api.get(`/api/goods/${id}`);
}

export const goods_update =(goodsData:any)=>{
    return api.put(`/api/goods`,goodsData);
}

export const goods_delete =(id:string)=>{
    return api.delete(`/api/goods/${id}`);
}


