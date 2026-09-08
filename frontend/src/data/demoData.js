// Demo & Prototype Data Layer for BIS AI Compliance Copilot
// Note: Demo data for prototype evaluation during SIH 2026.

export const IS_DEMO_DATA = true; // Flag for clear UI prototype tagging

export const SAMPLE_PROMPTS = [
  "I manufacture stainless steel pressure cookers in Maharashtra.",
  "What is the BIS certification process for lithium-ion battery packs?",
  "What are the mandatory QCO orders for toys under IS 9873?",
  "How do I apply for the Compulsory Registration Scheme (CRS)?",
  "What is the difference between ISI Mark Scheme-I and CRS Scheme-II?",
  "What testing requirements apply to solar PV modules under IS 14286?"
];

export const MOCK_STANDARDS = [
  {
    id: "IS-2347-2017",
    number: "IS 2347:2017",
    title: "Domestic Pressure Cookers - Specification",
    category: "Household Appliances",
    scheme: "Scheme I (ISI Mark)",
    qcoStatus: "Mandatory QCO in effect",
    status: "Active Standard",
    isDemo: true,
    relevance: "Mandatory certification under DPIIT QCO order for domestic pressure cookers.",
    keyRequirements: [
      "Clause 5.1 — Hydrostatic burst pressure test minimum 3.0x operating pressure",
      "Clause 7.2 — Food-grade rubber gasket compliance (IS 7466)",
      "Clause 6.3 — Safety valve release between 1.1 bar to 1.5 bar",
      "Clause 8.1 — Thermal shock resistance verification"
    ],
    primarySource: {
      title: "BIS Official Portal",
      url: "https://www.bis.gov.in",
      publisher: "Bureau of Indian Standards"
    },
    references: [
      { section: "Section 5 — Safety Tests", clause: "Clause 5.1 & 5.2", date: "2017 Edition" },
      { section: "Annexure B — Gasket Specs", clause: "IS 7466 Cross-ref", date: "Amended 2021" }
    ]
  },
  {
    id: "IS-13252-1-2010",
    number: "IS 13252 (Part 1):2010",
    title: "Information Technology Equipment - Safety",
    category: "Electronics & IT",
    scheme: "Scheme II (CRS)",
    qcoStatus: "Mandatory Registration",
    status: "Active Standard",
    isDemo: true,
    relevance: "Applies to laptops, power adapters, monitors, and servers under MeitY CRS.",
    keyRequirements: [
      "Clause 2.1 — Creepage distance & electrical clearance testing",
      "Clause 5.2 — Insulation resistance & dielectric strength (1500V AC)",
      "Clause 4.5 — Heating & temperature rise test on transformers",
      "Clause 1.7 — Enclosure flammability rating (UL94 V-0 equivalent)"
    ],
    primarySource: {
      title: "BIS CRS Official Portal",
      url: "https://www.crsbis.in",
      publisher: "MeitY / BIS CRS Division"
    },
    references: [
      { section: "Clause 2.1 — Safety Insulation", clause: "Table 2B Clearance", date: "2010 Edition" },
      { section: "MeitY CRS Mandate Phase 1", clause: "Schedule II", date: "Gazette 2012" }
    ]
  },
  {
    id: "IS-16046-2-2019",
    number: "IS 16046 (Part 2):2019",
    title: "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium Systems)",
    category: "Batteries & Energy Storage",
    scheme: "Scheme II (CRS)",
    qcoStatus: "Mandatory Registration",
    status: "Active Standard",
    isDemo: true,
    relevance: "Mandatory for portable lithium-ion batteries, EV modules, and power banks.",
    keyRequirements: [
      "Clause 7.2.1 — Overcharge safety protection test",
      "Clause 7.3.2 — External short circuit test at 55°C",
      "Clause 7.3.3 — Free fall test from 1.0 meter onto concrete",
      "Clause 7.3.6 — Thermal abuse testing up to 130°C"
    ],
    primarySource: {
      title: "BIS Official Battery Standards",
      url: "https://www.crsbis.in",
      publisher: "Bureau of Indian Standards"
    },
    references: [
      { section: "Section 7 — Safety Tests", clause: "Clauses 7.2 - 7.3", date: "2019 Revision" }
    ]
  }
];

export const MOCK_ALERTS = [
  {
    id: "ALT-2026-089",
    date: "2026-08-25",
    type: "QCO Notice (Demo Data)",
    category: "Household Electricals",
    title: "Extension of BIS Mandatory Certification for Smart Electric Ceiling Fans",
    whatChanged: "DPIIT issued QCO draft requiring IS 374:2019 star-rated compliance with embedded smart controller testing.",
    impact: "All manufacturers must submit test report to NABL accredited lab prior to enforcement date.",
    action: "Review IS 374 clauses and prepare factory quality manual.",
    isDemo: true
  },
  {
    id: "ALT-2026-074",
    date: "2026-08-10",
    type: "Amendment (Demo Data)",
    category: "Lithium Batteries",
    title: "Amendment 2 released for IS 16046 (Part 2):2019",
    whatChanged: "Updated safety thresholds for BMS (Battery Management System) overvoltage lockout time.",
    impact: "Existing CRS licensees must update technical construction file (TCF) during renewal.",
    action: "Check Amendment 2 from official portal and conduct internal gap check.",
    isDemo: true
  }
];

export const MOCK_ANALYSIS_RESULT = {
  product: "Stainless Steel Pressure Cooker",
  standardNumber: "IS 2347:2017",
  standardTitle: "Domestic Pressure Cookers - Specification",
  certificationScheme: "Scheme I (ISI Mark)",
  qcoMandatory: true,
  complianceScore: 82,
  riskLevel: "Pending Lab Test Reports",
  isDemo: true,
  statusChecklist: [
    { title: "Product Standard Identified", status: "success", detail: "IS 2347:2017 applies directly" },
    { title: "Manufacturing Location Checked", status: "success", detail: "Maharashtra plant details recorded" },
    { title: "NABL Test Report Status", status: "warning", detail: "Hydrostatic burst & gasket test reports pending" },
    { title: "Form 1 Application Status", status: "error", detail: "BIS Manakonline Form 1 not yet submitted" }
  ],
  requiredActions: [
    "Send sample cookers to a BIS-recognized NABL laboratory for IS 2347 testing.",
    "Verify food-grade safety certificate for rubber gasket under IS 7466.",
    "Prepare Form 1 application draft for submission on official BIS portal.",
    "Maintain internal factory quality control manual for auditor inspection."
  ],
  primarySource: {
    title: "BIS Official Portal",
    url: "https://www.bis.gov.in",
    publisher: "Bureau of Indian Standards"
  },
  references: [
    { section: "IS 2347:2017 Domestic Cookers", clause: "Clauses 5.1 & 7.2", date: "2017 Specification" },
    { section: "DPIIT Mandatory Quality Control Order", clause: "Schedule I Mandate", date: "Gazette Notification" }
  ]
};

export const LANGUAGES = [
  { code: "en", name: "English", label: "English" },
  { code: "hi", name: "हिन्दी", label: "Hindi" },
  { code: "mr", name: "मराठी", label: "Marathi" },
  { code: "bn", name: "বাংলা", label: "Bengali" },
  { code: "ta", name: "தமிழ்", label: "Tamil" },
  { code: "te", name: "తెలుగు", label: "Telugu" }
];
