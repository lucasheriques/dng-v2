import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import { buildUrlParameters } from "@/use-cases/calculator/utils";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { formDataAtom } from "./client-state";

interface Args {
  localStorageKey: string;
}

export function useCalculatorForm({ localStorageKey }: Args) {
  const [formData, setFormData] = useAtom(formDataAtom);
  const resetFormData = useResetAtom(formDataAtom);

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
      }));
    },
    [setFormData]
  );

  const handleInputChange = useCallback(
    (field: keyof CalculatorFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
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

  return {
    history,
    formData,
    setFormData,
    handleInputChange,
    handleFGTSChange,
    handleShare,
    handleClear,
    getParamsAndSaveToHistory,
    results,
  };
}
