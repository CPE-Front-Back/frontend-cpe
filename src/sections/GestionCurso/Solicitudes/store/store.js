import instance from '../../../../components/api/api';

export const getSolicitantesByCurso = async (codCurso, confirmado) => {
  try {
    const response = await instance.get(`solicitante/hechoSolicitudesEnCurso/${codCurso}/confirmado/${confirmado}`);
    return response;
  } catch (error) {
    console.log('Error en getSolicitantesByCurso', error);
    throw error;
  }
};

export const getSolicitudesByCurso = async (codCurso) => {
  try {
    const response = await instance.get(`solicitud/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en getSolicitudesByCurso', error);
    throw error;
  }
};

export const eliminarSolicitudesBySolicitante = async (codSolicitante) => {
  try {
    const response = await instance.delete(`solicitud/solicitante/${codSolicitante}`);
    return response;
  } catch (error) {
    console.log('Error en eliminarSolicitudesBySolicitante', error);
    throw error;
  }
};
