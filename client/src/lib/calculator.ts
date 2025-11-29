
export type TheoryMarks = {
  cie1: number | undefined;
  cie2: number | undefined;
  assignment1: number | undefined;
  assignment2: number | undefined;
  assignment3: number | undefined;
  model: number | undefined;
};

export type IntegratedMarks = {
  cie1: number | undefined;
  cie2: number | undefined;
  cie3: number | undefined;
  practical1: number | undefined;
  practical2: number | undefined;
  practical3: number | undefined;
};

export type CalculationResult = {
  total: number;
  maxTotal: number;
  percentage: number;
  message: string;
};

// Helper to safely parse input, returning undefined for empty strings
export const safeParse = (val: string | number): number | undefined => {
  if (typeof val === 'number') return val;
  if (val === '' || val === undefined || val === null) return undefined;
  const parsed = parseFloat(val); // Changed from parseInt to parseFloat to support decimal GPA
  return isNaN(parsed) ? undefined : parsed;
};

export const calculateTheory = (marks: TheoryMarks): CalculationResult => {
  // Conversion Rules:
  // CIE1 (50) -> 8
  // CIE2 (50) -> 8
  // Ass1 (10) -> 4  (Defaults to 0 if undefined)
  // Ass2 (10) -> 4  (Defaults to 0 if undefined)
  // Ass3 (10) -> 6  (Defaults to 0 if undefined)
  // Model (100) -> 10
  // Total Max: 40

  const c1 = ((marks.cie1 ?? 0) / 50) * 8;
  const c2 = ((marks.cie2 ?? 0) / 50) * 8;
  
  // Assignments default to 0 if undefined (blank)
  const a1Val = marks.assignment1 ?? 0;
  const a2Val = marks.assignment2 ?? 0;
  const a3Val = marks.assignment3 ?? 0;

  const a1 = (a1Val / 10) * 4;
  const a2 = (a2Val / 10) * 4;
  const a3 = (a3Val / 10) * 6;
  
  const m = ((marks.model ?? 0) / 100) * 10;

  const total = c1 + c2 + a1 + a2 + a3 + m;
  
  const finalTotal = Math.min(40, Math.max(0, total));
  
  let message = "Keep pushing!";
  if (finalTotal >= 35) message = "Excellent work!";
  else if (finalTotal >= 30) message = "Great job!";
  else if (finalTotal >= 20) message = "Good effort, keep improving.";
  else message = "Needs improvement.";

  return {
    total: Number(finalTotal.toFixed(1)),
    maxTotal: 40,
    percentage: (finalTotal / 40) * 100,
    message
  };
};

export const calculateIntegrated = (marks: IntegratedMarks): CalculationResult => {
  // Conversion Rules:
  // CIE1 (50) -> 7
  // CIE2 (50) -> 7
  // CIE3 (100) -> 11
  // Prac1 (50) -> 7
  // Prac2 (50) -> 7
  // Prac3 (100) -> 11
  // Total Max: 50

  const c1 = ((marks.cie1 ?? 0) / 50) * 7;
  const c2 = ((marks.cie2 ?? 0) / 50) * 7;
  const c3 = ((marks.cie3 ?? 0) / 100) * 11;
  
  const p1 = ((marks.practical1 ?? 0) / 50) * 7;
  const p2 = ((marks.practical2 ?? 0) / 50) * 7;
  const p3 = ((marks.practical3 ?? 0) / 100) * 11;

  const total = c1 + c2 + c3 + p1 + p2 + p3;
  const finalTotal = Math.min(50, Math.max(0, total));

  let message = "Keep pushing!";
  if (finalTotal >= 45) message = "Outstanding performance!";
  else if (finalTotal >= 35) message = "Great job!";
  else if (finalTotal >= 25) message = "Good effort.";
  else message = "Focus on the practicals.";

  return {
    total: Number(finalTotal.toFixed(1)),
    maxTotal: 50,
    percentage: (finalTotal / 50) * 100,
    message
  };
};
