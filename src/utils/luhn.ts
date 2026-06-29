export interface LuhnStep {
  digit: number;
  originalIndex: number; // index from right (0 is rightmost)
  isDoubled: boolean;
  doubledValue: number; // digit * 2 or digit
  sumExpression: string; // e.g. "1+8" or "9" or "4"
  finalValue: number; // reduced single digit sum value
}

export interface LuhnCalculationResult {
  rawInput: string;
  cleanedInput: string;
  steps: LuhnStep[]; // ordered left-to-right as in original number
  totalSum: number;
  checkDigit: number;
  method1Result: number; // (sum * 9) % 10
  method2Result: number; // (10 - (sum % 10)) % 10
  unitDigit: number; // sum % 10
  fullNumber: string;
}

export interface LuhnValidationResult {
  rawInput: string;
  cleanedInput: string;
  payload: string;
  providedCheckDigit: number;
  calculatedCheckDigit: number;
  steps: LuhnStep[];
  totalSum: number;
  isValid: boolean;
}

export function cleanNumberString(str: string): string {
  return str.replace(/[^0-9]/g, '');
}

/**
 * Calculates the check digit for a partial account number payload.
 * In a partial payload P, position 0 from right will become position 1 in the full number (with check digit appended).
 * Therefore, every digit at EVEN index from right in P (0, 2, 4...) is doubled!
 */
export function calculateLuhnCheckDigit(input: string): LuhnCalculationResult {
  const cleaned = cleanNumberString(input);
  const digits = cleaned.split('').map(Number);
  const steps: LuhnStep[] = [];
  let totalSum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const indexFromRight = digits.length - 1 - i;
    const isDoubled = indexFromRight % 2 === 0;

    let doubledValue = digit;
    let finalValue = digit;
    let sumExpression = `${digit}`;

    if (isDoubled) {
      doubledValue = digit * 2;
      if (doubledValue >= 10) {
        const d1 = Math.floor(doubledValue / 10);
        const d2 = doubledValue % 10;
        finalValue = d1 + d2;
        sumExpression = `${d1}+${d2}`;
      } else {
        finalValue = doubledValue;
        sumExpression = `${doubledValue}`;
      }
    }

    totalSum += finalValue;

    steps.push({
      digit,
      originalIndex: i,
      isDoubled,
      doubledValue,
      sumExpression,
      finalValue
    });
  }

  const unitDigit = totalSum % 10;
  const method1Result = (totalSum * 9) % 10;
  const method2Result = (10 - unitDigit) % 10;
  const checkDigit = method1Result;

  return {
    rawInput: input,
    cleanedInput: cleaned,
    steps,
    totalSum,
    checkDigit,
    method1Result,
    method2Result,
    unitDigit,
    fullNumber: cleaned + checkDigit
  };
}

/**
 * Validates a complete account number (with check digit at the end).
 * Position 0 from right is the check digit (kept as is).
 * Position 1, 3, 5... from right are doubled!
 */
export function validateLuhnNumber(input: string): LuhnValidationResult {
  const cleaned = cleanNumberString(input);
  if (cleaned.length === 0) {
    return {
      rawInput: input,
      cleanedInput: '',
      payload: '',
      providedCheckDigit: 0,
      calculatedCheckDigit: 0,
      steps: [],
      totalSum: 0,
      isValid: false
    };
  }

  const payload = cleaned.slice(0, -1);
  const providedCheckDigit = parseInt(cleaned.slice(-1), 10);
  const calcRes = calculateLuhnCheckDigit(payload);

  const digits = cleaned.split('').map(Number);
  const steps: LuhnStep[] = [];
  let totalSum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const indexFromRight = digits.length - 1 - i;
    const isDoubled = indexFromRight % 2 === 1;

    let doubledValue = digit;
    let finalValue = digit;
    let sumExpression = `${digit}`;

    if (isDoubled) {
      doubledValue = digit * 2;
      if (doubledValue >= 10) {
        const d1 = Math.floor(doubledValue / 10);
        const d2 = doubledValue % 10;
        finalValue = d1 + d2;
        sumExpression = `${d1}+${d2}`;
      } else {
        finalValue = doubledValue;
        sumExpression = `${doubledValue}`;
      }
    }

    totalSum += finalValue;

    steps.push({
      digit,
      originalIndex: i,
      isDoubled,
      doubledValue,
      sumExpression,
      finalValue
    });
  }

  return {
    rawInput: input,
    cleanedInput: cleaned,
    payload,
    providedCheckDigit,
    calculatedCheckDigit: calcRes.checkDigit,
    steps,
    totalSum,
    isValid: totalSum % 10 === 0
  };
}
