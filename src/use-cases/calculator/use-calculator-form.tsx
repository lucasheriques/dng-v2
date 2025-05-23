import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import { buildUrlParameters } from "@/use-cases/calculator/utils";
import { atom, useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

import {
  DEFAULT_FORM_DATA,
  REVERSE_PARAM_MAP,
} from "@/use-cases/calculator/constants";
import {
  safeParseBoolean,
  safeParseNumberString,
} from "@/use-cases/calculator/utils";
import { atomWithReset } from "jotai/utils";

// Combined form data atom (for CLT vs PJ calculator)
const formDataAtom = atomWithReset<CalculatorFormData & { isTouched: boolean }>(
  { ...DEFAULT_FORM_DATA, isTouched: false }
);

const detailsExpandedAtom = atom(false);

// Utility function to parse query parameters into CalculatorFormData
function parseQueryParamsToFormData(
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

interface Args {
  localStorageKey: string;
  initialData?: Partial<CalculatorFormData>;
}

export function useCalculatorForm({ localStorageKey, initialData = {} }: Args) {
  const [formData, setFormData] = useAtom(formDataAtom);
  const [isDetailsExpanded, setIsDetailsExpanded] =
    useAtom(detailsExpandedAtom);
  const resetFormData = useResetAtom(formDataAtom);

  useEffect(() => {
    if (Object.keys(initialData).length > 0 && !formData.isTouched) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData, formData.isTouched]);

  const results = useMemo(() => {
    return calculateResults(formData);
  }, [formData]);

  const [history, setHistory] = useLocalStorage<string[]>(localStorageKey, []);

  const getParamsAndSaveToHistory = useCallback(() => {
    const paramString = buildUrlParameters(formData).toString();
    const newHistory = [
      paramString,
      ...history.filter((h) => h !== paramString),
    ].slice(0, 6);
    setHistory(newHistory);
    return paramString;
  }, [formData, history, setHistory]);

  const handleFGTSChange = useCallback(
    (value: boolean) => {
      setFormData((prev) => ({
        ...prev,
        includeFGTS: value,
        isTouched: true,
      }));
    },
    [setFormData]
  );

  const handleInputChange = useCallback(
    (field: keyof CalculatorFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        isTouched: true,
      }));
    },
    [setFormData]
  );

  const handleShare = useCallback(async () => {
    const paramString = getParamsAndSaveToHistory();
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;
    window.history.replaceState({}, "", url.toString());
    try {
      await navigator.clipboard.writeText(url.toString());
      return true;
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      return false;
    }
  }, [getParamsAndSaveToHistory]);

  const handleClear = useCallback(() => {
    resetFormData();
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = "";
    window.history.replaceState({}, "", url.toString());
  }, [resetFormData]);

  const handleLoadHistory = useCallback(
    (paramString: string) => {
      const searchParams = new URLSearchParams(paramString);
      setFormData({
        ...parseQueryParamsToFormData(searchParams),
        isTouched: true,
      });
      const url = new URL(window.location.pathname, window.location.origin);
      url.search = paramString;
      window.history.replaceState({}, "", url.toString());
    },
    [setFormData]
  );

  return {
    history,
    formData,
    setFormData,
    handleInputChange,
    handleFGTSChange,
    handleShare,
    handleClear,
    getParamsAndSaveToHistory,
    handleLoadHistory,
    isDetailsExpanded,
    setIsDetailsExpanded,
    results,
  };
}
