import api from '@/app/lib/axios';

export const member_all = () => {
    return api.post('/api/users/all',{
        page:1,
        pageSize:10
    });
}

export const member_update = (userData:any) => {
    return api.put('/api/user',userData);
}

