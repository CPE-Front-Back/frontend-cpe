import { axiosInstance } from '../../../../components/api/api';

export const getBuildings = async () => {
  try {
    const response = await axiosInstance.get(`edificio/`);
    return response;
  } catch (error) {
    console.log('Error en getBuildings', error);
    throw error;
  }
};

export const getBuildingsByFaclulty = async (facultyCode) => {
  try {
    const response = await axiosInstance.get(`edificio/facultad/${facultyCode}`);
    return response;
  } catch (error) {
    console.log('Error en getBuildingsByFaclulty', error);
    throw error;
  }
};

export const getBuildingById = async (buildingCode) => {
  try {
    const response = await axiosInstance.get(`edificio/${buildingCode}`);
    return response;
  } catch (error) {
    console.log('Error en getBuildingsById', error);
    throw error;
  }
};

export const insertBuilding = async (building) => {
  try {
    const response = await axiosInstance.post(`edificio/`, building);
    return response;
  } catch (error) {
    if (error.request.status === 500 && error.request.response === 'Duplicated nomb_edificio') {
      console.log('Error en insertarEdificio', error);
      return error;
    }
    console.log('Error en insertarEdificio', error);
    throw error;
  }
};

export const updateBuilding = async (building) => {
  try {
    const response = await axiosInstance.put(`edificio/`, building);
    return response;
  } catch (error) {
    if (error.request.status === 500 && error.request.response === 'Duplicated nomb_edificio') {
      console.log('Error en modificarEdificio', error);
      return error;
    }
    console.log('Error en modificarEdificio', error);
    throw error;
  }
};

export const deleteBuilding = async (building) => {
  try {
    const response = await axiosInstance.delete(`edificio/${building.cod_edif}`);
    return response;
  } catch (error) {
    console.log('Error en deleteBuilding', error);
    throw error;
  }
};
