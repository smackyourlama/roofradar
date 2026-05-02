class Lead {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.businessName = data.businessName || null;
    this.fullName = data.fullName || null;
    this.phoneNumber = data.phoneNumber || null;
    this.physicalAddress = data.physicalAddress || null;
    this.website = data.website || null;
    this.email = data.email || null;
    this.metadata = data.metadata || {};
    this.isQualified = false;
    this.score = 0;
  }
}

module.exports = { Lead };
