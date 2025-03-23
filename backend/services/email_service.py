import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import MAIL_SERVER, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD

def enviar_correo(destinatario, mensaje):
    try:
        msg = MIMEMultipart()
        msg["From"] = MAIL_USERNAME
        msg["To"] = destinatario
        msg["Subject"] = "Alerta de criptomonedas cumplida"

        msg.attach(MIMEText(mensaje, "plain"))

        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, destinatario, msg.as_string())
        server.quit()
        
        print(f"📨 Correo enviado a {destinatario}")

    except Exception as e:
        print(f"❌ Error al enviar correo: {str(e)}")
