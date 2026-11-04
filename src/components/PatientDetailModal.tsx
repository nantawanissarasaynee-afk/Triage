import React from 'react';
import { Patient } from '../types/triage';
import { TRIAGE_LEVELS_META } from '../services/triageLogic';
import { HOSPITAL_LOGO_PATH, DEFAULT_HOSPITAL_NAME, DEFAULT_NURSE_ADMIN } from '../services/exportService';

interface PatientDetailModalProps {
  patient: Patient | null;
  hospitalName?: string;
  nurseName?: string;
  onClose: () => void;
  onUpdateStatus: (patientId: string, newStatus: Patient['status']) => void;
  onDeletePatient: (patientId: string) => void;
  onOpenReTriage: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  hospitalName = DEFAULT_HOSPITAL_NAME,
  nurseName = DEFAULT_NURSE_ADMIN,
  onClose,
  onUpdateStatus,
  onDeletePatient,
  onOpenReTriage
}) => {
  if (!patient) return null;

  const meta = TRIAGE_LEVELS_META[patient.triageLevel];

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      
      {/* Printable Triage Slip Container */}
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Hospital Branding Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={HOSPITAL_LOGO_PATH} alt="Hospital Logo" className="w-7 h-7 object-contain" />
            <span className="text-xs font-bold text-slate-800">{hospitalName}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">ใบ Triage ประจำตัวผู้ป่วย</span>
        </div>

        {/* Modal Header */}
        <div
          className="text-white px-5 py-3.5 flex items-center justify-between"
          style={{ backgroundColor: meta.borderColor }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.emoji}</span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {patient.prefix} {patient.fullName}
              </h3>
              <p className="text-xs text-white/90">
                Level {meta.level} : {meta.name} ({meta.waitTime})
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Top Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 block">HN</span>
              <strong className="font-mono text-slate-800">{patient.hn || '-'}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">อายุ</span>
              <strong className="text-slate-800">{patient.age} ปี</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">จุดบริการ</span>
              <strong className="text-[#1b5e20]">{patient.servicePoint}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">สถานะ</span>
              <strong className="text-amber-700">{patient.status}</strong>
            </div>
            <div className="col-span-2">
              <span className="text-[11px] text-slate-500 block">CID (เลข 13 หลัก)</span>
              <span className="font-mono text-slate-700">{patient.cid}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[11px] text-slate-500 block">วันเวลาที่มา</span>
              <span className="text-slate-700">{patient.visitDateTime} น.</span>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-1">อาการสำคัญ (Chief Complaint)</h4>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
              {patient.chiefComplaint}
            </div>
          </div>

          {/* Vitals Summary Grid */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-1.5">Vital Signs & Primary Survey</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">BP (mmHg)</span>
                <strong className="font-mono text-slate-800">{patient.sbp}/{patient.dbp}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">PR (/min)</span>
                <strong className="font-mono text-slate-800">{patient.pr}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">RR (/min)</span>
                <strong className="font-mono text-slate-800">{patient.rr}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">SpO2 (%)</span>
                <strong className="font-mono text-slate-800">{patient.o2Sat}%</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Temp (°C)</span>
                <strong className="font-mono text-slate-800">{patient.temp}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">GCS (3-15)</span>
                <strong className="font-mono text-slate-800">{patient.gcs}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Pain Score</span>
                <strong className="font-mono text-slate-800">{patient.painScore}/10</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">SIRS Score</span>
                <strong className="font-mono text-slate-800">{patient.sirsScore}/4</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-600">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <strong>Airway:</strong> {patient.airway}
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <strong>AVPU:</strong> {patient.avpu}
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <strong>CRT:</strong> {patient.crt}
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <strong>Lung Sound:</strong> {patient.lungSound}
              </div>
            </div>
          </div>

          {/* Notes */}
          {patient.note && (
            <div>
              <h4 className="font-bold text-slate-800 text-xs mb-1">หมายเหตุ / การดูแลเบื้องต้น</h4>
              <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 text-xs">
                {patient.note}
              </div>
            </div>
          )}

          {/* Re-Triage History Log */}
          {patient.retriageHistory && patient.retriageHistory.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <span>🔄</span>
                  <span>ประวัติการประเมินซ้ำ (Re-Triage History)</span>
                </h4>
                <span className="text-[11px] text-slate-500">{patient.retriageHistory.length} ครั้ง</span>
              </div>
              <div className="space-y-2">
                {patient.retriageHistory.map((ret, idx) => {
                  const qBadge =
                    ret.qualityCategory === 'Under-Triage'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : ret.qualityCategory === 'Over-Triage'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  return (
                    <div key={ret.id || idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-500 text-[11px]">{ret.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${qBadge}`}>
                          {ret.qualityCategory}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">ปรับระดับ:</span>
                        <strong className="text-slate-700">Level {ret.previousLevel}</strong>
                        <span>➔</span>
                        <strong className="text-[#1b5e20]">Level {ret.newLevel}</strong>
                      </div>
                      <div className="text-slate-600">
                        <strong>สัญญาณชีพ:</strong> BP {ret.vitals.sbp}/{ret.vitals.dbp} mmHg, PR {ret.vitals.pr}/min, SpO2 {ret.vitals.o2Sat}%, Pain {ret.vitals.pain}/10
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        <strong>เหตุผล:</strong> {ret.reason} (โดย {ret.staffName})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Re-Triage Interval Guidance */}
          <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-200 flex items-center justify-between text-xs text-sky-900">
            <div>
              <span className="font-semibold block">รอบการประเมินซ้ำตามเกณฑ์:</span>
              <span className="text-sky-700">{meta.retriageInterval}</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenReTriage(patient)}
              className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>Re-Triage ตอนนี้</span>
            </button>
          </div>

          {/* Staff */}
          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>ผู้คัดกรอง: <strong>{patient.staffName}</strong></span>
            <span>ID: <code className="text-slate-600">{patient.id}</code></span>
          </div>

          {/* Status Change Buttons */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-slate-700 block">อัปเดตสถานะผู้ป่วย:</span>
            <div className="flex flex-wrap gap-1.5">
              {(['รอตรวจ', 'กำลังตรวจ', 'จำหน่าย', 'ส่งต่อ (Refer)', 'Admit'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(patient.id, status)}
                  className={`px-3 py-1 text-xs rounded-md border font-medium cursor-pointer transition-colors ${
                    patient.status === status
                      ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <button
            onClick={() => {
              if (confirm('คุณต้องการลบข้อมูลการคัดกรองของผู้ป่วยรายนี้ใช่หรือไม่?')) {
                onDeletePatient(patient.id);
                onClose();
              }
            }}
            className="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
          >
            🗑️ ลบรายการ
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReTriage(patient)}
              className="bg-[#1b5e20] hover:bg-[#144918] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>🔄</span>
              <span>Re-Triage</span>
            </button>
            <button
              onClick={handlePrintSlip}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span>
              <span>พิมพ์ใบ Triage Tag</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
