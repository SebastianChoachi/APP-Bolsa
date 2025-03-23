import time
from db import mysql
import requests
from flask import current_app
from services.email_service import enviar_correo_alerta

def obtener_alertas_activas():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, id_usuario, crypto_name, condicion, precio FROM alertas WHERE estado = 1;")
    alertas = cursor.fetchall()  # Lista de tuplas
    cursor.close()
    # Convertir manualmente a diccionario
    columnas = ["id", "id_usuario", "crypto_name", "condicion", "precio"]
    alertas_dict = [dict(zip(columnas, alerta)) for alerta in alertas]

    return alertas_dict

# Extraer nombres unicos de cryptos en las alertas para la consulta
def obtener_criptos_en_alertas():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT DISTINCT crypto_name FROM alertas WHERE estado = 1")
    criptos = [fila[0] for fila in cursor.fetchall()]
    cursor.close()

    return criptos

# Segun el listado obtenido en 'obtener_criptos_en_alertas()', se consulta su precio actual
def obtener_precios_actuales():
    criptos = obtener_criptos_en_alertas()
    if not criptos:
        return {}  # Si no hay criptos activas en alertas

    criptos_str = ",".join(criptos)  # De lista a string separado por comas
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={criptos_str}&vs_currencies=usd"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {cripto: data.get(cripto, {}).get("usd", None) for cripto in criptos}
    
    return {} 


def procesar_alertas():
    alertas = obtener_alertas_activas()
    precios_actuales = obtener_precios_actuales() # Listado de cryptos-precios
    alertas_cumplidas = []
    cursor = mysql.connection.cursor()
    for alerta in alertas:
        cripto = alerta["crypto_name"]
        precio_actual = precios_actuales.get(cripto, None)
        if precio_actual is not None:
            # print(f"Revisando {cripto}: {alerta['condicion']} {alerta['precio']} (Precio actual: {precio_actual})") 
            if (alerta["condicion"] == "mayor o igual" and precio_actual >= alerta["precio"]) or \
               (alerta["condicion"] == "menor o igual" and precio_actual <= alerta["precio"]):
                try:
                    # print(f"ALERTA {alerta['id']} cumplida para {cripto} (Precio actual: {precio_actual})")
                    cursor.execute("SELECT email FROM usuarios WHERE id = %s", (alerta["id_usuario"],))
                    resultado = cursor.fetchone()
                    if resultado:
                        email_usuario = resultado[0]
                        enviar_correo_alerta(email_usuario, cripto, alerta["condicion"], alerta["precio"], precio_actual) 
                    # Marcar alerta como inactiva
                    cursor.execute("UPDATE alertas SET estado = 0 WHERE id = %s", (alerta["id"],))
                    mysql.connection.commit()
                    
                    alerta["precio_actual"] = precio_actual
                    alertas_cumplidas.append(alerta)
                    
                except Exception as e:
                 print(f"Error al procesar alerta. - {e}")
    cursor.close()

    return alertas_cumplidas 


def ejecutar_cada_x_minutos():
    with current_app.app_context():  # Habilita el contexto de Flask
        while True:
            alertas_cumplidas = procesar_alertas()
            if alertas_cumplidas:
                print(f"Se han cumplido {len(alertas_cumplidas)} alertas.")
            else:
                print("No se cumplieron alertas en este ciclo.")
            time.sleep(120)  # Se ejecuta cada 2 minutos
