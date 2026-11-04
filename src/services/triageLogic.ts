import { Patient, TriageLevel, TriageLevelMeta } from '../types/triage';

export const TRIAGE_LEVELS_META: Record<TriageLevel, TriageLevelMeta> = {
  1: {
    level: 1,
    name: 'Resuscitation',
    thaiLabel: 'วิกฤต',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    badgeText: 'text-red-700',
    borderColor: '#dc2626',
    waitTime: 'ทันที (Immediate)',
    retriageInterval: 'Continuous (ประเมินต่อเนื่องตลอดเวลา)',
    description: 'ผู้ป่วยมีภาวะคุกคามชีวิต ต้องได้รับการช่วยเหลือทันที',
    examples: [
      'Cardiac Arrest',
      'Respiratory Arrest',
      'Shock (SBP < 90 + PR > 120)',
      'Severe Respiratory Distress (RR < 8 หรือ > 35, SpO2 < 90%)',
      'GCS ≤ 8 (Coma)',
      'Airway มีสิ่งอุดกั้น / ฟังเสียง Stridor'
    ],
    mnemonic: '“หยุดหายใจ หัวใจหยุดเต้น ช่วยทันที”',
    colorHex: '#dc2626',
    emoji: '🔴'
  },
  2: {
    level: 2,
    name: 'Emergency',
    thaiLabel: 'ฉุกเฉิน',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    badgeText: 'text-pink-700',
    borderColor: '#db2777',
    waitTime: 'ภายใน 10 นาที (≤ 10-15 นาที)',
    retriageInterval: 'ทุก 15 นาที',
    description: 'ผู้ป่วยมีความเสี่ยงสูงที่จะทรุดลงอย่างรวดเร็ว หากไม่ได้รับการรักษาทันที',
    examples: [
      'Chest Pain สงสัย STEMI / NSTEMI',
      'Acute Stroke (Onset < 4.5 ชม. แขนขาอ่อนแรง ปากเบี้ยว)',
      'Severe Sepsis (SIRS Score ≥ 2)',
      'Altered Mental Status (GCS 9-12)',
      'Severe Pain (Pain Score ≥ 7-8/10)',
      'SpO2 90-94% หรือ หอบเหนื่อยมาก'
    ],
    mnemonic: '“ยังไม่วิกฤต แต่เสี่ยงวิกฤต”',
    colorHex: '#db2777',
    emoji: '🩷'
  },
  3: {
    level: 3,
    name: 'Urgent',
    thaiLabel: 'เร่งด่วน',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    borderColor: '#d97706',
    waitTime: 'ภายใน 30 นาที',
    retriageInterval: 'ทุก 30 นาที',
    description: 'ผู้ป่วยอาการคงที่ แต่ต้องใช้ทรัพยากรหลายอย่างในการวินิจฉัยและรักษา (≥ 2 อย่าง)',
    examples: [
      'Abdominal Pain (สงสัย Appendicitis, Cholecystitis)',
      'Moderate Trauma (กระดูกหักปิด แผลขนาดใหญ่)',
      'Asthma Exacerbation ที่ Stable',
      'GI Bleeding ที่ Vital Signs Stable',
      'ตรวจ Lab, X-ray/CT, ให้ยาทาง IV, ปรึกษาแพทย์เฉพาะทาง'
    ],
    mnemonic: '“Stable แต่ต้องตรวจหลายอย่าง”',
    colorHex: '#d97706',
    emoji: '🟡'
  },
  4: {
    level: 4,
    name: 'Semi-Urgent',
    thaiLabel: 'กึ่งเร่งด่วน',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    borderColor: '#16a34a',
    waitTime: 'ภายใน 60 นาที (≤ 1-2 ชม.)',
    retriageInterval: 'ทุก 60 นาที',
    description: 'ผู้ป่วยอาการไม่รุนแรง ใช้ทรัพยากรเพียง 1 อย่าง',
    examples: [
      'แผลฉีกขาดเล็กน้อย (เย็บแผลอย่างเดียว)',
      'Minor Injury / ข้อเท้าแพลง (X-ray จุดเดียว)',
      'Mild Extremity Pain',
      'ปัสสาวะแสบขัด (ตรวจ UA อย่างเดียว)'
    ],
    mnemonic: '“ไม่ฉุกเฉินมาก ใช้ Resource 1 อย่าง”',
    colorHex: '#16a34a',
    emoji: '🟢'
  },
  5: {
    level: 5,
    name: 'Non-Urgent',
    thaiLabel: 'ไม่เร่งด่วน',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    badgeText: 'text-slate-600',
    borderColor: '#64748b',
    waitTime: 'ภายใน 120 นาที (รอได้)',
    retriageInterval: 'ทุก 120 นาที',
    description: 'ผู้ป่วยอาการเล็กน้อย ไม่จำเป็นต้องใช้ทรัพยากรเพิ่มเติม',
    examples: [
      'หวัดทั่วไป / เจ็บคอเล็กน้อย',
      'ขอรับยาเดิมต่อเนื่อง (ยาเบาหวาน ความดัน หมด)',
      'ผื่นผิวหนังเรื้อรัง ไม่แพ้รุนแรง',
      'มาตรวจตามนัดปกติ'
    ],
    mnemonic: '“ตรวจ ให้คำแนะนำ กลับบ้านได้”',
    colorHex: '#64748b',
    emoji: '🤍'
  }
};

