import logging
import smtplib
from email.message import EmailMessage
import requests

class Notifier:
    def __init__(self, config=None):
        self.config = config or {}
        
    def send_email(self, subject, body, to_email):
        smtp_server = self.config.get('smtp_server', 'localhost')
        smtp_port = self.config.get('smtp_port', 25)
        from_email = self.config.get('from_email', 'sauron@localhost')
        
        msg = EmailMessage()
        msg.set_content(body)
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = to_email
        
        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.send_message(msg)
            logging.info(f"Email sent to {to_email}")
        except Exception as e:
            logging.error(f"Failed to send email: {e}")

    def send_webhook(self, url, payload):
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            logging.info(f"Webhook sent to {url}")
        except Exception as e:
            logging.error(f"Failed to send webhook: {e}")

    def notify(self, alert_data):
        logging.info(f"Alert generated: {alert_data}")
        # Optionally route based on severity or configuration
        if 'webhook_url' in self.config:
            self.send_webhook(self.config['webhook_url'], alert_data)
        if 'alert_email' in self.config:
            self.send_email(
                subject=f"Sauron Alert: {alert_data.get('type', 'Unknown Event')}",
                body=str(alert_data),
                to_email=self.config['alert_email']
            )
