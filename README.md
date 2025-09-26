# API REST con Node.js + Express — Gestión de Héroes, Películas y Multimedia

### Actividad segundo corte Almacenación de Datos

**Proyecto:** Ampliación de la API/REST en **Node.js + Express** — Gestión de Héroes, Películas y Elementos Multimedia

**Descripción corta**

Este repositorio contiene una API REST construida con **Node.js** y **Express**, conectada a **MySQL**, que gestiona héroes, películas y elementos multimedia relacionados. La ampliación incluye relaciones entre héroes y películas (protagonistas con rol) y entre héroes y elementos multimedia. También permite consultar multimedia de películas a través de los héroes protagonistas.

---

## Estructura del proyecto

```
├── controllers/        # Controladores de cada entidad
│   ├── heroes.controller.js
│   ├── multimedia.controller.js
│   ├── multimedia-heroes.controller.js
│   ├── peliculas.controller.js
│   ├── protagonistas.controller.js
│   └── usuarios.controller.js
│
├── database/           # Conexión a MySQL
│   └── my-sql-connection.js
│
├── helpers/            # Validadores y funciones auxiliares
│   ├── db-validators.js
│   └── generar-jwt.js
│
├── middlewares/        # Middlewares de validación
│   ├── validar-campos.js
│   ├── validar-jwt.js
│   └── validar-roles.js
│
├── models/             # Modelos de base de datos
│   ├── multimedia-heroes.js
│   ├── multimedia.model.js
│   ├── my-sql-connection.model.js
│   ├── peliculas.models.js
│   ├── protagonistas.model.js
│   └── usuarios.model.js
│
├── routes/             # Rutas de la API
│   ├── heroes.route.js
│   ├── multimedia.route.js
│   ├── peliculas.route.js
│   ├── protagonistas.route.js
│   └── usuarios.route.js
│
├── app.js              # Configuración principal del servidor
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts
└── README.md           # Documentación del proyecto
```

---

## Requisitos

* Node.js >= 18
* MySQL >= 8

---

## Instalación y configuración

1. Clona el repositorio:

```bash
git clone <url-del-repo>
cd <nombre-del-proyecto>
```

2. Instala dependencias:

```bash
npm install
```

3. Configura el archivo `.env`:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=heroesdb
JWT_SECRET=mi_secret_key
```

4. Inicia el servidor:

```bash
npm start
```

Por defecto se levanta en: `http://localhost:4000/api`

---

## Endpoints principales

### Héroes

* `GET /api/heroes` — listar héroes
* `GET /api/heroes/:id` — obtener héroe
* `POST /api/heroes` — crear héroe
* `PUT /api/heroes/:id` — actualizar héroe
* `DELETE /api/heroes/:id` — eliminar héroe

### Películas

* `GET /api/peliculas` — listar películas
* `GET /api/peliculas/:id` — obtener película
* `POST /api/peliculas` — crear película
* `PUT /api/peliculas/:id` — actualizar película
* `DELETE /api/peliculas/:id` — eliminar película

### Protagonistas (relación héroe-película)

* `POST /api/protagonistas` — asignar héroe a película con rol
* `GET /api/peliculas/:id/protagonistas` — obtener héroes de una película con su rol
* `PUT /api/protagonistas/:id` — actualizar rol
* `DELETE /api/protagonistas/:id` — eliminar relación

### Multimedia

* `GET /api/multimedia` — listar multimedia
* `GET /api/multimedia/:id` — detalle de un multimedia
* `POST /api/multimedia` — crear multimedia (asociado a un héroe)
* `PUT /api/multimedia/:id` — actualizar multimedia
* `DELETE /api/multimedia/:id` — eliminar multimedia
* `GET /api/heroes/:id/multimedia` — obtener multimedia de un héroe

---

## Consultas adicionales

1. **Por película obtener protagonistas y su rol**

```http
GET /api/peliculas/:id/protagonistas
```

Ejemplo de respuesta:

```json
[
  { "hero_id": 1, "name": "Superman", "role": "Protagonista" },
  { "hero_id": 2, "name": "Batman", "role": "Secundario" }
]
```

2. **Por película obtener multimedia de sus héroes protagonistas**

```http
GET /api/peliculas/:id/multimedia
```

Ejemplo de respuesta:

```json
[
  { "id": 10, "type": "photo", "url": "https://cdn/.../superman.jpg", "hero": "Superman" },
  { "id": 12, "type": "video", "url": "https://cdn/.../batman.mp4", "hero": "Batman" }
]
```

---

## Validaciones

* **BD**: claves foráneas, campos obligatorios, relaciones muchos-a-muchos.
* **API**:

  * Validar datos de entrada (`express-validator`).
  * Validación JWT para rutas protegidas.
  * Roles para restringir acceso.

---

## Scripts disponibles

* `npm start` — inicia el servidor en modo producción
* `npm run dev` — inicia con nodemon en modo desarrollo

---

## Pruebas

Se recomienda usar **Jest** o **Mocha + Chai** para pruebas unitarias e integración.

Ejemplo:

```bash
npm test
```

---

## Notas finales

* Documenta la API con Swagger en la carpeta `docs/`.
* Usa variables de entorno para credenciales sensibles.
* Considera paginación y filtros en los endpoints de lista.

✍️ Autores

✍️ Desarrollado por: Deyton Riasco Ortiz

✍️ Desarrollado por: Samuel Izquierdo Bonilla

📅 Fecha: 2025

📧 Contacto: driosoftpro@gmail.com

📧 Contacto: samuelizquier98@gmail.com