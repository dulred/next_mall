import api from '@/app/lib/axios';

export const member_all = () => {
    return api.post('/api/users/all',{
        page:1,
        pageSize:10
    });
}
