import baseModelFactory from "./baseModelFactory.js";

export default baseModelFactory({
  label: "Usuario",
  allowedProps: ["email","genero","id","nombre"],
});
