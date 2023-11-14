import instance from '../../../components/api/api';

export const getProvinciasReport = async () => {
  try {
    const format = 'pdf';
    const response = await instance.get(`report/provincias/${format}`, {
      responseType: 'arraybuffer', // Important: Set responseType to 'arraybuffer'
    });
    return response;
  } catch (error) {
    console.log('Error en getProvinciasReport', error);
    throw error;
  }
};
