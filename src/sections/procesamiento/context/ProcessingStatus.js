import { createContext, useContext, useEffect, useState } from 'react';
import { getCantCarrerasAsigSegundaVueltaCurso } from '../../home/app/store/store';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import { getSolicitudesByCurso } from '../../gestionCurso/solicitudes/store/store';
import {
  cantAsigCourse,
  getAnonimatosCourse,
  isPrimVueltaAsig,
  verifyCanCalify,
  verifyCanRecalify,
} from '../store/store';

const ProcessingStatusContext = createContext();

export function ProcessingStatusProvider({ children }) {
  const [canAsigPrimVuelta, setCanAsigPrimVuelta] = useState(false);
  const [canAsigSegVuelta, setCanAsigSegVuelta] = useState(false);
  const [canAsigClassrooms, setCanAsigClassrooms] = useState(false);
  const [canAsigActs, setCanAsigActs] = useState(false);
  const [canCalify, setCanCalify] = useState(false);
  const [canRecalify, setCanRecalify] = useState(false);
  const [canActOffers, setCanActOffers] = useState(false);
  const [canActCapacities, setCanActCapacities] = useState(false);
  const [canActRequests, setCanActRequests] = useState(false);
  const { activeCourse } = UseActiveCourse();

  useEffect(() => {
    if (activeCourse.cod_curso !== -1) {
      verifyCanAsigPrimVuelta(activeCourse.cod_curso).then(() =>
        verifyCanAsigSegVuelta(activeCourse.cod_curso).then(() =>
          VerifyCanCapacityOfferRequest(activeCourse.cod_curso).then(() =>
            verifyCanAsigClassrooms(activeCourse.cod_curso).then(() =>
              verifyCanAsigActs(activeCourse.cod_curso).then(() =>
                verifyCalify(activeCourse.cod_curso).then(() => verifyRecalify(activeCourse.cod_curso))
              )
            )
          )
        )
      );
    }
  }, [activeCourse]);

  // ok
  const verifyCanAsigPrimVuelta = async (codCurso) => {
    console.log('verificando asigPrimVuelta');
    getSolicitudesByCurso(codCurso)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length > 0) {
            setCanAsigPrimVuelta(true);
          } else {
            setCanAsigPrimVuelta(false);
          }
        }
      })
      .catch((error) => {
        console.log('Error in verifyCanAsigPrimVuelta', error);
      });
  };

  // ok
  const verifyCanAsigSegVuelta = async (codCurso) => {
    console.log('verificando asignSegVuelta');

    getCantCarrerasAsigSegundaVueltaCurso(codCurso)
      .then((response) => {
        if (response.status === 200) {
          if (response.data > 0) {
            setCanCalify(false);
            setCanAsigSegVuelta(false);
            setCanRecalify(false);
            // todo implementation of reports
          }
        }
      })
      .catch((error) => {
        console.log('Error in verifyCanAsigSegVuelta', error);
      });
  };

  // ok
  const VerifyCanCapacityOfferRequest = async (codCurso) => {
    console.log('verificando canCapacityOfferRequest');

    isPrimVueltaAsig(codCurso)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            setCanActOffers(false);
            setCanAsigPrimVuelta(false);
            setCanAsigClassrooms(true);
            // todo implementation of reports
          } else {
            setCanActOffers(true);
            setCanActRequests(true);
          }
        }
      })
      .catch((error) => {
        console.log('Error in VerifyCanCapacityOfferRequest', error);
      });
  };

  // ok
  const verifyCanAsigClassrooms = async (codCurso) => {
    console.log('verificando asignAulas');

    cantAsigCourse(codCurso)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length > 0) {
            setCanAsigClassrooms(false);
            setCanAsigActs(true);
            setCanActCapacities(false);
            // todo implementation of reports
          } else {
            setCanActCapacities(true);
          }
        }
      })
      .catch((error) => {
        console.log('Error in verifyCanAsigClassrooms', error);
      });
  };

  // ok
  const verifyCanAsigActs = async (codCurso) => {
    console.log('verificando asigActas');

    getAnonimatosCourse(codCurso)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length > 0) {
            setCanAsigActs(false);
            setCanCalify(true);
            // todo implementation of reports
          }
        }
      })
      .catch((error) => {
        console.log('Error in verifyCanAsigActs', error);
      });
  };

  // ok
  const verifyCalify = async (codCurso) => {
    console.log('verificando calify');

    verifyCanCalify(codCurso)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            setCanAsigSegVuelta(true);
            setCanRecalify(true);
            // todo implementation of reports
          }
        }
      })
      .catch((error) => {
        console.log('Error in verifyCalify', error);
      });
  };

  //
  const verifyRecalify = async (codCurso) => {
    console.log('verificando Recalify');

    verifyCanRecalify(codCurso)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            setCanCalify(false);
            setCanRecalify(false);
            setCanAsigSegVuelta(true);
            // todo implementation of reports
          }
        }
      })
      .catch((error) => {
        console.log('Error in verifyRecalify', error);
      });
  };

  return (
    <ProcessingStatusContext.Provider
      value={{
        canAsigPrimVuelta,
        setCanAsigPrimVuelta,
        canAsigSegVuelta,
        setCanAsigSegVuelta,
        canAsigClassrooms,
        setCanAsigClassrooms,
        canAsigActs,
        setCanAsigActs,
        canCalify,
        setCanCalify,
        canRecalify,
        setCanRecalify,
        canActOffers,
        setCanActOffers,
        canActCapacities,
        setCanActCapacities,
        canActRequests,
        setCanActRequests,
      }}
    >
      {children}
    </ProcessingStatusContext.Provider>
  );
}

export function UseProcessingStatus() {
  return useContext(ProcessingStatusContext);
}
