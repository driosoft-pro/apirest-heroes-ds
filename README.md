# API REST — SQL, NoSQL y Grafos (Neo4j)

Este proyecto expone una API REST en Node.js/Express que integra tres capas de persistencia: relacional (MySQL), documental (MongoDB) y grafos (Neo4j). La API mantiene endpoints claros y consistentes, con separación de controladores por backend y un módulo de grafos independiente.

---

## Índice

1. Descripción general
2. Arquitectura y estructura de carpetas
3. Requisitos y versiones recomendadas
4. Variables de entorno
5. Ejecución y perfiles
6. Enrutamiento y módulos
7. Endpoints por tecnología
   - SQL (MySQL/Sequelize)
   - NoSQL (MongoDB/Mongoose)
   - Grafos (Neo4j)
8. Ejemplos de uso (cURL)
9. Autenticación y seguridad
10. Migraciones y utilidades de datos (Python)
11. Buenas prácticas y notas
12. Licencia

---

## 1) Descripción general

- SQL (MySQL): modelos y controladores con Sequelize.
- NoSQL (MongoDB): modelos y controladores con Mongoose.
- Grafos (Neo4j): nodos y relaciones con el driver oficial neo4j-driver.
- Selección de backend relacional/documental mediante variable DB_DRIVER (sql o nosql).
- Módulo de grafos independiente montado bajo /api/grafos, no depende de DB_DRIVER.

Puerto por defecto usado en los ejemplos: 8082.

---

## 2) Arquitectura y estructura de carpetas

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
├── app.js
├── package.json
├── .env.example
└── README.md
```

---

## 3) Requisitos y versiones recomendadas

- Node.js >= 18
- npm >= 9
- MySQL >= 8
- MongoDB >= 6
- Neo4j >= 5 (o AuraDB)
- Python >= 3.11 (para utilidades de migración)

---

## 4) Variables de entorno

Cree un archivo .env con los siguientes valores. Ajuste credenciales y bases de datos según su entorno.

```env
# Core
PORT=8082
NODE_ENV=remote
DB_DRIVER=sql              # sql | nosql

# ===== SQL (MySQL) =====
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=su_password
DB_NAME=myDb

# ===== NoSQL (MongoDB) =====
MONGO_URI=mongodb://localhost:27017/BDALMA_DATOS
MONGO_USER=
MONGO_PASS=

# ===== Grafos (Neo4j) =====
NEO4J_URI=neo4j+s://<host>.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=su_password
NEO4J_DATABASE=BD_ALMADATOS

# ===== JWT =====
JWT_SECRET=su_clave_secreta_segura
```

Notas:

- DB_DRIVER solo afecta al backend SQL/NoSQL. El módulo de grafos funciona siempre y se monta bajo /api/grafos.
- connectionGrafos.js debe exportar getSession(mode) para que los modelos de grafos abran sesiones READ/WRITE sobre la base indicada.

---

## 5) Ejecución y perfiles

Instalación de dependencias:

```bash
npm install
```

Desarrollo con recarga:

```bash
npm start
# o
nodemon app.js
```

Cambiar de backend relacional/documental (opcional):

```bash
# SQL
DB_DRIVER=sql npm start

