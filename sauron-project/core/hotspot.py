import subprocess
import logging

class HotspotManager:
    def __init__(self, ssid="Sauron-Setup", password="changeme123"):
        self.ssid = ssid
        self.password = password
        
    def check_wifi_connection(self):
        # Checks if we have an active wifi connection
        try:
            output = subprocess.check_output(["nmcli", "-t", "-f", "ACTIVE,SSID", "dev", "wifi"], text=True)
            for line in output.splitlines():
                if line.startswith("yes:"):
                    return True
            return False
        except Exception as e:
            logging.error(f"Failed to check wifi: {e}")
            return False
            
    def enable_hotspot(self):
        logging.info(f"Enabling fallback hotspot: {self.ssid}")
        try:
            subprocess.run([
                "nmcli", "dev", "wifi", "hotspot", 
                "ifname", "wlan0", 
                "ssid", self.ssid, 
                "password", self.password
            ], check=True)
            return True
        except subprocess.CalledProcessError as e:
            logging.error(f"Failed to start hotspot: {e}")
            return False

if __name__ == "__main__":
    hm = HotspotManager()
    if not hm.check_wifi_connection():
        hm.enable_hotspot()
