import time
from db import mysql
import requests

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
    
    return {}  # En caso de error, devuelve diccionario vacío


def procesar_alertas():
    alertas = obtener_alertas_activas()
    precios_actuales = obtener_precios_actuales() # Listado de cryptos-precios
    alertas_cumplidas = []
    for alerta in alertas:
        cripto = alerta["crypto_name"]
        precio_actual = precios_actuales.get(cripto, None)
        if precio_actual is not None:
            # print(f"Revisando {cripto}: {alerta['condicion']} {alerta['precio']} (Precio actual: {precio_actual})") 
            if (alerta["condicion"] == "mayor o igual" and precio_actual >= alerta["precio"]) or \
               (alerta["condicion"] == "menor o igual" and precio_actual <= alerta["precio"]):
                # Marcar alerta como inactiva
                cursor = mysql.connection.cursor()
                cursor.execute("UPDATE alertas SET estado = 0 WHERE id = %s", (alerta["id"],))
                mysql.connection.commit()
                cursor.close()

                alerta["precio_actual"] = precio_actual
                alertas_cumplidas.append(alerta)
                # print(f"ALERTA {alerta['id']} cumplida para {cripto} (Precio actual: {precio_actual})")

    return alertas_cumplidas 


def ejecutar_cada_x_minutos():
    """Ejecuta el proceso de verificación de alertas cada 5 minutos."""
    while True:
        alertas_cumplidas = procesar_alertas()
        if alertas_cumplidas:
            print(f"Se han cumplido {len(alertas_cumplidas)} alertas.")
            # Aquí se llamaría a la función de envío de correos.
        else:
            print("No se cumplieron alertas en este ciclo.")

        time.sleep(120)  # Timer de 2 minutos

if __name__ == "__main__":
    ejecutar_cada_x_minutos()
