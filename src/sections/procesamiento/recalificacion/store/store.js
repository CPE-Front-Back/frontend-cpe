import { axiosInstance } from '../../../../components/api/api';

export const getAllRequestersInRoom = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`solicitante/todosEnAula/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en getAllRequestersInRoom', error);
    throw error;
  }
};

export const getRequesterInRoomById = async (requesterId, codCurso) => {
  try {
    const response = await axiosInstance.get(`solicitante/enAula/numeroId/${requesterId}/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en FindRequesterInRoomById', error);
    throw error;
  }
};

export const getActByRequesterId = async (requesterId) => {
  try {
    const response = await axiosInstance.get(`acta/cod_solicitante/${requesterId}`);
    return response;
  } catch (error) {
    console.log('Error en getActByRequesterId', error);
    throw error;
  }
};

export const getAssignmentByRequesterId = async (requesterId) => {
  try {
    const response = await axiosInstance.get(`asignacion/solicitante/${requesterId}`);
    return response;
  } catch (error) {
    console.log('Error en getAssignmentByRequesterId', error);
    throw error;
  }
};

export const insertRequalification = async (requalification) => {
  try {
    const response = await axiosInstance.post(`recalificacion/`, requalification);
    return response;
  } catch (error) {
    console.log('Erroe en insertRequalification', error);
    throw error;
  }
};
