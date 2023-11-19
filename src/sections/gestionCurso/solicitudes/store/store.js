import { axiosInstance } from '../../../../components/api/api';

export const getSolicitantesByCurso = async (codCurso, confirmado) => {
  try {
    const response = await axiosInstance.get(
      `solicitante/hechoSolicitudesEnCurso/${codCurso}/confirmado/${confirmado}`
    );
    return response;
  } catch (error) {
    console.log('Error en getSolicitantesByCurso', error);
    throw error;
  }
};

export const getSolicitudesByCurso = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`solicitud/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en getSolicitudesByCurso', error);
    throw error;
  }
};

export const eliminarSolicitudesBySolicitante = async (codSolicitante) => {
  try {
    const response = await axiosInstance.delete(`solicitud/solicitante/${codSolicitante}`);
    return response;
  } catch (error) {
    console.log('Error en eliminarSolicitudesBySolicitante', error);
    throw error;
  }
};

export const deleteRequester = async (requester) => {
  try {
    const response = await axiosInstance.delete(`solicitante/${requester.cod_solicitante}`);
    return response;
  } catch (error) {
    console.log('Error en deleteRequester', error);
    throw error;
  }
};
