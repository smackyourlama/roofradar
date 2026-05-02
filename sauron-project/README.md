# Sauron - Phase 2 Core Features
This project implements the core features for the Sauron Raspberry Pi cybersecurity monitoring appliance.

## Features
- **Syslog Ingestion**: Ingests syslog events from the network.
- **Suricata Integration**: Parses Suricata `eve.json` alerts.
- **LLM Summarization**: Summarizes cybersecurity alerts using local LLM (Ollama).
- **Dashboard**: A local web interface to view alerts and system health.
- **Hotspot Fallback**: Manages fallback to AP mode for onboarding if no WiFi is available.

## Implementation
The `core` directory contains the Python modules implementing these features.
