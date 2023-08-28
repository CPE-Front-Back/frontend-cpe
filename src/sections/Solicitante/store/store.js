import instance from '../../../components/api/api';

export const sendSolicitantePersonalData = async (solicitante) => {
  console.log(solicitante);
  try {
    const response = await instance.post(`solicitante/`, solicitante);
    return response;
  } catch (error) {
    console.log('Error en sendSolicitantePersonalData', error);
    throw error;
  }
};

export const updateSolicitantePersonalData = async (solicitante) => {
  console.log(solicitante);
  try {
    const response = await instance.put(`solicitante/`, solicitante);
    return response;
  } catch (error) {
    console.log('Error en sendSolicitantePersonalData', error);
    throw error;
  }
};

export const getSolicitanteById = async (numId) => {
  try {
    const response = await instance.get(`solicitante/${numId}`);
    return response;
  } catch (error) {
    console.log('Error en getSolicitanteById', error);
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
      const response = await instance.post(`solicitud/`, solicitud);
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
