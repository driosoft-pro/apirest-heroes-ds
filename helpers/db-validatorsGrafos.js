import { getSession } from "../database/connectionGrafos.js";

// ====== Listas blancas ======
export const GRAFOS_LABELS = [
  "Pais",
  "Ciudad",
  "Persona",
  "Sitio",
  "Plato",
  "Usuario",
  "Compra",
];

export const REL_TYPES = [
  // geografía / pertenencia
  "PERTENECE_A",
  "UBICADO_EN",
  // personas/usuarios
  "NACIO_EN",
  "VIVE_EN",
  "VISITO",
  // oferta / ventas
  "SE_VENDE_EN",
  // compras
  "REALIZO_COMPRA",
  "INCLUYE_PLATO",
  "EN_SITIO",
];

// Campos permitidos por label
const FIELDS_BY_LABEL = {
  Pais: ["id", "pais", "iso", "idioma", "capital", "region"],
  Ciudad: ["id", "ciudad", "lat", "lng", "poblacion"],
  Persona: ["id", "nombre", "apellido", "genero", "email", "edad", "profesion"],
  Sitio: ["id", "sitio", "tipo", "lat", "lng", "descripcion"],
  Plato: ["id", "plato", "categoria", "origen", "sabores", "precio"],
  Usuario: ["id", "nombre", "username", "email", "rol", "genero"],
  Compra: ["id", "fecha", "cantidad", "total"],
};

// ====== Utilidad para lecturas ======
async function runRead(cypher, params = {}) {
  const session = getSession("READ");
  try {
    const res = await session.run(cypher, params);
    return res.records;
  } finally {
    await session.close();
  }
}

// ====== Validadores sincrónicos ======
export function isValidLabel(label = "") {
  if (!GRAFOS_LABELS.includes(label)) {
    throw new Error(
      `Label inválido: "${label}". Permitidos: ${GRAFOS_LABELS.join(", ")}`,
    );
  }
  return true;
}

export function isUUIDv4(id = "") {
  const re =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!re.test(String(id))) {
    throw new Error(`El id "${id}" no es un UUID v4 válido.`);
  }
  return true;
}

export function isValidRelType(type = "") {
  if (!type || typeof type !== "string") {
    throw new Error(`El tipo de relación es requerido.`);
  }
  if (REL_TYPES.length && !REL_TYPES.includes(type)) {
    throw new Error(
      `Tipo de relación inválido: "${type}". Permitidos: ${REL_TYPES.join(", ")}`,
    );
  }
  return true;
}

// bloquear propiedades no permitidas por label en CRUD de nodos
export function validarCamposNodo(label, payload = {}) {
  const permitidos = FIELDS_BY_LABEL[label];
  if (!permitidos) return true;
  const desconocidos = Object.keys(payload).filter(
    (k) => !permitidos.includes(k),
  );
  if (desconocidos.length) {
    throw new Error(
      `Propiedades no permitidas para ${label}: ${desconocidos.join(", ")}. ` +
        `Permitidas: ${permitidos.join(", ")}`,
    );
  }
  return true;
}

// ====== Validadores asíncronos ======
export async function existeNodoPorId(label, id) {
  // se asume que ya pasaste isValidLabel e isUUIDv4 antes
  const recs = await runRead(
    `MATCH (n:${label} { id: $id }) RETURN count(n) AS c`,
    { id },
  );
  const c = recs[0]?.get("c");
  const count = typeof c?.toInt === "function" ? c.toInt() : Number(c);
  if (!count) {
    throw new Error(`No existe nodo (${label}) con id="${id}".`);
  }
  return true;
}

export async function existeRelacionExacta(
  fromLabel,
  fromId,
  type,
  toLabel,
  toId,
) {
  const recs = await runRead(
    `MATCH (a:${fromLabel} { id: $fromId })-[r:${type}]->(b:${toLabel} { id: $toId })
     RETURN count(r) AS c`,
    { fromId, toId },
  );
  const c = recs[0]?.get("c");
  const count = typeof c?.toInt === "function" ? c.toInt() : Number(c);
  if (!count) {
    throw new Error(
      `No existe relación ${type} entre (${fromLabel}:${fromId}) y (${toLabel}:${toId}).`,
    );
  }
  return true;
}

export async function noExisteRelacionExacta(
  fromLabel,
  fromId,
  type,
  toLabel,
  toId,
) {
  const recs = await runRead(
    `MATCH (a:${fromLabel} { id: $fromId })-[r:${type}]->(b:${toLabel} { id: $toId })
     RETURN count(r) AS c`,
    { fromId, toId },
  );
  const c = recs[0]?.get("c");
  const count = typeof c?.toInt === "function" ? c.toInt() : Number(c);
  if (count) {
    throw new Error(
      `Ya existe relación ${type} entre (${fromLabel}:${fromId}) y (${toLabel}:${toId}).`,
    );
  }
  return true;
}
