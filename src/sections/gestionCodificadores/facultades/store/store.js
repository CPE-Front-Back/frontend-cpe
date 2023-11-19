import { axiosInstance } from '../../../../components/api/api';

export const getFaculties = async () => {
  try {
    const response = await axiosInstance.get(`facultad/`);
    return response;
  } catch (error) {
    console.log('Error en getFaculties', error);
    throw error;
  }
};

export const getFacultiesById = async (facultyCode) => {
  try {
    const response = await axiosInstance.get(`facultad/${facultyCode}`);
    return response;
  } catch (error) {
    console.log('Error en getFacultiesById', error);
    throw error;
  }
};

export const insertFaculty = async (faculty) => {
  try {
    const response = await axiosInstance.post(`facultad/`, faculty);
    return response;
  } catch (error) {
    console.log('Error en insertFaculty', error);
    throw error;
  }
};

export const updateFaculty = async (Faculty) => {
  try {
    const response = await axiosInstance.put(`facultad/`, Faculty);
    return response;
  } catch (error) {
    console.log('Error en updateFaculty', error);
    throw error;
  }
};

export const deleteFaculty = async (faculty) => {
  try {
    const response = await axiosInstance.delete(`facultad/${faculty.nomb_facultad}`);
    return response;
  } catch (error) {
    console.log('Error en deleteFaculty', error);
    throw error;
  }
};
