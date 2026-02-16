// Realistic demo data for myFeesTracker

const S = (id, name, reg, classId, year, term, required, paid) => ({
  id, name, registrationNumber: reg, classId, academicYear: year, term, feesRequired: required, feesPaid: paid, status: "active", createdAt: "2026-01-15T08:00:00Z"
});

export const SEED_STUDENTS = [
  // Baby Class
  S("s01", "Nakato Sarah", "KA-2026-001", "Baby Class", "2026", "Term 1", 350000, 350000),
  S("s02", "Wasswa Brian", "KA-2026-002", "Baby Class", "2026", "Term 1", 350000, 200000),
  // Middle Class
  S("s03", "Apio Lydia", "KA-2026-003", "Middle Class", "2026", "Term 1", 400000, 400000),
  S("s04", "Okello James", "KA-2026-004", "Middle Class", "2026", "Term 1", 400000, 150000),
  S("s05", "Namutebi Grace", "KA-2026-005", "Middle Class", "2026", "Term 1", 400000, 400000),
  // Top Class
  S("s06", "Kato Ali", "KA-2026-006", "Top Class", "2026", "Term 1", 450000, 450000),
  S("s07", "Babirye Faith", "KA-2026-007", "Top Class", "2026", "Term 1", 450000, 300000),
  // P1
  S("s08", "Ssali Kevin", "KA-2026-008", "P1", "2026", "Term 1", 500000, 500000),
  S("s09", "Nambooze Esther", "KA-2026-009", "P1", "2026", "Term 1", 500000, 250000),
  S("s10", "Mugisha Daniel", "KA-2026-010", "P1", "2026", "Term 1", 500000, 500000),
  // P2
  S("s11", "Atim Peace", "KA-2026-011", "P2", "2026", "Term 1", 500000, 500000),
  S("s12", "Ouma Victor", "KA-2026-012", "P2", "2026", "Term 1", 500000, 0),
  S("s13", "Namukasa Joan", "KA-2026-013", "P2", "2026", "Term 1", 500000, 350000),
  // P3
  S("s14", "Kakande Simon", "KA-2026-014", "P3", "2026", "Term 1", 550000, 550000),
  S("s15", "Adong Mercy", "KA-2026-015", "P3", "2026", "Term 1", 550000, 200000),
  S("s16", "Tumusiime Robert", "KA-2026-016", "P3", "2026", "Term 1", 550000, 550000),
  // P4
  S("s17", "Nalubega Fatima", "KA-2026-017", "P4", "2026", "Term 1", 600000, 600000),
  S("s18", "Wabwire Joseph", "KA-2026-018", "P4", "2026", "Term 1", 600000, 400000),
  // P5
  S("s19", "Achan Betty", "KA-2026-019", "P5", "2026", "Term 1", 650000, 650000),
  S("s20", "Muwanga Isaac", "KA-2026-020", "P5", "2026", "Term 1", 650000, 325000),
  S("s21", "Namubiru Catherine", "KA-2026-021", "P5", "2026", "Term 1", 650000, 650000),
  // P6
  S("s22", "Opiro Moses", "KA-2026-022", "P6", "2026", "Term 1", 700000, 700000),
  S("s23", "Nakimera Anita", "KA-2026-023", "P6", "2026", "Term 1", 700000, 500000),
  // P7
  S("s24", "Lubwama Henry", "KA-2026-024", "P7", "2026", "Term 1", 800000, 800000),
  S("s25", "Amongin Rebecca", "KA-2026-025", "P7", "2026", "Term 1", 800000, 600000),
  S("s26", "Ssemakula David", "KA-2026-026", "P7", "2026", "Term 1", 800000, 800000),
  S("s27", "Namayanja Rita", "KA-2026-027", "P7", "2026", "Term 1", 800000, 400000),
  S("s28", "Otim Patrick", "KA-2026-028", "P7", "2026", "Term 1", 800000, 800000),
];

