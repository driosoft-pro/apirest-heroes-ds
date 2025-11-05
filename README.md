# API REST — SQL + NoSQL + **Grafos (Neo4j)** + Python Utils

**Gestión de Héroes, Películas y Multimedia con Node.js/Express + MySQL/MongoDB + Neo4j (grafos) + utilidades Python para migraciones**

---

## Descripción general

Este proyecto expone una **API REST en Node.js + Express** que puede operar contra **SQL (MySQL)**, **NoSQL (MongoDB)** y **Grafos (Neo4j)**.
Además incorpora **utilidades en Python** para facilitar **migraciones de datos, validaciones y análisis** (exportar/importar JSON, comparar datasets y generar visualizaciones).

> Puedes elegir el motor relacional/documental en tiempo de ejecución con la variable `DB_DRIVER`:
>
> - `DB_DRIVER=sql` → usa MySQL (Sequelize).
> - `DB_DRIVER=nosql` → usa MongoDB (Mongoose).
>
> El **módulo de grafos (Neo4j)** es **adicional** y expone sus rutas propias bajo `/api/grafos` (funciona de forma independiente a `DB_DRIVER`).

---

## Tecnologías

| Capa             | Tecnología                                                    | Descripción                          |
| ---------------- | ------------------------------------------------------------- | ------------------------------------ |
| Backend          | Node.js 18+ + Express                                         | API principal                        |
| SQL              | MySQL 8+ (Sequelize)                                          | Gestión relacional                   |
| NoSQL            | MongoDB 6+ (Mongoose / PyMongo)                               | Gestión documental                   |
| **Grafos**       | **Neo4j 5+ (neo4j-driver)**                                   | **Nodos y relaciones**               |
| Migración / Data | Python 3.11+                                                  | Scripts CLI y Notebook               |
| Librerías Py     | pandas, polars, numpy, pymongo, matplotlib, seaborn, tabulate | Herramientas de análisis y migración |

---

## Estructura del proyecto (actualizada)

```
├── controllers/
│   ├── heroesSQL.controller.js
│   ├── heroesNoSQL.controller.js
│   ├── peliculasSQL.controller.js
│   ├── peliculasNoSQL.controller.js
│   ├── multimediasSQL.controller.js
│   ├── multimediasNoSQL.controller.js
│   ├── protagonistasSQL.controller.js
│   ├── protagonistasNoSQL.controller.js
│   ├── usuarios.controller.js
│   └── grafos/
│       ├── pais.controller.js
│       ├── ciudad.controller.js
│       ├── persona.controller.js
│       ├── sitio.controller.js
│       ├── plato.controller.js
│       ├── usuario.controller.js
│       └── relaciones.controller.js
│
├── database/
│   ├── connectionSQL.js        # Sequelize (MySQL)
│   ├── connectionNoSQL.js      # Mongoose (MongoDB)
│   └── connectionGrafos.js     # neo4j-driver (exporta getSession(mode))
│
├── helpers/
│   ├── db-validators.js
│   └── generar-jwt.js
│
├── migracion_sql_nosql/
│   ├── migracion.ipynb
│   ├── export_sql_to_json.py
│   ├── import_json_to_mongo.py
│   ├── compare_datasets.py
│   └── visualize_data.py
│
├── models/
│   ├── SQL/...
│   ├── NoSQL/...
│   └── grafos/
│       ├── baseModelFactory.js
│       ├── pais.model.js
│       ├── ciudad.model.js
│       ├── persona.model.js
│       ├── sitio.model.js
│       ├── plato.model.js
│       └── usuario.model.js
│
├── routes/
│   ├── heroes.route.js
│   ├── peliculas.route.js
│   ├── multimedias.route.js
│   ├── protagonistas.route.js
│   ├── usuarios.route.js
│   └── grafos/
│       ├── pais.routes.js
│       ├── ciudad.routes.js
│       ├── persona.routes.js
│       ├── sitio.routes.js
│       ├── plato.routes.js
│       ├── usuario.routes.js
│       └── relaciones.routes.js
│   └── grafos.route.js         # Agregador de rutas de grafos
│
├── scripts/
│   └── constraints.cypher      # Constraints/índices para Neo4j
│
├── app.js
├── package.json
├── .env.example
└── README.md
```

