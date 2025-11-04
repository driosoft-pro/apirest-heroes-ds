// ============================================
// CONSULTAS DE EJEMPLO
// ============================================

// CONSULTA 1: De las personas famosas cuales son deportistas hombres, indicando su procedencia
MATCH (p:Persona {profesion:'Deportista'})-[:NACIO_EN]->(c:Ciudad)
WHERE p.genero = 'Masculino'
RETURN p.nombre AS Deportista, p.genero AS Genero, c.ciudad AS Ciudad;

// CONSULTA 2: Cuál es el plato más consumido por los usuarios
MATCH (u:Usuario)-[:CONSUMIO]->(p:Plato)
RETURN p.plato AS Plato, COUNT(u) AS VecesConsumido
ORDER BY VecesConsumido DESC
LIMIT 5;

// CONSULTA 3: Obtener todos los sitios turísticos de Colombia con su ubicación
MATCH (s:Sitio)-[:UBICADO_EN]->(c:Ciudad)-[:PERTENECE_A]->(p:Pais {pais:'Colombia'})
RETURN s.sitio AS Sitio, s.tipo AS Tipo, c.ciudad AS Ciudad
ORDER BY c.ciudad;

// CONSULTA 4: Usuarios que viven en Cali y los sitios que han visitado
MATCH (u:Usuario)-[:VIVE_EN]->(c:Ciudad {ciudad:'Cali'})
OPTIONAL MATCH (u)-[v:VISITO]->(s:Sitio)
RETURN u.nombre AS Usuario, u.email AS Email, 
        COLLECT(DISTINCT s.sitio) AS SitiosVisitados, 
        COUNT(DISTINCT s) AS TotalVisitas;

// CONSULTA 5: Platos disponibles en cada país con su precio promedio
MATCH (p:Plato)-[:SE_VENDE_EN]->(s:Sitio)-[:UBICADO_EN]->(c:Ciudad)-[:PERTENECE_A]->(pais:Pais)
RETURN pais.pais AS Pais, 
       COUNT(DISTINCT p.plato) AS CantidadPlatos, 
       AVG(p.precio) AS PrecioPromedio,
       MIN(p.precio) AS PlatoMasBarato,
       MAX(p.precio) AS PlatoMasCaro
ORDER BY PrecioPromedio DESC;

// CONSULTA 6: Ranking de restaurantes y hoteles más visitados
MATCH (u:Usuario)-[:VISITO]->(s:Sitio)
WHERE s.tipo IN ['Restaurante', 'Hotel']
WITH s, COUNT(u) AS Visitas
RETURN s.sitio AS Establecimiento, s.tipo AS Tipo, Visitas
ORDER BY Visitas DESC, s.sitio;

// CONSULTA 7: Personas famosas agrupadas por profesión y país de origen
MATCH (p:Persona)-[:NACIO_EN]->(c:Ciudad)-[:PERTENECE_A]->(pais:Pais)
RETURN pais.pais AS Pais, 
       p.profesion AS Profesion, 
       COUNT(p) AS Cantidad,
       COLLECT(p.nombre) AS Nombres
ORDER BY pais.pais, Cantidad DESC;

// CONSULTA 8: Usuarios con mayor gasto en consumo de platos
MATCH (u:Usuario)-[:CONSUMIO]->(p:Plato)
WITH u, SUM(p.precio) AS GastoTotal, COUNT(p) AS PlatosConsumidos
RETURN u.nombre AS Usuario, 
       u.email AS Email,
       PlatosConsumidos,
       GastoTotal AS TotalGastado
ORDER BY GastoTotal DESC
LIMIT 10;

// CONSULTA 9: Ciudades más populares por cantidad de visitas a sus sitios
MATCH (u:Usuario)-[:VISITO]->(s:Sitio)-[:UBICADO_EN]->(c:Ciudad)-[:PERTENECE_A]->(p:Pais)
WITH c, p, COUNT(u) AS TotalVisitas
RETURN p.pais AS Pais,
       c.ciudad AS Ciudad, 
       TotalVisitas
ORDER BY TotalVisitas DESC, p.pais;

// CONSULTA 10: Platos que nunca han sido consumidos
MATCH (p:Plato)
WHERE NOT EXISTS((p)<-[:CONSUMIO]-())
RETURN p.plato AS PlatoNoConsumido, 
       p.precio AS Precio
ORDER BY p.precio DESC;

// CONSULTA 11: Usuarios que han visitado sitios pero no han consumido nada
MATCH (u:Usuario)-[:VISITO]->(:Sitio)
WHERE NOT EXISTS((u)-[:CONSUMIO]->(:Plato))
RETURN u.nombre AS Usuario, 
       u.email AS Email,
       u.genero AS Genero;

// CONSULTA 12: Análisis de consumo por género de usuarios
MATCH (u:Usuario)-[:CONSUMIO]->(p:Plato)
WITH u.genero AS Genero, SUM(p.precio) AS TotalGastado, COUNT(p) AS TotalConsumos
RETURN Genero,
       TotalConsumos AS CantidadConsumos,
       TotalGastado AS GastoTotal,
       ROUND(TotalGastado * 1.0 / TotalConsumos) AS PromedioGastoPorConsumo
ORDER BY TotalGastado DESC;