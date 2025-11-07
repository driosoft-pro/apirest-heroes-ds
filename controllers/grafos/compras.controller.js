import { getSession } from "../../database/connectionGrafos.js";

const ID_PROP = "id";

// ========== Utilitario Cypher ==========
async function runQuery(cypher, params = {}, mode = "READ") {
  const session = getSession(mode);
  try {
    const res = await session.run(cypher, params);
    return res.records;
  } finally {
    await session.close();
  }
}

// ========== Helpers presentación ==========
function displayName(props = {}) {
  return (
    props.nombre ||
    props.username ||
    props.pais ||
    props.ciudad ||
    props.sitio ||
    props.plato ||
    props.titulo ||
    props.name ||
    undefined
  );
}
function firstLabel(labels) {
  return Array.isArray(labels) && labels.length ? labels[0] : "Desconocido";
}

// ========== Endpoints base (detalle y por usuario) ==========
export async function comprasDeUsuario(req, res) {
  try {
    const { id } = req.params;
    const cypher = `
      MATCH (u:Usuario { ${ID_PROP}: $id })-[:REALIZO_COMPRA]->(c:Compra)
      OPTIONAL MATCH (c)-[:INCLUYE_PLATO]->(p:Plato)
      OPTIONAL MATCH (c)-[:EN_SITIO]->(s:Sitio)
      RETURN u, c, p, s
      ORDER BY c.fecha DESC
    `;
    const rows = await runQuery(cypher, { id });
    const data = rows.map((r) => ({
      usuario: {
        id: r.get("u").properties.id,
        nombre: displayName(r.get("u").properties),
      },
      compra: r.get("c").properties,
      plato: r.get("p") ? r.get("p").properties : null,
      sitio: r.get("s") ? r.get("s").properties : null,
    }));
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function detalleCompra(req, res) {
  try {
    const { id } = req.params;
    const cypher = `
      MATCH (u:Usuario)-[:REALIZO_COMPRA]->(c:Compra { ${ID_PROP}: $id })
      OPTIONAL MATCH (c)-[:INCLUYE_PLATO]->(p:Plato)
      OPTIONAL MATCH (c)-[:EN_SITIO]->(s:Sitio)
      RETURN u, c, p, s
    `;
    const [row] = await runQuery(cypher, { id });
    if (!row) return res.status(404).json({ error: "Compra no encontrada" });
    res.json({
      usuario: {
        id: row.get("u").properties.id,
        nombre: displayName(row.get("u").properties),
      },
      compra: row.get("c").properties,
      plato: row.get("p") ? row.get("p").properties : null,
      sitio: row.get("s") ? row.get("s").properties : null,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// ========== Agregados: Top-N por plato ==========
export async function topPlatos(req, res) {
  try {
    const { from, to, limit = 10 } = req.query;
    // Si fecha está guardada en formato ISO YYYY-MM-DD, el filtro lexicográfico sirve.
    const where = [];
    const params = { limit: Number(limit) };
    if (from) {
      where.push("c.fecha >= $from");
      params.from = from;
    }
    if (to) {
      where.push("c.fecha <= $to");
      params.to = to;
    }
    const whereStr = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const cypher = `
      MATCH (c:Compra)-[:INCLUYE_PLATO]->(p:Plato)
      ${whereStr}
      RETURN
        p.plato        AS plato,
        p.id           AS platoId,
        count(c)       AS compras,
        coalesce(sum(c.cantidad), 0) AS unidades,
        coalesce(sum(c.total), 0)    AS total
      ORDER BY total DESC, compras DESC
      LIMIT toInteger($limit)
    `;
    const rows = await runQuery(cypher, params);
    const data = rows.map((r) => ({
      plato: r.get("plato"),
      platoId: r.get("platoId"),
      compras: toInt(r.get("compras")),
      unidades: toNumber(r.get("unidades")),
      total: toNumber(r.get("total")),
    }));
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// ========== Agregados: Top-N por sitio ==========
export async function topSitios(req, res) {
  try {
    const { from, to, limit = 10 } = req.query;
    const where = [];
    const params = { limit: Number(limit) };
    if (from) {
      where.push("c.fecha >= $from");
      params.from = from;
    }
    if (to) {
      where.push("c.fecha <= $to");
      params.to = to;
    }
    const whereStr = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const cypher = `
      MATCH (c:Compra)-[:EN_SITIO]->(s:Sitio)
      ${whereStr}
      RETURN
        s.sitio        AS sitio,
        s.id           AS sitioId,
        count(c)       AS compras,
        coalesce(sum(c.cantidad), 0) AS unidades,
        coalesce(sum(c.total), 0)    AS total
      ORDER BY total DESC, compras DESC
      LIMIT toInteger($limit)
    `;
    const rows = await runQuery(cypher, params);
    const data = rows.map((r) => ({
      sitio: r.get("sitio"),
      sitioId: r.get("sitioId"),
      compras: toInt(r.get("compras")),
      unidades: toNumber(r.get("unidades")),
      total: toNumber(r.get("total")),
    }));
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// ========== Serie diaria por fecha ==========
export async function serieDiaria(req, res) {
  try {
    const { from, to } = req.query;
    const where = [];
    const params = {};
    if (from) {
      where.push("c.fecha >= $from");
      params.from = from;
    }
    if (to) {
      where.push("c.fecha <= $to");
      params.to = to;
    }
    const whereStr = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const cypher = `
      MATCH (c:Compra)
      ${whereStr}
      RETURN
        c.fecha                         AS fecha,
        count(c)                        AS compras,
        coalesce(sum(c.cantidad), 0)    AS unidades,
        coalesce(sum(c.total), 0)       AS total
      ORDER BY fecha ASC
    `;
    const rows = await runQuery(cypher, params);
    const data = rows.map((r) => ({
      fecha: r.get("fecha"),
      compras: toInt(r.get("compras")),
      unidades: toNumber(r.get("unidades")),
      total: toNumber(r.get("total")),
    }));
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// ========== helpers numeric coercion ==========
function toInt(v) {
  return typeof v?.toInt === "function" ? v.toInt() : Number(v);
}
function toNumber(v) {
  // Neo4j puede devolver Integer; coalesce con Number
  if (v == null) return 0;
  if (typeof v.toNumber === "function") return v.toNumber();
  if (typeof v.toInt === "function") return v.toInt();
  return Number(v);
}
