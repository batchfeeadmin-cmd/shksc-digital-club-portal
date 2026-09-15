import { useState, useEffect } from 'react';
import { Club, ApprovalRequest, RegistrationState, Fee as ClubFee } from '../types';
import { getClubs, saveClubs as saveClubsService, getRegistrationState, updateRegistrationState as saveRegStateService } from '../services/clubs/clubService';
import { getApprovalRequests, saveApprovalRequests } from '../services/approvals/approvalService';
import { getClubFees, saveClubFees as saveFeesService } from '../services/payments/paymentService';

export type { ApprovalRequest as UpdateRequest, RegistrationState, ClubFee };

export const getClubsData = getClubs;
export const saveClubsData = saveClubsService;
export const getUpdateRequests = getApprovalRequests;
export const saveUpdateRequests = saveApprovalRequests;

export function useRegistrationState() {
  const [state, setState] = useState<RegistrationState>(getRegistrationState());
  useEffect(() => {
    const handleUpdate = () => setState(getRegistrationState());
    window.addEventListener('shksc_state_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('shksc_state_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  return { state, saveState: saveRegStateService };
}

export function useClubsData() {
  const [clubs, setClubs] = useState<Club[]>(getClubs());
  useEffect(() => {
    const handleUpdate = () => setClubs(getClubs());
    window.addEventListener('shksc_state_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('shksc_state_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  return { clubs, saveClubs: saveClubsService };
}

export function useUpdateRequests() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(getApprovalRequests());
  useEffect(() => {
    const handleUpdate = () => setRequests(getApprovalRequests());
    window.addEventListener('shksc_state_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('shksc_state_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  return { requests, saveRequests: saveUpdateRequests };
}

export function useClubFees() {
  const [fees, setFees] = useState<Record<string, ClubFee>>(getClubFees());
  useEffect(() => {
    const handleUpdate = () => setFees(getClubFees());
    window.addEventListener('shksc_state_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('shksc_state_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  return { fees, saveFees: saveFeesService };
}
