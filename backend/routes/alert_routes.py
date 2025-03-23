from venv import logger
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import mysql

alert_bp = Blueprint('alert_bp', __name__)

# Crear nueva alerta para usuario logueado.
@alert_bp.route("/", methods=["POST"])
@jwt_required()
def create_alert():

    user_id = get_jwt_identity()
    data = request.json

    crypto_name = data.get("crypto_name")
    condicion = data.get("condicion")
    precio = data.get("precio")

    if not crypto_name or not condicion or precio is None:
        return jsonify({"error": "Faltan datos para la generación de la alerta"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO alertas (id_usuario, crypto_name, condicion, precio) VALUES (%s, %s, %s, %s)",
                   (user_id, crypto_name, condicion, precio))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Alerta creada exitosamente"}), 201

# Obtener las alertas del usuario logueado
@alert_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_alerts():
    current_user_id = get_jwt_identity() # obtener el id de usuario
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, crypto_name, condicion, precio, estado FROM alertas WHERE id_usuario = %s", (current_user_id,))
    alerts = cursor.fetchall()
    cursor.close()
    alert_list = [{"id": a[0], "crypto_name": a[1], "condicion": a[2], "precio": a[3], "estado": a[4]} for a in alerts]
    return jsonify(alert_list), 200


# Eliminar una alerta por ID
@alert_bp.route("/<int:alert_id>", methods=["DELETE"])
@jwt_required()
def delete_alert(alert_id):
    user_id = get_jwt_identity()
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM alertas WHERE id = %s AND id_usuario = %s", (alert_id, user_id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Alerta eliminada"}), 200
