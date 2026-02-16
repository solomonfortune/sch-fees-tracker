export const PRIMARY_CLASSES = [
  "Baby Class","Middle Class","Top Class","P1","P2","P3","P4","P5","P6","P7"
];
export const SECONDARY_CLASSES = ["S1","S2","S3","S4","S5","S6"];
export const CLASSES = [...PRIMARY_CLASSES, ...SECONDARY_CLASSES];

export const getClassesBySchoolType = (type) => {
  if (type === "Primary School") return PRIMARY_CLASSES;
  if (type === "Secondary School") return SECONDARY_CLASSES;
  return CLASSES;
};

export const TERMS = ["Term 1", "Term 2", "Term 3"];
export const METHODS = ["Mobile Money", "Cash", "Bank Transfer", "Check"];
export const CURRENCIES = ["UGX","KES","TZS","GHS","NGN","USD","EUR"];

export const DEFAULT_CATEGORIES = [
  { id:"dc-1", name:"Construction Fees", description:"Building and infrastructure" },
  { id:"dc-2", name:"School Trip", description:"Educational trips and excursions" },
  { id:"dc-3", name:"Uniform Fees", description:"School uniforms and attire" },
  { id:"dc-4", name:"Exam Fees", description:"Examination and assessment fees" },
  { id:"dc-5", name:"Sports Fees", description:"Sports activities and equipment" },
  { id:"dc-6", name:"Library Fees", description:"Library membership and resources" },
  { id:"dc-7", name:"Computer Lab Fees", description:"Computer lab usage and maintenance" },
  { id:"dc-8", name:"Development Fund", description:"General school development" },
  { id:"dc-9", name:"Graduation Fees", description:"Graduation ceremony expenses" },
  { id:"dc-10", name:"Other", description:"Miscellaneous payments" },
];
