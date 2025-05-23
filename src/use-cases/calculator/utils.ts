import {
  DEFAULT_FORM_DATA,
  PARAMETERS_MAP,
} from "@/use-cases/calculator/constants";

import { CalculatorFormData } from "@/use-cases/calculator/types";

// Helper function to safely parse boolean values from strings ("1"/"0")
export function safeParseBoolean(
  value: string | string[] | null | undefined,
  defaultValue: boolean
): boolean {
  if (typeof value !== "string") return defaultValue;
  return value === "1" ? true : value === "0" ? false : defaultValue;
}

// Helper function to safely parse string values intended for numerical calculations
export function safeParseNumberString(
  value: string | string[] | null | undefined,
  defaultValue: string
): string {
  const processValue = Array.isArray(value) ? value[0] : value; // Handle potential string[]

  if (typeof processValue !== "string" || processValue.trim() === "") {
    // Allow empty string if default is empty, otherwise use default
    return defaultValue === "" && processValue === "" ? "" : defaultValue;
  }
  // Basic check: try converting to number and see if it's NaN
  // This handles various numeric formats but rejects non-numeric strings.
  // We keep the string format for the state.
  if (isNaN(Number(processValue))) {
    return defaultValue;
  }
  return processValue; // Return the original valid string
}

export function buildUrlParameters(formData: Partial<CalculatorFormData>) {
  const params = new URLSearchParams();
  for (const key in formData) {
    const formKey = key as keyof CalculatorFormData;
    const shortKey = PARAMETERS_MAP[formKey];
    const value = formData[formKey];
    const defaultValue = DEFAULT_FORM_DATA[formKey];

    if (shortKey && value !== defaultValue) {
      params.set(shortKey, String(value));
    }
  }
  return params;
}
