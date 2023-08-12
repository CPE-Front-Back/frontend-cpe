import PropTypes from "prop-types";

OfertasForm.propTypes = {
   editMode: PropTypes.bool,
   formData: PropTypes.object,
   onSubmit: PropTypes.func
}
export default function OfertasForm ({ editMode, formData, onSubmit }){
   return(<>LA VENTANA DE OFERTAS PARA {editMode? "EDITAR": "AÑADIR"} UNA OFERTA</>);
}