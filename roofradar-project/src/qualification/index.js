class LeadQualification {
  /**
   * Qualifies a lead based on mandatory fields.
   * Required: (fullName OR businessName) AND phoneNumber AND physicalAddress
   * @param {Lead} lead 
   * @returns {boolean}
   */
  static qualify(lead) {
    const hasName = Boolean(lead.fullName || lead.businessName);
    const hasPhone = Boolean(lead.phoneNumber);
    const hasAddress = Boolean(lead.physicalAddress);

    const isValid = hasName && hasPhone && hasAddress;
    lead.isQualified = isValid;
    
    if (!isValid) {
      console.log(`[Qualification] Lead disqualified. Missing requirements (Name: ${hasName}, Phone: ${hasPhone}, Address: ${hasAddress})`);
    } else {
      console.log(`[Qualification] Lead qualified: ${lead.businessName || lead.fullName}`);
    }

    return isValid;
  }

  static processLeads(leads) {
    return leads.map(lead => {
      this.qualify(lead);
      return lead;
    });
  }
}

module.exports = { LeadQualification };
