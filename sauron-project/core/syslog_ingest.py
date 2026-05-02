import socket
import logging

class SyslogIngester:
    def __init__(self, host='0.0.0.0', port=514):
        self.host = host
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
    def start(self):
        self.sock.bind((self.host, self.port))
        logging.info(f"Listening for syslog on {self.host}:{self.port}")
        while True:
            data, addr = self.sock.recvfrom(1024)
            message = data.decode('utf-8').strip()
            self.process_message(addr, message)
            
    def process_message(self, addr, message):
        # Basic parsing/storing of syslog messages
        logging.info(f"Syslog from {addr}: {message}")
        # In a real scenario, write to a DB or forward to LLM analyzer

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    ingester = SyslogIngester()
    # ingester.start() # Disabled for module import
