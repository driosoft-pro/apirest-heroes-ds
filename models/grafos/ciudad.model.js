import baseModelFactory from "./baseModelFactory.js";

export default baseModelFactory({
  label: "Ciudad",
  allowedProps: ["nombre", "poblacion", "region"],
});
