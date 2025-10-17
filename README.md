# 🌐 API REST — SQL + NoSQL + Python Utils
**Gestión de Héroes, Películas y Multimedia con Node.js/Express + MySQL/MongoDB + utilidades Python para migraciones**

---

## 📌 Descripción general
Este proyecto expone una **API REST en Node.js + Express** que puede operar contra **SQL (MySQL)** o **NoSQL (MongoDB)**.  
Además incorpora **utilidades en Python** para facilitar **migraciones de datos, validaciones y análisis** (exportar/importar JSON, comparar datasets y generar visualizaciones).

> Puedes elegir el motor de base de datos en tiempo de ejecución con la variable `DB_DRIVER`:
> - `DB_DRIVER=sql` → usa MySQL (Sequelize).
> - `DB_DRIVER=nosql` → usa MongoDB (Mongoose / PyMongo).
>
> El API expone los mismos endpoints funcionales independientemente del backend activo.

---

## 🧩 Tecnologías

| Capa | Tecnología | Descripción |
|------|-------------|-------------|
| Backend | Node.js 18+ + Express | API principal |
| SQL | MySQL 8+ (Sequelize) | Gestión relacional |
| NoSQL | MongoDB 6+ (Mongoose / PyMongo) | Gestión documental |
| Migración / Data | Python 3.11+ | Scripts CLI y Notebook |
| Librerías Py | pandas, polars, numpy, pymongo, matplotlib, seaborn, tabulate | Herramientas de análisis y migración |

---

## 📂 Estructura del proyecto

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
│   └── usuarios.controller.js
│
├── database/
│   ├── connectionSQL.js        # Sequelize (MySQL)
│   └── connectionNoSQL.js      # Mongoose (MongoDB)
│
├── helpers/
│   ├── db-validators.js
│   └── generar-jwt.js
│
├── migracion_sql_nosql/        # Nuevo módulo Python para migraciones SQL↔NoSQL
│   ├── migracion.ipynb         # Notebook principal
│   ├── export_sql_to_json.py   # Exporta tablas SQL a JSON
│   ├── import_json_to_mongo.py # Importa JSON a MongoDB
│   ├── compare_datasets.py     # Compara estructuras/datos
│   └── visualize_data.py       # Visualizaciones y reportes
│
├── models/
│   ├── SQL/...
│   └── NoSQL/...
│
├── routes/
│   ├── heroes.route.js
│   ├── peliculas.route.js
│   ├── multimedias.route.js
│   ├── protagonistas.route.js
│   └── usuarios.route.js
│
├── app.js
├── package.json
├── requirements.txt
├── .env.example
└── README.md
```
> Si aún no existe la carpeta `migrations/`, créala y coloca allí los scripts Python (ver ejemplos de uso más abajo).

---

## ⚙️ Requisitos

### 🔹 Node.js
- Node.js >= 18  
- npm >= 9  
- MySQL >= 8  
- MongoDB >= 6  

### 🔹 Python
- Python >= 3.11  
- pip >= 23  

Instala las dependencias:
```bash
pip install -r requirements.txt
```
---

## 🚀 Instalación (Node.js + API)
1) Clonar e instalar dependencias:
```bash
git clone https://github.com/driosoft-pro/apirest-heroes-ds.git
cd apirest-heroes-ds
npm install
```

2) Configurar variables de entorno en `.env` (puedes copiar desde `.env.example`):
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

# ===== JWT =====
JWT_SECRET=mi_secret_key
```

3) Levantar el servidor:
```bash
# Desarrollo (con nodemon si está configurado):
npm run dev

# Producción:
npm start
```

Por defecto: `http://localhost:4000/api`

> **Tip:** Cambia dinámicamente el backend con `DB_DRIVER` sin modificar el código:
> - `DB_DRIVER=sql npm run dev`
> - `DB_DRIVER=nosql npm run dev`

---

