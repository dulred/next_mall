import api from '@/app/lib/axios';

export const goods_detail_bycategoryId = (detailData:any) => {
    return api.post('/api/goods/detail',detailData);
}

export const goods_detail_update = (detailData:any) => {
    return api.put(`/api/detail`,detailData);
}
export const goods_detail_add_one = (goodsId:any) => {
    return api.get(`/api/goods/detail/${goodsId}`);
}

export const tmp_goods_detail_upload = (detailData:any) => {
    return api.post(`/api/upload/tmp/detail`,detailData);
}

export const goods_detail_delete = (id:any) => {
    return api.delete(`/api/detail/${id}`);
}