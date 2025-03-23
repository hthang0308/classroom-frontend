import axiosClient from '@/utils/axiosClient';

interface HealthResponse {
  status: string;
}

const healthApi = {
  // Frontend health check - doesn't need to contact backend
  checkFrontendHealth: () => {
    return {
      status: 'ok',
      message: 'Frontend is running',
      timestamp: new Date().toISOString(),
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    };
  },
  
  // Backend health check - contacts the backend
  checkBackendHealth: () => axiosClient.get<string>('/health'),
};

export default healthApi; 