import useHealthCheck from '@/hooks/useHealthCheck';
import React, { createContext, ReactNode, useContext } from 'react';

interface HealthCheckContextType {
  isBackendHealthy: boolean;
  error: string | null;
}

const HealthCheckContext = createContext<HealthCheckContextType>({
  isBackendHealthy: true,
  error: null,
});

export const useHealthCheckContext = () => useContext(HealthCheckContext);

interface HealthCheckProviderProps {
  children: ReactNode;
}

export const HealthCheckProvider: React.FC<HealthCheckProviderProps> = ({ children }) => {
  const healthCheckData = useHealthCheck();

  return <HealthCheckContext.Provider value={healthCheckData}>{children}</HealthCheckContext.Provider>;
};

export default HealthCheckProvider;
