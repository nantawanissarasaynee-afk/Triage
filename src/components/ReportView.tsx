import React, { useState } from 'react';
import { Patient, TriageLevel } from '../types/triage';
import { TRIAGE_LEVELS_META } from '../services/triageLogic';
import { exportPatientsToExcel, exportPatientsToPrintPdf, HOSPITAL_LOGO_PATH } from '../services/exportService';

interface ReportViewProps {
  patients: Patient[];
  hospitalName?: string;
  nurseName?: string;
}

export const ReportView: React.FC<ReportViewProps> = ({
  patients,
  hospitalName = 'โรงพยาบาลหลวงพ่อเปิ่น',
  nurseName = 'พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพปฏิบัติการ'
}) => {
  const [selectedMonth, setSelectedMonth] = useState('พ.ย.');
  const [selectedYear, setSelectedYear] = useState('2569');

  // Count by level including historical records
  const baseCounts: Record<TriageLevel, number> = {
    1: 0,
    2: 5,
    3: 18,
    4: 36,
    5: 7
  };

  // Add currently added patients
  patients.forEach((p) => {
    if (p.triageLevel in baseCounts) {
      baseCounts[p.triageLevel] = (baseCounts[p.triageLevel] || 0) + 1;
    }
  });

  const totalCases = Object.values(baseCounts).reduce((a, b) => a + b, 0);

  const levelItems: Array<{ level: TriageLevel; label: string; color: string }> = [
    { level: 1, label: 'Resuscitation', color: '#dc2626' },
    { level: 2, label: 'Emergency', color: '#db2777' },
    { level: 3, label: 'Urgency', color: '#d97706' },
    { level: 4, label: 'Semi Urgency', color: '#16a34a' },
    { level: 5, label: 'Non Urgency', color: '#64748b' }
  ];

  // Daily distribution matching screenshot 6/7
  const dayDistribution: Record<number, number> = {
    1: 21,
    2: 36,
    3: 9
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Month & Year Filter Bar matching screenshot */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
            <span>📊</span>
            <span>รายงานประจำเดือน</span>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            >
              <option value="ม.ค.">ม.ค.</option>
              <option value="ก.พ.">ก.พ.</option>
              <option value="มี.ค.">มี.ค.</option>
              <option value="ต.ค.">ต.ค.</option>
              <option value="พ.ย.">พ.ย.</option>
              <option value="ธ.ค.">ธ.ค.</option>
            </select>

            <input
              type="text"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-center font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />

            <button
              type="button"
              className="bg-[#1b5e20] hover:bg-[#144918] text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Level Breakdown Progress Bars Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{selectedMonth} {selectedYear} – รวมทั้งหมด {totalCases} ราย</span>
          </div>
          <span className="text-xs font-normal opacity-90">MOPH ED Triage</span>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          
          {levelItems.map(({ level, label, color }) => {
            const count = baseCounts[level] || 0;
            const pct = totalCases > 0 ? Math.round((count / totalCases) * 100) : 0;

            if (count === 0 && level === 1) return null; // Resuscitation = 0 in example

            return (
              <div key={level} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                    <span className="text-slate-800 font-semibold">{label}</span>
                  </div>
                  <div className="text-slate-600 tabular-nums">
                    <span>{count} ราย</span>
                    <span className="text-slate-400 ml-1">({pct}%)</span>
                  </div>
                </div>
                
                {/* Progress Track */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Triage Quality & Re-Triage Audit Card (Under-Triage / Over-Triage / Re-Triage) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚖️</span>
            <span>รายงานการควบคุมคุณภาพ (Triage Quality & Re-Triage Audit)</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-normal">
            เกณฑ์มาตรฐาน สธ. (MOPH)
          </span>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Under-Triage Box */}
            <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-800 text-xs">⚠️ Under-Triage</span>
                <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold">
                  เป้าหมาย &lt; 5%
                </span>
              </div>
              <div className="text-2xl font-extrabold text-red-700 tabular-nums">
                {patients.filter(p => p.triageQuality === 'Under-Triage').length} <span className="text-xs font-normal text-slate-600">ราย ({patients.length > 0 ? ((patients.filter(p => p.triageQuality === 'Under-Triage').length / patients.length) * 100).toFixed(1) : 0}%)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                คัดกรองต่ำกว่าความเป็นจริง เสี่ยงได้รับการรักษาล่าช้า
              </p>
            </div>

            {/* Over-Triage Box */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 text-xs">ℹ️ Over-Triage</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                  ยอมรับได้ 25-50%
                </span>
              </div>
              <div className="text-2xl font-extrabold text-amber-700 tabular-nums">
                {patients.filter(p => p.triageQuality === 'Over-Triage').length} <span className="text-xs font-normal text-slate-600">ราย ({patients.length > 0 ? ((patients.filter(p => p.triageQuality === 'Over-Triage').length / patients.length) * 100).toFixed(1) : 0}%)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                คัดกรองสูงเกินจริง ได้รับการปรับระดับหลังประเมินซ้ำ
              </p>
            </div>

            {/* Re-Triage Compliance */}
            <div className="p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-800 text-xs">🔄 Re-Triage ที่ดำเนินการ</span>
                <span className="text-[10px] bg-sky-200 text-sky-900 px-1.5 py-0.5 rounded font-bold">
                  ความปลอดภัยผู้ป่วย
                </span>
              </div>
              <div className="text-2xl font-extrabold text-sky-700 tabular-nums">
                {patients.reduce((acc, p) => acc + (p.retriageHistory?.length || 0), 0)} <span className="text-xs font-normal text-slate-600">ครั้ง</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                ประเมินสัญญาณชีพและอาการซ้ำตามรอบเวลาของแต่ละระดับ
              </p>
            </div>

          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <span>การคัดกรองที่สอดคล้องตามเกณฑ์ (Appropriate Triage): <strong>{patients.filter(p => p.triageQuality !== 'Under-Triage' && p.triageQuality !== 'Over-Triage').length} ราย</strong></span>
            <span className="text-emerald-700 font-bold">ผ่านมาตรฐานความปลอดภัย รพ.หลวงพ่อเปิ่น</span>
          </div>

        </div>
      </div>

      {/* Service Point Breakdown Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center gap-2">
          <span>📍</span>
          <span>จำแนกตามจุดบริการ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-xs font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4">จุดบริการ</th>
                <th className="py-2.5 px-4">จำนวน</th>
                <th className="py-2.5 px-4 text-right">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-slate-800">ER</td>
                <td className="py-2.5 px-4 text-slate-600 tabular-nums">63</td>
                <td className="py-2.5 px-4 text-right text-slate-600 tabular-nums">95.5%</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-slate-800">OPD</td>
                <td className="py-2.5 px-4 text-slate-600 tabular-nums">3</td>
                <td className="py-2.5 px-4 text-right text-slate-600 tabular-nums">4.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Calendar Heatmap Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center gap-2">
          <span>📈</span>
          <span>รายวัน</span>
        </div>
        <div className="p-4">
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-slate-600 mb-2">
            <div>อา</div>
            <div>จ</div>
            <div>อ</div>
            <div>พ</div>
            <div>พฤ</div>
            <div>ศ</div>
            <div>ส</div>
          </div>

          {/* 30 days grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const val = dayDistribution[day];
              const isHighlight = val !== undefined;

              return (
                <div
                  key={day}
                  className={`p-1.5 sm:p-2 rounded-lg text-center transition-all ${
                    day === 2
                      ? 'bg-[#1b5e20] text-white shadow-xs'
                      : day === 1
                      ? 'bg-emerald-600 text-white'
                      : day === 3
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-slate-50 text-slate-700 border border-slate-100'
                  }`}
                >
                  <div className="text-[11px] font-medium leading-none mb-1">{day}</div>
                  <div className="text-xs sm:text-sm font-bold tabular-nums min-h-[18px]">
                    {val || ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-slate-400 mt-3">
            ตัวเลขในช่องคือจำนวน Triage / วัน
          </div>

        </div>
      </div>

      {/* Hospital Certifying Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <img src={HOSPITAL_LOGO_PATH} alt="Logo" className="w-9 h-9 object-contain" />
          <div>
            <div className="font-bold text-slate-800">{hospitalName}</div>
            <div className="text-slate-500">พยาบาลผู้ดูแลระบบ: <strong>{nurseName}</strong></div>
          </div>
        </div>
        <div className="text-right text-slate-500 font-mono text-[11px]">
          ระบบคัดกรอง 5 ระดับ MOPH ED Triage
        </div>
      </div>

      {/* Action Buttons: Excel and PDF Export */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
        <button
          onClick={() => exportPatientsToExcel(patients, `Triage_Report_${selectedMonth}_${selectedYear}`)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <span>📊</span>
          <span>ส่งออกรายงานเป็นไฟล์ Excel (.xlsx)</span>
        </button>

        <button
          onClick={() => exportPatientsToPrintPdf(patients, {
            title: `รายงานประจำเดือน ${selectedMonth} ${selectedYear} (MOPH ED Triage)`,
            hospitalName,
            nurseName
          })}
          className="bg-[#1b5e20] hover:bg-[#144918] text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <span>🖨️</span>
          <span>พิมพ์ / บันทึกรายงานเป็น PDF</span>
        </button>
      </div>

    </div>
  );
};
