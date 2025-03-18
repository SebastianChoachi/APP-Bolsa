from flask import Blueprint, jsonify, request
from db import mysql
import requests

crypto_bp = Blueprint('crypto_bp', __name__)

COINGECKO_API = "https://api.coingecko.com/api/v3"

@crypto_bp.route("/", methods=["GET"])
def get_cryptos():
    # Obtiene la lista de criptomonedas almacenadas en la base de datos.
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, nombre, simbolo FROM cryptos")
    cryptos = cursor.fetchall()
    cursor.close()

    # Convertir lista de tuplas a lista de diccionarios
    crypto_list = [{"id": c[0], "nombre": c[1], "simbolo": c[2]} for c in cryptos]
    
    return jsonify(crypto_list), 200

# Obtener el histórico de precios de la crypto en X período
@crypto_bp.route("/<string:crypto_id>", methods=["GET"])
def get_crypto_history(crypto_id):
    days = request.args.get("days", default=30, type=int)  # parámetro "days" (por defecto, 30 días)
    
    response = requests.get(f"{COINGECKO_API}/coins/{crypto_id}/market_chart?vs_currency=usd&days={days}")
    
    if response.status_code == 200:
        return jsonify(response.json())
    
    return jsonify({"error": "No se pudo obtener los datos"}), 500

