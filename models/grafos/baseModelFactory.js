import { getSession } from "../../database/connectionGrafos.js";

const ID_PROP = "id";

/** Ejecuta una consulta con la sesión que provee tu conexión */
async function runQuery(cypher, params = {}, mode = "READ") {
  const session = getSession(mode); // Debe devolver una sesión del driver
  try {
    const res = await session.run(cypher, params);
    return res.records;
  } finally {
    await session.close();
  }
}

/** Filtra únicamente las propiedades permitidas */
function pickProps(source = {}, allowed = []) {
  const out = {};
  for (const k of allowed) {
    if (
      Object.prototype.hasOwnProperty.call(source, k) &&
      source[k] !== undefined
    ) {
      out[k] = source[k];
    }
  }
  return out;
}

/**
 * Crea un modelo CRUD para el label indicado
 * @param {{label: string, allowedProps?: string[]}} options
 */
export default function baseModelFactory({ label, allowedProps = [] }) {
  return {
    label,
    allowedProps,

    /** CREATE */
    async create(data = {}) {
      const props = pickProps(data, allowedProps);
      const cypher = `
        CREATE (n:${label} { ${ID_PROP}: coalesce($${ID_PROP}, randomUUID()) })
        SET n += $props
        RETURN n AS node
      `;
      const records = await runQuery(
        cypher,
        { [ID_PROP]: data[ID_PROP], props },
        "WRITE",
      );
      const node = records[0]?.get("node");
      return node ? node.properties : null;
    },

    /** READ by id */
    async getById(id) {
      const cypher = `MATCH (n:${label} { ${ID_PROP}: $id }) RETURN n AS node`;
      const records = await runQuery(cypher, { id }, "READ");
      const node = records[0]?.get("node");
      return node ? node.properties : null;
    },

    /** LIST con búsqueda simple y paginación */
    async list({ q, skip = 0, limit = 25 } = {}) {
      const filter = q
        ? `WHERE any(k in keys(n) WHERE toString(n[k]) CONTAINS $q)`
        : "";
      const cypher = `
        MATCH (n:${label})
        ${filter}
        RETURN n AS node
        SKIP toInteger($skip)
        LIMIT toInteger($limit)
      `;
      const records = await runQuery(cypher, { q, skip, limit }, "READ");
      return records.map((r) => r.get("node").properties);
    },

    /** UPDATE (merge parcial de props permitidas) */
    async update(id, data = {}) {
      const props = pickProps(data, allowedProps);
      const cypher = `
        MATCH (n:${label} { ${ID_PROP}: $id })
        SET n += $props
        RETURN n AS node
      `;
      const records = await runQuery(cypher, { id, props }, "WRITE");
      const node = records[0]?.get("node");
      return node ? node.properties : null;
    },

    /** DELETE (DETACH) */
    async remove(id) {
      const cypher = `
        MATCH (n:${label} { ${ID_PROP}: $id })
        DETACH DELETE n
        RETURN $id AS id
      `;
      const records = await runQuery(cypher, { id }, "WRITE");
      return records[0]?.get("id") || null;
    },
  };
}
