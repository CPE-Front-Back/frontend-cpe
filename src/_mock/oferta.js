import { faker } from '@faker-js/faker';

const ofertas = [...Array(13)].map((_, index) => ({
  codOferta: faker.datatype.uuid(),
  codCarrera: faker.name.jobArea(),
  codCurso: faker.datatype.uuid(),
  cantOfertas: faker.datatype.number(100),
}));

export default ofertas;
