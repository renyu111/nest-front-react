import axios from 'axios';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
}

interface Statistics {
  totalUsers: number;
  totalFiles: number;
  totalStorage: number;
  recentUploads: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器
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

// 添加响应拦截器
api.interceptors.response.use(
  (response) => response,
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

export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data);
  },
  getFiles: () => api.get<UserProfile[]>('/files').then(res => res.data),
  deleteFile: (fileId: string) => api.delete(`/files/${fileId}`).then(res => res.data),
};

// 数据统计相关接口
export const dashboardApi = {
  getStatistics: () => api.get<Statistics>('/dashboard/statistics').then(res => res.data),
  getRecentActivities: () => api.get<Activity[]>('/dashboard/activities').then(res => res.data),
}; 