// Simples Nacional Tax Rates
// Source: Based on official tables, simplified for clarity.
// Note: These include the detailed breakdown needed for export calculations.

interface TaxComponentRates {
  irpj: number;
  csll: number;
  cofins: number;
  pisPasep: number;
  cpp: number;
  iss?: number; // ISS is part of the rate, but handled separately in some contexts
}

export interface SimplesNacionalRateBracket {
  maxRevenue: number;
  nominalRate: number; // Alíquota Nominal
  deduction: number; // Valor a Deduzir
  componentRates: TaxComponentRates; // Percentage breakdown within the nominal rate
}

// ANEXO III (Services like installation, maintenance, travel agencies, academies, etc., and Software Dev with Fator R >= 28%)
export const ANEXO_III_RATES: SimplesNacionalRateBracket[] = [
  {
    maxRevenue: 180000,
    nominalRate: 0.06,
    deduction: 0,
    componentRates: {
      irpj: 0.04,
      csll: 0.035,
      cofins: 0.1282,
      pisPasep: 0.0278,
      cpp: 0.434,
      iss: 0.335,
    }, // Approximate % of nominal rate
  },
  {
    maxRevenue: 360000,
    nominalRate: 0.112,
    deduction: 9360,
    componentRates: {
      irpj: 0.04,
      csll: 0.035,
      cofins: 0.1282,
      pisPasep: 0.0278,
      cpp: 0.434,
      iss: 0.335,
    },
  },
  {
    maxRevenue: 720000,
    nominalRate: 0.135,
    deduction: 17640,
    componentRates: {
      irpj: 0.04,
      csll: 0.035,
      cofins: 0.1282,
      pisPasep: 0.0278,
      cpp: 0.434,
      iss: 0.335,
    },
  },
  {
    maxRevenue: 1800000,
    nominalRate: 0.16,
    deduction: 35640,
    componentRates: {
      irpj: 0.04,
      csll: 0.035,
      cofins: 0.1282,
      pisPasep: 0.0278,
      cpp: 0.434,
      iss: 0.335,
    },
  },
  {
    maxRevenue: 3600000,
    nominalRate: 0.21,
    deduction: 125640,
    componentRates: {
      irpj: 0.055,
      csll: 0.035,
      cofins: 0.1405,
      pisPasep: 0.0305,
      cpp: 0.404,
      iss: 0.335,
    },
  },
  {
    maxRevenue: 4800000,
    nominalRate: 0.33, // Note: Above 3.6M, ISS/ICMS might be separate.
    deduction: 648000,
    componentRates: {
      irpj: 0.35,
      csll: 0.15,
      cofins: 0.147,
      pisPasep: 0.033,
      cpp: 0.305,
      iss: 0.015,
    }, // ISS becomes much smaller part
  },
];

// ANEXO V (Services like auditing, technology, engineering, advertising, Software Dev with Fator R < 28%)
export const ANEXO_V_RATES: SimplesNacionalRateBracket[] = [
  {
    maxRevenue: 180000,
    nominalRate: 0.155,
    deduction: 0,
    componentRates: {
      irpj: 0.25,
      csll: 0.15,
      cofins: 0.1408,
      pisPasep: 0.0302,
      cpp: 0.2885,
      iss: 0.1405,
    }, // Approximate % of nominal rate
  },
  {
    maxRevenue: 360000,
    nominalRate: 0.18,
    deduction: 4500,
    componentRates: {
      irpj: 0.23,
      csll: 0.15,
      cofins: 0.1492,
      pisPasep: 0.0328,
      cpp: 0.2785,
      iss: 0.1595,
    },
  },
  {
    maxRevenue: 720000,
    nominalRate: 0.195,
    deduction: 9900,
    componentRates: {
      irpj: 0.24,
      csll: 0.15,
      cofins: 0.1492,
      pisPasep: 0.0328,
      cpp: 0.2385,
      iss: 0.1895,
    },
  },
  {
    maxRevenue: 1800000,
    nominalRate: 0.205,
    deduction: 17100,
    componentRates: {
      irpj: 0.21,
      csll: 0.125,
      cofins: 0.154,
      pisPasep: 0.036,
      cpp: 0.235,
      iss: 0.24,
    },
  },
  {
    maxRevenue: 3600000,
    nominalRate: 0.23,
    deduction: 62100,
    componentRates: {
      irpj: 0.21,
      csll: 0.125,
      cofins: 0.154,
      pisPasep: 0.036,
      cpp: 0.235,
      iss: 0.24,
    },
  },
  {
    maxRevenue: 4800000,
    nominalRate: 0.305, // Note: Above 3.6M, ISS/ICMS might be separate.
    deduction: 540000,
    componentRates: {
      irpj: 0.35,
      csll: 0.15,
      cofins: 0.147,
      pisPasep: 0.033,
      cpp: 0.305,
      iss: 0.015,
    }, // ISS becomes much smaller part
  },
];

// Taxes exempt from export revenue under Simples Nacional
export const EXPORT_EXEMPT_TAXES: (keyof TaxComponentRates)[] = [
  "cofins",
  "pisPasep",
  "iss",
];
