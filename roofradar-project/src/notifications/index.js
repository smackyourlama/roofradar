class NotificationSystem {
  static async sendReport(leads) {
    console.log("=== Notification System: Sending Report ===");
    const qualifiedLeads = leads.filter(l => l.isQualified);
    
    let reportBody = `Roofradar Lead Report\n`;
    reportBody += `Total Leads Processed: ${leads.length}\n`;
    reportBody += `Total Qualified Leads: ${qualifiedLeads.length}\n\n`;
    
    qualifiedLeads.forEach(lead => {
      reportBody += `Lead: ${lead.businessName || lead.fullName}\n`;
      reportBody += `Score: ${lead.score || 0}\n`;
      reportBody += `Phone: ${lead.phoneNumber || 'N/A'}\n`;
      reportBody += `Address: ${lead.physicalAddress || 'N/A'}\n`;
      reportBody += `----------------------------------------\n`;
    });

    // In a real system, we would use nodemailer or a Slack/Discord webhook here.
    // For this phase, we output to a file and console to simulate sending.
    const fs = require('fs');
    const path = require('path');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(__dirname, '..', '..', `lead-report-${timestamp}.txt`);
    
    fs.writeFileSync(reportPath, reportBody);
    console.log(`Report generated and "sent". Saved locally to: ${reportPath}`);
  }
}

module.exports = { NotificationSystem };
