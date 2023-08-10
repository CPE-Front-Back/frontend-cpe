import {useState} from "react";
import CapacidadesForm from "../CapacidadesForm";

export default function CapacidadesLayot () {
   const [currentContent, setCurrentContent] = useState("list");
   
   const [defaultData, setDefaultData] = useState(
      {
         id: "",
         id_faculty: "",
         id_building: "",
         id_classroom: "",
         capacity: "",
         id_priority: ""
      }
   );
   
   const {data, getForm} = CapacidadesForm(defaultData);
   
   const renderForm = () => {
      <CapacidadesForm />
   }
}