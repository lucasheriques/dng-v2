import {
  DEFAULT_FORM_DATA,
  REVERSE_PARAM_MAP,
} from "@/use-cases/calculator/constants";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import {
  safeParseBoolean,
  safeParseNumberString,
} from "@/use-cases/calculator/utils";
import { atomWithReset } from "jotai/utils";

// Combined form data atom (for CLT vs PJ calculator)
export const formDataAtom = atomWithReset<
  CalculatorFormData & { isTouched: boolean }
>({ ...DEFAULT_FORM_DATA, isTouched: false });

// Utility function to parse query parameters into CalculatorFormData
export function parseQueryParamsToFormData(
  searchParams: URLSearchParams
): CalculatorFormData {
  const formData: CalculatorFormData = { ...DEFAULT_FORM_DATA };

  for (const shortKey in REVERSE_PARAM_MAP) {
    const formKey = REVERSE_PARAM_MAP[shortKey];
    const value = searchParams.get(shortKey);

    if (value !== null) {
      if (formKey === "includeFGTS") {
        formData.includeFGTS = safeParseBoolean(
          value,
          DEFAULT_FORM_DATA.includeFGTS
        );
      } else {
        const stringValue = safeParseNumberString(
          value,
          DEFAULT_FORM_DATA[formKey] as string
        );
        formData[formKey] = stringValue;
      }
    }
  }

  return formData;
}
