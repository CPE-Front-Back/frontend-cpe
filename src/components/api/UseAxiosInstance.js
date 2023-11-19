import { useEffect } from 'react';
import { UseAuthContext } from '../../sections/auth/context/AuthProvider';
import { axiosInstance } from './api';

export default function UseAxiosInstance() {
  const { auth } = UseAuthContext;

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const accessToken = auth.token;
          prevRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);

  return axiosInstance;
}
