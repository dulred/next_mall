import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认使用 localStorage
import { combineReducers } from 'redux';
import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';


// 配置 persist
const persistConfig = {
  key: 'root', // 存储的 key 名
  storage,
  whitelist: ['counter','auth'], // 指定要持久化的 slice（例如 'address'）
};

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建持久化 store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({   //取消数据序列化检测，注释会，会有报错，后期再优化，可以尝试注释这一个配置，然后看看如何解决
    serializableCheck: false
 })
});

// 定义 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 创建持久化存储器
export const persistor = persistStore(store);

export default store;
