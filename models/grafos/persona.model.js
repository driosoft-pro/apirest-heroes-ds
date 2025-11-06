import baseModelFactory from "./baseModelFactory.js";

export default baseModelFactory({
  label: "Persona",
  allowedProps: ["nombre", "apellido", "edad", "email"],
});
