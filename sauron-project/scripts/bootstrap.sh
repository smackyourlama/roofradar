#!/bin/bash
# Sauron Raspberry Pi Bootstrap Script
# Sets up dependencies for Sauron

set -e

echo "Starting Sauron Bootstrap..."

# 1. Update and upgrade system
apt-get update && apt-get upgrade -y

# 2. Install core dependencies
apt-get install -y python3 python3-pip python3-venv docker.io suricata hostapd dnsmasq iptables ufw fail2ban

# 3. Enable and start Docker
systemctl enable docker
systemctl start docker

# 4. Pull required Docker images (e.g., Ollama if running via docker, though pi might run native)
# docker pull ollama/ollama

# 5. Setup Python environment
python3 -m venv /opt/sauron/venv
/opt/sauron/venv/bin/pip install -r /opt/sauron/requirements.txt || echo "requirements.txt not found yet"

# 6. Setup directories
mkdir -p /var/log/sauron
mkdir -p /etc/sauron

echo "Bootstrap complete."
