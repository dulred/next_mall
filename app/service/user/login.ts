import api from '@/app/lib/axios';

export const login = (username:string,password:string)=>{
    return api.post( '/api/login', {username:username,password:password});
}