// lib/api.ts
import axios from 'axios';
import store from '@/app/lib/store'; // 确保导入 store
import { setToken } from '@/app/lib/slices/authSlice';

const DEV = "http://127.0.0.1:5000"
const PRO = 'https://www.guagnximisa.top/'
const FLAG = true

const api = axios.create({
  baseURL: FLAG ? DEV : PRO, 
  timeout: 5000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const state = store.getState(); // 从 store 获取状态
    const token = state.auth.token; // 假设 auth 是你的 slice 名称
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const token = response.data?.result.token;
    
    if (token) {
      store.dispatch(setToken(token)); // 直接使用 store.dispatch
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
