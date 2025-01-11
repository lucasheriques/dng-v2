export interface Invoice {
  companyLogo: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  vendorInfo: ContactInfo;
  customerInfo: ContactInfo;
  paymentMethods: PaymentMethod[];
  items: LineItem[];
}

export interface ContactInfo {
  name: string;
  streetAddress: string;
  cityStateZip: string;
  email: string;
}

export interface PaymentMethod {
  rail: string;
  details: PaymentDetail[];
}

interface PaymentDetail {
  name: string;
  value: string;
}

interface LineItem {
  description: string;
  price: string;
}

export const CURRENCIES = {
  USD: {
    symbol: "$",
    code: "USD",
    name: "US Dollar",
  },
  BRL: {
    symbol: "R$",
    code: "BRL",
    name: "Brazilian Real",
  },
  EUR: {
    symbol: "€",
    code: "EUR",
    name: "Euro",
  },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
export interface StoredInvoice extends Omit<Invoice, "items" | "total"> {
  id: string;
  items: Array<{ description: string; price: string }>;
  total: string;
  currency: CurrencyCode;
}
