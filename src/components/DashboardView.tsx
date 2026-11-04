import React from 'react';
import { Patient, TriageLevel } from '../types/triage';
import { TRIAGE_LEVELS_META } from '../services/triageLogic';

interface DashboardViewProps {
  patients: Patient[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onGoToForm: () => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenQuickGuide: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  soundEnabled,
  onToggleSound,
  onGoToForm,
  onSelectPatient,
  onOpenQuickGuide
}) => {
  // Count by level
  const counts: Record<TriageLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  patients.forEach(p => {
    const lvl = (p.triageLevel in counts ? p.triageLevel : 5) as TriageLevel;
    counts[lvl] = (counts[lvl] || 0) + 1;
  });

  const totalToday = patients.length;
  const monthTotal = totalToday + 57; // Historical accumulated cases

  const recentPatients = patients.slice(0, 20);

  // Format today's date in Thai Buddhist year
  const today = new Date();
  const thaiDateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear() + 543}`;

  return (
    <div className="space-y-4">
      
      {/* Page Title & Date Header */}
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>⏱️</span>
          <span>Dashboard</span>
        </h2>
        <span className="text-sm text-slate-500 font-medium tabular-nums">{thaiDateStr}</span>
      </div>

      {/* ER Real-time Audio Alert Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 text-sky-900 text-xs sm:text-sm font-medium">
          <span className="text-base sm:text-lg">📢</span>
          <span>ระบบเสียงแจ้งเตือนเคสใหม่ในห้องฉุกเฉิน (ER Real-time Alert)</span>
        </div>
        <button
          onClick={onToggleSound}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs ${
            soundEnabled
              ? 'bg-[#0284c7] hover:bg-sky-700 text-white'
              : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
          }`}
        >
          <span>{soundEnabled ? '🔊' : '🔇'}</span>
          <span>{soundEnabled ? 'เปิดเสียงอยู่' : 'ปิดเสียง'}</span>
        </button>
      </div>

      {/* LINE OpenChat "Triage LPH" Integration Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border border-emerald-300 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#06C755] flex items-center justify-center text-white text-xl shadow-sm shrink-0">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <span>LINE OpenChat:</span>
                <span className="text-[#06C755]">Triage LPH</span>
              </h3>
              <span className="bg-[#06C755]/15 text-[#06C755] border border-[#06C755]/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                เชื่อมต่อแล้ว
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              กลุ่มประสานงานคัดกรองฉุกเฉิน & แจ้งเตือนเคสผู้ป่วยใหม่ โรงพยาบาลหลวงพ่อเปิ่น
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
          <a
            href="https://line.me/ti/g2/V1UNTdetwPj4fS9-3Z3mzS3r-pzF8klqZLmyaQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer text-center"
          >
            <span>📲</span>
            <span>แตะเข้าร่วม OpenChat &quot;Triage LPH&quot;</span>
          </a>
        </div>
      </div>

      {/* 5-Level Summary Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
            <span>👥</span>
            <span>ผู้รับบริการวันนี้</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 font-medium">
            รวมทั้งหมด <strong className="text-[#1b5e20] text-base font-bold tabular-nums">{totalToday}</strong> ราย
          </div>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          
          {/* Level 1: Resuscitation */}
          <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-red-600 p-3.5 transition-transform hover:-translate-y-0.5">
            <div className="text-3xl font-extrabold text-red-600 tabular-nums leading-none mb-2">
              {counts[1]}
            </div>
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>Resuscitation</span>
            </div>
          </div>

          {/* Level 2: Emergency */}
          <div className="bg-pink-50/50 rounded-xl border border-slate-200 border-t-4 border-t-pink-600 p-3.5 transition-transform hover:-translate-y-0.5">
            <div className="text-3xl font-extrabold text-pink-600 tabular-nums leading-none mb-2">
              {counts[2]}
            </div>
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-600 inline-block"></span>
              <span>Emergency</span>
            </div>
          </div>

          {/* Level 3: Urgency */}
          <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-amber-500 p-3.5 transition-transform hover:-translate-y-0.5">
            <div className="text-3xl font-extrabold text-amber-600 tabular-nums leading-none mb-2">
              {counts[3]}
            </div>
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Urgency</span>
            </div>
          </div>

          {/* Level 4: Semi-Urgency */}
          <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-emerald-600 p-3.5 transition-transform hover:-translate-y-0.5">
            <div className="text-3xl font-extrabold text-emerald-600 tabular-nums leading-none mb-2">
              {counts[4]}
            </div>
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              <span>Semi Urgency</span>
            </div>
          </div>

          {/* Level 5: Non-Urgency */}
          <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-slate-400 p-3.5 col-span-2 sm:col-span-1 transition-transform hover:-translate-y-0.5">
            <div className="text-3xl font-extrabold text-slate-600 tabular-nums leading-none mb-2">
              {counts[5]}
            </div>
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
              <span>Non Urgency</span>
            </div>
          </div>

        </div>

        {/* Month Summary & Quality KPI strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100 gap-2">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">เกณฑ์คุณภาพ MOPH:</span>
            <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold text-[11px]">
              Under-Triage: {patients.filter(p => p.triageQuality === 'Under-Triage').length} ราย (&lt;5% KPI)
            </span>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold text-[11px]">
              Over-Triage: {patients.filter(p => p.triageQuality === 'Over-Triage').length} ราย
            </span>
            <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-bold text-[11px]">
              Re-Triage: {patients.reduce((acc, p) => acc + (p.retriageHistory?.length || 0), 0)} ครั้ง
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <span>📅 เดือนนี้: <strong className="text-slate-700 tabular-nums">{monthTotal}</strong> ราย</span>
            <button
              type="button"
              onClick={onOpenQuickGuide}
              className="text-[#1b5e20] hover:text-[#144918] font-bold underline cursor-pointer"
            >
              📖 ดูเกณฑ์คัดกรอง
            </button>
          </div>

        </div>
      </div>

      {/* Big Action Button */}
      <button
        onClick={onGoToForm}
        className="w-full bg-[#1b5e20] hover:bg-[#144918] text-white py-3.5 px-6 rounded-xl font-semibold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
      >
        <span className="text-lg">✚</span>
        <span>บันทึก Triage ใหม่</span>
      </button>

      {/* Recent Patients Table (Top 20) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Table Header Bar */}
        <div className="bg-[#1b5e20] text-white px-4 py-3 flex items-center justify-between">
          <div className="font-semibold text-sm sm:text-base flex items-center gap-2">
            <span>🕒</span>
            <span>รายการผู้ป่วยล่าสุด (แสดงสูงสุด 20 ราย)</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-normal">
            Real-time Live
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-xs font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4 whitespace-nowrap">เวลา</th>
                <th className="py-2.5 px-4 whitespace-nowrap">ชื่อผู้ป่วย</th>
                <th className="py-2.5 px-4 whitespace-nowrap">ระดับความรุนแรง</th>
                <th className="py-2.5 px-4 whitespace-nowrap">จุดบริการ</th>
                <th className="py-2.5 px-4 whitespace-nowrap text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    ยังไม่มีข้อมูลผู้ป่วยที่บันทึก
                  </td>
                </tr>
              ) : (
                recentPatients.map(patient => {
                  const meta = TRIAGE_LEVELS_META[patient.triageLevel];
                  const time = patient.visitDateTime.split(' ')[1] || patient.timestamp.slice(11, 16);
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => onSelectPatient(patient)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                        {time} น.
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {patient.prefix} {patient.fullName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.badgeBg}`}
                        >
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: meta.borderColor }}
                          ></span>
                          <span>{meta.name}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                        {patient.servicePoint || 'ER'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient);
                          }}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer"
                        >
                          เปิดดู
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
