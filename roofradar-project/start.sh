#!/bin/bash
cd "$(dirname "$0")"

# Start the main cron process
echo "Starting roofradar cron..."
nohup npm run cron > cron.log 2>&1 &

# Start the watchdog
echo "Starting watchdog..."
nohup node watchdog.js > watchdog.log 2>&1 &

echo "Services started."