## 📦 Scripts npm
*(Si no existen en tu `package.json`, añádelos como ejemplo)*
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "NODE_ENV=development node app.js",
    "dev:sql": "cross-env DB_DRIVER=sql npm run dev",
    "dev:nosql": "cross-env DB_DRIVER=nosql npm run dev",
    "lint": "eslint .",
    "test": "node --test"
  }
}
```
> En Windows puedes usar `cross-env` para inyectar variables de entorno (`npm i -D cross-env`).

---

## 🔑 Autenticación, roles y seguridad
- **JWT** para autenticación (`/api/usuarios/login`).
- **Roles**: `ADMIN_ROLE`, `USER_ROLE`.
- **Validaciones** con `express-validator`.
- CORS y sanitización de entrada recomendados.

---

## 🧠 Endpoints principales (resumen)

### 👤 Usuarios
- `POST /api/usuarios` — crear usuario
- `POST /api/usuarios/login` — login + JWT
- `GET /api/usuarios` — listar (requiere JWT + ADMIN_ROLE)

### 🦸 Héroes
- `GET /api/heroes` — listar
- `GET /api/heroes/:id` — detalle
- `GET /api/heroes/como/:termino` — búsqueda
- `POST /api/heroes` — crear
- `PUT /api/heroes/:id` — actualizar
- `DELETE /api/heroes/:id` — eliminar

### 🎬 Películas
- `GET /api/peliculas`
- `GET /api/peliculas/:id`
- `POST /api/peliculas`
- `PUT /api/peliculas/:id`
- `DELETE /api/peliculas/:id`

### 🎭 Protagonistas (Héroe↔Película M:M)
- `POST /api/protagonistas` — asignar héroe + rol
- `GET /api/protagonistas`
- `GET /api/protagonistas/:id`
- `PUT /api/protagonistas/:id`
- `DELETE /api/protagonistas/:id`

### 🖼 Multimedia
- `GET /api/multimedias`
- `GET /api/multimedias/:id`
- `POST /api/multimedias`
- `PUT /api/multimedias/:id`
- `DELETE /api/multimedias/:id`

### 🎞 Multimedia↔Héroes (M:M)
- `POST /api/multimediasHeroes`
- `GET /api/multimediasHeroes`
- `GET /api/multimediasHeroes/:id`
- `PUT /api/multimediasHeroes/:id`
- `DELETE /api/multimediasHeroes/:id`

### 🔍 Consultas adicionales
- `GET /api/peliculas/:id/protagonistas` — protagonistas y su rol
- `GET /api/heroes/:id/multimedia` — multimedia de un héroe
- `GET /api/peliculas/:id/multimedia` — multimedia agregado vía héroes protagonistas

---

## 🧰 Utilidades Python (migraciones y análisis)

Instalar dependencias:
```bash
pip install -r requirements.txt
```

> Todos los scripts leen variables desde `.env` cuando aplica, o puedes pasar argumentos por CLI.

### 1) Exportar SQL → JSON
Convierte tablas MySQL a archivos JSON para migrar fácilmente a MongoDB.
```bash
python migrations/export_sql_to_json.py   --host "$DB_HOST" --user "$DB_USER" --password "$DB_PASSWORD" --database "$DB_NAME"   --tables heroes,peliculas,protagonistas,multimedias,multimedias_heroes,usuarios   --out ./migrations/export/
```
**Argumentos comunes:**
- `--tables` coma-separado o `--all` para todas
- `--out` carpeta de salida

### 2) Importar JSON → MongoDB
Carga los JSON exportados dentro de colecciones de `heroesdb`.
```bash
python migrations/import_json_to_mongo.py   --mongo-uri "$MONGO_URI"   --in ./migrations/export/   --map heroes:heroes peliculas:peliculas protagonistas:protagonistas multimedias:multimedias usuarios:usuarios
```
**Opciones útiles:** `--drop` (vacía colecciones antes de importar), `--upsert`.

### 3) Comparar datasets SQL vs NoSQL
Chequeos rápidos de conteos y campos clave.
```bash
python migrations/compare_datasets.py   --sql-host "$DB_HOST" --sql-user "$DB_USER" --sql-password "$DB_PASSWORD" --sql-db "$DB_NAME"   --mongo-uri "$MONGO_URI"   --collections heroes,peliculas,usuarios
```
Salida tabulada en consola (usa `tabulate`).

### 4) Visualizar datos (gráficas)
Genera gráficos de distribución, top-N, etc. (PNG).
```bash
python migrations/visualize_data.py   --mongo-uri "$MONGO_URI"   --collection heroes   --field rol   --out ./migrations/reports/roles_heroes.png
```
> Usa `matplotlib` y `seaborn`. No requiere GUI (guarda a archivo).

---

## 👤 Usuarios de prueba
**Administradores**
- `samuel@mail.com` / `samuel123` (ADMIN_ROLE)
- `sofia@mail.com` / `sofia123` (ADMIN_ROLE)

**Usuarios**
- `deyton@mail.com` / `deyton123` (USER_ROLE)
- `lucia@mail.com` / `lucia123` (USER_ROLE)

> Recuerda cambiar contraseñas y poblar la BD según tu entorno de desarrollo.

---

## 📝 Notas y buenas prácticas
- Mantén separado el **código de acceso a datos** para SQL y NoSQL (ya lo hace la carpeta `database/` + controladores por backend).
- Usa `.env` para credenciales y `JWT_SECRET`.
- Añade **Swagger/OpenAPI** en `docs/` para documentación viva.
- Considera **Docker Compose** (MySQL + MongoDB + API + scripts).

---

## ✍️ Autores
- **Deyton Riasco Ortiz** — driosoftpro@gmail.com  
- **Samuel Izquierdo Bonilla** — samuelizquierdo98@gmail.com  
**Año:** 2025

---

## 📄 Licencia
Este proyecto se distribuye con fines académicos. Ajusta la licencia según tus necesidades.
