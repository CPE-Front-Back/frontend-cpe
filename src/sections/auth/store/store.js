import instance from '../../../components/api/api';

export const login = async (loginData) => {
  try {
    const response = await instance.post(`auth/login`, loginData);
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

export const getUserData = async (userName) => {
  try {
    const response = await instance.get(`users/${userName}`);
    return response;
  } catch (error) {
    console.log('Error en login', error);
    throw error;
  }
};

/*
export const login = (loginData) => {
  console.log('loginData', loginData);
};
*/
