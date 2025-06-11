export const fileDocGroupAndTypes = {
  Appraisal: [
    "Appraisal Amendment",
    "Appraisal - Other",
    "Appraisal PDF",
    "Appraisal XML",
    "Secondary Appraisal",
  ],
  "Borrower Documents": [
    "Background Report",
    "Borrower Documents - Other",
    "Borrower Experience Docs",
    "Borrower Personal Financial Statements",
    "Borrower REO",
    "Borrower Track Record",
    "Credit Authorization",
    "Credit Report",
    "Loan Application",
    "OFAC Report",
    "Photo Identification",
  ],
  "Closing Package": [
    "Allonge",
    "Assignment of Leases & Rents",
    "Assignment of Mortgage",
    "Business Purpose Affidavit",
    "CEMA",
    "Closing Package",
    "Closing Package - Other",
    "Final HUD",
    "Final Title Policy",
    "Guaranty",
    "Loan Agreement",
    "Mortgage",
    "Note",
    "Recorded Documents",
  ],
  "Construction Documents": [
    "Construction Documents - Other",
    "Contactor Agreement",
    "Permits",
    "Plans",
    "Scope of Work",
  ],
  "Entity Docs": [
    "Amended Entity Document",
    "Articles of Organization",
    "COGS",
    "EIN",
    "Entity Docs - Other",
    "Foreign Entity Docs",
    "Operating Agreement",
  ],
  "Insurance Docs": [
    "Bound Insurance Policy",
    "Flood Insurance",
    "HOA Master Insurance Policy",
    "Insurance Binder",
    "Insurance Docs - Other",
    "Insurance Final Paid Receipt",
    "Insurance Invoice",
  ],
  Liquidity: [
    "Bank Statement",
    "Gift Letter",
    "Liquidity - Other",
    "Other Account Type Statement",
  ],
  "Leases & Rents": [
    "Leases & Rents - Other",
    "Proof of Rent Received",
    "Unit Rental Lease",
  ],
  "Letter of Explanation & Exceptions": [
    "AKA Letter",
    "Background LOE",
    "Credit Report LOE",
    "Letter of Explanation - Other",
    "Liquidity LOE",
  ],
  // "No Category": ["No Category"],
  "Property Documents": [
    "Flood Certificate",
    "HOA Dues",
    "Payoff Letter",
    "Property Documents - Other",
    "Property Management Agreement",
    "Purchase Contract",
    "Purchase HUD",
    "Verification of Mortgage",
  ],
  Questionnaires: [
    "Condo Questionnaire",
    "Property Management Questionnaire",
    "Questionnaires - Other",
  ],
  "Terms & Sizer": [
    "Preliminary HUD",
    "Sizer",
    "Term Sheet",
    "Terms & Sizer - Other",
  ],
  "Third Party Reports": [
    "Budget Feasibility Report",
    "Engineering Report",
    "Environmental Report",
    "Third Party Reports - Other",
  ],
  "Title Docs": [
    "Final Title Policy",
    "Preliminary Title",
    "Tax Certs",
    "Title Docs - Other",
  ],
};

export const fileDocGroups = Object.keys(fileDocGroupAndTypes);

export const getDocTypesByGroup = (group) => fileDocGroupAndTypes[group];

export const searchDocuments = (searchTerm) => {
  // Check if searchTerm is provided and is a string
  if (!searchTerm || typeof searchTerm !== "string") {
    return { error: "Search term must be a non-empty string" };
  }

  const results = {};

  // Iterate through each document group
  Object.entries(fileDocGroupAndTypes).forEach(([docGroup, docTypes]) => {
    // Check if the docGroup contains the search term
    const docGroupMatches = docGroup.includes(searchTerm);

    // Find matching doc types in this group
    const matchingDocTypes = docTypes.filter((docType) =>
      docType.includes(searchTerm)
    );

    // If either the docGroup or any docTypes match, add to results
    if (docGroupMatches || matchingDocTypes.length > 0) {
      results[docGroup] = matchingDocTypes;

      // If the docGroup matched but no specific docTypes matched,
      // include all docTypes for this group
      if (docGroupMatches && matchingDocTypes.length === 0) {
        results[docGroup] = docTypes;
      }
    }
  });

  return results;
};
