import { getSession } from "../../database/connectionGrafos.js";

const ID_PROP = "id";

// ===== utilitario Cypher =====
async function runQuery(cypher, params = {}, mode = "READ") {
  const session = getSession(mode);
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}

// ===== helpers de presentación =====
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
function firstLabel(labels, fallback) {
  return Array.isArray(labels) && labels.length
    ? labels[0]
    : fallback || "Desconocido";
}
function formatEdge(row, fallbackFromLabel) {
  const fromNode = row.get("fromNode")?.properties || {};
  const toNode = row.get("toNode")?.properties || {};
  const relProps = row.get("rel")?.properties || {};
  const type = row.get("type");
  const fromLbl = firstLabel(row.get("fromLabels"), fallbackFromLabel);
  const toLbl = firstLabel(row.get("toLabels"));

  return {
    relation: { type, properties: relProps },
    from: { label: fromLbl, id: fromNode.id, nombre: displayName(fromNode) },
    to: { label: toLbl, id: toNode.id, nombre: displayName(toNode) },
  };
}

// ===== create =====
export async function create(req, res) {
  try {
    const { fromLabel, fromId, type, toLabel, toId, props = {} } = req.body;
    if (!fromLabel || !fromId || !type || !toLabel || !toId)
      return res.status(400).json({
        error: "fromLabel, fromId, type, toLabel, toId son requeridos",
      });

    const cypher = `
      MATCH (a:${fromLabel} { ${ID_PROP}: $fromId })
      MATCH (b:${toLabel}  { ${ID_PROP}: $toId })
      MERGE (a)-[r:${type}]->(b)
      SET r += $props
      RETURN labels(a) AS fromLabels, a AS fromNode,
             type(r) AS type,       r AS rel,
             labels(b) AS toLabels, b AS toNode
    `;
    const [row] = await runQuery(cypher, { fromId, toId, props }, "WRITE");
    if (!row) return res.status(404).json({ error: "Nodos no encontrados" });
    return res.status(201).json(formatEdge(row, fromLabel));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== remove =====
export async function remove(req, res) {
  try {
    const { fromLabel, fromId, type, toLabel, toId } = req.body;
    if (!fromLabel || !fromId || !type || !toLabel || !toId)
      return res.status(400).json({
        error: "fromLabel, fromId, type, toLabel, toId son requeridos",
      });

    const cypher = `
      MATCH (a:${fromLabel} { ${ID_PROP}: $fromId })-[r:${type}]->(b:${toLabel} { ${ID_PROP}: $toId })
      DELETE r
      RETURN $fromId AS fromId, $toId AS toId, '${type}' AS type
    `;
    const [row] = await runQuery(cypher, { fromId, toId }, "WRITE");
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

// ===== listFrom =====
export async function listFrom(req, res) {
  try {
    const { label, id } = req.params;
    const cypher = `
      MATCH (a:${label} { ${ID_PROP}: $id })-[r]->(b)
      RETURN labels(a) AS fromLabels, a AS fromNode,
             type(r) AS type,       r AS rel,
             labels(b) AS toLabels, b AS toNode
    `;
    const records = await runQuery(cypher, { id });
    return res.json(records.map((r) => formatEdge(r, label)));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== listTo =====
export async function listTo(req, res) {
  try {
    const { label, id } = req.params;
    const cypher = `
      MATCH (a)-[r]->(b:${label} { ${ID_PROP}: $id })
      RETURN labels(a) AS fromLabels, a AS fromNode,
             type(r) AS type,       r AS rel,
             labels(b) AS toLabels, b AS toNode
    `;
    const records = await runQuery(cypher, { id });
    return res.json(records.map((r) => formatEdge(r)));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== listAll =====
export async function listAll(req, res) {
  try {
    const { label, id } = req.params;
    const cypher = `
      MATCH (x:${label} { ${ID_PROP}: $id })
      OPTIONAL MATCH (x)-[r1]->(o1)
      RETURN labels(x)  AS fromLabels, x  AS fromNode,
             type(r1)   AS type,       r1 AS rel,
             labels(o1) AS toLabels,   o1 AS toNode
      UNION
      MATCH (x:${label} { ${ID_PROP}: $id })
      OPTIONAL MATCH (i2)-[r2]->(x)
      RETURN labels(i2) AS fromLabels, i2 AS fromNode,
             type(r2)   AS type,       r2 AS rel,
             labels(x)  AS toLabels,   x  AS toNode
    `;
    const records = await runQuery(cypher, { id });
    const data = records
      .filter((r) => r.get("rel"))
      .map((r) => formatEdge(r, label));
    return res.json(data);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== listFromByType =====
export async function listFromByType(req, res) {
  try {
    const { label, id, type } = req.params;
    const cypher = `
      MATCH (a:${label} { ${ID_PROP}: $id })-[r:${type}]->(b)
      RETURN labels(a) AS fromLabels, a AS fromNode,
             type(r) AS type,       r AS rel,
             labels(b) AS toLabels, b AS toNode
    `;
    const records = await runQuery(cypher, { id });
    return res.json(records.map((r) => formatEdge(r, label)));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== updateRelProps =====
export async function updateRelProps(req, res) {
  try {
    const { fromLabel, fromId, type, toLabel, toId, props = {} } = req.body;
    const cypher = `
      MATCH (a:${fromLabel} { ${ID_PROP}: $fromId })-[r:${type}]->(b:${toLabel} { ${ID_PROP}: $toId })
      SET r += $props
      RETURN labels(a) AS fromLabels, a AS fromNode,
             type(r) AS type, r AS rel,
             labels(b) AS toLabels,   b AS toNode
    `;
    const [row] = await runQuery(cypher, { fromId, toId, props }, "WRITE");
    if (!row) return res.status(404).json({ error: "Relación no encontrada" });
    return res.json(formatEdge(row, fromLabel));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== deleteBetween =====
export async function deleteBetween(req, res) {
  try {
    const { fromLabel, fromId, toLabel, toId, type } = req.body;
    const typeFilter = type ? `:[${type}]` : "";
    const cypher = `
      MATCH (a:${fromLabel} { ${ID_PROP}: $fromId })-[r${typeFilter}]->(b:${toLabel} { ${ID_PROP}: $toId })
      WITH collect(r) AS rels, size(collect(r)) AS count
      FOREACH (rel IN rels | DELETE rel)
      RETURN count AS deleted
    `;
    const [row] = await runQuery(cypher, { fromId, toId }, "WRITE");
    return res.json({ deleted: row?.get("deleted") || 0 });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== degree =====
export async function degree(req, res) {
  try {
    const { label, id } = req.params;
    const cypher = `
      MATCH (n:${label} { ${ID_PROP}: $id })
      RETURN size((n)-->) AS out, size((n)<--) AS in, size((n)--()) AS all
    `;
    const [row] = await runQuery(cypher, { id });
    return res.json({
      out: row.get("out"),
      in: row.get("in"),
      all: row.get("all"),
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== neighbors =====
export async function neighbors(req, res) {
  try {
    const { label, id } = req.params;
    const depth = Math.max(1, Math.min(3, Number(req.query.depth || 1)));
    const type = req.query.type;
    const typePattern = type ? `:${type}` : "";

    const cypher = `
      MATCH (root:${label} { ${ID_PROP}: $id })
      CALL {
        WITH root
        MATCH p = (root)-[${typePattern}*1..${depth}]-(n)
        RETURN p
      }
      RETURN p
    `;
    const recs = await runQuery(cypher, { id });

    const nodes = new Map();
    const rels = [];
    for (const r of recs) {
      const path = r.get("p");
      path.segments.forEach((seg) => {
        const a = seg.start,
          b = seg.end,
          rel = seg.relationship;
        nodes.set(a.identity.toString(), {
          id: a.properties.id,
          label: firstLabel(a.labels),
          nombre: displayName(a.properties),
        });
        nodes.set(b.identity.toString(), {
          id: b.properties.id,
          label: firstLabel(b.labels),
          nombre: displayName(b.properties),
        });
        rels.push({
          type: rel.type,
          from: a.properties.id,
          to: b.properties.id,
          properties: rel.properties || {},
        });
      });
    }
    return res.json({ nodes: Array.from(nodes.values()), rels });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== shortestPath =====
export async function shortestPath(req, res) {
  try {
    const { fromLabel, fromId, toLabel, toId, type } = req.body;
    const typePattern = type ? `:${type}` : "";
    const cypher = `
      MATCH (a:${fromLabel} { ${ID_PROP}: $fromId })
      MATCH (b:${toLabel}  { ${ID_PROP}: $toId })
      MATCH p = shortestPath((a)-[${typePattern}*..5]-(b))
      RETURN p
    `;
    const [row] = await runQuery(cypher, { fromId, toId });
    if (!row) return res.status(404).json({ error: "No existe camino" });

    const path = row.get("p");
    const nodes = new Map();
    const rels = [];
    path.segments.forEach((seg) => {
      const a = seg.start,
        b = seg.end,
        rel = seg.relationship;
      nodes.set(a.identity.toString(), {
        id: a.properties.id,
        label: firstLabel(a.labels),
        nombre: displayName(a.properties),
      });
      nodes.set(b.identity.toString(), {
        id: b.properties.id,
        label: firstLabel(b.labels),
        nombre: displayName(b.properties),
      });
      rels.push({
        type: rel.type,
        from: a.properties.id,
        to: b.properties.id,
        properties: rel.properties || {},
      });
    });
    return res.json({ nodes: Array.from(nodes.values()), rels });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

// ===== subgraph (alias de neighbors) =====
export async function subgraph(req, res) {
  return neighbors(req, res);
}
