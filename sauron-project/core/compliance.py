import json
from typing import Dict, List, Any

# Simple mapping of alert types/signatures to NIST 800-171 and CMMC 2.0 controls
COMPLIANCE_MAPPING = {
    "SSH Brute Force": {
        "NIST_800_171": ["3.1.8", "3.1.12", "3.14.6"],
        "CMMC": ["AC.L2-3.1.8", "AC.L2-3.1.12"],
        "category": "Access Control"
    },
    "Malware Detected": {
        "NIST_800_171": ["3.14.1", "3.14.2", "3.14.4"],
        "CMMC": ["SI.L2-3.14.1", "SI.L2-3.14.2", "SI.L2-3.14.4"],
        "category": "System and Information Integrity"
    },
    "Unauthorized Access": {
        "NIST_800_171": ["3.1.1", "3.1.2", "3.3.1"],
        "CMMC": ["AC.L2-3.1.1", "AC.L2-3.1.2", "AU.L2-3.3.1"],
        "category": "Access Control / Audit and Accountability"
    },
    "Default": {
        "NIST_800_171": ["3.3.1", "3.3.2"],
        "CMMC": ["AU.L2-3.3.1", "AU.L2-3.3.2"],
        "category": "Audit and Accountability"
    }
}

class ComplianceMapper:
    def __init__(self):
        self.mapping = COMPLIANCE_MAPPING

    def map_alert(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """
        Enhances an alert dictionary with compliance mapping data.
        """
        signature = alert.get("signature", "Unknown")
        
        # Simple heuristic matching
        matched_profile = self.mapping["Default"]
        if "SSH" in signature or "Brute Force" in signature:
            matched_profile = self.mapping["SSH Brute Force"]
        elif "Malware" in signature or "Trojan" in signature or "Virus" in signature:
            matched_profile = self.mapping["Malware Detected"]
        elif "Unauthorized" in signature or "Login Failed" in signature:
            matched_profile = self.mapping["Unauthorized Access"]

        alert["compliance"] = matched_profile
        return alert

    def generate_evidence_report(self, alerts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generates a summary report grouping alerts by compliance controls.
        """
        report = {
            "NIST_800_171": {},
            "CMMC": {},
            "total_events": len(alerts)
        }

        for alert in alerts:
            mapped = self.map_alert(alert)
            comp_data = mapped["compliance"]
            
            for control in comp_data["NIST_800_171"]:
                if control not in report["NIST_800_171"]:
                    report["NIST_800_171"][control] = 0
                report["NIST_800_171"][control] += 1
                
            for control in comp_data["CMMC"]:
                if control not in report["CMMC"]:
                    report["CMMC"][control] = 0
                report["CMMC"][control] += 1

        return report
