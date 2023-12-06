import { axiosInstance } from '../../../../components/api/api';

export const getIncomeSources = async () => {
  try {
    const response = await axiosInstance.get(`fuenteIngreso/`);
    return response;
  } catch (error) {
    console.log('Error en getIncomeSources', error);
    throw error;
  }
};

export const getIncomeSourcesById = async (IncomeSourceCode) => {
  try {
    const response = await axiosInstance.get(`fuenteIngreso/${IncomeSourceCode}`);
    return response;
  } catch (error) {
    console.log('Error en getIncomeSourcesById', error);
    throw error;
  }
};

export const insertIncomeSource = async (incomeSource) => {
  try {
    const response = await axiosInstance.post(`fuenteIngreso/`, incomeSource);
    return response;
  } catch (error) {
    if (error.request.status === 500 && error.request.response === 'Duplicated nomb_fuente') {
      console.log('Error en insertIncomeSource', error);
      return error;
    }
    console.log('Error en insertIncomeSource', error);
    throw error;
  }
};

export const updateIncomeSource = async (incomeSource) => {
  try {
    const response = await axiosInstance.put(`fuenteIngreso/`, incomeSource);
    return response;
  } catch (error) {
    if (error.request.status === 500 && error.request.response === 'Duplicated nomb_fuente') {
      console.log('Error en updateIncomeSource', error);
      return error;
    }
    console.log('Error en updateIncomeSource', error);
    throw error;
  }
};

export const deleteIncomeSource = async (incomeSource) => {
  try {
    const response = await axiosInstance.delete(`fuenteIngreso/${incomeSource.nomb_fuente}`);
    return response;
  } catch (error) {
    console.log('Error en deleteIncomeSource', error);
    throw error;
  }
};
