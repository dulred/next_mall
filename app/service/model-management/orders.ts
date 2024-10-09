import api from '@/app/lib/axios';

export const orders_all = () => {
    return api.post('/api/orders/all',{
        page:1,
        pageSize:10
    });
}

