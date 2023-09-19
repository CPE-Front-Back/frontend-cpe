import instance from '../../../../components/api/api';

export const getBuildings = async () => {
  try {
    const response = await instance.get(`edificio/`);
    return response;
  } catch (error) {
    console.log('Error en getBuildings', error);
    throw error;
  }
};

export const getBuildingsByFaclulty = async (facultyCode) => {
  try {
    const response = await instance.get(`edificio/facultad/${facultyCode}`);
    return response;
  } catch (error) {
    console.log('Error en getBuildingsByFaclulty', error);
    throw error;
  }
};

export const getBuildingById = async (buildingCode) => {
  try {
    const response = await instance.get(`edificio/${buildingCode}`);
    return response;
  } catch (error) {
    console.log('Error en getBuildingsById', error);
    throw error;
  }
};

export const insertBuilding = async (building) => {
  try {
    const response = await instance.post(`edificio/`, building);
    return response;
  } catch (error) {
    console.log('Error en insertarEdificio', error);
    throw error;
  }
};

export const updateBuilding = async (building) => {
  try {
    const response = await instance.put(`edificio/`, building);
    return response;
  } catch (error) {
    console.log('Error en modificarEdificio', error);
    throw error;
  }
};
