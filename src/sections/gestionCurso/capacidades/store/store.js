import instance from '../../../../components/api/api';

export const getCapacities = async (curso) => {
  try {
    const response = await instance.get(`capacidad/curso/${curso}`);
    return response;
  } catch (error) {
    console.log('Error en getCapacities', error);
    throw error;
  }
};

export const insertCapacity = async (capacity) => {
  try {
    const response = await instance.post(`capacidad/`, capacity);
    return response;
  } catch (error) {
    console.log('Error en insertCapacity', error);
    throw error;
  }
};

export const updateCapacity = async (capacity) => {
  try {
    const response = await instance.put(`capacidad/`, capacity);
    return response;
  } catch (error) {
    console.log('Error en updateCapacity', error);
    throw error;
  }
};

export const deleteCapacity = async (capacity) => {
  try {
    const response = await instance.delete(`capacidad/${capacity.cod_capacidad}`);
    return response;
  } catch (error) {
    console.log('Error en deleteCapacity', error);
    throw error;
  }
};
