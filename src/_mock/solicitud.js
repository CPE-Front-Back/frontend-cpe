import { faker } from '@faker-js/faker';

const solicitudes = [...Array(15)].map((_, index) => ({
  codSol: faker.datatype.uuid(),
  idSol: faker.datatype.number({ min: 10000000000, max: 99999999999 }),
  nombSol: faker.name.firstName(),
  primerApellSol: faker.name.lastName(),
  segundoApellSol: faker.name.lastName(),
  opcion1: faker.name.jobArea(),
  opcion2: faker.name.jobArea(),
  opcion3: faker.name.jobArea(),
  opcion4: faker.name.jobArea(),
  opcion5: faker.name.jobArea(),
}));

export default solicitudes;
