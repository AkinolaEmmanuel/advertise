const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface InitializeTransactionParams {
  email: string;
  amount: number;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
  plan?: string;
  channels?: string[];
}

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface InitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface VerifyData {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel: string;
  customer: {
    email: string;
    customer_code: string;
  };
  metadata: Record<string, unknown>;
  paid_at: string;
}

interface PlanData {
  plan_code: string;
  name: string;
  amount: number;
  interval: string;
}

async function paystackFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<PaystackResponse<T>> {
  const res = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message || `Paystack API error: ${res.status}`
    );
  }

  return res.json();
}

export async function initializeTransaction(params: InitializeTransactionParams) {
  return paystackFetch<InitializeData>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      ...params,
      amount: params.amount * 100,
    }),
  });
}

export async function verifyTransaction(reference: string) {
  return paystackFetch<VerifyData>(`/transaction/verify/${reference}`);
}

export async function createPlan(
  name: string,
  amount: number,
  interval: "monthly" | "yearly"
) {
  return paystackFetch<PlanData>("/plan", {
    method: "POST",
    body: JSON.stringify({
      name,
      amount: amount * 100,
      interval,
    }),
  });
}

export async function listPlans() {
  return paystackFetch<PlanData[]>("/plan");
}

export const PLANS = {
  standard: {
    name: "Standard",
    amount: 5000,
    code: process.env.PAYSTACK_STANDARD_PLAN_CODE || "",
  },
  pro: {
    name: "Pro",
    amount: 10000,
    code: process.env.PAYSTACK_PRO_PLAN_CODE || "",
  },
} as const;
