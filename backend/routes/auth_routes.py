from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from db import mysql
import bcrypt

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Faltan datos"}), 400

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, password FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    if not user or not bcrypt.checkpw(password.encode(), user[1].encode()):
        return jsonify({"error": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=user[0])
    return jsonify({"access_token": access_token}), 200