// Generate payments from students who have paid something
const P = (id, studentId, studentName, classId, amount, method, term, date, receipt) => ({
  id, studentId, studentName, classId, amount, method, term, date, receiptNumber: receipt, createdAt: date + "T10:00:00Z"
});

export const SEED_PAYMENTS = [
  P("p01", "s01", "Nakato Sarah", "Baby Class", 350000, "Mobile Money", "Term 1", "2026-01-20", "RCP-38291047"),
  P("p02", "s02", "Wasswa Brian", "Baby Class", 200000, "Cash", "Term 1", "2026-01-22", "RCP-41827365"),
  P("p03", "s03", "Apio Lydia", "Middle Class", 250000, "Mobile Money", "Term 1", "2026-01-18", "RCP-55739201"),
  P("p04", "s03", "Apio Lydia", "Middle Class", 150000, "Cash", "Term 1", "2026-02-03", "RCP-55739402"),
  P("p05", "s04", "Okello James", "Middle Class", 150000, "Cash", "Term 1", "2026-01-25", "RCP-62048173"),
  P("p06", "s05", "Namutebi Grace", "Middle Class", 400000, "Bank Transfer", "Term 1", "2026-01-17", "RCP-70193284"),
  P("p07", "s06", "Kato Ali", "Top Class", 450000, "Mobile Money", "Term 1", "2026-01-19", "RCP-83047251"),
  P("p08", "s07", "Babirye Faith", "Top Class", 300000, "Cash", "Term 1", "2026-01-28", "RCP-91735062"),
  P("p09", "s08", "Ssali Kevin", "P1", 500000, "Bank Transfer", "Term 1", "2026-01-16", "RCP-10482936"),
  P("p10", "s09", "Nambooze Esther", "P1", 250000, "Mobile Money", "Term 1", "2026-02-01", "RCP-12847395"),
  P("p11", "s10", "Mugisha Daniel", "P1", 500000, "Mobile Money", "Term 1", "2026-01-21", "RCP-20384756"),
  P("p12", "s11", "Atim Peace", "P2", 500000, "Cash", "Term 1", "2026-01-23", "RCP-31749285"),
  P("p13", "s13", "Namukasa Joan", "P2", 350000, "Mobile Money", "Term 1", "2026-02-05", "RCP-42918374"),
  P("p14", "s14", "Kakande Simon", "P3", 550000, "Bank Transfer", "Term 1", "2026-01-17", "RCP-50382917"),
  P("p15", "s15", "Adong Mercy", "P3", 200000, "Cash", "Term 1", "2026-02-06", "RCP-61827340"),
  P("p16", "s16", "Tumusiime Robert", "P3", 550000, "Mobile Money", "Term 1", "2026-01-24", "RCP-73920184"),
  P("p17", "s17", "Nalubega Fatima", "P4", 600000, "Mobile Money", "Term 1", "2026-01-20", "RCP-84019273"),
  P("p18", "s18", "Wabwire Joseph", "P4", 400000, "Cash", "Term 1", "2026-02-02", "RCP-92048371"),
  P("p19", "s19", "Achan Betty", "P5", 650000, "Bank Transfer", "Term 1", "2026-01-18", "RCP-10293847"),
  P("p20", "s20", "Muwanga Isaac", "P5", 325000, "Mobile Money", "Term 1", "2026-02-04", "RCP-20481739"),
  P("p21", "s21", "Namubiru Catherine", "P5", 650000, "Check", "Term 1", "2026-01-22", "RCP-31948270"),
  P("p22", "s22", "Opiro Moses", "P6", 700000, "Mobile Money", "Term 1", "2026-01-19", "RCP-40182937"),
  P("p23", "s23", "Nakimera Anita", "P6", 500000, "Cash", "Term 1", "2026-02-07", "RCP-51739284"),
  P("p24", "s24", "Lubwama Henry", "P7", 800000, "Bank Transfer", "Term 1", "2026-01-16", "RCP-60284719"),
  P("p25", "s25", "Amongin Rebecca", "P7", 600000, "Mobile Money", "Term 1", "2026-02-01", "RCP-72918403"),
  P("p26", "s26", "Ssemakula David", "P7", 800000, "Mobile Money", "Term 1", "2026-01-21", "RCP-83019472"),
  P("p27", "s27", "Namayanja Rita", "P7", 400000, "Cash", "Term 1", "2026-02-08", "RCP-94027381"),
  P("p28", "s28", "Otim Patrick", "P7", 800000, "Check", "Term 1", "2026-01-23", "RCP-10394827"),
];

