// ============================================
// VERIFICACIÓN
// ============================================

// Contar todos los nodos por tipo
MATCH (n)
RETURN labels(n)[0] as tipo, COUNT(n) as cantidad
ORDER BY cantidad DESC;

// Verificar que todos los nodos tienen ID
MATCH (n)
WHERE n.id IS NULL
RETURN labels(n)[0] as tipo_sin_id, COUNT(n) as cantidad;

// Ver resumen de relaciones
MATCH ()-[r]->()
RETURN type(r) as tipo_relacion, COUNT(r) as cantidad
ORDER BY cantidad DESC;

// ============================================
// CONSULTAS
// ============================================

// 1. Ver las persona famosas cuales son deportistas, hombres, indicando su procedencia.
MATCH (p:Persona {profesion:'Deportista'})-[:NACIO_EN]->(c:Ciudad)
WHERE p.genero = 'Masculino'
RETURN p.nombre AS Deportista, p.genero AS Genero, c.ciudad AS Ciudad;

// 2. Ver platos más vendidos
MATCH (c:Compra)-[:INCLUYE_PLATO]->(p:Plato)
RETURN p.id, p.plato, COUNT(c) as veces_vendido, p.precio
ORDER BY veces_vendido DESC;

// 3. Ver todas las compras de un usuario
MATCH (u:Usuario {email:'sam@gmail.com'})-[:REALIZO_COMPRA]->(c:Compra)-[:INCLUYE_PLATO]->(p:Plato)
MATCH (c)-[:EN_SITIO]->(s:Sitio)
RETURN u.id, u.nombre, c.id, c.fecha, p.plato, c.total, s.sitio
ORDER BY c.fecha DESC;

// 4. Ver total gastado por usuario
MATCH (u:Usuario)-[:REALIZO_COMPRA]->(c:Compra)
RETURN u.id, u.nombre, u.email, SUM(c.total) as total_gastado
ORDER BY total_gastado DESC;



// 5. Ver compras por sitio
MATCH (s:Sitio)<-[:EN_SITIO]-(c:Compra)-[:INCLUYE_PLATO]->(p:Plato)
RETURN s.id, s.sitio, COUNT(c) as total_compras, SUM(c.total) as ingresos_totales
ORDER BY ingresos_totales DESC;

// 6. Ver compras en un rango de fechas
MATCH (c:Compra)-[:INCLUYE_PLATO]->(p:Plato)
WHERE c.fecha >= '2025-11-01' AND c.fecha <= '2025-11-15'
RETURN c.id, c.fecha, p.plato, c.total
ORDER BY c.fecha;

// 7. Ver historial completo de un usuario (visitas + compras)
MATCH (u:Usuario {email:'sam@gmail.com'})
OPTIONAL MATCH (u)-[v:VISITO]->(sitio_visitado:Sitio)
OPTIONAL MATCH (u)-[:REALIZO_COMPRA]->(c:Compra)-[:EN_SITIO]->(sitio_compra:Sitio)
OPTIONAL MATCH (c)-[:INCLUYE_PLATO]->(p:Plato)
RETURN u.nombre, v.fecha as fecha_visita, sitio_visitado.sitio,
       c.fecha as fecha_compra, sitio_compra.sitio, p.plato, c.total
ORDER BY coalesce(c.fecha, v.fecha) DESC;

// 8. Ver usuarios que viven en una ciudad específica
MATCH (u:Usuario)-[:VIVE_EN]->(c:Ciudad {ciudad:'Cali'})
RETURN u.id, u.nombre, u.email, c.ciudad;

// 9. Ver personas famosas de un país
MATCH (p:Persona)-[:NACIO_EN]->(c:Ciudad)-[:PERTENECE_A]->(pais:Pais {pais:'Colombia'})
RETURN p.id, p.nombre, p.profesion, p.genero, c.ciudad
ORDER BY p.profesion, p.nombre;

// 10. Ver sitios turísticos de una ciudad
MATCH (s:Sitio)-[:UBICADO_EN]->(c:Ciudad {ciudad:'Bogotá'})
RETURN s.id, s.sitio, s.tipo, c.ciudad
ORDER BY s.tipo;

// 11. Ver menú disponible en un sitio
MATCH (p:Plato)-[:SE_VENDE_EN]->(s:Sitio {sitio:'Restaurante Andrés Carne de Res'})
RETURN s.id, s.sitio, p.id, p.plato, p.precio
ORDER BY p.precio;

// 12. Ver ciudades de un país con conteo de sitios
MATCH (c:Ciudad)-[:PERTENECE_A]->(p:Pais {pais:'Colombia'})
OPTIONAL MATCH (s:Sitio)-[:UBICADO_EN]->(c)
RETURN c.id, c.ciudad, p.pais, COUNT(s) as total_sitios
ORDER BY total_sitios DESC;

// 13. Ver usuarios que visitaron un sitio específico
MATCH (u:Usuario)-[v:VISITO]->(s:Sitio {sitio:'Museo del Oro'})
RETURN u.id, u.nombre, u.email, v.fecha, v.hora
ORDER BY v.fecha DESC;

// 14. Ver platos de un país específico (a través de sitios)
MATCH (p:Plato)-[:SE_VENDE_EN]->(s:Sitio)-[:UBICADO_EN]->(c:Ciudad)-[:PERTENECE_A]->(pais:Pais {pais:'Colombia'})
RETURN DISTINCT p.id, p.plato, p.precio
ORDER BY p.plato;

// 15. Ver compras realizadas en sitios de una ciudad
MATCH (c:Compra)-[:EN_SITIO]->(s:Sitio)-[:UBICADO_EN]->(ciudad:Ciudad {ciudad:'Bogotá'})
MATCH (c)-[:INCLUYE_PLATO]->(p:Plato)
MATCH (u:Usuario)-[:REALIZO_COMPRA]->(c)
RETURN ciudad.ciudad, s.sitio, u.nombre, p.plato, c.fecha, c.total
ORDER BY c.fecha DESC;

// 16. Ver estadísticas de un usuario
MATCH (u:Usuario {email:'sam@gmail.com'})
OPTIONAL MATCH (u)-[:REALIZO_COMPRA]->(compra:Compra)
OPTIONAL MATCH (u)-[:VISITO]->(sitio:Sitio)
RETURN u.id, u.nombre, u.email,
       COUNT(DISTINCT compra) as total_compras,
       SUM(compra.total) as total_gastado,
       COUNT(DISTINCT sitio) as sitios_visitados;

