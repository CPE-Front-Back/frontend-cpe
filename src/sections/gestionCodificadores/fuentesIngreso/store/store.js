import instance from '../../../../components/api/api';

export const getIncomeSources = async () => {
  try {
    const response = await instance.get(`fuenteIngreso/`);
    return response;
  } catch (error) {
    console.log('Error en getIncomeSources', error);
    throw error;
  }
};

export const getIncomeSourcesById = async (IncomeSourceCode) => {
  try {
    const response = await instance.get(`fuenteIngreso/${IncomeSourceCode}`);
    return response;
  } catch (error) {
    console.log('Error en getIncomeSourcesById', error);
    throw error;
  }
};

export const insertIncomeSource = async (incomeSource) => {
  try {
    const response = await instance.post(`fuenteIngreso/`, incomeSource);
    return response;
  } catch (error) {
    console.log('Error en insertIncomeSource', error);
    throw error;
  }
};

export const updateIncomeSource = async (incomeSource) => {
  try {
    const response = await instance.put(`fuenteIngreso/`, incomeSource);
    return response;
  } catch (error) {
    console.log('Error en updateIncomeSource', error);
    throw error;
  }
};

export const deleteIncomeSource = async (incomeSource) => {
  try {
    const response = await instance.delete(`fuenteIngreso/${incomeSource.cod_fuente}`);
    return response;
  } catch (error) {
    console.log('Error en deleteIncomeSource', error);
    throw error;
  }
};
