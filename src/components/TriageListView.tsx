import React, { useState } from 'react';
import { Patient, TriageLevel } from '../types/triage';
import { TRIAGE_LEVELS_META } from '../services/triageLogic';
import { exportPatientsToExcel, exportPatientsToPrintPdf } from '../services/exportService';

interface TriageListViewProps {
  patients: Patient[];
  hospitalName?: string;
  nurseName?: string;
  onAddNew: () => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenReTriage?: (patient: Patient) => void;
}

export const TriageListView: React.FC<TriageListViewProps> = ({
  patients,
  hospitalName,
  nurseName,
  onAddNew,
  onSelectPatient,
  onOpenReTriage
}) => {
  const [filterDate, setFilterDate] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter((patient) => {
    if (filterLevel !== 'all' && patient.triageLevel !== Number(filterLevel)) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      const matchName = patient.fullName.toLowerCase().includes(term);
      const matchHn = patient.hn.toLowerCase().includes(term);
      const matchCid = patient.cid.includes(term);
      if (!matchName && !matchHn && !matchCid) return false;
    }
    return true;
  });

  const handleExportExcel = () => {
    exportPatientsToExcel(filteredPatients, 'Triage_LuangPhorPern_Patients');
  };

  const handleExportPdf = () => {
    exportPatientsToPrintPdf(filteredPatients, {
      title: 'รายงานการคัดกรองผู้ป่วย MOPH ED Triage',
      hospitalName,
      nurseName
    });
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* List Header & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
            <span>📋</span>
            <span>รายการ Triage</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportExcel}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="ส่งออกรายการผู้ป่วยเป็นไฟล์ Excel (.xlsx)"
            >
              <span>📊</span>
              <span>ส่งออก Excel</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="พิมพ์หรือบันทึกเป็นไฟล์ PDF พร้อมตราสัญลักษณ์ รพ.หลวงพ่อเปิ่น"
            >
              <span>📄</span>
              <span>ส่งออก / พิมพ์ PDF</span>
            </button>
            <button
              onClick={onAddNew}
              className="bg-[#1b5e20] hover:bg-[#144918] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>✚</span>
              <span>เพิ่ม</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid matching screenshot 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          
          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />
          </div>

          {/* Level Dropdown */}
          <div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            >
              <option value="all">ทุก Level</option>
              <option value="1">Level 1 (Resuscitation)</option>
              <option value="2">Level 2 (Emergency)</option>
              <option value="3">Level 3 (Urgency)</option>
              <option value="4">Level 4 (Semi Urgency)</option>
              <option value="5">Level 5 (Non Urgency)</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="sm:col-span-2 flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อ/HN..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />
            <button
              type="button"
              className="bg-[#1b5e20] hover:bg-[#144918] text-white px-3.5 py-2 rounded-lg text-sm shrink-0 flex items-center justify-center cursor-pointer transition-colors"
            >
              🔍
            </button>
          </div>

        </div>

        {/* Found Count */}
        <div className="text-xs text-slate-500 font-medium pt-1">
          <span>พบ </span>
          <strong className="text-slate-800 tabular-nums">{filteredPatients.length}</strong>
          <span> รายการ</span>
        </div>

      </div>

      {/* Patient Cards List matching screenshot 1 */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">ไม่พบข้อมูลผู้ป่วยตามเงื่อนไขที่ระบุ</p>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const meta = TRIAGE_LEVELS_META[patient.triageLevel];
            const time = patient.visitDateTime.split(' ')[1] || patient.timestamp.slice(11, 16);

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5 hover:border-slate-300"
              >
                {/* Header: Name & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-800">
                      {patient.prefix} {patient.fullName}
                    </h3>
                    {patient.triageQuality && (
                      <span
                        className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          patient.triageQuality === 'Under-Triage'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : patient.triageQuality === 'Over-Triage'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {patient.triageQuality === 'Under-Triage' ? '⚠️ Under-Triage' : patient.triageQuality === 'Over-Triage' ? 'ℹ️ Over-Triage' : '✅ Appropriate'}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${meta.badgeBg}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: meta.borderColor }}
                      ></span>
                      <span>{meta.name}</span>
                    </span>

                    {onOpenReTriage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReTriage(patient);
                        }}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-[#1b5e20] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer"
                        title="ประเมินซ้ำ (Re-Triage)"
                      >
                        🔄 Re-Triage
                      </button>
                    )}
                  </div>
                </div>

                {/* Metadata Line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <span>🕒</span>
                    <span>{time}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <span>🔢</span>
                    <span>HN: {patient.hn}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{patient.servicePoint}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>👤</span>
                    <span>{patient.staffName}</span>
                  </span>
                </div>

                {/* Complaint Preview */}
                <div className="bg-slate-50 border-l-3 border-[#1b5e20] rounded-r-md px-3 py-2 text-xs text-slate-600 line-clamp-2">
                  {patient.chiefComplaint || 'ไม่มีบันทึกอาการสำคัญ'}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
