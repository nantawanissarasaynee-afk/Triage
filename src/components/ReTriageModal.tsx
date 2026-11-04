import React, { useState } from 'react';
import { Patient, TriageLevel, ReTriageRecord } from '../types/triage';
import { TRIAGE_LEVELS_META, determineTriageQuality } from '../services/triageLogic';
import { DEFAULT_NURSE_ADMIN } from '../services/exportService';

interface ReTriageModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveReTriage: (patientId: string, record: ReTriageRecord) => void;
  nurseAdmin?: string;
}

export const ReTriageModal: React.FC<ReTriageModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSaveReTriage,
  nurseAdmin = DEFAULT_NURSE_ADMIN
}) => {
  if (!isOpen || !patient) return null;

  const [newLevel, setNewLevel] = useState<TriageLevel>(patient.triageLevel);
  const [sbp, setSbp] = useState<number>(patient.sbp || 120);
  const [dbp, setDbp] = useState<number>(patient.dbp || 80);
  const [pr, setPr] = useState<number>(patient.pr || 80);
  const [rr, setRr] = useState<number>(patient.rr || 18);
  const [o2Sat, setO2Sat] = useState<number>(patient.o2Sat || 98);
  const [temp, setTemp] = useState<number>(patient.temp || 36.5);
  const [pain, setPain] = useState<number>(patient.painScore || 0);
  const [gcs, setGcs] = useState<number>(patient.gcs || 15);
  const [reason, setReason] = useState<string>('ประเมินซ้ำตามรอบเวลาและติดตามอาการ');
  const [staffName, setStaffName] = useState<string>(nurseAdmin);

  const prevMeta = TRIAGE_LEVELS_META[patient.triageLevel];
  const newMeta = TRIAGE_LEVELS_META[newLevel];
  const qualityInfo = determineTriageQuality(patient.triageLevel, newLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const record: ReTriageRecord = {
      id: `RET-${Date.now()}`,
      timestamp,
      previousLevel: patient.triageLevel,
      newLevel,
      reason,
      staffName,
      vitals: {
        sbp,
        dbp,
        pr,
        rr,
        o2Sat,
        temp,
        pain,
        gcs
      },
      qualityCategory: qualityInfo.type
    };

    onSaveReTriage(patient.id, record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#1b5e20] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔄</span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Re-Triage (การประเมินซ้ำตามเกณฑ์ MOPH)
              </h3>
              <p className="text-xs text-white/85">
                ติดตามอาการผู้ป่วยระหว่างรอตรวจและทบทวนคุณภาพการคัดกรอง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Patient Card Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">
                {patient.prefix} {patient.fullName} (HN: {patient.hn || '-'})
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                อาการแรกรับ: {patient.chiefComplaint}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">ระดับเดิม</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${prevMeta.badgeBg}`}>
                Level {prevMeta.level} ({prevMeta.name})
              </span>
            </div>
          </div>

          {/* New Vital Signs Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              📊 สัญญาณชีพปัจจุบัน (Re-assessed Vital Signs)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500">BP (mmHg)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={sbp}
                    onChange={(e) => setSbp(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs"
                    placeholder="SBP"
                    required
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={dbp}
                    onChange={(e) => setDbp(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-center text-xs"
                    placeholder="DBP"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">PR (/min)</label>
                <input
                  type="number"
                  value={pr}
                  onChange={(e) => setPr(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">RR (/min)</label>
                <input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">SpO2 (%)</label>
                <input
                  type="number"
                  value={o2Sat}
                  onChange={(e) => setO2Sat(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">Pain Score (0-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={pain}
                  onChange={(e) => setPain(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">GCS (3-15)</label>
                <input
                  type="number"
                  min={3}
                  max={15}
                  value={gcs}
                  onChange={(e) => setGcs(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* Select New Triage Level */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              🎯 ระดับ Triage หลังประเมินซ้ำ (Re-Triage Level)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {([1, 2, 3, 4, 5] as TriageLevel[]).map((lvl) => {
                const m = TRIAGE_LEVELS_META[lvl];
                const isActive = newLevel === lvl;
                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setNewLevel(lvl)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#1b5e20] bg-[#1b5e20] text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>Level {lvl}</div>
                    <div className="text-[10px] font-normal truncate">{m.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Indicator Box (Under-Triage / Over-Triage / Appropriate) */}
          <div className={`p-3 rounded-xl border flex items-start gap-3 ${qualityInfo.badgeColor}`}>
            <span className="text-xl mt-0.5">
              {qualityInfo.type === 'Under-Triage' ? '⚠️' : qualityInfo.type === 'Over-Triage' ? 'ℹ️' : '✅'}
            </span>
            <div>
              <div className="font-bold text-xs sm:text-sm">
                การประเมินคุณภาพ: {qualityInfo.label}
              </div>
              <div className="text-xs opacity-90 leading-relaxed mt-0.5">
                {qualityInfo.description}
              </div>
            </div>
          </div>

          {/* Reason for Re-Triage */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              เหตุผล / การเปลี่ยนแปลงของอาการ (Clinical Notes)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ระบุเหตุผล เช่น ผู้ป่วยมีอาการเหนื่อยมากขึ้น, ปวดท้องลดลงหลังได้รับยา, ประเมินซ้ำตามรอบเวลา..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              required
            />
          </div>

          {/* Staff Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              พยาบาลผู้ประเมินซ้ำ
            </label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              required
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-[#1b5e20] hover:bg-[#144918] text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>บันทึกผลการ Re-Triage</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
