import instance from '../../../../components/api/api';

export const getComparecenciasCurso = async (codCurso) => {
  try {
    const response = await instance.get(`actaComparecencia/curso/${codCurso}`);
    console.log('comparecencias:', response.data);
    return response;
  } catch (error) {
    console.log('Error en getClassrooms', error);
    throw error;
  }
};

export const getActasNotas = async (codCurso, codActaComp) => {
  try {
    const response = await instance.get(`acta/curso/${codCurso}/comparecencia/${codActaComp}`);
    return response;
  } catch (error) {
    console.log('Error en getActasNotas', error);
    throw error;
  }
};

export const getAsignaciones = async (codCurso, codActaComp) => {
  try {
    const response = await instance.get(`asignacion/curso/${codCurso}/actaComparecencia/${codActaComp}`);
    return response;
  } catch (error) {
    console.log('Error en getAsignaciones', error);
    throw error;
  }
};
