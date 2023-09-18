import instance from '../../../../components/api/api';

export const getCursos = async () => {
  try {
    const response = await instance.get(`curso/`);
    return response;
  } catch (error) {
    console.log('Error en getCursos', error);
    throw error;
  }
};

export const getActiveCourse = async () => {
  try {
    const response = await instance.get(`curso/activo/`);
    return response;
  } catch (error) {
    console.log('Error en getActiveCourse', error);
    throw error;
  }
};

export const insertarCurso = async (curso) => {
  try {
    const response = await instance.post(`curso/`, curso);
    return response;
  } catch (error) {
    console.log('Error en insertarCurso', error);
    throw error;
  }
};
export const desactivarCursos = async () => {
  try {
    const response = await instance.get(`curso/desactivar/`);
    return response;
  } catch (error) {
    console.log('Error en desactivarCursos', error);
    throw error;
  }
};
export const activarCurso = async (curso) => {
  const updatedCurso = {
    ...curso,
    activo: true,
  };

  console.log('updatedCurso:', updatedCurso);
  try {
    const response = await instance.put(`curso/`, updatedCurso);
    return response;
  } catch (error) {
    console.log('Error en activarCurso', error);
    throw error;
  }
};