/**
 * วิเคราะห์คุณภาพการ Triage จากการประเมินซ้ำ (Under-Triage vs Over-Triage)
 */
export function determineTriageQuality(originalLevel: TriageLevel, newLevel: TriageLevel) {
  if (newLevel < originalLevel) {
    // ผู้ป่วยอาการหนักกว่าเดิมที่คัดกรองไว้ เช่น เดิม 4 กลายเป็น 2 หรือ 1
    return {
      type: 'Under-Triage' as const,
      label: 'Under-Triage (คัดกรองต่ำกว่าความเป็นจริง)',
      description: `ผู้ป่วยเดิมคัดกรองไว้ Level ${originalLevel} แต่อาการจริงรุนแรงเป็น Level ${newLevel}`,
      badgeColor: 'bg-red-100 text-red-800 border-red-300'
    };
  } else if (newLevel > originalLevel) {
    // ผู้ป่วยคัดกรองสูงเกินจริง เช่น เดิม 2 กลายเป็น 4
    return {
      type: 'Over-Triage' as const,
      label: 'Over-Triage (คัดกรองสูงเกินความเป็นจริง)',
      description: `ผู้ป่วยเดิมคัดกรองไว้ Level ${originalLevel} แต่ประเมินซ้ำเป็น Level ${newLevel}`,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else {
    return {
      type: 'Appropriate' as const,
      label: 'Appropriate (การคัดกรองตรงตามเกณฑ์)',
      description: `ระดับคงที่ Level ${newLevel} สัญญาณชีพและอาการสอดคล้องตามเกณฑ์`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }
}

/**
 * คำนวณเกณฑ์ MOPH ED Triage 5 ระดับ อัตโนมัติจากสัญญาณชีพและอาการ
 */
export function evaluateMophTriage(params: {
  airway: string;
  rr: number;
  o2Sat: number;
  sbp: number;
  pr: number;
  gcs: number;
  painScore: number;
  sirsScore: number;
  complaint: string;
}): { level: TriageLevel; reason: string } {
  const { airway, rr, o2Sat, sbp, pr, gcs, painScore, sirsScore, complaint } = params;
  const c = (complaint || '').toLowerCase();

  // 1. ตรวจสอบ Level 1 (Resuscitation)
  if (
    airway === 'มีสิ่งอุดกั้น' ||
    gcs <= 8 ||
    o2Sat < 90 ||
    rr < 8 ||
    rr > 35 ||
    (sbp < 85 && pr > 120) ||
    c.includes('หยุดหายใจ') ||
    c.includes('หัวใจหยุดเต้น') ||
    c.includes('cpr') ||
    c.includes('cardiac arrest') ||
    c.includes('respiratory arrest') ||
    c.includes('ช็อก') ||
    c.includes('shock')
  ) {
    return {
      level: 1,
      reason: 'พบภาวะคุกคามชีวิต (GCS ≤ 8, Airway อุดกั้น, SpO2 < 90%, หรือมีภาวะช็อกวิกฤต) ต้องช่วยเหลือทันที'
    };
  }

  // 2. ตรวจสอบ Level 2 (Emergency)
  if (
    c.includes('เจ็บหน้าอก') ||
    c.includes('แน่นหน้าอก') ||
    c.includes('chest pain') ||
    c.includes('mi') ||
    c.includes('stemi') ||
    c.includes('stroke') ||
    c.includes('ปากเบี้ยว') ||
    c.includes('แขนขาอ่อนแรง') ||
    c.includes('พูดไม่ชัด') ||
    (gcs >= 9 && gcs <= 12) ||
    painScore >= 7 ||
    sirsScore >= 2 ||
    (o2Sat >= 90 && o2Sat <= 94) ||
    sbp >= 200 ||
    sbp <= 90 ||
    c.includes('ชัก') ||
    c.includes('seizure') ||
    c.includes('หายใจเหนื่อยมาก') ||
    c.includes('หอบเหนื่อยรุนแรง')
  ) {
    return {
      level: 2,
      reason: 'ผู้ป่วยมีความเสี่ยงสูงที่จะทรุดลง (สงสัย ACS/Stroke, Pain ≥ 7, SIRS Positive หรือสัญญาณชีพอ่อนไหว)'
    };
  }

  // 3. ตรวจสอบ Level 3 (Urgent)
  if (
    c.includes('ปวดท้อง') ||
    c.includes('abdominal pain') ||
    c.includes('หอบ') ||
    c.includes('asthma') ||
    c.includes('เลือดออก') ||
    c.includes('ถ่ายเป็นเลือด') ||
    c.includes('อาเจียนเป็นเลือด') ||
    c.includes('อุบัติเหตุ') ||
    c.includes('trauma') ||
    painScore >= 4 ||
    rr > 22 ||
    pr > 100 ||
    pr < 50
  ) {
    return {
      level: 3,
      reason: 'อาการคงที่ แต่คาดว่าต้องใช้ทรัพยากรวินิจฉัย/รักษาหลายอย่าง (Lab, X-ray, IV Fluid, Consult)'
    };
  }

  // 4. ตรวจสอบ Level 4 (Semi-Urgent)
  if (
    c.includes('แผล') ||
    c.includes('เย็บ') ||
    c.includes('ลื่นล้ม') ||
    c.includes('ถลอก') ||
    c.includes('บวม') ||
    c.includes('ข้อเท้าแพลง') ||
    c.includes('minor') ||
    painScore >= 1
  ) {
    return {
      level: 4,
      reason: 'อาการไม่รุนแรง ใช้ทรัพยากรการรักษาเพียง 1 อย่าง (เช่น เย็บแผล หรือตรวจทางรังสี 1 จุด)'
    };
  }

  // 5. Level 5 (Non-Urgent)
  return {
    level: 5,
    reason: 'Vital signs ปกติ อาการเล็กน้อย ไม่จำเป็นต้องใช้ทรัพยากรเพิ่มเติม (ตรวจ/รับยา/คำแนะนำ)'
  };
}

/**
 * ข้อมูลเริ่มต้น โรงพยาบาลหลวงพ่อเปิ่น
 */
export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'TRG-20261103-0834',
    timestamp: '2026-11-03 08:34:00',
    cid: '1739900123456',
    hn: '0006387',
    prefix: 'น.ส.',
    fullName: 'ระวีวัฒน์ แดงช้อย',
    age: 32,
    visitDateTime: '03/11/2026 08:34',
    chiefComplaint: 'ทดสอบระบบ',
    airway: 'พูดได้ปกติ',
    rr: 18,
    o2Sat: 98,
    lungSound: 'Clear',
    pr: 80,
    temp: 36.6,
    sbp: 120,
    dbp: 80,
    crt: '<= 2 วินาที',
    bleeding: 'ไม่มี',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 0,
    triageLevel: 2,
    triageLevelName: 'Emergency',
    servicePoint: 'ER',
    staffName: 'พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0832',
    timestamp: '2026-11-03 08:32:00',
    cid: '1739900789012',
    hn: '0254400',
    prefix: 'น.ส.',
    fullName: 'ศศิธร สุขทอง',
    age: 45,
    visitDateTime: '03/11/2026 08:32',
    chiefComplaint: '06.00น. วันที่ 3 พ.ย. 69 มีอาการปวดท้องมาก ปวดลักษณะบิดๆ คลื่นไส้ เวียนศีรษะ ไม่มีท...',
    airway: 'พูดได้ปกติ',
    rr: 20,
    o2Sat: 97,
    lungSound: 'Clear',
    pr: 86,
    temp: 37.0,
    sbp: 135,
    dbp: 85,
    crt: '<= 2 วินาที',
    bleeding: 'ไม่มี',
    gcs: 15,
    avpu: 'A',
    sirsScore: 1,
    painScore: 8,
    triageLevel: 2,
    triageLevelName: 'Emergency',
    servicePoint: 'ER',
    staffName: 'พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0822',
    timestamp: '2026-11-03 08:22:00',
    cid: '1739900345678',
    hn: '0030275',
    prefix: 'นาย',
    fullName: 'รณชัย สวัสดิ์มี',
    age: 50,
    visitDateTime: '03/11/2026 08:22',
    chiefComplaint: '23.15น. วันที่ 23 พ.ย.69 ถ่ายอุจจาระมีเลือดสดๆปน 1ครั้ง เบ่งอุจจาระแรง ไม่มี...',
    airway: 'พูดได้ปกติ',
    rr: 18,
    o2Sat: 99,
    lungSound: 'Clear',
    pr: 76,
    temp: 36.4,
    sbp: 128,
    dbp: 78,
    crt: '<= 2 วินาที',
    bleeding: 'เลือดปนอุจจาระ',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 2,
    triageLevel: 4,
    triageLevelName: 'Semi Urgency',
    servicePoint: 'OPD',
    staffName: 'พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0631',
    timestamp: '2026-11-03 06:31:00',
    cid: '1739900567890',
    hn: '0336279',
    prefix: 'นาง',
    fullName: 'เจ้า จินดาประภาพร',
    age: 62,
    visitDateTime: '03/11/2026 06:31',
    chiefComplaint: 'assault แผลถลอกบริเวณใบหน้า',
    airway: 'พูดได้ปกติ',
    rr: 18,
    o2Sat: 98,
    lungSound: 'Clear',
    pr: 78,
    temp: 36.5,
    sbp: 130,
    dbp: 80,
    crt: '<= 2 วินาที',
    bleeding: 'แผลถลอก',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 3,
    triageLevel: 4,
    triageLevelName: 'Semi Urgency',
    servicePoint: 'ER',
    staffName: 'น.ส.รัตนา พันประสิทธิ์',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0203',
    timestamp: '2026-11-03 02:03:00',
    cid: '1739900987654',
    hn: '0082579',
    prefix: 'นาย',
    fullName: 'ประจวบ พิศเพ็ง',
    age: 58,
    visitDateTime: '03/11/2026 02:03',
    chiefComplaint: 'จุกแน่นท้อง คลื่นไส้ อาเจียน 1 ครั้ง',
    airway: 'พูดได้ปกติ',
    rr: 20,
    o2Sat: 97,
    lungSound: 'Clear',
    pr: 84,
    temp: 36.8,
    sbp: 140,
    dbp: 85,
    crt: '<= 2 วินาที',
    bleeding: 'ไม่มี',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 4,
    triageLevel: 4,
    triageLevelName: 'Semi Urgency',
    servicePoint: 'ER',
    staffName: 'น.ส.รัตนา พันประสิทธิ์',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0151',
    timestamp: '2026-11-03 01:51:00',
    cid: '1739900112233',
    hn: '0045612',
    prefix: 'นาย',
    fullName: 'วีรพงศ์ รอดงาม',
    age: 41,
    visitDateTime: '03/11/2026 01:51',
    chiefComplaint: 'ปวดข้อมือขวาจากอุบัติเหตุลื่นล้ม มีอาการบวม',
    airway: 'พูดได้ปกติ',
    rr: 18,
    o2Sat: 99,
    lungSound: 'Clear',
    pr: 76,
    temp: 36.5,
    sbp: 122,
    dbp: 78,
    crt: '<= 2 วินาที',
    bleeding: 'ไม่มี',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 4,
    triageLevel: 4,
    triageLevelName: 'Semi Urgency',
    servicePoint: 'ER',
    staffName: 'น.ส.รัตนา พันประสิทธิ์',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0034',
    timestamp: '2026-11-03 00:34:00',
    cid: '1739900445566',
    hn: '0012398',
    prefix: 'นาง',
    fullName: 'ประหยัด จันทราภาส',
    age: 69,
    visitDateTime: '03/11/2026 00:34',
    chiefComplaint: 'ขอรับยาความดันต่อเนื่อง ยาหมด',
    airway: 'พูดได้ปกติ',
    rr: 16,
    o2Sat: 98,
    lungSound: 'Clear',
    pr: 72,
    temp: 36.4,
    sbp: 125,
    dbp: 75,
    crt: '<= 2 วินาที',
    bleeding: 'ไม่มี',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 0,
    triageLevel: 5,
    triageLevelName: 'Non Urgency',
    servicePoint: 'ER',
    staffName: 'น.ส.รัตนา พันประสิทธิ์',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0029',
    timestamp: '2026-11-03 00:29:00',
    cid: '1739900778899',
    hn: '0023419',
    prefix: 'นาย',
    fullName: 'ธัญพิสิษฐ์ โพธิ์สูง',
    age: 28,
    visitDateTime: '03/11/2026 00:29',
    chiefComplaint: 'คันตา มีผื่นคันเล็กน้อยบริเวณแขน 2 วัน',
    airway: 'พูดได้ปกติ',
    rr: 16,
    o2Sat: 99,
    lungSound: 'Clear',
    pr: 74,
    temp: 36.6,
    sbp: 118,
    dbp: 76,
    crt: '<= 2 วินาที',
    bleeding: 'ไม่มี',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 1,
    triageLevel: 5,
    triageLevelName: 'Non Urgency',
    servicePoint: 'ER',
    staffName: 'น.ส.รัตนา พันประสิทธิ์',
    status: 'รอตรวจ'
  },
  {
    id: 'TRG-20261103-0010',
    timestamp: '2026-11-03 00:10:00',
    cid: '1739900990011',
    hn: '0098712',
    prefix: 'นาง',
    fullName: 'สมศรี มั่นคง',
    age: 52,
    visitDateTime: '03/11/2026 00:10',
    chiefComplaint: 'มีไข้ต่ำๆ ไอแห้งๆ 1 วัน',
    airway: 'พูดได้ปกติ',
    rr: 18,
    o2Sat: 98,
    lungSound: 'Clear',
    pr: 80,
    temp: 37.2,
    sbp: 120,
    dbp: 80,
    crt: '<= 2 วินาที',
    bleeding: 'ไม่มี',
    gcs: 15,
    avpu: 'A',
    sirsScore: 0,
    painScore: 1,
    triageLevel: 5,
    triageLevelName: 'Non Urgency',
    servicePoint: 'ER',
    staffName: 'น.ส.รัตนา พันประสิทธิ์',
    status: 'รอตรวจ'
  }
];

/**
 * Web Audio API synthesizer for hospital alert chime
 */
export function playHospitalBeep(level: TriageLevel) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (level === 1) {
      // Siren warble alert for Level 1 Resuscitation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } else {
      // Distinct Medical Chime (D5 -> A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.6);
    }
  } catch (err) {
    console.warn('Audio alert not allowed or supported:', err);
  }
}
