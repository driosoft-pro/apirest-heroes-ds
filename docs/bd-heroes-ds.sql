-- ========================================
-- CREACIÓN DE BASE DE DATOS
-- ========================================
DROP DATABASE IF EXISTS heroes;
CREATE DATABASE heroes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heroes;

-- ========================================
-- DROPS DE TABLAS (por seguridad)
-- ========================================
DROP TABLE IF EXISTS multimedias_heroe_ds;
DROP TABLE IF EXISTS protagonistas_ds;
DROP TABLE IF EXISTS multimedias_ds;
DROP TABLE IF EXISTS usuarios_ds;
DROP TABLE IF EXISTS peliculas_ds;
DROP TABLE IF EXISTS heroes_ds;

-- ========================================
-- TABLAS
-- ========================================

-- Tabla de héroes
CREATE TABLE heroes_ds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    bio TEXT,
    img VARCHAR(250),
    aparicion DATE,
    casa VARCHAR(20),
    CONSTRAINT heroes_nombre_u UNIQUE (nombre)
);

-- Tabla de películas
CREATE TABLE peliculas_ds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de usuarios (ajustada con ENUM en rol)
CREATE TABLE usuarios_ds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    img VARCHAR(250),
    rol ENUM('ADMIN_ROLE', 'USER_ROLE') NOT NULL,
    estado CHAR(1) NOT NULL DEFAULT '1',
    google CHAR(1) NOT NULL DEFAULT '0',
    fecha_creacion DATE NOT NULL,
    fecha_actualizacion DATE,
    CONSTRAINT usuarios_correo_u UNIQUE (correo)
);

-- Tabla de multimedias
CREATE TABLE multimedias_ds (
    idmultimedia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    url TEXT,
    tipo VARCHAR(15) NOT NULL
);

-- Tabla de protagonistas (relación héroes - películas)
CREATE TABLE protagonistas_ds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    papel TEXT,
    fecha_participacion DATE,
    heroes_id INT NOT NULL,
    peliculas_id INT NOT NULL,
    CONSTRAINT protagonistas_heroes_fk FOREIGN KEY (heroes_id) REFERENCES heroes_ds(id),
    CONSTRAINT protagonistas_peliculas_fk FOREIGN KEY (peliculas_id) REFERENCES peliculas_ds(id)
);

-- Tabla intermedia héroes - multimedias (relación N:M)
CREATE TABLE multimedias_heroe_ds (
    heroes_id INT NOT NULL,
    idmultimedia INT NOT NULL,
    PRIMARY KEY (heroes_id, idmultimedia),
    CONSTRAINT multimedias_heroe_heroes_fk FOREIGN KEY (heroes_id) REFERENCES heroes_ds(id),
    CONSTRAINT multimedias_heroe_multimedia_fk FOREIGN KEY (idmultimedia) REFERENCES multimedias_ds(idmultimedia)
);

-- ========================================
-- INSERTS
-- ========================================

-- INSERTS PARA heroes_ds
INSERT INTO heroes_ds (nombre, bio, img, aparicion, casa) VALUES
('Iron Man', 'Millonario e inventor que creó la armadura Iron Man.', 'ironman.jpg', '2008-05-02', 'Marvel'),
('Captain America', 'Soldado mejorado con el suero del súper soldado.', 'capamerica.jpg', '2011-07-22', 'Marvel'),
('Thor', 'Dios del trueno, hijo de Odín.', 'thor.jpg', '2011-05-06', 'Marvel'),
('Hulk', 'Científico que se transforma en un monstruo verde.', 'hulk.jpg', '2008-06-13', 'Marvel'),
('Black Widow', 'Espía y agente de S.H.I.E.L.D.', 'blackwidow.jpg', '2010-05-07', 'Marvel'),
('Hawkeye', 'Experto arquero de S.H.I.E.L.D.', 'hawkeye.jpg', '2011-05-06', 'Marvel'),
('Spider-Man', 'Joven con poderes arácnidos.', 'spiderman.jpg', '2017-07-07', 'Marvel'),
('Doctor Strange', 'Hechicero supremo.', 'drstrange.jpg', '2016-11-04', 'Marvel'),
('Black Panther', 'Rey de Wakanda, portador del traje de Pantera Negra.', 'blackpanther.jpg', '2018-02-16', 'Marvel'),
('Captain Marvel', 'Piloto con poderes cósmicos.', 'captmarvel.jpg', '2019-03-08', 'Marvel');

