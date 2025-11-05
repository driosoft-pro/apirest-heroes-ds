import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { sequelize } from "../database/connectionSQL.js";
import { connectionNoSQL } from "../database/connectionNoSQL.js";
import { verifyNeo4j, closeNeo4j } from "../database/connectionGrafos.js";

// Cargar variables de entorno sin logs
dotenv.config({ quiet: true });

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    // Ruta raíz
    this.app.get("/", (req, res) => {
      res.json({
        message: "API de Héroes - MultiDB",
        status: "online",
        databases: {
          mysql: "Sequelize",
          mongodb: "Mongoose",
          neo4j: "Neo4j Driver",
        },
      });
    });

    // Middlewares primero
    this.middlewares();

    // Luego las conexiones
    this.connectDatabases();

    // Finalmente las rutas
    this.routes();

    // Manejo de cierre graceful
    this.setupGracefulShutdown();
  }

  // Middlewares
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public")); // Directorio público
  }

  // Conectar todas las bases de datos
  async connectDatabases() {
    await this.connectionSQL();
    await this.connectionMongo();
    await this.connectionNeo4j();
  }

  // Conexión a MySQL (Sequelize)
  async connectionSQL() {
    try {
      await sequelize.authenticate();
      console.log("✓ Conexión OK a MySQL/MariaDB.");
      console.log(`  * Base de datos: ${process.env.MONGODB_REMOTE_BD}`);
    } catch (error) {
      console.error("✗ No se pudo conectar a MySQL:", error.message);
    }
  }

  // Conexión a MongoDB (Mongoose)
  async connectionMongo() {
    try {
      await connectionNoSQL();
      console.log("✓ Conexión OK a MongoDB.");
      console.log(
        `  * Base de datos: ${process.env.NEO4J_DATABASE || "neo4j"}`,
      );
    } catch (error) {
      console.error("✗ No se pudo conectar a MongoDB:", error.message);
    }
  }

  // Conexión a Neo4j (neo4j-driver)
  async connectionNeo4j() {
    try {
      await verifyNeo4j();
      console.log("✓ Conexión OK a Neo4j.");
      console.log(
        `  * Base de datos: ${process.env.NEO4J_DATABASE || "neo4j"}`,
      );
    } catch (err) {
      console.error("✗ No se pudo conectar a Neo4j:", err.message);
    }
  }

  // Cargar rutas
  async routes() {
    try {
      const routes = (await import("../routes/index.js")).default;
      this.app.use("/api", routes);
      console.log("✓ Rutas cargadas correctamente.");
    } catch (error) {
      console.error("✗ Error al cargar rutas:", error.message);
    }
  }

  // Configurar cierre graceful del servidor
  setupGracefulShutdown() {
    process.on("SIGINT", async () => {
      console.log("\n Cerrando servidor...");

      try {
        // Cerrar conexión a Neo4j
        await closeNeo4j();

        // Cerrar conexión a Sequelize
        await sequelize.close();
        console.log("✓ Conexión a MySQL cerrada");

        console.log("✓ Servidor cerrado correctamente");
        process.exit(0);
      } catch (error) {
        console.error("Error al cerrar conexiones:", error);
        process.exit(1);
      }
    });
  }

  // Iniciar servidor
  listen() {
    this.app.listen(this.port, () => {
      console.log("\n" + "=".repeat(50));
      console.log(` Servidor corriendo en puerto ${this.port}`);
      console.log(` URL: http://localhost:${this.port}`);
      console.log(` Entorno: ${process.env.DB_ENV || "local"}`);
      console.log("=".repeat(50) + "\n");
    });
  }
}

export default Server;
