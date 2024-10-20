import api from '@/app/lib/axios';

export const goods_thumb_bycategoryId = (thumbData:any) => {
    return api.post('/api/goods/thumb',thumbData);
}

export const goods_thumb_update = (thumbData:any) => {
    return api.put(`/api/thumb`,thumbData);
}
export const goods_thumb_add_one = (goodsId:any) => {
    return api.get(`/api/goods/thumb/${goodsId}`);
}

export const goods_thumb_delete = (id:any) => {
    return api.delete(`/api/thumb/${id}`);
}

export const tmp_goods_thumb_upload = (thumbData:any) => {
    return api.post(`/api/upload/tmp/thumb`,thumbData);
}
