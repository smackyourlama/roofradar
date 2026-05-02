# Sauron - Cybersecurity Monitoring Appliance

This project implements the core features for the Sauron Raspberry Pi cybersecurity monitoring appliance.

## Features
- **Syslog Ingestion**: Ingests syslog events from the network.
- **Suricata Integration**: Parses Suricata `eve.json` alerts.
- **LLM Summarization**: Summarizes cybersecurity alerts using local LLM (Ollama).
- **Dashboard**: A local web interface to view alerts and system health.
- **Hotspot Fallback**: Manages fallback to AP mode for onboarding if no WiFi is available.
- **Compliance Mapping (Phase 4)**: Maps cybersecurity alerts to NIST 800-171 and CMMC 2.0 controls for evidence generation.
- **Production Readiness (Phase 4)**: Bootstrap and Lockdown scripts for securely provisioning Raspberry Pi SD images.

## Implementation
- The `core` directory contains the Python modules implementing these features.
- The `scripts` directory contains bash scripts for bootstrapping and locking down the appliance.
