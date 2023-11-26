import { axiosInstance } from '../../../components/api/api';

export const getAllUsersExceptCurrent = async (userName) => {
  try {
    const response = await axiosInstance.get(`users/exceptCurrent/${userName}`);
    return response;
  } catch (error) {
    console.log('Error en getAllUsersExceptCurrent', error);
    throw error;
  }
};

export const getUserByUserName = async (userName) => {
  try {
    const response = await axiosInstance.get(`users/${userName}`);
    return response;
  } catch (error) {
    console.log('Error en getUserByUserName', error);
    throw error;
  }
};

export const getInsertedUserByUserName = async (userName) => {
  try {
    const response = await axiosInstance.get(`users/inserted/${userName}`);
    return response;
  } catch (error) {
    console.log('Error en getInsertedUserByUserName', error);
    throw error;
  }
};

export const getAllRoles = async () => {
  try {
    const response = await axiosInstance.get(`roles/`);
    return response;
  } catch (error) {
    console.log('Error en getAllRoles', error);
    throw error;
  }
};

export const insertUser = async (user) => {
  try {
    const response = await axiosInstance.post(`users/`, user);
    return response;
  } catch (error) {
    console.log('Error en insertUser', error);
    throw error;
  }
};

export const insertUserRole = async (userRol) => {
  try {
    const response = await axiosInstance.post(`userRol/`, userRol);
    return response;
  } catch (error) {
    console.log('Error en insertUserRole', error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const response = await axiosInstance.put(`users/`, user);
    return response;
  } catch (error) {
    console.log('Error en updateUser', error);
    throw error;
  }
};

export const getUserRoleByUserAndRol = async (cod_usuario, cod_rol) => {
  try {
    const response = await axiosInstance.get(`userRol/user/${cod_usuario}/rol/${cod_rol}`);
    return response;
  } catch (error) {
    console.log('Error en getUserRoleByUserAndRol', error);
    throw error;
  }
};

export const updateUserRol = async (userRol) => {
  try {
    const response = await axiosInstance.put(`userRol/`, userRol);
    return response;
  } catch (error) {
    console.log('Error en updateUserRol', error);
    throw error;
  }
};

export const deleteUser = async (user) => {
  try {
    const response = await axiosInstance.delete(`users/${user.cod_usuario}`);
    return response;
  } catch (error) {
    console.log('Error en deleteUser', error);
    throw error;
  }
};
