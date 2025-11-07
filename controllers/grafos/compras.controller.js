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

// ========== helpers numeric coercion ==========
function toInt(v) {
  return typeof v?.toInt === "function" ? v.toInt() : Number(v);
}

function toNumber(v) {
  if (v == null) return 0;
  if (typeof v.toNumber === "function") return v.toNumber();
  if (typeof v.toInt === "function") return v.toInt();
  return Number(v);
}

// ==================== FUNCIONES CRUD BÁSICAS ====================

// CREATE - Crear nueva compra
export async function create(req, res) {
  try {
    const {
      usuarioId,
      sitioId,
      platoId,
      fecha,
      total,
      cantidad = 1,
      notas = "",
    } = req.body;
    const compraId = crypto.randomUUID();

    const cypher = `
      MATCH (u:Usuario {${ID_PROP}: $usuarioId})
      MATCH (s:Sitio {${ID_PROP}: $sitioId})
      MATCH (p:Plato {${ID_PROP}: $platoId})
      CREATE (c:Compra {
        ${ID_PROP}: $compraId,
        fecha: $fecha,
        total: $total,
        cantidad: $cantidad,
        notas: $notas,
        creadaEn: datetime()
      })
      CREATE (u)-[:REALIZO_COMPRA]->(c)
      CREATE (c)-[:EN_SITIO]->(s)
      CREATE (c)-[:INCLUYE_PLATO]->(p)
      RETURN c, u, s, p
    `;

    const rows = await runQuery(
      cypher,
      {
        usuarioId,
        sitioId,
        platoId,
        compraId,
        fecha,
        total: parseFloat(total),
        cantidad: parseInt(cantidad),
        notas,
      },
      "WRITE",
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el usuario, sitio o plato especificado",
      });
    }

    const row = rows[0];
    res.status(201).json({
      ok: true,
      compra: {
        ...row.get("c").properties,
        usuario: row.get("u").properties,
        sitio: row.get("s").properties,
        plato: row.get("p").properties,
      },
    });
  } catch (e) {
    console.error("Error al crear compra:", e);
    res
      .status(500)
      .json({ ok: false, msg: "Error al crear compra", error: e.message });
  }
}

