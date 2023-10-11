export const validateForm = (
  formData,
  firstLastName,
  secondLastName,
  provinciaSeleccionada,
  municipioSeleccionado,
  fuenteIngresoSeleccionada,
  setErrors
) => {
  const newErrors = {};

  if (!formData.num_id) {
    newErrors.num_id = 'Carnet de identidad es requerido';
  }

  if (!formData.nomb_solicitante) {
    newErrors.nomb_solicitante = 'Nombre(s) son requeridos';
  }

  if (!firstLastName) {
    newErrors.apell_solicitante = 'Primer apellido requerido';
  }

  if (!secondLastName) {
    newErrors.secondLastName = 'Segundo apellido requerido';
  }

  if (!formData.num_telefono) {
    newErrors.num_telefono = 'Teléfono es requerido';
  }

  if (!provinciaSeleccionada) {
    newErrors.provinciaSeleccionada = 'Provincia es requerida';
  }

  if (!municipioSeleccionado) {
    newErrors.municipioSeleccionado = 'Municipio es requerido';
  }

  if (!fuenteIngresoSeleccionada) {
    newErrors.fuenteIngresoSeleccionada = 'Fuente de Ingreso es requerida';
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
