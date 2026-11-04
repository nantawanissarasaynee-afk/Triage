export type TriageLevel = 1 | 2 | 3 | 4 | 5;

export type TriageQualityType = 'Appropriate' | 'Under-Triage' | 'Over-Triage';

export interface ReTriageRecord {
  id: string;
  timestamp: string;
  previousLevel: TriageLevel;
  newLevel: TriageLevel;
  reason: string;
  staffName: string;
  vitals: {
    sbp: number;
    dbp: number;
    pr: number;
    rr: number;
    o2Sat: number;
    temp: number;
    pain: number;
    gcs: number;
  };
  qualityCategory: TriageQualityType;
}

export interface Patient {
  id: string;
  timestamp: string;
  cid: string;
  hn: string;
  prefix: string;
  fullName: string;
  age: number;
  visitDateTime: string;
  chiefComplaint: string;
  
  // Primary Survey
  airway: string; // 'พูดได้ปกติ' | 'ไม่มีสิ่งอุดกั้น' | 'มีสิ่งอุดกั้น'
  rr: number; // Respiratory rate /min
  o2Sat: number; // SpO2 %
  lungSound: string;
  pr: number; // Pulse rate /min
  temp: number; // Celsius
  sbp: number; // Systolic BP
  dbp: number; // Diastolic BP
  crt: string; // '<= 2 วินาที' | '> 2 วินาที'
  bleeding: string;
  gcs: number; // 3-15
  avpu: string; // 'A' | 'V' | 'P' | 'U'
  sirsScore: number; // 0-4
  painScore: number; // 0-10
  
  // Classification
  triageLevel: TriageLevel;
  triageLevelName: string;
  recommendedLevel?: TriageLevel;
  recommendedReason?: string;
  servicePoint: string; // 'ER' | 'OPD' | 'LR' | 'ทันตกรรม' | 'อื่นๆ'
  note?: string;
  staffName: string;
  status: 'รอตรวจ' | 'กำลังตรวจ' | 'จำหน่าย' | 'ส่งต่อ (Refer)' | 'Admit';

  // Re-Triage & Quality Control
  retriageHistory?: ReTriageRecord[];
  triageQuality?: TriageQualityType;
  lastRetriageTime?: string;
}

export interface TriageLevelMeta {
  level: TriageLevel;
  name: string;
  thaiLabel: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  waitTime: string;
  retriageInterval: string;
  description: string;
  examples: string[];
  mnemonic: string;
  colorHex: string;
  emoji: string;
}

export interface HospitalSettings {
  hospitalName: string;
  staffName: string;
  logoUrl?: string;
  lineToken: string;
  lineOpenChatUrl?: string;
  lineOpenChatName?: string;
  gasWebappUrl: string;
  sheetId: string;
  enableSound: boolean;
}