export const SEED_OTHER_PAYMENTS = [
  { id: "op01", payerName: "Nakato Sarah (Parent)", payerContact: "0772-123456", categoryId: "dc-1", categoryName: "Construction Fees", description: "New classroom block contribution", amount: 150000, method: "Mobile Money", date: "2026-01-25", reference: "MM-4829301", receiptNumber: "OP-83920174-AKX", createdAt: "2026-01-25T09:00:00Z" },
  { id: "op02", payerName: "Okello James (Parent)", payerContact: "0782-654321", categoryId: "dc-2", categoryName: "School Trip", description: "Jinja excursion — Term 1", amount: 80000, method: "Cash", date: "2026-02-01", reference: "", receiptNumber: "OP-74028193-BFR", createdAt: "2026-02-01T11:00:00Z" },
  { id: "op03", payerName: "Lubwama Henry (Parent)", payerContact: "0701-987654", categoryId: "dc-3", categoryName: "Uniform Fees", description: "2 sets school uniform", amount: 120000, method: "Cash", date: "2026-01-20", reference: "", receiptNumber: "OP-61039284-CWP", createdAt: "2026-01-20T14:00:00Z" },
  { id: "op04", payerName: "Namubiru Catherine (Parent)", payerContact: "0772-111222", categoryId: "dc-4", categoryName: "Exam Fees", description: "Mock exams P5", amount: 50000, method: "Mobile Money", date: "2026-02-05", reference: "MM-8374019", receiptNumber: "OP-50294817-DTK", createdAt: "2026-02-05T08:30:00Z" },
  { id: "op05", payerName: "Ssemakula David (Parent)", payerContact: "0782-333444", categoryId: "dc-5", categoryName: "Sports Fees", description: "Inter-school athletics", amount: 60000, method: "Cash", date: "2026-02-03", reference: "", receiptNumber: "OP-42918304-EMN", createdAt: "2026-02-03T10:00:00Z" },
  { id: "op06", payerName: "Atim Peace (Parent)", payerContact: "0701-555666", categoryId: "dc-8", categoryName: "Development Fund", description: "Annual development levy", amount: 200000, method: "Bank Transfer", date: "2026-01-18", reference: "BT-REF-20260118", receiptNumber: "OP-31047298-FJQ", createdAt: "2026-01-18T09:15:00Z" },
  { id: "op07", payerName: "Mugisha Daniel (Parent)", payerContact: "0772-777888", categoryId: "dc-1", categoryName: "Construction Fees", description: "Library construction fund", amount: 100000, method: "Mobile Money", date: "2026-02-06", reference: "MM-1928374", receiptNumber: "OP-20384917-GXH", createdAt: "2026-02-06T13:00:00Z" },
  { id: "op08", payerName: "Babirye Faith (Parent)", payerContact: "0782-999000", categoryId: "dc-9", categoryName: "Graduation Fees", description: "Top Class graduation ceremony", amount: 75000, method: "Cash", date: "2026-02-08", reference: "", receiptNumber: "OP-19283740-HVL", createdAt: "2026-02-08T11:30:00Z" },
];

export const SEED_SETTINGS = {
  name: "",  // Will be set from school name during login
  email: "", // Will be set from login email
  phone: "0772-000111",
  currency: "UGX",
  address: "Plot 12, Kampala Road",
  district: "Kampala",
  country: "Uganda",
};