// LIST - Listar todas las compras con filtros opcionales
export async function list(req, res) {
  try {
    const { page = 1, limit = 10, from, to } = req.query;
    const skipVal = (Number(page) - 1) * Number(limit);

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
      MATCH (u:Usuario)-[:REALIZO_COMPRA]->(c:Compra)
      OPTIONAL MATCH (c)-[:EN_SITIO]->(s:Sitio)
      OPTIONAL MATCH (c)-[:INCLUYE_PLATO]->(p:Plato)
      ${whereStr}
      RETURN c, u, s, p
      ORDER BY c.fecha DESC
      SKIP ${skipVal}
      LIMIT ${Number(limit)}
    `;

    const rows = await runQuery(cypher, params);

    const compras = rows.map((r) => ({
      ...r.get("c").properties,
      usuario: r.get("u").properties,
      sitio: r.get("s") ? r.get("s").properties : null,
      plato: r.get("p") ? r.get("p").properties : null,
    }));

    res.json({ ok: true, compras });
  } catch (e) {
    console.error("Error al listar compras:", e);
    res
      .status(500)
      .json({ ok: false, msg: "Error al listar compras", error: e.message });
  }
}

// GET BY ID - Obtener una compra por ID
export async function getById(req, res) {
  try {
    const { id } = req.params;

    const cypher = `
      MATCH (u:Usuario)-[:REALIZO_COMPRA]->(c:Compra {${ID_PROP}: $id})
      OPTIONAL MATCH (c)-[:EN_SITIO]->(s:Sitio)
      OPTIONAL MATCH (c)-[:INCLUYE_PLATO]->(p:Plato)
      RETURN c, u, s, p
    `;

    const rows = await runQuery(cypher, { id });

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "Compra no encontrada" });
    }

    const row = rows[0];
    res.json({
      ok: true,
      compra: {
        ...row.get("c").properties,
        usuario: row.get("u").properties,
        sitio: row.get("s") ? row.get("s").properties : null,
        plato: row.get("p") ? row.get("p").properties : null,
      },
    });
  } catch (e) {
    console.error("Error al obtener compra:", e);
    res
      .status(500)
      .json({ ok: false, msg: "Error al obtener compra", error: e.message });
  }
}

// UPDATE - Actualizar una compra
export async function update(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const setClauses = [];
    const params = { id };

    if (updates.fecha) {
      setClauses.push("c.fecha = $fecha");
      params.fecha = updates.fecha;
    }
    if (updates.total !== undefined) {
      setClauses.push("c.total = $total");
      params.total = parseFloat(updates.total);
    }
    if (updates.cantidad !== undefined) {
      setClauses.push("c.cantidad = $cantidad");
      params.cantidad = parseInt(updates.cantidad);
    }
    if (updates.notas !== undefined) {
      setClauses.push("c.notas = $notas");
      params.notas = updates.notas;
    }

    // Actualizar propiedades básicas si hay cambios
    if (setClauses.length > 0) {
      setClauses.push("c.actualizadaEn = datetime()");
      const updateCypher = `
        MATCH (c:Compra {${ID_PROP}: $id})
        SET ${setClauses.join(", ")}
        RETURN c
      `;
      const rows = await runQuery(updateCypher, params, "WRITE");

      if (rows.length === 0) {
        return res.status(404).json({ ok: false, msg: "Compra no encontrada" });
      }
    }

    // Actualizar relación con usuario si se proporciona
    if (updates.usuarioId) {
      await runQuery(
        `
        MATCH (c:Compra {${ID_PROP}: $id})
        MATCH (c)<-[r:REALIZO_COMPRA]-(:Usuario)
        DELETE r
        WITH c
        MATCH (u:Usuario {${ID_PROP}: $usuarioId})
        CREATE (u)-[:REALIZO_COMPRA]->(c)
        `,
        { id, usuarioId: updates.usuarioId },
        "WRITE",
      );
    }

    // Actualizar relación con sitio si se proporciona
    if (updates.sitioId) {
      await runQuery(
        `
        MATCH (c:Compra {${ID_PROP}: $id})
        MATCH (c)-[r:EN_SITIO]->(:Sitio)
        DELETE r
        WITH c
        MATCH (s:Sitio {${ID_PROP}: $sitioId})
        CREATE (c)-[:EN_SITIO]->(s)
        `,
        { id, sitioId: updates.sitioId },
        "WRITE",
      );
    }

    // Actualizar relación con plato si se proporciona
    if (updates.platoId) {
      await runQuery(
        `
        MATCH (c:Compra {${ID_PROP}: $id})
        MATCH (c)-[r:INCLUYE_PLATO]->(:Plato)
        DELETE r
        WITH c
        MATCH (p:Plato {${ID_PROP}: $platoId})
        CREATE (c)-[:INCLUYE_PLATO]->(p)
        `,
        { id, platoId: updates.platoId },
        "WRITE",
      );
    }

    // Obtener la compra actualizada
    const rows = await runQuery(
      `
      MATCH (u:Usuario)-[:REALIZO_COMPRA]->(c:Compra {${ID_PROP}: $id})
      OPTIONAL MATCH (c)-[:EN_SITIO]->(s:Sitio)
      OPTIONAL MATCH (c)-[:INCLUYE_PLATO]->(p:Plato)
      RETURN c, u, s, p
      `,
      { id },
    );

    const row = rows[0];
    res.json({
      ok: true,
      compra: {
        ...row.get("c").properties,
        usuario: row.get("u").properties,
        sitio: row.get("s") ? row.get("s").properties : null,
        plato: row.get("p") ? row.get("p").properties : null,
      },
    });
  } catch (e) {
    console.error("Error al actualizar compra:", e);
    res
      .status(500)
      .json({ ok: false, msg: "Error al actualizar compra", error: e.message });
  }
}

// DELETE - Eliminar una compra
export async function remove(req, res) {
  try {
    const { id } = req.params;

    const cypher = `
      MATCH (c:Compra {${ID_PROP}: $id})
      OPTIONAL MATCH (c)-[r]-()
      DELETE r, c
      RETURN count(c) as deleted
    `;

    const rows = await runQuery(cypher, { id }, "WRITE");
    const deleted = toInt(rows[0].get("deleted"));

    if (deleted === 0) {
      return res.status(404).json({ ok: false, msg: "Compra no encontrada" });
    }

    res.json({ ok: true, msg: "Compra eliminada exitosamente" });
  } catch (e) {
    console.error("Error al eliminar compra:", e);
    res
      .status(500)
      .json({ ok: false, msg: "Error al eliminar compra", error: e.message });
  }
}

// ==================== FUNCIONES ESPECIALES/AGREGACIONES ====================

// COMPRAS DE USUARIO - Obtener todas las compras de un usuario específico
export async function comprasDeUsuario(req, res) {
  try {
    const { id } = req.params;
    const cypher = `
      MATCH (u:Usuario {${ID_PROP}: $id})-[:REALIZO_COMPRA]->(c:Compra)
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

// DETALLE COMPRA - Detalle de una compra específica
export async function detalleCompra(req, res) {
  try {
    const { id } = req.params;
    const cypher = `
      MATCH (u:Usuario)-[:REALIZO_COMPRA]->(c:Compra {${ID_PROP}: $id})
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

// TOP PLATOS - Obtener los platos más comprados
export async function topPlatos(req, res) {
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

// TOP SITIOS - Obtener los sitios más visitados
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

// SERIE DIARIA - Obtener serie temporal de compras por día
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
