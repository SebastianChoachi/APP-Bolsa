from flask import Flask
from flask_cors import CORS
from db import init_db
from routes.auth_routes import auth_bp
from routes.crypto_routes import crypto_bp
from routes.alert_routes import alert_bp
from flask_jwt_extended import JWTManager
import threading
from services.alert_checker import ejecutar_cada_x_minutos

app = Flask(__name__)
CORS(app)  # Permitir conexiones desde el frontend Angular

# Configuración de la base de datos
app.config.from_pyfile('config.py')

# Inicializar la base de datos
init_db(app)

# Configurar clave secreta para JWT
app.config["JWT_SECRET_KEY"] = "super_secret_key"  # Usar una clave segura en producción

# Inicializar JWTManager
jwt = JWTManager(app)  

# Registrar rutas
app.register_blueprint(auth_bp, url_prefix="/")
app.register_blueprint(crypto_bp, url_prefix="/cryptos")
app.register_blueprint(alert_bp, url_prefix="/alerts")

# Iniciar el proceso de verificación de alertas en segundo plano
def start_alert_checker():
    print("Iniciando el hilo de verificación de alertas...")
    def run_with_context():
        with app.app_context():  # Asegura que el hilo use el contexto de Flask
            ejecutar_cada_x_minutos()
    thread = threading.Thread(target=run_with_context, daemon=True)
    thread.start()
    print("Hilo de alertas iniciado.")

start_alert_checker()

if __name__ == "__main__":
  app.run(debug=True)