> Si ya contabas con otra estructura, solo **añade** las carpetas/archivos de `grafos` y el `grafos.route.js`.

---

## ⚙️ Variables de entorno

Copia/ajusta en tu `.env` (o `.env.example`):

```env
# Core
PORT=4000
DB_DRIVER=sql        # sql | nosql

# ===== SQL (MySQL) =====
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=heroesdb

# ===== NoSQL (MongoDB) =====
MONGO_URI=mongodb://localhost:27017/heroesdb
MONGO_USER=
MONGO_PASS=

# ===== Grafos (Neo4j) =====
NEO4J_URI=neo4j+s://<tu-host>.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=super-secreto
NEO4J_DATABASE=neo4j
```

> El driver se inicializa en `database/connectionGrafos.js` y debe exportar **`getSession(mode)`** (READ/WRITE).

---

## Integración de rutas de grafos en la app

En tu **app.js** (ESM), agrega **una sola línea** para montar el agregador de rutas de grafos:

```js
import express from "express";
// ...tus otras importaciones
import grafosRoutes from "./routes/grafos.route.js";

const app = express();
// ...middlewares, rutas existentes

// Monta las rutas de grafos bajo /api/grafos
app.use("/api/grafos", grafosRoutes);

// ...arranque del servidor
export default app;
```

> No se modifica nada más. El resto de tu app permanece intacto.

---

## Rutas de Grafos (Neo4j)

Base: `http://localhost:4000/api/grafos` (ajusta `PORT` si corresponde).

### Nodos (CRUD estándar)

Para cada recurso: **`POST /`**, **`GET /`**, **`GET /:id`**, **`PUT /:id`**, **`DELETE /:id`**

- **País** → `/pais`
- **Ciudad** → `/ciudad`
- **Persona** → `/persona`
- **Sitio** → `/sitio`
- **Plato** → `/plato`
- **Usuario** → `/usuario`

#### Ejemplos rápidos (cURL)

**Crear País**

```bash
curl -X POST http://localhost:4000/api/grafos/pais   -H 'Content-Type: application/json'   -d '{"nombre":"Colombia","iso":"CO","idioma":"es","capital":"Bogotá"}'
```

**Listar Personas (paginado + búsqueda)**

```bash
curl 'http://localhost:4000/api/grafos/persona?q=ana&skip=0&limit=20'
```

**Actualizar Sitio**

```bash
curl -X PUT http://localhost:4000/api/grafos/sitio/<id-sitio>   -H 'Content-Type: application/json'   -d '{"tipo":"Museo","lat":4.61,"lng":-74.08}'
```

**Eliminar Plato**

```bash
curl -X DELETE http://localhost:4000/api/grafos/plato/<id-plato>
```

> **Notas**
>
> - Si **no envías `id`** al crear, el sistema genera uno con `randomUUID()` en Neo4j.
> - Los modelos solo aceptan **propiedades permitidas** por recurso (whitelist).

### Relaciones (genéricas)

Rutas: `/relaciones`

- **Crear relación** → `POST /api/grafos/relaciones`
  Body (JSON):

  ```json
  {
    "fromLabel": "Persona",
    "fromId": "<uuid-persona>",
    "type": "VIVE_EN",
    "toLabel": "Ciudad",
    "toId": "<uuid-ciudad>",
    "props": { "desde": "2020-01-01" }
  }
  ```

- **Eliminar relación** → `DELETE /api/grafos/relaciones`
  Body (JSON):

  ```json
  {
    "fromLabel": "Persona",
    "fromId": "<uuid-persona>",
    "type": "VIVE_EN",
    "toLabel": "Ciudad",
    "toId": "<uuid-ciudad>"
  }
  ```

