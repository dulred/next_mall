import api from '@/app/lib/axios';

export const goods_styles_bycategoryId = (skuData:any) => {
    return api.post('/api/goods/style/categoryType',skuData);
}

export const goods_styles_update = (skuData:any) => {
    return api.put('/api/goodsStyle',skuData);
}
export const goods_styles_add_random= (goodsId:any) => {
    return api.get(`/api/goodsStyle/${goodsId}`);
}

export const goods_styles_delete= (id:any) => {
    return api.delete(`/api/goodsStyle/${id}`);
}
