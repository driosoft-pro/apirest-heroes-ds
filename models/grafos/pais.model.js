import baseModelFactory from "./baseModelFactory.js";

export default baseModelFactory({
  label: "Pais",
  allowedProps: ["nombre", "iso", "idioma", "capital"],
});
