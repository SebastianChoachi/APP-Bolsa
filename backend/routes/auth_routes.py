from flask import Blueprint, request, jsonify
from db import mysql
import bcrypt
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth_bp", __name__)

# REGISTRO DE USUARIO
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, password FROM usuarios WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if user is None:
        return jsonify({"error": "Credenciales inválidas"}), 401

    user_id, stored_hashed_password = user

    # 🔹 Asegurar que la contraseña almacenada esté en bytes 🔹
    if isinstance(stored_hashed_password, str):
        stored_hashed_password = stored_hashed_password.encode("utf-8")

    # Verificar la contraseña
    if not bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
        return jsonify({"error": "Credenciales inválidas"}), 401
    
    # Generar token JWT
    # access_token = create_access_token(identity=user_id)
    # return jsonify({"message": "Login exitoso", "user_id": user_id, "token": access_token}), 200

    return jsonify({"message": "Login exitoso", "user_id": user_id}), 200