import healthApi from '@/api/health';
import { useEffect, useState } from 'react';

interface HealthCheckResult {
  isBackendHealthy: boolean;
  error: string | null;
}

export const useHealthCheck = (): HealthCheckResult => {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthApi.checkBackendHealth();
        setIsBackendHealthy(true);
        setError(null);
      } catch (err) {
        console.error('Backend health check failed:', err);
        setIsBackendHealthy(false);
        setError('Unable to connect to backend service');
      }
    };

    // Check health immediately
    checkHealth();

    // Also set up an interval to check periodically (every 5 minutes)
    const intervalId = setInterval(checkHealth, 5 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return { isBackendHealthy, error };
};

export default useHealthCheck; 