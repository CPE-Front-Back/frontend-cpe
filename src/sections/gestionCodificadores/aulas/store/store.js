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

export const getClassroomsByBuilding = async (buildingCode) => {
  try {
    const response = await instance.get(`aula/edificio/${buildingCode}`);
    return response;
  } catch (error) {
    console.log('Error en getClassroomsByBuilding', error);
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

export const deleteClassroom = async (classroom) => {
  try {
    const response = await instance.delete(`aula/${classroom.cod_aula}`);
    return response;
  } catch (error) {
    console.log('Error en deleteClassroom', error);
    throw error;
  }
};
