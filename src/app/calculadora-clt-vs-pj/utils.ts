import { deflate, inflate } from "pako";
import { CalculatorFormData } from "./types";

export function compress(data: CalculatorFormData) {
  // Remove empty/default values to minimize data size
  const minimalData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => {
      if (value === "") return false;
      if (key === "includeFGTS" && value === true) return false;
      if (key === "accountingFee" && value === "189") return false;
      if (key === "inssContribution" && value === String(1412 * 0.11))
        return false;
      if (key === "taxRate" && value === "10") return false;
      return true;
    })
  );

  // Convert to JSON and compress
  const jsonString = JSON.stringify(minimalData);
  const compressed = deflate(jsonString, { level: 9 });

  // Convert to URL-safe base64
  return Buffer.from(compressed)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decompress(hash: string) {
  try {
    // Add padding if needed
    const base64 = hash
      .padEnd(hash.length + ((4 - (hash.length % 4)) % 4), "=")
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const data = Buffer.from(base64, "base64");
    const decompressed = inflate(data);
    const jsonString = new TextDecoder().decode(decompressed);
    const parsed = JSON.parse(jsonString);

    // Restore default values
    return {
      grossSalary: "",
      pjGrossSalary: "",
      mealAllowance: "",
      transportAllowance: "",
      healthInsurance: "",
      otherBenefits: "",
      includeFGTS: true,
      accountingFee: "189",
      inssContribution: String(1412 * 0.11),
      taxRate: "10",
      otherExpenses: "",
      ...parsed,
    };
  } catch (e) {
    console.error("Failed to decompress data:", e);
    return undefined;
  }
}
