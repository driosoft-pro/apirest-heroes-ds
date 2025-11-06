import baseModelFactory from "./baseModelFactory.js";

export default baseModelFactory({
  label: "Usuario",
  allowedProps: ["username", "rol", "activo"],
});