# NoSQL
DB_DRIVER=nosql npm start
```

La API queda accesible en:

```
http://localhost:8082/api
```

El módulo de grafos queda en:

```
http://localhost:8082/api/grafos
```

---

## 6) Enrutamiento y módulos

- app.js monta el agregador principal:

  ```js
  import routes from "./routes/index.js";
  app.use("/api", routes);
  ```

- routes/index.js incluye el agregador de grafos:

  ```js
  import grafosRoutes from "./grafos.route.js";
  router.use("/grafos", grafosRoutes);
  ```

- Los routers de recursos relacionales/documentales (héroes, películas, etc.) montan controladores específicos para SQL o NoSQL de acuerdo con DB_DRIVER. Los endpoints se mantienen estables, cambiando únicamente la implementación detrás del controlador.

---

## 7) Endpoints por tecnología

### 7.1 SQL (MySQL/Sequelize)

Prefijo base:

```
/api
```

Recursos principales (CRUD estándar; algunos endpoints pueden requerir JWT/roles):

- Héroes: `/heroes`
- Películas: `/peliculas`
- Protagonistas (relación Héroe↔Película): `/protagonistas`
- Multimedias: `/multimedias`
- Usuarios (auth y administración): `/usuarios`

Patrones comunes por recurso:

- `GET /api/<recurso>` — listar
- `GET /api/<recurso>/:id` — detalle
- `POST /api/<recurso>` — crear
- `PUT /api/<recurso>/:id` — actualizar
- `DELETE /api/<recurso>/:id` — eliminar

Ejemplos adicionales frecuentes (según tu proyecto):

- `GET /api/peliculas/:id/protagonistas`
- `GET /api/heroes/:id/multimedia`
- `GET /api/peliculas/:id/multimedia`

La selección del controlador SQL se realiza internamente según `DB_DRIVER=sql`.

### 7.2 NoSQL (MongoDB/Mongoose)

Prefijo base idéntico:

```
/api
```

Mismos recursos y rutas que en SQL; cambia el controlador a su versión NoSQL cuando `DB_DRIVER=nosql`. Los endpoints y los contratos JSON se mantienen consistentes para permitir alternar el backend sin cambios en el cliente.

### 7.3 Grafos (Neo4j)

Prefijo base:

```
/api/grafos
```

Nodos (CRUD estándar):

- País: `/pais`
- Ciudad: `/ciudad`
- Persona: `/persona`
- Sitio: `/sitio`
- Plato: `/plato`
- Usuario: `/usuario`

Métodos por recurso:

- `POST /api/grafos/<recurso>` — crear
- `GET /api/grafos/<recurso>` — listar (`?q=&skip=&limit=`)
- `GET /api/grafos/<recurso>/:id` — obtener por id
- `PUT /api/grafos/<recurso>/:id` — actualizar
- `DELETE /api/grafos/<recurso>/:id` — eliminar

Relaciones (genéricas):

- `POST /api/grafos/relaciones` — crear relación
  - Body JSON: `{ fromLabel, fromId, type, toLabel, toId, props? }`
- `DELETE /api/grafos/relaciones` — eliminar relación
  - Body JSON: `{ fromLabel, fromId, type, toLabel, toId }`
- `GET /api/grafos/relaciones/:label/:id` — listar relaciones salientes de un nodo

Notas:

- Si no envía `id` al crear un nodo de grafos, se genera con `randomUUID()`.
- Cada modelo de grafos valida una lista de propiedades permitidas por tipo de nodo.

---

## 8) Ejemplos de uso (cURL)

Ajuste el puerto si corre en otro distinto a 8082.

### 8.1 SQL/NoSQL (endpoints comunes)

Listar héroes:

```bash
curl http://localhost:8082/api/heroes
```

Crear héroe:

```bash
curl -X POST http://localhost:8082/api/heroes   -H "Content-Type: application/json"   -d '{"nombre":"Iron Man","poder":"Tecnología"}'
```

Asignar protagonista (Héroe↔Película):

```bash
curl -X POST http://localhost:8082/api/protagonistas   -H "Content-Type: application/json"   -d '{"heroeId":1,"peliculaId":10,"rol":"Cameo"}'
```

Listar multimedia por película:

```bash
curl http://localhost:8082/api/peliculas/10/multimedia
```

Autenticación:

```bash
curl -X POST http://localhost:8082/api/usuarios/login   -H "Content-Type: application/json"   -d '{"email":"admin@mail.com","password":"admin123"}'
```

### 8.2 Grafos (Neo4j)

Crear país:

```bash
curl -X POST http://localhost:8082/api/grafos/pais   -H "Content-Type: application/json"   -d '{"nombre":"Colombia","iso":"CO","idioma":"es","capital":"Bogotá"}'
```

Listar personas:

```bash
curl "http://localhost:8082/api/grafos/persona?skip=0&limit=20"
```

Actualizar sitio:

```bash
curl -X PUT http://localhost:8082/api/grafos/sitio/<id-sitio>   -H "Content-Type: application/json"   -d '{"tipo":"Museo","lat":4.61,"lng":-74.08}'
```

Eliminar plato:

```bash
curl -X DELETE http://localhost:8082/api/grafos/plato/<id-plato>
```

Crear relación Persona -> Ciudad (VIVE_EN):

```bash
curl -X POST http://localhost:8082/api/grafos/relaciones   -H "Content-Type: application/json"   -d '{
        "fromLabel":"Persona","fromId":"<uuid-persona>",
        "type":"VIVE_EN",
        "toLabel":"Ciudad","toId":"<uuid-ciudad>",
        "props":{"desde":"2020-01-01"}
      }'
```

Listar relaciones de una Persona:

```bash
curl http://localhost:8082/api/grafos/relaciones/Persona/<uuid-persona>
```

---

## 9) Autenticación y seguridad

- JWT para autenticación de endpoints protegidos (por ejemplo, usuarios y administración).
- Middleware de roles sugerido: ADMIN_ROLE, USER_ROLE.
- Validaciones con express-validator y sanitización básica.
- CORS configurado a nivel de app.js si es necesario.

---

## 10) Migraciones y utilidades de datos (Python)

Dependencias Python:

```bash
pip install -r requirements.txt
```

Flujo típico:

1. Exportar SQL a JSON (`export_sql_to_json.py`).
2. Importar JSON a MongoDB (`import_json_to_mongo.py`).
3. Comparar conteos/campos (`compare_datasets.py`).
4. Visualizar datos (`visualize_data.py`).

Cada script acepta argumentos por CLI y puede leer variables desde `.env` cuando aplique.

---

## Buenas prácticas y notas

- Mantener la lógica de acceso a datos aislada por backend (ya contemplado en controllers/ y database/).
- Documentar cualquier campo adicional requerido por tus modelos reales.
- Para Neo4j, ejecutar scripts/constraints.cypher para unicidad por id e índices útiles.
- En ESM, usar rutas relativas con extensión .js en todos los imports.
- Si cambias el nombre de funciones de conexión, actualiza las importaciones en los modelos/controladores.

---

## Autores

- **Deyton Riasco Ortiz** — driosoftpro@gmail.com
- **Samuel Izquierdo Bonilla** — samuelizquierdo98@gmail.com
  **Año:** 2025

---

## Licencia

Proyecto con fines académicos. Ajuste la licencia según sus necesidades internas.

---

## Autores

- **Deyton Riasco Ortiz** — driosoftpro@gmail.com
- **Samuel Izquierdo Bonilla** — samuelizquierdo98@gmail.com
  **Año:** 2025
