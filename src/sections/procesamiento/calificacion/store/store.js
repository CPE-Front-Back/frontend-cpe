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

export const getRequesterAct = async (noAnonymity) => {
  try {
    const response = await instance.get(`acta/cod_anonimato/${noAnonymity}`);
    return response;
  } catch (error) {
    console.log('Error en getRequesterAct', error);
    throw error;
  }
};

export const getRequesterAssignment = async (codActa) => {
  try {
    const response = await instance.get(`asignacion/acta/${codActa}`);
    return response;
  } catch (error) {
    console.log('Error en getRequesterAssignment', error);
    throw error;
  }
};

export const updateQualification = async (assignment) => {
  try {
    const response = await instance.put(`asignacion/`, assignment);
    return response;
  } catch (error) {
    console.log('Error en getAsignaciones', error);
    throw error;
  }
};
