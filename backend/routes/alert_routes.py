from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import mysql

alert_bp = Blueprint('alert_bp', __name__)

@alert_bp.route("/", methods=["POST"])
# @jwt_required()
def create_alert():
    # Crea una nueva alerta para el usuario autenticado.
    data = request.json
    #user_id = get_jwt_identity()
    user_id = data.get("user_id") # JSC: Temporalmente obtenemos el user_id desde query params
    simbolo_crypto = data.get("simbolo_crypto")  # se define con el símbolo de la crypto
    condicion = data.get("condicion")  # Ejemplo: ">= 50000"

    if not simbolo_crypto or not condicion:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO alertas (id_usuario, simbolo_crypto, condicion) VALUES (%s, %s, %s)",
        (user_id, simbolo_crypto, condicion)
    )
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Alerta creada exitosamente"}), 201


@alert_bp.route("/", methods=["GET"])
# @jwt_required()
def get_alerts():
    # Obtiene todas las alertas del usuario autenticado.
    # user_id = get_jwt_identity()
    user_id = request.args.get("user_id")  # JSC: Temporalmente obtenemos el user_id desde query params
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, simbolo_crypto, condicion FROM alertas WHERE id_usuario = %s", (user_id,))
    alerts = cursor.fetchall()
    cursor.close()

    # Convertir a formato JSON
    alert_list = [{"id": a[0], "simbolo_crypto": a[1], "condicion": a[2]} for a in alerts]

    return jsonify(alert_list), 200


@alert_bp.route("/", methods=["DELETE"])
# @jwt_required()
def delete_alert():
    # Elimina una alerta específica por su ID.
    data = request.json
    alert_id = data.get("alert_id")

    if not alert_id:
        return jsonify({"error": "Se requiere el ID de la alerta"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM alertas WHERE id = %s", (alert_id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Alerta eliminada exitosamente"}), 200
