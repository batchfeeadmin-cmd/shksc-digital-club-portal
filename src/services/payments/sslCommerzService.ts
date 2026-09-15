import { Student } from '../../types';

// ---------------------------------------------------------------------------
// SSLCommerz integration layer (BDT payments)
// ---------------------------------------------------------------------------
// Real SSLCommerz API integration steps (when credentials are available):
//
// 1. Put store credentials in .env:
//    VITE_SSLCOMMERZ_STORE_ID=your_store_id
//    VITE_SSLCOMMERZ_STORE_PASSWORD=your_store_password
//    VITE_SSLCOMMERZ_SANDBOX=true
//
// 2. Replace the mock bodies of createPaymentSession() and validatePayment()
//    with real HTTP calls (see comments inside each function).
//
// SSLCommerz flow: init session -> redirect to GatewayPageURL ->
//                  IPN/redirect back -> validate by tran_id -> mark paid.
// ---------------------------------------------------------------------------

export interface SSLCommerzConfig {
  storeId: string;
  storePassword: string;
  sandbox: boolean;
}

export const sslcommerzConfig: SSLCommerzConfig = {
  storeId: import.meta.env.VITE_SSLCOMMERZ_STORE_ID || 'SHKSC_SANDBOX_STORE',
  storePassword: import.meta.env.VITE_SSLCOMMERZ_STORE_PASSWORD || 'SHKSC_SANDBOX_PASSWORD',
  sandbox: import.meta.env.VITE_SSLCOMMERZ_SANDBOX !== 'false'
};

const SANDBOX_BASE = 'https://sandbox.sslcommerz.com';
const LIVE_BASE = 'https://securepay.sslcommerz.com';

export const getSSLCommerzBaseUrl = (): string =>
  sslcommerzConfig.sandbox ? SANDBOX_BASE : LIVE_BASE;

export interface PaymentSessionParams {
  tranId: string;
  amount: number;
  currency?: string;
  student: Student;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  clubName: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
}

export interface PaymentSessionResult {
  tranId: string;
  gatewayUrl: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
}

export interface PaymentValidationResult {
  tranId: string;
  valid: boolean;
  amount: number;
  currency: string;
  method: string;
  paidAt: string;
}

// SSLCommerz-compatible transaction id
export const generateTranId = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SHKSC-${Date.now().toString(36).toUpperCase()}-${random}`;
};

// Creates a payment session on the SSLCommerz gateway and returns the
// hosted payment page URL the student must be redirected to.
export const createPaymentSession = async (params: PaymentSessionParams): Promise<PaymentSessionResult> => {
  // ---- REAL INTEGRATION (replace this mock) ----
  // const res = await fetch(`${getSSLCommerzBaseUrl()}/gwprocess/v4/api.php`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   body: new URLSearchParams({
  //     store_id: sslcommerzConfig.storeId,
  //     store_passwd: sslcommerzConfig.storePassword,
  //     total_amount: String(params.amount),
  //     currency: params.currency || 'BDT',
  //     tran_id: params.tranId,
  //     success_url: params.successUrl,
  //     fail_url: params.failUrl,
  //     cancel_url: params.cancelUrl,
  //     cus_name: params.studentName,
  //     cus_email: params.studentEmail,
  //     cus_phone: params.studentPhone,
  //     product_name: `${params.clubName} Club Fees`,
  //     product_category: 'Club Registration',
  //     product_profile: 'non-physical-goods',
  //     shipping_method: 'NO'
  //   })
  // });
  // const data = await res.json();
  // if (data.status === 'SUCCESS') {
  //   return { tranId: params.tranId, gatewayUrl: data.GatewayPageURL, status: 'PENDING' };
  // }
  // throw new Error(data.failedreason || 'SSLCommerz session creation failed');
  // --------------------------------------------------------------------

  // MOCK: immediately return a fake hosted page URL (no real charge happens).
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    tranId: params.tranId,
    gatewayUrl: `${getSSLCommerzBaseUrl()}/mock-gateway?tran_id=${params.tranId}`,
    status: 'PENDING'
  };
};

// Validates a transaction with SSLCommerz after the student returns
// from the hosted payment page (or the IPN hits our server).
export const validatePayment = async (tranId: string): Promise<PaymentValidationResult> => {
  // ---- REAL INTEGRATION (replace this mock) ----
  // const res = await fetch(
  //   `${getSSLCommerzBaseUrl()}/validator/api/validationserverAPI.php?val_id=...&store_id=...&store_passwd=...&format=json`
  // );
  // const data = await res.json();
  // return {
  //   tranId,
  //   valid: data.status === 'VALID' || data.status === 'VALIDATED',
  //   amount: Number(data.amount),
  //   currency: data.currency,
  //   method: data.card_type || data.method || 'Online',
  //   paidAt: data.tran_date || new Date().toISOString()
  // };
  // --------------------------------------------------------------------

  // MOCK: treat every transaction as successful (payment simulated).
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    tranId,
    valid: true,
    amount: 0,
    currency: 'BDT',
    method: 'SSLCommerz (Sandbox)',
    paidAt: new Date().toISOString()
  };
};
