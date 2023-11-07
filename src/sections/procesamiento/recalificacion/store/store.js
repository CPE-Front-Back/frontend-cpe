import instance from '../../../../components/api/api';

export const getRequesterInRoomById = async (requesterId, codCurso) => {
  try {
    const response = await instance.get(`solicitante/enAula/numeroId/${requesterId}/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en FindRequesterInRoomById', error);
    throw error;
  }
};

export const getActByRequesterId = async (requesterId) => {
  try {
    const response = await instance.get(`acta/cod_solicitante/${requesterId}`);
    return response;
  } catch (error) {
    console.log('Error en getActByRequesterId', error);
    throw error;
  }
};

export const getAssignmentByRequesterId = async (requesterId) => {
  try {
    const response = await instance.get(`asignacion/solicitante/${requesterId}`);
    return response;
  } catch (error) {
    console.log('Error en getAssignmentByRequesterId', error);
    throw error;
  }
};
