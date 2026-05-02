class NotificationSystem {
  static async sendReport(leads) {
    console.log("=== Notification System: Sending Report ===");
    const qualifiedLeads = leads.filter(l => l.isQualified);
    
    let reportBody = `RoofRadar Lead Report\n`;
    reportBody += `Total Leads Processed: ${leads.length}\n`;
    reportBody += `Total Qualified Leads: ${qualifiedLeads.length}\n\n`;
    
    qualifiedLeads.forEach(lead => {
      reportBody += `Lead: ${lead.businessName || lead.fullName}\n`;
      reportBody += `Score: ${lead.score || 0}\n`;
      reportBody += `Phone: ${lead.phoneNumber || 'N/A'}\n`;
      reportBody += `Address: ${lead.physicalAddress || 'N/A'}\n`;
      reportBody += `----------------------------------------\n`;
    });

    // Save to local file
    const fs = require('fs');
    const path = require('path');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(__dirname, '..', '..', `lead-report-${timestamp}.txt`);
    
    fs.writeFileSync(reportPath, reportBody);
    console.log(`Report generated and saved locally to: ${reportPath}`);

    // Send to Telegram
    try {
      const token = '8401625388:AAEwc33alBpvGwk3kXibfkB3bjiz_MtUf-w';
      const chatId = '7888746584';
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: reportBody
        })
      });

      if (!response.ok) {
        console.error('Telegram API Error:', await response.text());
      } else {
        console.log('Telegram notification sent successfully.');
      }
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }
}

module.exports = { NotificationSystem };
