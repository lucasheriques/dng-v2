import { PaymentMethod } from "@/app/gerador-de-invoice/types";

const SAMPLE_ACH: PaymentMethod = {
  rail: "ACH",
  details: [
    { name: "Account Number", value: "026001591" },
    { name: "Routing Number", value: "437971575927" },
    { name: "Beneficiary Name", value: "Jane Doe" },
  ],
};

const SAMPLE_WIRE: PaymentMethod = {
  rail: "Wire",
  details: [
    { name: "Account Number", value: "026001591" },
    { name: "Routing Number", value: "437971575927" },
    { name: "Beneficiary Name", value: "Jane Doe" },
  ],
};

const SAMPLE_INTERNATIONAL_WIRE: PaymentMethod = {
  rail: "International Wire",
  details: [
    { name: "IBAN", value: "1234567890" },
    { name: "Beneficiary Name", value: "John Doe" },
    { name: "Beneficiary Address", value: "1234 Main St, Anytown, USA" },
    { name: "SWIFT Code", value: "1234567890" },
  ],
};

const SAMPLE_CHECK: PaymentMethod = {
  rail: "Check",
  details: [
    { name: "Payable to", value: "John Doe" },
    { name: "Address", value: "1234 Main St, Anytown, USA" },
  ],
};

const EMPTY_PAYMENT_METHOD: PaymentMethod = {
  rail: "Vazio",
  details: [{ name: "", value: "" }],
};

export const PAYMENT_METHOD_TEMPLATES = {
  INTERNATIONAL_WIRE: SAMPLE_INTERNATIONAL_WIRE,
  ACH: SAMPLE_ACH,
  WIRE: SAMPLE_WIRE,
  CHECK: SAMPLE_CHECK,
  EMPTY: EMPTY_PAYMENT_METHOD,
} as const;
