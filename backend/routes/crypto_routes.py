from flask import Blueprint, jsonify, request
from db import mysql
import requests

crypto_bp = Blueprint('crypto_bp', __name__)

COINGECKO_API = "https://api.coingecko.com/api/v3"

# Obtener la lista de criptomonedas almacenadas en la base de datos.
@crypto_bp.route("/", methods=["GET"])
def get_cryptos():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, nombre, simbolo FROM cryptos")
    cryptos = cursor.fetchall()
    cursor.close()

    # Convertir lista de tuplas a lista de diccionarios
    crypto_list = [{"id": c[0], "nombre": c[1].lower(), "simbolo": c[2]} for c in cryptos]
    
    return jsonify(crypto_list), 200

# Obtener el histórico de precios de la crypto en X período
@crypto_bp.route("/<string:crypto_id>", methods=["GET"])
def get_crypto_history(crypto_id):
    days = request.args.get("days", default=30, type=int)  # parámetro "days" (por defecto, 30 días)
    
    response = requests.get(f"{COINGECKO_API}/coins/{crypto_id}/market_chart?vs_currency=usd&days={days}")
    
    if response.status_code == 200:
        return jsonify(response.json())
    
    return jsonify({"error": "No se pudo obtener los datos"}), 500

# Obtener precios actuales para el listado de cryptos en BD
@crypto_bp.route("/prices", methods=["GET"])
def get_crypto_prices():
    try:
        # 1. Obtener lista de criptos desde la base de datos
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT nombre FROM cryptos")
        cryptos = cursor.fetchall()
        cursor.close()

        # 2. Extraer nombres y formatearlos en una lista separada por comas
        crypto_ids = ",".join([crypto[0].lower() for crypto in cryptos])  # crypto[0] porque fetchall() devuelve una lista de tuplas

        if not crypto_ids:
            return jsonify({"error": "No hay criptomonedas registradas"}), 400

        # 3. Consumo API de CoinGecko con las criptos de la BD
        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {
            "ids": crypto_ids,
            "vs_currencies": "usd"
        }
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            return jsonify({"error": "No se pudieron obtener los precios"}), 500
        
        return jsonify(response.json())  # Enviar datos al frontend

    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500