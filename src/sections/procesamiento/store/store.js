import { axiosInstance } from '../../../components/api/api';

export const asignar1raVuelta = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`procesamiento/asignarPrimeraVuelta/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en asignar1raVuelta', error);
    throw error;
  }
};

export const asignar2daVuelta = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`procesamiento/asignarSegundaVuelta/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en asignar2daVuelta', error);
    throw error;
  }
};

export const asignarAulas = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`procesamiento/asignarAulas/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en asignarAulas', error);
    throw error;
  }
};

export const asignarActas = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`procesamiento/asignarActas/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en asignarActas', error);
    throw error;
  }
};

export const isPrimVueltaAsig = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`carreraAsigPrimVuelta/cursoAsignado/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en isPrimVueltaAsig', error);
    throw error;
  }
};

export const cantAsigCourse = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`asignacion/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en cantAsigCourse');
    throw error;
  }
};

export const getAnonimatosCourse = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`actaAnonimato/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en getAnonimatosCourse');
    throw error;
  }
};

export const verifyCanCalify = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`procesamiento/verificarPuedeCalificar/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en verifyCanCalify');
    throw error;
  }
};

export const verifyCanRecalify = async (codCurso) => {
  try {
    const response = await axiosInstance.get(`procesamiento/verificarPuedeRecalificar/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en verifyCanRecalify');
    throw error;
  }
};
