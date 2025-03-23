import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app

def enviar_correo_alerta(destinatario, cripto, condicion, precio_objetivo, precio_actual):
    try:
        # Obtener la configuración desde Flask
        mail_server = current_app.config["MAIL_SERVER"]
        mail_port = current_app.config["MAIL_PORT"]
        mail_use_tls = current_app.config["MAIL_USE_TLS"]
        mail_username = current_app.config["MAIL_USERNAME"]
        mail_password = current_app.config["MAIL_PASSWORD"]
        mail_sender = current_app.config["MAIL_USERNAME"]

        asunto = f"Alerta de {cripto} cumplida"
        cuerpo = f"""
        <h2>Alerta cumplida</h2>
        <p>La alerta configurada para <b>{cripto}</b> se ha cumplido:</p>
        <ul>
            <li><b>Condición:</b> {condicion} {precio_objetivo}</li>
            <li><b>Precio actual:</b> {precio_actual}</li>
        </ul>
        <p>Revisa tu cuenta para más detalles.</p>
        """
        msg = MIMEMultipart()
        msg["From"] = mail_sender
        msg["To"] = destinatario
        msg["Subject"] = asunto
        msg.attach(MIMEText(cuerpo, "html"))

        # Conexión al servidor SMTP
        with smtplib.SMTP(mail_server, mail_port) as server:
            if mail_use_tls:
                server.starttls()
            server.login(mail_username, mail_password)
            server.sendmail(mail_sender, destinatario, msg.as_string())

    except Exception as e:
        print(f"Error al enviar correo a {destinatario}: {e}")
