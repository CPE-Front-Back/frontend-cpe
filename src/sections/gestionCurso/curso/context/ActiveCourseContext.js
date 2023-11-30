import { createContext, useContext, useEffect, useState } from 'react';
import { UseAuthContext } from '../../../auth/context/AuthProvider';
import { getActiveCourse } from '../store/store';

const ActiveCourseContext = createContext();
export function ActiveCourseProvider({ children }) {
  const [activeCourse, setActiveCourse] = useState({
    cod_curso: -1,
    nomb_curso: 'Ningún curso activo',
    activo: false,
    fecha_inicio: '-- - -- - ----',
    fecha_inicio_prem: '-- - -- - ----',
    fecha_fin_prem: '-- - -- - ----',
  });
  const [refreshProcessingStatus, setRefreshProcessingStatus] = useState(0);
  const { auth } = UseAuthContext();

  useEffect(() => {
    getActiveCourse()
      .then((response) => {
        if (response.status === 200) {
          setActiveCourse(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el curso activo: ', error);
      });
  }, [auth]);

  useEffect(() => {
    console.log('Ha cambiado el activeCourse en el context:', activeCourse);
  }, [activeCourse]);

  useEffect(() => {
    console.log('Ha cambiado el refreshProcessingStatus en el context:', refreshProcessingStatus);
  }, [refreshProcessingStatus]);

  return (
    <ActiveCourseContext.Provider
      value={{ activeCourse, setActiveCourse, refreshProcessingStatus, setRefreshProcessingStatus }}
    >
      {children}
    </ActiveCourseContext.Provider>
  );
}

export function UseActiveCourse() {
  return useContext(ActiveCourseContext);
}
