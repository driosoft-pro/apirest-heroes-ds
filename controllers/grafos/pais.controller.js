import Pais from "../../models/grafos/pais.model.js";

export async function create(req, res) {
  try {
    const node = await Pais.create(req.body);
    return res.status(201).json(node);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function list(req, res) {
  try {
    const { q, skip, limit } = req.query;
    const data = await Pais.list({
      q,
      skip: skip ? Number(skip) : 0,
      limit: limit ? Number(limit) : 25,
    });
    return res.json(data);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function getById(req, res) {
  try {
    const node = await Pais.getById(req.params.id);
    if (!node) return res.status(404).json({ error: "No encontrado" });
    return res.json(node);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function update(req, res) {
  try {
    const node = await Pais.update(req.params.id, req.body);
    if (!node) return res.status(404).json({ error: "No encontrado" });
    return res.json(node);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function remove(req, res) {
  try {
    const id = await Pais.remove(req.params.id);
    if (!id) return res.status(404).json({ error: "No encontrado" });
    return res.json({ id, deleted: true });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