- **Listar relaciones salientes de un nodo** → `GET /api/grafos/relaciones/:label/:id`
  Ejemplo:
  `GET /api/grafos/relaciones/Persona/<uuid-persona>`

#### Ejemplos rápidos (cURL)

**Crear relación VIVE_EN**

```bash
curl -X POST http://localhost:4000/api/grafos/relaciones   -H 'Content-Type: application/json'   -d '{
        "fromLabel":"Persona","fromId":"<uuid-persona>",
        "type":"VIVE_EN",
        "toLabel":"Ciudad","toId":"<uuid-ciudad>",
        "props":{"desde":"2020-01-01"}
      }'
```

**Eliminar relación**

```bash
curl -X DELETE http://localhost:4000/api/grafos/relaciones   -H 'Content-Type: application/json'   -d '{
        "fromLabel":"Persona","fromId":"<uuid-persona>",
        "type":"VIVE_EN",
        "toLabel":"Ciudad","toId":"<uuid-ciudad>"
      }'
```

**Listar relaciones de una Persona**

```bash
curl http://localhost:4000/api/grafos/relaciones/Persona/<uuid-persona>
```

---

## Constraints/Índices (opcional pero recomendado)

Archivo: `scripts/constraints.cypher`

```cypher
CREATE CONSTRAINT pais_id IF NOT EXISTS FOR (n:Pais) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT ciudad_id IF NOT EXISTS FOR (n:Ciudad) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT persona_id IF NOT EXISTS FOR (n:Persona) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT sitio_id IF NOT EXISTS FOR (n:Sitio) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT plato_id IF NOT EXISTS FOR (n:Plato) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT usuario_id IF NOT EXISTS FOR (n:Usuario) REQUIRE n.id IS UNIQUE;

CREATE INDEX pais_nombre IF NOT EXISTS FOR (n:Pais) ON (n.nombre);
CREATE INDEX ciudad_nombre IF NOT EXISTS FOR (n:Ciudad) ON (n.nombre);
CREATE INDEX persona_email IF NOT EXISTS FOR (n:Persona) ON (n.email);
CREATE INDEX sitio_nombre IF NOT EXISTS FOR (n:Sitio) ON (n.nombre);
CREATE INDEX plato_nombre IF NOT EXISTS FOR (n:Plato) ON (n.nombre);
CREATE INDEX usuario_username IF NOT EXISTS FOR (n:Usuario) ON (n.username);
```

Ejecuta los constraints (si tienes `cypher-shell`):

```bash
cypher-shell -a "$NEO4J_URI" -u "$NEO4J_USER" -p "$NEO4J_PASSWORD" -d "$NEO4J_DATABASE" -f scripts/constraints.cypher
```

---

## Arranque rápido

1. Instalar dependencias de Node y configurar `.env` (SQL, NoSQL y Grafos):

```bash
npm install
```

2. (Opcional) Crear constraints/índices en Neo4j (ver sección anterior).

3. Levantar el servidor:

```bash
npm run dev     # o npm start
```

4. Probar endpoints de grafos:

- `POST /api/grafos/pais`
- `GET /api/grafos/persona`
- `POST /api/grafos/relaciones`

---

## Auth / Middlewares

Las rutas de grafos están listas para integrarse con tu esquema de **JWT** y middlewares existentes.
Si necesitas asegurar `/api/grafos/**`, agrega tu middleware al montar `grafosRoutes` o dentro de cada router.

---

## Autores

- **Deyton Riasco Ortiz** — driosoftpro@gmail.com
- **Samuel Izquierdo Bonilla** — samuelizquierdo98@gmail.com
  **Año:** 2025

---

## Licencia

Este proyecto se distribuye con fines académicos. Ajusta la licencia según tus necesidades.
