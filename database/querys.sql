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
    nombre VARCHAR(100) NOT NULL,
    simbolo VARCHAR(10) NOT NULL UNIQUE
);
CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    simbolo_crypto VARCHAR(10) NOT NULL,
    condicion VARCHAR(50) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,  -- Campo booleano (1 = activo, 0 = inactivo)
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (simbolo_crypto) REFERENCES cryptos(simbolo) ON DELETE CASCADE
);

SHOW TABLES;

# Creación Registros Iniciales
INSERT INTO usuarios (nombre, email, password) VALUES ('Juan Choachi', 'juansebastianchv@hotmail.com', 'password');
INSERT INTO cryptos (nombre, simbolo) VALUES ('bitcoin','btc');
INSERT INTO cryptos (nombre, simbolo) VALUES ('ethereum','eth');
INSERT INTO cryptos (nombre, simbolo) VALUES ('tether','usdt');

select * from usuarios;
select * from cryptos;
