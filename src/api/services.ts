import axios from 'axios';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/users/login', data).then((res) => res.data),
  register: (data: RegisterRequest) =>
    api.post<RegisterResponse>('/users/register', data).then((res) => res.data),
};

// 文件上传 API
export const uploadApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getFiles: () => api.get<ImageItem[]>('/upload'),
  deleteFile: (fileName: string) => api.delete(`/upload/${fileName}`),
};

// 添加 ImageItem 接口
export interface ImageItem {
  fileName: string;
  fileType: string;
  url: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

// 数据统计相关接口
export const dashboardApi = {
  getStatistics: () => api.get<Statistics>('/dashboard/statistics').then(res => res.data),
  getRecentActivities: () => api.get<Activity[]>('/dashboard/activities').then(res => res.data),
};

export default api; 