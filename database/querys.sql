# Scheme 'app_bolsa'
USE app_bolsa;

# Creación de Tablas
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE cryptos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    simbolo VARCHAR(10) NOT NULL UNIQUE
);
CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    crypto_name VARCHAR(10) NOT NULL,
    condicion VARCHAR(50) NOT NULL,
    precio DECIMAL(18, 2) NOT NULL,  -- Precio con 18 dígitos en total, 2 decimales
    estado TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (crypto_name) REFERENCES cryptos(nombre) ON DELETE CASCADE
);

SHOW TABLES;

# Creación Registros Iniciales
INSERT INTO cryptos (nombre, simbolo) VALUES ('bitcoin','btc');
INSERT INTO cryptos (nombre, simbolo) VALUES ('ethereum','eth');
INSERT INTO cryptos (nombre, simbolo) VALUES ('tether','usdt');

select * from usuarios;
select * from cryptos;
select * from alertas;

INSERT INTO alertas (id_usuario, crypto_name, condicion, precio) VALUES (1,'bitcoin', '<=', 84090.20);
UPDATE alertas SET estado = 1 where id_usuario between 1 and 2;