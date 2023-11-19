import { axiosInstance } from '../../components/api/api';

export const getMunicipiosPorProvincia = async (codProvincia) => {
  try {
    const response = await axiosInstance.get(`municipio/provincia/${codProvincia}`);
    return response;
  } catch (error) {
    console.log('Error en getMunicipiosPorProvincia', error);
    throw error;
  }
};

export const getMunicipiosPorID = async (idMunicipio) => {
  try {
    const response = await axiosInstance.get(`municipio/${idMunicipio}`);
    return response;
  } catch (error) {
    console.log('Error en getMunicipiosPorID', error);
    throw error;
  }
};

export const getProvincias = async () => {
  try {
    const response = await axiosInstance.get(`provincia/`);
    return response;
  } catch (error) {
    console.log('Error en getProvincias', error);
    throw error;
  }
};

export const getFuentesIngreso = async () => {
  try {
    const response = await axiosInstance.get(`fuenteIngreso/`);
    return response;
  } catch (error) {
    console.log('Error en getFuentesIngreso', error);
    throw error;
  }
};
