import baseModelFactory from "./baseModelFactory.js";

export default baseModelFactory({
  label: "Sitio",
  allowedProps: ["nombre", "tipo", "lat", "lng"],
});
