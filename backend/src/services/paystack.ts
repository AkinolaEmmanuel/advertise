import { config } from "../config.js";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

type InitializeData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

type VerifyData = {
  status: string;
  reference: string;
  amount: number;
  metadata: Record<string, any>;
  customer: { email: string };
};

export const PLANS = {
  standard: {
    name: "Standard",
    amount: 250000,
    code: config.paystackStandardPlanCode,
  },
  pro: {
    name: "Pro",
    amount: 500000,
    code: config.paystackProPlanCode,
  },
} as const;

async function paystackFetch<T>(endpoint: string, options: RequestInit = {}) {
  if (!config.paystackSecretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.paystackSecretKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = (await res.json()) as PaystackResponse<T>;
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack request failed");
  }
  return data;
}

export function initializeTransaction(params: {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}) {
  return paystackFetch<InitializeData>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function verifyTransaction(reference: string) {
  return paystackFetch<VerifyData>(`/transaction/verify/${reference}`);
}
