from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import mysql

alert_bp = Blueprint('alert_bp', __name__)

@alert_bp.route("/", methods=["POST"])
@jwt_required()
def create_alert():
    data = request.json
    user_id = get_jwt_identity()
    crypto_id = data.get("crypto_id")
    target_price = data.get("target_price")

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO alerts (user_id, crypto_id, target_price) VALUES (%s, %s, %s)", (user_id, crypto_id, target_price))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Alerta creada"}), 201

@alert_bp.route("/", methods=["GET"])
@jwt_required()
def get_alerts():
    user_id = get_jwt_identity()

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM alerts WHERE user_id = %s", (user_id,))
    alerts = cursor.fetchall()
    cursor.close()

    return jsonify(alerts), 200

@alert_bp.route("/", methods=["DELETE"])
@jwt_required()
def delete_alert():
    data = request.json
    alert_id = data.get("alert_id")

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM alerts WHERE id = %s", (alert_id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Alerta eliminada"}), 200
