import baseModelFactory from "./baseModelFactory.js";

export default baseModelFactory({
  label: "Persona",
  allowedProps: ["genero", "id", "nombre", "profesion"],
});
