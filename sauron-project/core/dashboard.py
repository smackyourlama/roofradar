from flask import Flask, jsonify, render_template_string
import threading
import logging

from .suricata_parser import SuricataParser
from .llm_summary import LLMSummarizer
from .notifications import Notifier

app = Flask(__name__)

# Core components
suricata_parser = SuricataParser()
llm_summarizer = LLMSummarizer()
notifier = Notifier()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Sauron Dashboard</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        h2 { color: #555; }
        .alert { background: #ffebee; border-left: 5px solid #f44336; padding: 10px; margin-bottom: 10px; }
        .alert-high { border-color: #d32f2f; }
        .alert-medium { background: #fff8e1; border-color: #ffc107; }
        .alert-low { background: #e8f5e9; border-color: #4caf50; }
        .summary { font-style: italic; color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sauron Cybersecurity Appliance</h1>
        <h2>System Health</h2>
        <div id="health">Loading health status...</div>
        <h2>Recent Suricata Alerts</h2>
        <div id="alerts">Loading alerts...</div>
    </div>
    <script>
        fetch('/api/health')
            .then(r => r.json())
            .then(data => {
                document.getElementById('health').innerHTML = `Status: <b>${data.status}</b>`;
            });
            
        fetch('/api/alerts')
            .then(r => r.json())
            .then(data => {
                const alertsDiv = document.getElementById('alerts');
                if (data.length === 0) {
                    alertsDiv.innerHTML = '<p>No alerts found.</p>';
                    return;
                }
                alertsDiv.innerHTML = data.map(a => `
                    <div class="alert">
                        <strong>[${a.alert.severity}] ${a.alert.signature}</strong> (Src: ${a.src_ip}, Dest: ${a.dest_ip})
                        <div class="summary">${a.llm_summary || 'No summary available.'}</div>
                    </div>
                `).join('');
            });
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "components": {"syslog": "ok", "suricata": "ok", "llm": "ok"}})

@app.route('/api/alerts')
def alerts():
    # Parse real alerts from Suricata log
    raw_alerts = suricata_parser.parse_alerts()[-10:] # get last 10
    
    processed_alerts = []
    for alert in raw_alerts:
        # We could summarize each alert via LLM if needed
        # In a real system, we'd cache this or do it asynchronously
        processed_alerts.append({
            "timestamp": alert.get("timestamp"),
            "src_ip": alert.get("src_ip"),
            "dest_ip": alert.get("dest_ip"),
            "alert": alert.get("alert", {}),
            "llm_summary": "Summary generation deferred to background task." # To avoid blocking the UI
        })
        
    return jsonify(processed_alerts)

@app.route('/api/process_latest_alert', methods=['POST'])
def process_latest_alert():
    raw_alerts = suricata_parser.parse_alerts()
    if not raw_alerts:
        return jsonify({"status": "no alerts"})
        
    latest_alert = raw_alerts[-1]
    summary = llm_summarizer.summarize_alert(str(latest_alert))
    
    enriched_alert = {
        "alert_data": latest_alert,
        "summary": summary
    }
    
    notifier.notify(enriched_alert)
    return jsonify({"status": "processed", "data": enriched_alert})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
