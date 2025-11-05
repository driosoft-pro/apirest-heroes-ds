import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

let driver = null;

// Configuración según el entorno
const getNeo4jConfig = () => {
  const isRemote = (process.env.DB_ENV || "local").toLowerCase() === "remote";

  if (isRemote) {
    return {
      uri: process.env.NEO4J_URI, // Connection URI completo
      user: process.env.NEO4J_USER,
      password: process.env.NEO4J_PASSWORD,
      database: process.env.NEO4J_DATABASE || "neo4j", // Base de datos específica
    };
  } else {
    return {
      uri: process.env.NEO4J_LOCAL_URI || "bolt://localhost:7687",
      user: process.env.NEO4J_LOCAL_USER || "neo4j",
      password: process.env.NEO4J_LOCAL_PASSWORD,
      database: "neo4j",
    };
  }
};

// Crear conexión a Neo4j
export const connectNeo4j = () => {
  try {
    const config = getNeo4jConfig();

    if (!config.uri || !config.user || !config.password) {
      throw new Error(
        "Configuración de Neo4j incompleta. Revisa las variables en .env",
      );
    }

    driver = neo4j.driver(
      config.uri,
      neo4j.auth.basic(config.user, config.password),
      {
        maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 horas
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutos
      },
    );

    console.log("Driver de Neo4j creado correctamente...");
    return driver;
  } catch (error) {
    console.error("Error al crear driver de Neo4j:", error.message);
    throw error;
  }
};

// Verificar conexión a Neo4j
export const verifyNeo4j = async () => {
  try {
    if (!driver) {
      driver = connectNeo4j();
    }

    const session = driver.session();

    try {
      // Ejecutar una consulta simple para verificar la conexión
      const result = await session.run("RETURN 1 as test");

      if (result.records.length > 0) {
        console.log("Conexión a Neo4j verificada correctamente");
        return true;
      }
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error("Error al verificar conexión con Neo4j:", error.message);
    throw new Error("Error al conectar con Neo4j");
  }
};

// Obtener el driver (útil para usarlo en otros archivos)
export const getDriver = () => {
  if (!driver) {
    driver = connectNeo4j();
  }
  return driver;
};

// Cerrar conexión (útil para cuando se apague el servidor)
export const closeNeo4j = async () => {
  if (driver) {
    await driver.close();
    console.log("Conexión a Neo4j cerrada");
    driver = null;
  }
};
