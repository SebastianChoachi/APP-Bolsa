from flask import Blueprint, jsonify, request
import requests

crypto_bp = Blueprint('crypto_bp', __name__)

COINGECKO_API = "https://api.coingecko.com/api/v3"

@crypto_bp.route("/", methods=["GET"])
def get_cryptos():
    response = requests.get(f"{COINGECKO_API}/coins/markets?vs_currency=usd")
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({"error": "No se pudo obtener los datos"}), 500

@crypto_bp.route("/<string:crypto_id>", methods=["GET"])
def get_crypto_history(crypto_id):
    response = requests.get(f"{COINGECKO_API}/coins/{crypto_id}/market_chart?vs_currency=usd&days=30")
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({"error": "No se pudo obtener los datos"}), 500
