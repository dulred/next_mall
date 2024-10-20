import api from '@/app/lib/axios';

export const goods_spec_bycategoryId = (specData:any) => {
    return api.post('/api/goods/spec/categoryType',specData);
}

export const goods_spec_add_random = (goodsId:any) => {
    return api.get(`/api/goods/spec/${goodsId}`);
}

export const goods_spec_delete = (goodsId:any) => {
    return api.delete(`/api/spec/${goodsId}`);
}


export const goods_spec_update = (specData:any) => {
    return api.put(`/api/spec`,specData);
}

export const goods_sku_generate = (goodsId:any) => {
    return api.get(`/api/spec/generate/${goodsId}`);
}