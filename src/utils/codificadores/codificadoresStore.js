import instance from '../../components/api/api';

export const getMunicipiosPorProvincia = async (codProvincia) => {
  try {
    const response = await instance.get(`municipio/provincia/${codProvincia}`);
    return response;
  } catch (error) {
    console.log('Error en getMunicipiosPorProvincia', error);
    throw error;
  }
};

export const getProvincias = async () => {
  try {
    const response = await instance.get(`provincia/`);
    return response;
  } catch (error) {
    console.log('Error en getProvincias', error);
    throw error;
  }
};

export const getFuentesIngreso = async () => {
  try {
    const response = await instance.get(`fuenteIngreso/`);
    return response;
  } catch (error) {
    console.log('Error en getFuentesIngreso', error);
    throw error;
  }
};

export const getCarreras = async () => {
  try {
    const response = await instance.get(`carrera/`);
    return response;
  } catch (error) {
    console.log('Error en getCarreras', error);
    throw error;
  }
};
