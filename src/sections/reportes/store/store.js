import instance from '../../../components/api/api';

export const getProvinciasReport = async () => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/provincias/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getProvinciasReport', error);
    throw error;
  }
};

export const getActasAnonimatoReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/actasAnonimato/nomb_curso/${nomb_curso}/format/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getActasAnonimato', error);
    throw error;
  }
};

export const getActasComparecenciaReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/actasComparecencia/nomb_curso/${nomb_curso}/format/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getActasComparecencia', error);
    throw error;
  }
};

export const getActasNotasReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/actasNotas/nomb_curso/${nomb_curso}/format/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getActasNotas', error);
    throw error;
  }
};

export const getActasReclamacionReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/actasReclamacion/nomb_curso/${nomb_curso}/format/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getActasReclamacionReport', error);
    throw error;
  }
};

export const getListadoAsignaciones1raVueltaCarreraReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(
      `report/listadoAsignaciones1raVueltaCarrera/nomb_curso/${nomb_curso}/format/${format}`,
      {
        responseType: 'arraybuffer',
      }
    );
    return response;
  } catch (error) {
    console.log('Error en getListadoAsignaciones1raVueltaCarreraReport', error);
    throw error;
  }
};

export const getListadoAsignaciones1raVueltaEstudianteReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(
      `report/listadoAsignaciones1raVueltaEstudiante/nomb_curso/${nomb_curso}/format/${format}`,
      {
        responseType: 'arraybuffer',
      }
    );
    return response;
  } catch (error) {
    console.log('Error en getListadoAsignaciones1raVueltaEstudianteReport', error);
    throw error;
  }
};

export const getListadoAsignacionesFinalCarreraReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(
      `report/listadoAsignacionesFinalCarrera/nomb_curso/${nomb_curso}/format/${format}`,
      {
        responseType: 'arraybuffer',
      }
    );
    return response;
  } catch (error) {
    console.log('Error en getListadoAsignacionesFinalCarreraReport', error);
    throw error;
  }
};

export const getListadoAsignacionesFinalEstudianteReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(
      `report/listadoAsignacionesFinalEstudiante/nomb_curso/${nomb_curso}/format/${format}`,
      {
        responseType: 'arraybuffer',
      }
    );
    return response;
  } catch (error) {
    console.log('Error en getListadoAsignacionesFinalEstudianteReport', error);
    throw error;
  }
};

export const getListadoNotasReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/listadoNotas/nomb_curso/${nomb_curso}/format/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getListadoNotasReport', error);
    throw error;
  }
};

export const getListadoRecalificacionesReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/listadoRecalificaciones/nomb_curso/${nomb_curso}/format/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getListadoRecalificacionesReport', error);
    throw error;
  }
};

export const getListadoUbicacionEstudianteReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/listadoUbicacionEstudiante/nomb_curso/${nomb_curso}/format/${format}`, {
      responseType: 'arraybuffer',
    });
    return response;
  } catch (error) {
    console.log('Error en getListadoUbicacionEstudianteReport', error);
    throw error;
  }
};

export const getResumenAsignaciones1raOpcCarreraReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(
      `report/resumenAsignaciones1raOpcCarrera/nomb_curso/${nomb_curso}/format/${format}`,
      {
        responseType: 'arraybuffer',
      }
    );
    return response;
  } catch (error) {
    console.log('Error en getResumenAsignaciones1raOpcCarreraReport', error);
    throw error;
  }
};

export const getResumenFinalAsignacionesCarreraReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(
      `report/resumenFinalAsignacionesCarrera/nomb_curso/${nomb_curso}/format/${format}`,
      {
        responseType: 'arraybuffer',
      }
    );
    return response;
  } catch (error) {
    console.log('Error en getResumenFinalAsignacionesCarreraReport', error);
    throw error;
  }
};

export const getResumenSolicitudes1raOpcCarreraReport = async (nomb_curso) => {
  try {
    const format = 'pdf';
    const response = await instance.get(
      `report/resumenSolicitudes1raOpcCarrera/nomb_curso/${nomb_curso}/format/${format}`,
      {
        responseType: 'arraybuffer',
      }
    );
    return response;
  } catch (error) {
    console.log('Error en getResumenSolicitudes1raOpcCarreraReport', error);
    throw error;
  }
};
