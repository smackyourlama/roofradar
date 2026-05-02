#!/bin/bash
# Sauron Raspberry Pi Lockdown Script
# Hardens the OS for production readiness (NIST 800-171 / CMMC compliance focus)

set -e

echo "Starting Sauron Security Lockdown..."

# 1. Configure UFW (Uncomplicated Firewall)
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP Dashboard
ufw allow 443/tcp # HTTPS Dashboard
ufw allow 514/udp # Syslog
ufw --force enable

# 2. Secure SSH
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config || echo "Password auth already disabled or not found"
systemctl restart sshd

# 3. Enable Fail2Ban
systemctl enable fail2ban
systemctl start fail2ban

# 4. Disable unused services (example)
systemctl disable avahi-daemon || true
systemctl stop avahi-daemon || true
systemctl disable bluetooth || true
systemctl stop bluetooth || true

# 5. Set restrictive permissions on Sauron directories
chmod 700 /opt/sauron
chmod 600 /etc/sauron/* || true
chmod 640 /var/log/sauron/* || true

# 6. Setup Auditd (if installed, good for compliance)
apt-get install -y auditd
systemctl enable auditd
systemctl start auditd

echo "Lockdown complete."
