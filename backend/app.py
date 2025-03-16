from flask import Flask
from flask_cors import CORS
from db import init_db
from routes.auth_routes import auth_bp
from routes.crypto_routes import crypto_bp
from routes.alert_routes import alert_bp

app = Flask(__name__)
CORS(app)  # Permitir conexiones desde el frontend Angular

# Configuración de la base de datos
app.config.from_pyfile('config.py')

# Inicializar la base de datos
init_db(app)

# Registrar rutas
app.register_blueprint(auth_bp, url_prefix="/")
app.register_blueprint(crypto_bp, url_prefix="/cryptos")
app.register_blueprint(alert_bp, url_prefix="/alerts")

if __name__ == "__main__":
    app.run(debug=True)
