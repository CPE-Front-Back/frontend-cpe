import { axiosForAuth, axiosInstance } from '../../../components/api/api';

export const sendSolicitantePersonalData = async (solicitante) => {
  console.log(solicitante);
  try {
    const response = await axiosInstance.post(`solicitante/`, solicitante);
    return response;
  } catch (error) {
    console.log('Error en sendSolicitantePersonalData', error);
    if (error.request.status === 500 && error.request.response === 'Duplicated num_id') {
      return error;
    }
    console.log('Error en sendSolicitantePersonalData', error);
    throw error;
  }
};

export const sendSolicitantePersonalDataRequester = async (solicitante) => {
  console.log(solicitante);
  try {
    const response = await axiosForAuth.post(`solicitante/`, solicitante);
    return response;
  } catch (error) {
    console.log('Error en sendSolicitantePersonalDataRequester', error);
    if (error.request.status === 500 && error.request.response === 'Duplicated num_id') {
      return error;
    }
    console.log('Error en sendSolicitantePersonalDataRequester', error);
    throw error;
  }
};

export const updateSolicitantePersonalData = async (solicitante) => {
  console.log(solicitante);
  try {
    const response = await axiosInstance.put(`solicitante/`, solicitante);
    return response;
  } catch (error) {
    console.log('Error en updateSolicitantePersonalData', error);
    if (error.request.status === 500 && error.request.response === 'Duplicated num_id') {
      return error;
    }
    console.log('Error en updateSolicitantePersonalData', error);
    throw error;
  }
};

export const getSolicitanteById = async (numId) => {
  try {
    const response = await axiosInstance.get(`solicitante/${numId}`);
    return response;
  } catch (error) {
    console.log('Error en getSolicitanteById', error);
    throw error;
  }
};

export const getSolicitanteByIdRequester = async (numId) => {
  try {
    const response = await axiosForAuth.get(`solicitante/${numId}`);
    return response;
  } catch (error) {
    console.log('Error en getSolicitanteByIdRequester', error);
    throw error;
  }
};

export const insertarSolicitudes = async (solicitudes, codSol) => {
  const updatedSolicitudes = [];
  let insertadas = true;

  Object.keys(solicitudes).forEach((opcionKey) => {
    if (Object.prototype.hasOwnProperty.call(solicitudes, opcionKey)) {
      const solicitud = solicitudes[opcionKey];

      // Check if the solicitud is undefined
      if (solicitud === undefined) {
        return; // Skip this iteration and continue to the next one
      }

      const opcion = parseInt(opcionKey.replace('opcion', ''), 10); // Specify radix parameter
      const cod_oferta = solicitud.cod_oferta;

      updatedSolicitudes.push({
        cod_oferta,
        opcion,
        cod_solicitante: codSol,
      });
    }
  });

  try {
    const promiseArray = updatedSolicitudes.map(async (solicitud) => {
      const response = await axiosInstance.post(`solicitud/`, solicitud);
      if (response.status !== 200) {
        insertadas = false;
      }
    });

    await Promise.all(promiseArray);

    return insertadas;
  } catch (error) {
    console.log('Error al insertar las solicitudes', error);
    return insertadas;
  }
};

export const insertarSolicitudesRequester = async (solicitudes, codSol) => {
  const updatedSolicitudes = [];
  let insertadas = true;

  Object.keys(solicitudes).forEach((opcionKey) => {
    if (Object.prototype.hasOwnProperty.call(solicitudes, opcionKey)) {
      const solicitud = solicitudes[opcionKey];

      // Check if the solicitud is undefined
      if (solicitud === undefined) {
        return; // Skip this iteration and continue to the next one
      }

      const opcion = parseInt(opcionKey.replace('opcion', ''), 10); // Specify radix parameter
      const cod_oferta = solicitud.cod_oferta;

      updatedSolicitudes.push({
        cod_oferta,
        opcion,
        cod_solicitante: codSol,
      });
    }
  });

  try {
    const promiseArray = updatedSolicitudes.map(async (solicitud) => {
      const response = await axiosForAuth.post(`solicitud/`, solicitud);
      if (response.status !== 200) {
        insertadas = false;
      }
    });

    await Promise.all(promiseArray);

    return insertadas;
  } catch (error) {
    console.log('Error al insertar las solicitudes Requester', error);
    return insertadas;
  }
};