-- INSERTS PARA peliculas_ds
INSERT INTO peliculas_ds (nombre) VALUES
('Iron Man'),
('The Incredible Hulk'),
('Captain America: The First Avenger'),
('Thor'),
('The Avengers'),
('Avengers: Age of Ultron'),
('Captain America: Civil War'),
('Doctor Strange'),
('Black Panther'),
('Captain Marvel');

-- INSERTS PARA usuarios_ds (corregido ENUM rol)
INSERT INTO usuarios_ds (nombre, correo, password, img, rol, estado, google, fecha_creacion, fecha_actualizacion) VALUES
('Samuel', 'samuel@mail.com', '1234', 'samuel.png', 'ADMIN_ROLE', '1', '0', '2025-01-01', '2025-02-01'),
('Ana Torres', 'ana@mail.com', 'pass123', 'ana.png', 'USER_ROLE', '1', '1', '2025-01-05', '2025-02-05'),
('Carlos Ruiz', 'carlos@mail.com', 'carlospw', 'carlos.png', 'USER_ROLE', '1', '0', '2025-01-07', '2025-02-06'),
('Lucía Gómez', 'lucia@mail.com', 'luciapw', 'lucia.png', 'USER_ROLE', '1', '0', '2025-01-10', '2025-02-07'),
('Pedro López', 'pedro@mail.com', 'pedropw', 'pedro.png', 'USER_ROLE', '1', '1', '2025-01-12', '2025-02-08'),
('Marta Díaz', 'marta@mail.com', 'martapw', 'marta.png', 'USER_ROLE', '1', '0', '2025-01-15', '2025-02-09'),
('Andrés Mejía', 'andres@mail.com', 'andrespw', 'andres.png', 'USER_ROLE', '1', '0', '2025-01-18', '2025-02-10'),
('Sofía Ríos', 'sofia@mail.com', 'sofiapw', 'sofia.png', 'USER_ROLE', '1', '1', '2025-01-20', '2025-02-11'),
('Laura Peña', 'laura@mail.com', 'laurapw', 'laura.png', 'USER_ROLE', '1', '0', '2025-01-22', '2025-02-12'),
('Diego Castro', 'diego@mail.com', 'diegopw', 'diego.png', 'USER_ROLE', '1', '0', '2025-01-25', '2025-02-13');

-- INSERTS PARA multimedias_ds
INSERT INTO multimedias_ds (nombre, url, tipo) VALUES
('Iron Man Poster', 'ironman_poster.jpg', 'imagen'),
('Iron Man Trailer', 'ironman_trailer.mp4', 'video'),
('Hulk Poster', 'hulk_poster.jpg', 'imagen'),
('Hulk Trailer', 'hulk_trailer.mp4', 'video'),
('Avengers Poster', 'avengers_poster.jpg', 'imagen'),
('Avengers Trailer', 'avengers_trailer.mp4', 'video'),
('Black Panther Poster', 'blackpanther_poster.jpg', 'imagen'),
('Black Panther Trailer', 'blackpanther_trailer.mp4', 'video'),
('Doctor Strange Poster', 'drstrange_poster.jpg', 'imagen'),
('Doctor Strange Trailer', 'drstrange_trailer.mp4', 'video');

-- INSERTS PARA protagonistas_ds
INSERT INTO protagonistas_ds (papel, fecha_participacion, heroes_id, peliculas_id) VALUES
('Tony Stark / Iron Man', '2008-05-02', 1, 1),
('Bruce Banner / Hulk', '2008-06-13', 4, 2),
('Steve Rogers / Captain America', '2011-07-22', 2, 3),
('Thor Odinson', '2011-05-06', 3, 4),
('Natasha Romanoff / Black Widow', '2012-05-04', 5, 5),
('Clint Barton / Hawkeye', '2012-05-04', 6, 5),
('Peter Parker / Spider-Man', '2016-04-27', 7, 7),
('Stephen Strange / Doctor Strange', '2016-11-04', 8, 8),
('T’Challa / Black Panther', '2018-02-16', 9, 9),
('Carol Danvers / Captain Marvel', '2019-03-08', 10, 10);

-- INSERTS PARA multimedias_heroe_ds
INSERT INTO multimedias_heroe_ds (heroes_id, idmultimedia) VALUES
(1, 1), (1, 2),  -- Iron Man
(4, 3), (4, 4),  -- Hulk
(2, 5), (2, 6),  -- Captain America aparece en Avengers
(9, 7), (9, 8),  -- Black Panther
(8, 9), (8, 10); -- Doctor Strange
