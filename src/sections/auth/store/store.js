import { axiosForAuth } from '../../../components/api/api';

export const login = async (loginData) => {
  try {
    const response = await axiosForAuth.post(`auth/login`, loginData);
    return response;
  } catch (error) {
    if (!error?.response) {
      console.log('No hay respuesta del server');
    } else if (error.response?.status === 401) {
      console.log('la respuesta en el store', error.response.data);
    }
    return error;
  }
};
