import api from '@/app/lib/axios';

export const goods_sku_bycategoryId = (skuData:any) => {
    return api.post('/api/goods/sku',skuData);
}

export const goods_sku_update = (skuData:any) => {
    return api.put(`/api/sku`,skuData);
}

export const tmp_goods_sku_upload = (skuData:any) => {
    return api.post(`/api/upload/tmp/sku`,skuData);
}
