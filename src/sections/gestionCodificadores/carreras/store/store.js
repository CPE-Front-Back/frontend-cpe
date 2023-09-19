import instance from '../../../../components/api/api';

export const getCarreras = async () => {
  try {
    const response = await instance.get(`carrera/`);
    return response;
  } catch (error) {
    console.log('Error en getCarreras', error);
    throw error;
  }
};

export const insertCarrera = async (carrera) => {
  try {
    const response = await instance.post(`carrera/`, carrera);
    return response;
  } catch (error) {
    console.log('Error en insertarCarrera', error);
    throw error;
  }
};

export const updateCarrera = async (carrera) => {
  try {
    const response = await instance.put(`carrera/`, carrera);
    return response;
  } catch (error) {
    console.log('Error en modificarCarrera', error);
    throw error;
  }
};
