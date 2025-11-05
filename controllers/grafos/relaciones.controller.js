import { getSession } from "../../database/connectionGrafos.js";

const ID_PROP = "id";

async function runQuery(cypher, params = {}) {
  const session = getSession("WRITE");
  try {
    const res = await session.run(cypher, params);
    return res.records;
  } finally {
    await session.close();
  }
}

export async function create(req, res) {
  try {
    const { fromLabel, fromId, type, toLabel, toId, props = {} } = req.body;
    if (!fromLabel || !fromId || !type || !toLabel || !toId) {
      return res.status(400).json({
        error: "fromLabel, fromId, type, toLabel, toId son requeridos",
      });
    }

    const cypher = `
      MATCH (a:${fromLabel} { ${ID_PROP}: $fromId })
      MATCH (b:${toLabel} { ${ID_PROP}: $toId })
      MERGE (a)-[r:${type}]->(b)
      SET r += $props
      RETURN a AS from, type(r) AS type, r AS rel, b AS to
    `;
    const [row] = await runQuery(cypher, { fromId, toId, props });
    if (!row) return res.status(404).json({ error: "Nodos no encontrados" });

    return res.status(201).json({
      from: row.get("from").properties,
      type: row.get("type"),
      rel: row.get("rel")?.properties || {},
      to: row.get("to").properties,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function remove(req, res) {
  try {
    const { fromLabel, fromId, type, toLabel, toId } = req.body;
    if (!fromLabel || !fromId || !type || !toLabel || !toId) {
      return res.status(400).json({
        error: "fromLabel, fromId, type, toLabel, toId son requeridos",
      });
    }

    const cypher = `
      MATCH (a:${fromLabel} { ${ID_PROP}: $fromId })-[r:${type}]->(b:${toLabel} { ${ID_PROP}: $toId })
      DELETE r
      RETURN $fromId AS fromId, $toId AS toId, '${type}' AS type
    `;
    const [row] = await runQuery(cypher, { fromId, toId });
    if (!row) return res.status(404).json({ error: "Relación no encontrada" });

    return res.json({
      deleted: true,
      fromId: row.get("fromId"),
      toId: row.get("toId"),
      type: row.get("type"),
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function listFrom(req, res) {
  try {
    const { label, id } = req.params;
    if (!label || !id)
      return res.status(400).json({ error: "label e id son requeridos" });

    const cypher = `
      MATCH (a:${label} { ${ID_PROP}: $id })-[r]->(b)
      RETURN type(r) AS type, r AS rel, b AS to
    `;
    const records = await runQuery(cypher, { id });
    const data = records.map((r) => ({
      type: r.get("type"),
      rel: r.get("rel")?.properties || {},
      to: r.get("to").properties,
    }));
    return res.json(data);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
