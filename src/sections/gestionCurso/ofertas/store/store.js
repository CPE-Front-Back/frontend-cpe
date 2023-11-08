import instance from '../../../../components/api/api';

export const getAllOfertasByCurso = async (codCurso) => {
  try {
    const response = await instance.get(`oferta/curso/${codCurso}`);
    return response;
  } catch (error) {
    console.log('Error en getAllOfertasByCurso', error);
    throw error;
  }
};

export const updateOferta = async (oferta) => {
  try {
    const response = await instance.put(`oferta/`, oferta);
    return response;
  } catch (error) {
    console.log('Error en updateOferta', error);
    throw error;
  }
};

export const insertarOferta = async (oferta) => {
  try {
    const response = await instance.post(`oferta/`, oferta);
    return response;
  } catch (error) {
    console.log('Error en updateOferta', error);
    throw error;
  }
};

export const deleteOffer = async (offer) => {
  try {
    const response = await instance.delete(`oferta/${offer.cod_oferta}`);
    return response;
  } catch (error) {
    console.log('Error en deleteOffer', error);
    throw error;
  }
};
