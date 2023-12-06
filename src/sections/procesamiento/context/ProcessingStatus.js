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
  const [canActRequests, setCanActRequests] = useState(true);
  const { activeCourse, refreshProcessingStatus } = UseActiveCourse();

  const [canReport1, setCanReport1] = useState(false);
  const [canReport2, setCanReport2] = useState(false);
  const [canReport3, setCanReport3] = useState(false);
  const [canReport4, setCanReport4] = useState(false);
  const [canReport5, setCanReport5] = useState(false);
  const [canReport6, setCanReport6] = useState(false);
  const [canReport7, setCanReport7] = useState(false);
  const [canReport8, setCanReport8] = useState(false);
  const [canReport9, setCanReport9] = useState(false);
  const [canReport10, setCanReport10] = useState(false);
  const [canReport11, setCanReport11] = useState(false);
  const [canReport12, setCanReport12] = useState(false);
  const [canReport13, setCanReport13] = useState(false);
  const [canReport14, setCanReport14] = useState(false);
  const [canReport15, setCanReport15] = useState(false);

  useEffect(() => {
    if (activeCourse.cod_curso !== -1) {
      verifyCanAsigPrimVuelta(activeCourse.cod_curso)
        .then(() => {})
        .finally(() => {
          setTimeout(() => {
            VerifyCanCapacityOfferRequest(activeCourse.cod_curso)
              .then(() => {})
              .finally(() => {
                setTimeout(() => {
                  verifyCanAsigClassrooms(activeCourse.cod_curso)
                    .then(() => {})
                    .finally(() => {
                      setTimeout(() => {
                        verifyCanAsigActs(activeCourse.cod_curso)
                          .then(() => {})
                          .finally(() => {
                            setTimeout(() => {
                              verifyCalify(activeCourse.cod_curso)
                                .then(() => {})
                                .finally(() => {
                                  setTimeout(() => {
                                    verifyRecalify(activeCourse.cod_curso)
                                      .then(() => {})
                                      .finally(() => {
                                        setTimeout(() => {
                                          verifyCanAsigSegVuelta(activeCourse.cod_curso).then(() => {});
                                        }, 900);
                                      });
                                  }, 900);
                                });
                            }, 900);
                          });
                      }, 900);
                    });
                }, 900);
              });
          }, 900);
        });
    }
  }, [activeCourse, refreshProcessingStatus]);

  // ok
  const verifyCanAsigPrimVuelta = async (codCurso) => {
    console.log('verificando asigPrimVuelta');
    getSolicitudesByCurso(codCurso, true)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length > 0) {
            setCanAsigPrimVuelta(true);
            setCanReport1(true);
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
            setCanReport11(true);
            setCanReport12(true);
            setCanReport13(true);
            setCanReport14(true);
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
            setCanReport1(true);
            setCanReport2(true);
            setCanReport3(true);
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
            setCanReport4(true);
            setCanReport5(true);
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
            setCanReport6(true);
            setCanReport8(true);
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
            setCanReport9(true);
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
            setCanReport7(true);
            setCanReport10(true);
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
        canReport1,
        setCanReport1,
        canReport2,
        setCanReport2,
        canReport3,
        setCanReport3,
        canReport4,
        setCanReport4,
        canReport5,
        setCanReport5,
        canReport6,
        setCanReport6,
        canReport7,
        setCanReport7,
        canReport8,
        setCanReport8,
        canReport9,
        setCanReport9,
        canReport10,
        setCanReport10,
        canReport11,
        setCanReport11,
        canReport12,
        setCanReport12,
        canReport13,
        setCanReport13,
        canReport14,
        setCanReport14,
        canReport15,
        setCanReport15,
      }}
    >
      {children}
    </ProcessingStatusContext.Provider>
  );
}

export function UseProcessingStatus() {
  return useContext(ProcessingStatusContext);
}
