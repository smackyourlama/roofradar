const cron = require('node-cron');
const { LeadDiscovery } = require('./discovery');
const { LeadQualification } = require('./qualification');
const { LeadScoring } = require('./scoring');
const { NotificationSystem } = require('./notifications');

async function runDiscoveryCycle() {
  console.log(`\n[${new Date().toISOString()}] === Roofradar Discovery Cycle Started ===`);

  try {
    // 1. Discovery
    const discovery = new LeadDiscovery("GooglePlacesMock");
    let leads = await discovery.discoverLeads("Roofing Contractors", "Springfield");
    console.log(`Discovered ${leads.length} potential leads.`);

    if (leads.length > 0) {
      // 2. Qualification
      leads = LeadQualification.processLeads(leads);
      
      // 3. Scoring
      leads = LeadScoring.processLeads(leads);

      // 4. Reporting & Notification
      await NotificationSystem.sendReport(leads);
    } else {
      console.log("No leads discovered in this cycle.");
    }
  } catch (error) {
    console.error("Error during discovery cycle:", error);
  }

  console.log(`[${new Date().toISOString()}] === Roofradar Discovery Cycle Completed ===\n`);
}

function startCron() {
  console.log("Initializing Roofradar Automated Discovery Cycle (Cron)...");
  
  // Run every 6 hours
  // Format: second minute hour day-of-month month day-of-week
  const schedule = '0 */6 * * *'; 
  
  cron.schedule(schedule, () => {
    runDiscoveryCycle();
  });

  console.log(`Cron scheduled: "${schedule}" (Runs every 6 hours)`);
  
  // Optionally run once immediately on startup
  console.log("Running initial cycle immediately...");
  runDiscoveryCycle();
}

module.exports = { startCron, runDiscoveryCycle };

// If executed directly
if (require.main === module) {
  startCron();
}
