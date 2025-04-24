import { Id } from "../convex/_generated/dataModel";

const API_URL = "https://api.abacatepay.com/v1";

const endpoints = {
  createPayment: `${API_URL}/billing/create`,
};

export interface AbacatePayProduct {
  externalId: Id<"purchases"> | string | number; // Allow generic string ID for reusability
  name: string;
  description: string;
  quantity: number; // >=1
  price: number; // in cents, minimum 100 (1 BRL)
}

export interface AbacatePayCustomer {
  name: string;
  cellphone?: string;
  email: string;
  taxId?: string; // CPF or CNPJ
}

interface CreatePaymentBody {
  frequency: "ONE_TIME";
  methods: ["PIX"];
  products: AbacatePayProduct[]; // >=1
  returnUrl: string; // has to be a valid url. URL to redirect if they click "Back" on the browser
  completionUrl: string; // has to be a valid url. URL to redirect after the payment is completed
  customerId?: string; // if customer is created
  customer?: AbacatePayCustomer; // if customer is not created
}

interface CreatePaymentSucessfulResponse {
  data: {
    id: string; // Payment Intent ID
    url: string; // PIX payment URL
    amount: number;
    status: "PENDING" | "EXPIRED" | "CANCELLED" | "PAID" | "REFUNDED";
    devMode: boolean;
    methods: string[];
    products: {
      id: string;
      externalId: string;
      quantity: number;
    }[];
    frequency: string;
    nextBilling: string | null;
    customer: {
      id: string;
      metadata: AbacatePayCustomer;
    } | null;
  };
  error: null;
}

interface CreatePaymentErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  code: string;
}

type CreatePaymentResponse =
  | CreatePaymentSucessfulResponse
  | CreatePaymentErrorResponse;

interface CreatePixPaymentArgs {
  apiKey: string;
  products: AbacatePayProduct[];
  customer: AbacatePayCustomer;
  returnUrl: string;
  completionUrl: string;
}

/**
 * Creates a PIX payment intent with AbacatePay.
 * @throws {Error} If the API request fails or returns an error.
 */
export async function createAbacatePixPayment(
  args: CreatePixPaymentArgs
): Promise<{ paymentIntentId: string; paymentUrl: string }> {
  const body: CreatePaymentBody = {
    frequency: "ONE_TIME",
    methods: ["PIX"],
    products: args.products,
    returnUrl: args.returnUrl,
    completionUrl: args.completionUrl,
    customer: args.customer,
  };

  const response = await fetch(endpoints.createPayment, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const responseData: CreatePaymentResponse = await response.json();

  if (responseData.error !== null || !response.ok) {
    const errorResponse = responseData as CreatePaymentErrorResponse;
    console.error("AbacatePay API Error:", {
      error: errorResponse.error,
      message: errorResponse.message,
      statusCode: errorResponse.statusCode,
      code: errorResponse.code,
    });
    // Use a more specific error message if available
    const errorMessage =
      errorResponse.message ||
      errorResponse.error ||
      `HTTP error! status: ${response.status}`;
    throw new Error(`AbacatePay API Error: ${errorMessage}`);
  }

  const successResponse = responseData as CreatePaymentSucessfulResponse;
  const {
    data: { url: paymentUrl, id: paymentIntentId },
  } = successResponse;

  return { paymentIntentId, paymentUrl };
}

// Interface for the webhook payload structure (can be expanded as needed)
export interface AbacatePayWebhookPayload {
  data: {
    billing: {
      amount: number;
      couponsUsed: string[];
      customer: {
        id: string;
        metadata: {
          cellphone: string;
          email: string;
          name: string;
          taxId: string;
        };
      };
      frequency: "ONE_TIME";
      id: string; // Billing ID
      kind: ["PIX"];
      paidAmount: number;
      products: {
        externalId: string; // Should correspond to our purchaseId
        id: string;
        quantity: number;
      }[];
      status: "PAID"; // We are interested in "PAID" status
    };
    payment: {
      amount: number;
      fee: number;
      method: "PIX";
    };
  };
  devMode: boolean;
  event: string; // e.g., "billing.paid"
}
