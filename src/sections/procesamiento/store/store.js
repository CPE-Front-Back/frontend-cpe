import instance from '../../../components/api/api';

export const asignar1raVuelta = async (codCurso) => {
  try {
    const response = await instance.get(`procesamiento/asignarPrimeraVuelta/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en asignar1raVuelta', error);
    throw error;
  }
};
