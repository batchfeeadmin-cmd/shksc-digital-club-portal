import { ApprovalRequest } from '../../types';
import { triggerStateUpdate } from '../base';
import { getClubs, updateClub } from '../clubs/clubService';
import { applyFeeUpdate } from '../payments/paymentService';
import { updateUser } from '../auth/userService';
import { logActivity } from '../activity/activityService';

const APPROVALS_STORAGE_KEY = 'shksc_update_requests';

// Seed requests so the approval workflow is demonstrable out of the box.
const seedRequests: ApprovalRequest[] = [
  {
    id: 'req-seed-1',
    clubId: 'c3',
    clubName: 'SHKSC Science Club',
    type: 'Information Update',
    status: 'Pending',
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    data: {
      name: 'SHKSC Science Club',
      shortDescription: 'Established in 2013, the SHKSC Science Club has earned 100+ awards — from national olympiads to the World Robot Olympiad global stage.',
      fullDescription: 'সামসুল হক খান স্কুল অ্যান্ড কলেজ বিজ্ঞান ক্লাব শিক্ষার্থীদের বিজ্ঞানমনস্কতা, সৃজনশীলতা ও উদ্ভাবনী দক্ষতা বিকাশের প্ল্যাটফর্ম।',
      mission: 'হাতে-কলমে experiment ও project-এর মাধ্যমে বিজ্ঞান শেখা।',
      vision: 'বিজ্ঞানমনস্ক ও প্রযুক্তিসচেতন প্রজন্ম গড়ে তোলা।',
      coordinatorName: 'To be announced',
      coordinatorRole: 'Club Coordinator'
    }
  },
  {
    id: 'req-seed-2',
    clubId: 'c4',
    clubName: 'SHKSC Sports Club',
    type: 'Fee Update',
    status: 'Pending',
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    data: { registrationFee: 150, affiliationCost: 2000 }
  },
  {
    id: 'req-seed-3',
    clubId: 'c8',
    clubName: 'SHKSC Computer Club',
    type: 'Profile Update',
    status: 'Pending',
    requestDate: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    data: {
      userId: 'u-science',
      name: 'Science Club Admin',
      email: 'science@shksc.edu',
      mobile: '01711-000000',
      designation: 'Club Moderator'
    }
  }
];

export const getApprovalRequests = (): ApprovalRequest[] => {
  const saved = localStorage.getItem(APPROVALS_STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(seedRequests));
  return seedRequests;
};

export const createApprovalRequest = (request: ApprovalRequest): void => {
  const requests = getApprovalRequests();
  requests.push(request);
  localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(requests));
  logActivity({
    actor: 'Club Admin',
    role: 'club_admin',
    clubName: request.clubName,
    action: `Submitted ${request.type}`,
    detail: `New ${request.type} request sent for Root Admin review`
  });
  triggerStateUpdate();
};

export const saveApprovalRequests = (requests: ApprovalRequest[]): void => {
  localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(requests));
  triggerStateUpdate();
};

export const updateApprovalRequestStatus = (id: string, status: 'Approved' | 'Rejected'): void => {
  const requests = getApprovalRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = status;
    localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(requests));
    triggerStateUpdate();
  }
};

// Apply the requested change to the underlying data and mark it approved
export const approveRequest = (request: ApprovalRequest): void => {
  updateApprovalRequestStatus(request.id, 'Approved');
  logActivity({
    actor: 'Root Admin',
    role: 'root_admin',
    clubName: request.clubName,
    action: `Approved ${request.type}`,
    detail: `${request.clubName} ${request.type} went live`
  });

  switch (request.type) {
    case 'Information Update': {
      const clubs = getClubs();
      const club = clubs.find(c => c.id === request.clubId);
      if (club) {
        club.name = request.data.name;
        club.shortDescription = request.data.shortDescription;
        club.fullDescription = request.data.fullDescription;
        club.mission = request.data.mission;
        club.vision = request.data.vision;
        if (!club.coordinator) club.coordinator = { name: '', role: '', image: '' };
        club.coordinator.name = request.data.coordinatorName;
        club.coordinator.role = request.data.coordinatorRole;
        updateClub(club);
      }
      break;
    }

    case 'Fee Update': {
      applyFeeUpdate(request.clubId, request.data);
      break;
    }

    case 'Profile Update': {
      const userId = request.data.userId;
      if (userId) {
        updateUser(userId, {
          name: request.data.name,
          email: request.data.email,
          mobile: request.data.mobile,
          designation: request.data.designation
        });
      }
      break;
    }

    case 'Gallery Update': {
      const clubs = getClubs();
      const club = clubs.find(c => c.id === request.clubId);
      if (club && request.data.image) {
        club.gallery = [...(club.gallery || []), request.data.image];
        updateClub(club);
      }
      break;
    }

    case 'Achievement Update': {
      const achievements = getApprovedAchievements();
      achievements.push({
        id: request.id,
        clubId: request.clubId,
        clubName: request.clubName,
        title: request.data.title,
        year: request.data.year,
        eventName: request.data.eventName,
        award: request.data.award,
        image: request.data.image || ''
      });
      saveApprovedAchievements(achievements);

      const clubs = getClubs();
      const club = clubs.find(c => c.id === request.clubId);
      if (club) {
        club.achievementCount = (club.achievementCount || 0) + 1;
        updateClub(club);
      }
      break;
    }
  }
};

export const rejectRequest = (request: ApprovalRequest): void => {
  updateApprovalRequestStatus(request.id, 'Rejected');
  logActivity({
    actor: 'Root Admin',
    role: 'root_admin',
    clubName: request.clubName,
    action: `Rejected ${request.type}`,
    detail: `${request.clubName} ${request.type} was rejected`
  });
};

// ---------- Approved achievements (live on public club pages after approval) ----------

const APPROVED_ACHIEVEMENTS_KEY = 'shksc_approved_achievements';

export interface ApprovedAchievement {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  year: number | string;
  eventName?: string;
  award?: string;
  image?: string;
}

export const getApprovedAchievements = (): ApprovedAchievement[] => {
  const saved = localStorage.getItem(APPROVED_ACHIEVEMENTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveApprovedAchievements = (achievements: ApprovedAchievement[]): void => {
  localStorage.setItem(APPROVED_ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  triggerStateUpdate();
};
