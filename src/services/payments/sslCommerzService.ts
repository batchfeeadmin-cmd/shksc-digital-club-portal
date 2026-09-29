import { Student } from '../../types';

// Frontend-only payment simulator used by the approved demo. Real gateway
// credentials and validation must live on the backend and must never be
// exposed through VITE_* environment variables or browser code.
export const DEMO_PAYMENT_MODE = true;

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

// Demo transaction id. The backend will provide authoritative transaction IDs.
export const generateTranId = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SHKSC-${Date.now().toString(36).toUpperCase()}-${random}`;
};

export const createPaymentSession = async (params: PaymentSessionParams): Promise<PaymentSessionResult> => {
  // Simulates the backend creating a gateway session. No charge is made.
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    tranId: params.tranId,
    gatewayUrl: `demo-payment://${params.tranId}`,
    status: 'PENDING'
  };
};

export const validatePayment = async (tranId: string): Promise<PaymentValidationResult> => {
  // Simulates a successful backend validation for the demo.
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    tranId,
    valid: true,
    amount: 0,
    currency: 'BDT',
    method: 'Demo Payment',
    paidAt: new Date().toISOString()
  };
};
