import api from '@/app/lib/axios';

export const admin_all = () => {
    return api.post('/api/admin/all',{
        page:1,
        pageSize:10
    });
}

