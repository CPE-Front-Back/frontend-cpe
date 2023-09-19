import instance from '../../../../components/api/api';

export const getClassrooms = async () => {
  try {
    const response = await instance.get(`aula/`);
    return response;
  } catch (error) {
    console.log('Error en getClassrooms', error);
    throw error;
  }
};

export const insertClassroom = async (classroom) => {
  try {
    const response = await instance.post(`aula/`, classroom);
    return response;
  } catch (error) {
    console.log('Error en insertClassroom', error);
    throw error;
  }
};

export const updateClassroom = async (classroom) => {
  try {
    const response = await instance.put(`aula/`, classroom);
    return response;
  } catch (error) {
    console.log('Error en updateClassroom', error);
    throw error;
  }
};
