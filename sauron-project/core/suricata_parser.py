import json
import os
import logging

class SuricataParser:
    def __init__(self, log_path="/var/log/suricata/eve.json"):
        self.log_path = log_path
        
    def parse_alerts(self):
        alerts = []
        if not os.path.exists(self.log_path):
            logging.error(f"Suricata log file {self.log_path} not found.")
            return alerts
            
        with open(self.log_path, 'r') as f:
            for line in f:
                try:
                    event = json.loads(line)
                    if event.get('event_type') == 'alert':
                        alerts.append(event)
                except json.JSONDecodeError:
                    continue
        return alerts

if __name__ == "__main__":
    parser = SuricataParser()
    print(parser.parse_alerts())
