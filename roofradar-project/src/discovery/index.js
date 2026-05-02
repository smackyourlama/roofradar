const { Lead } = require('../models/Lead');

class LeadDiscovery {
  constructor(source) {
    this.source = source;
  }

  async discoverLeads(query, location) {
    console.log(`[Discovery] Searching for "${query}" in ${location} via ${this.source}...`);
    // In a real scenario, this would call an API like Google Places, Yelp, or a scraping service.
    // For now, we return mock data based on the requirements.
    return this.mockApiCall();
  }

  async mockApiCall() {
    const rawData = [
      {
        businessName: "Elite Roofing Pros",
        phoneNumber: "555-0101",
        physicalAddress: "123 Main St, Springfield",
        website: "https://eliteroofing.example.com",
        email: "contact@eliteroofing.example.com",
        metadata: { rating: 4.8, reviews: 120 }
      },
      {
        // Missing address - should be disqualified
        fullName: "John Doe Roofing",
        phoneNumber: "555-0102"
      },
      {
        // Missing phone - should be disqualified
        businessName: "Skyline Roofers",
        physicalAddress: "456 High St, Springfield"
      },
      {
        // Valid personal lead
        fullName: "Jane Smith",
        phoneNumber: "555-0104",
        physicalAddress: "789 Oak Ave, Springfield",
        metadata: { rating: 3.5, reviews: 12 }
      }
    ];

    return rawData.map(data => new Lead(data));
  }
}

module.exports = { LeadDiscovery };
