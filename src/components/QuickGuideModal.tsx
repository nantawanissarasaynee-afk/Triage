import React, { useState } from 'react';
import { TRIAGE_LEVELS_META } from '../services/triageLogic';
import { TriageLevel } from '../types/triage';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'levels' | 'quality' | 'retriage' | 'resources'>('levels');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const levels: TriageLevel[] = [1, 2, 3, 4, 5];

  // Filter levels based on search term
  const filteredLevels = levels.filter((lvl) => {
    if (!searchTerm.trim()) return true;
    const meta = TRIAGE_LEVELS_META[lvl];
    const term = searchTerm.toLowerCase();
    const matchName = meta.name.toLowerCase().includes(term);
    const matchThai = meta.thaiLabel.toLowerCase().includes(term);
    const matchDesc = meta.description.toLowerCase().includes(term);
    const matchEx = meta.examples.some((ex) => ex.toLowerCase().includes(term));
    return matchName || matchThai || matchDesc || matchEx;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#1b5e20] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📖</span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                คู่มือเกณฑ์การคัดกรอง MOPH ED Triage & การควบคุมคุณภาพ
              </h3>
              <p className="text-xs text-white/85">
                มาตรฐานกระทรวงสาธารณสุข (MOPH) โรงพยาบาลหลวงพ่อเปิ่น
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1.5 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('levels')}
            className={`py-2 px-3.5 rounded-t-lg transition-colors cursor-pointer border-t border-x whitespace-nowrap ${
              activeTab === 'levels'
                ? 'bg-white text-[#1b5e20] border-slate-200 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            🎯 5 ระดับ MOPH Triage
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`py-2 px-3.5 rounded-t-lg transition-colors cursor-pointer border-t border-x whitespace-nowrap ${
              activeTab === 'quality'
                ? 'bg-white text-[#1b5e20] border-slate-200 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            ⚖️ Under-Triage & Over-Triage
          </button>
          <button
            onClick={() => setActiveTab('retriage')}
            className={`py-2 px-3.5 rounded-t-lg transition-colors cursor-pointer border-t border-x whitespace-nowrap ${
              activeTab === 'retriage'
                ? 'bg-white text-[#1b5e20] border-slate-200 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            🔄 เกณฑ์ Re-Triage (ประเมินซ้ำ)
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-2 px-3.5 rounded-t-lg transition-colors cursor-pointer border-t border-x whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-white text-[#1b5e20] border-slate-200 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            🧪 การนับทรัพยากร (Resources)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: 5 LEVELS */}
          {activeTab === 'levels' && (
            <div className="space-y-4">
              
              {/* Search Bar inside guide */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาเกณฑ์ เช่น เจ็บหน้าอก, สโตรก, GCS, SIRS, แผล, ปวดท้อง..."
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ล้าง
                  </button>
                )}
              </div>

              {/* Quick Summary Pill Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                  <div className="font-bold text-red-700 text-xs">🔴 Level 1</div>
                  <div className="text-[11px] text-red-600 font-semibold mt-0.5">ทันที (0 นาที)</div>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-2 text-center">
                  <div className="font-bold text-pink-700 text-xs">🩷 Level 2</div>
                  <div className="text-[11px] text-pink-600 font-semibold mt-0.5">≤ 10 นาที</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                  <div className="font-bold text-amber-700 text-xs">🟡 Level 3</div>
                  <div className="text-[11px] text-amber-600 font-semibold mt-0.5">≤ 30 นาที</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
                  <div className="font-bold text-emerald-700 text-xs">🟢 Level 4</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">≤ 60 นาที</div>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-2 text-center col-span-2 sm:col-span-1">
                  <div className="font-bold text-slate-700 text-xs">🤍 Level 5</div>
                  <div className="text-[11px] text-slate-600 font-semibold mt-0.5">≤ 120 นาที</div>
                </div>
              </div>

              {/* Level Items */}
              <div className="space-y-4 divide-y divide-slate-100">
                {filteredLevels.map((lvl) => {
                  const meta = TRIAGE_LEVELS_META[lvl];
                  return (
                    <div key={lvl} className="pt-3.5 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{meta.emoji}</span>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900">
                            Level {meta.level} : {meta.name} ({meta.thaiLabel})
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            ⏱️ รอคอย: {meta.waitTime}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🔄 Re-triage: {meta.retriageInterval}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-700 font-medium text-xs leading-relaxed">
                        {meta.description}
                      </p>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-800">เกณฑ์การคัดกรองและตัวอย่างโรค:</span>
                        <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600">
                          {meta.examples.map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-xs text-[#1b5e20] font-semibold flex items-center gap-1.5">
                        <span>📝 จำง่าย :</span>
                        <span>{meta.mnemonic}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: UNDER-TRIAGE & OVER-TRIAGE */}
          {activeTab === 'quality' && (
            <div className="space-y-4 leading-relaxed">
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950">
                <h4 className="font-bold text-sm mb-1">
                  🎯 การควบคุมคุณภาพการคัดกรองผู้ป่วย (Triage Quality Control)
                </h4>
                <p className="text-xs opacity-90">
                  ตามมาตรฐานการประเมินคุณภาพบริการห้องฉุกเฉิน กระทรวงสาธารณสุข การคัดกรองที่แม่นยำส่งผลโดยตรงต่ออัตราการรอดชีวิตและความปลอดภัยของผู้ป่วย (Patient Safety)
                </p>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Under-Triage */}
                <div className="bg-red-50/70 border-2 border-red-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <h5 className="font-bold text-red-800 text-sm">Under-Triage (คัดกรองต่ำกว่าจริง)</h5>
                  </div>
                  <div className="text-xs text-red-900 space-y-1.5">
                    <p><strong>นิยาม:</strong> ผู้ป่วยที่มีอาการรุนแรงหรือมีความเสี่ยงสูง แต่ได้รับการคัดกรองไว้ในระดับความรุนแรงที่ต่ำกว่าความเป็นจริง (เช่น ผู้ป่วยภาวะวิกฤต/ฉุกเฉิน แต่ประเมินไว้เป็น Level 4 หรือ 5)</p>
                    <p><strong>ผลกระทบ:</strong> ผู้ป่วยได้รับการรักษาล่าช้า (Delayed Treatment) เสี่ยงต่อภาวะแทรกซ้อนรุนแรง หรือเสียชีวิต</p>
                    <div className="p-2 bg-white rounded border border-red-300 font-bold text-red-700 text-center">
                      เกณฑ์มาตรฐาน MOPH: อัตรา Under-Triage ควร &lt; 5%
                    </div>
                    <p><strong>สาเหตุพบบ่อย:</strong> ไม่ได้วัด Vital Signs ครบถ้วน, มองข้ามอาการปวดรุนแรง (Pain Score ≥ 7), ไม่ซักประวัติประเมิน High Risk (เช่น เบาหวานกับอาการเจ็บหน้าอกแบบเงียบ)</p>
                  </div>
                </div>

                {/* Over-Triage */}
                <div className="bg-amber-50/70 border-2 border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">ℹ️</span>
                    <h5 className="font-bold text-amber-800 text-sm">Over-Triage (คัดกรองสูงเกินจริง)</h5>
                  </div>
                  <div className="text-xs text-amber-900 space-y-1.5">
                    <p><strong>นิยาม:</strong> ผู้ป่วยที่มีอาการไม่รุนแรง แต่ได้รับการคัดกรองไว้ในระดับฉุกเฉินหรือวิกฤตเกินความเป็นจริง</p>
                    <p><strong>ผลกระทบ:</strong> แย่งทรัพยากรห้องฉุกเฉิน (ED Crowding), แพทย์และพยาบาลภาระงานล้น, ผู้ป่วยวิกฤตตัวจริงอาจรอคอยนานขึ้น</p>
                    <div className="p-2 bg-white rounded border border-amber-300 font-bold text-amber-700 text-center">
                      เกณฑ์มาตรฐาน MOPH: ยอมรับได้ไม่เกิน 25 - 50%
                    </div>
                    <p><em>*หมายเหตุ: ในทางเวชศาสตร์ฉุกเฉิน การ Over-triage ถือว่าปลอดภัยกว่า Under-triage แต่ต้องมีกระบวนการ Re-Triage เพื่อปรับระดับให้เหมาะสม</em></p>
                  </div>
                </div>

              </div>

              {/* Prevention & Auditing */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs text-slate-700">
                <h5 className="font-bold text-slate-800">✅ มาตรการป้องกัน Under-Triage ในโรงพยาบาลหลวงพ่อเปิ่น</h5>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                  <li>ประเมินสัญญาณชีพ (Vital Signs) ครบทุกมิติ: BP, PR, RR, SpO2, Temp, GCS และ Pain Score</li>
                  <li>คำนวณคะแนน <strong>SIRS Score (0-4)</strong> เสมอเพื่อดักจับภาวะ Severe Sepsis ในผู้ป่วยติดเชื้อ</li>
                  <li>ตรวจวัดสัญญาณชีพซ้ำตามรอบเวลาอย่างเคร่งครัด (Re-Triage Protocol)</li>
                  <li>หากไม่แน่ใจในความรุนแรง ให้เลือกประเมินระดับความรุนแรงที่สูงขึ้นไว้ก่อน (Err on the side of caution)</li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 3: RE-TRIAGE PROTOCOL */}
          {activeTab === 'retriage' && (
            <div className="space-y-4 leading-relaxed text-xs sm:text-sm">
              
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-950">
                <h4 className="font-bold text-sm mb-1">
                  🔄 แนวปฏิบัติการประเมินซ้ำ (Re-Triage Protocol)
                </h4>
                <p className="text-xs opacity-90">
                  ผู้ป่วยที่รอรับการตรวจรักษาในห้องฉุกเฉินต้องได้รับการประเมินซ้ำเพื่อติดตามการเปลี่ยนแปลงของอาการ โดยพยาบาลวิชาชีพจะต้องบันทึกผลการ Re-Triage ทุกครั้ง
                </p>
              </div>

              {/* Re-Triage Frequency Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#1b5e20] text-white">
                    <tr>
                      <th className="py-2.5 px-3">ระดับ Triage</th>
                      <th className="py-2.5 px-3">ระยะเวลารอคอยสูงสุด</th>
                      <th className="py-2.5 px-3">ความถี่ในการ Re-Triage</th>
                      <th className="py-2.5 px-3">แนวทางการประเมิน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-red-50/40">
                      <td className="py-2 px-3 font-bold text-red-700">Level 1 (Resuscitation)</td>
                      <td className="py-2 px-3">ทันที (0 นาที)</td>
                      <td className="py-2 px-3 font-semibold text-red-800">Continuous (ต่อเนื่อง)</td>
                      <td className="py-2 px-3">เข้าห้อง Resuscitation ทันที, ติด Monitor EKG, O2 Sat ต่อเนื่อง</td>
                    </tr>
                    <tr className="bg-pink-50/40">
                      <td className="py-2 px-3 font-bold text-pink-700">Level 2 (Emergency)</td>
                      <td className="py-2 px-3">≤ 10 นาที</td>
                      <td className="py-2 px-3 font-semibold text-pink-800">ทุก 15 นาที</td>
                      <td className="py-2 px-3">วัด Vital Signs ซ้ำ, ประเมินอาการเจ็บหน้าอก, ระดับความรู้สึกตัว</td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="py-2 px-3 font-bold text-amber-700">Level 3 (Urgent)</td>
                      <td className="py-2 px-3">≤ 30 นาที</td>
                      <td className="py-2 px-3 font-semibold text-amber-800">ทุก 30 นาที</td>
                      <td className="py-2 px-3">วัด Vital Signs, ประเมิน Pain score, ตรวจสอบผล Lab/X-ray ที่ส่งตรวจ</td>
                    </tr>
                    <tr className="bg-emerald-50/40">
                      <td className="py-2 px-3 font-bold text-emerald-700">Level 4 (Semi-Urgent)</td>
                      <td className="py-2 px-3">≤ 60 นาที</td>
                      <td className="py-2 px-3 font-semibold text-emerald-800">ทุก 60 นาที</td>
                      <td className="py-2 px-3">สังเกตอาการทั่วไป, ประเมินแผลหรืออาการปวดซ้ำ</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-700">Level 5 (Non-Urgent)</td>
                      <td className="py-2 px-3">≤ 120 นาที</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">ทุก 120 นาที</td>
                      <td className="py-2 px-3">ประเมินเมื่อผู้ป่วยแจ้งมีอาการเปลี่ยนแปลง</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Red Flags for Immediate Up-Triage */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-1.5 text-xs text-red-900">
                <h5 className="font-bold flex items-center gap-1.5 text-red-800">
                  <span>🚨</span>
                  <span>สัญญาณอันตรายที่ต้องปรับระดับขึ้นทันที (Immediate Up-Triage)</span>
                </h5>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  <li>SpO2 ลดลงต่ำกว่า 95% หรือมีอาการหายใจเหนื่อยหอบเพิ่มขึ้น</li>
                  <li>Systolic BP &lt; 90 mmHg หรือ ชีพจร PR &gt; 120 ครั้ง/นาที (เสี่ยงภาวะช็อก)</li>
                  <li>ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status) หรือ GCS ลดลง ≥ 2 คะแนน</li>
                  <li>อาการเจ็บแน่นหน้าอกรุนแรงขึ้น หรือมีอาการเหงื่อแตกตัวเย็น</li>
                  <li>Pain Score เพิ่มขึ้นเป็นระดับรุนแรง (≥ 7-8 คะแนน)</li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 4: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4 leading-relaxed text-xs sm:text-sm">
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950">
                <h4 className="font-bold text-sm mb-1">
                  🧪 การจำแนกทรัพยากรห้องฉุกเฉิน (Resource Utilization)
                </h4>
                <p className="text-xs opacity-90">
                  เกณฑ์ MOPH ใช้จำนวนทรัพยากรที่ต้องใช้ในการตัดสินแยกระหว่าง Level 3 (≥ 2 อย่าง), Level 4 (1 อย่าง), และ Level 5 (0 อย่าง)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div className="bg-white border border-emerald-200 rounded-xl p-3.5 space-y-2">
                  <h5 className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                    <span>✅</span>
                    <span>นับเป็นทรัพยากร (Counts as Resource)</span>
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                    <li><strong>ตรวจทางห้องปฏิบัติการ:</strong> CBC, Blood Chem, Cardiac Enzymes, UA</li>
                    <li><strong>ตรวจทางรังสีวิทยา:</strong> X-ray, CT Scan, Ultrasound, MRI</li>
                    <li><strong>การให้ยาทางหลอดเลือด:</strong> IV Hydration, IV Antibiotics, IV Sedation</li>
                    <li><strong>การปรึกษาแพทย์เฉพาะทาง:</strong> Consult ศัลยกรรม, สูติฯ, อายุรกรรม</li>
                    <li><strong>หัตถการซับซ้อน:</strong> ใส่ท่อช่วยหายใจ, เย็บแผลซับซ้อน, ใส่สายสวนปัสสาวะ, ใส่ Chest Drain</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <h5 className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                    <span>❌</span>
                    <span>ไม่นับเป็นทรัพยากร (Does NOT count)</span>
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                    <li>การตรวจร่างกายทั่วไปและการซักประวัติ</li>
                    <li>การตรวจวัดสัญญาณชีพตามปกติ</li>
                    <li>การให้ยากิน (Oral Medication) หรือฉีดวัคซีนบาดทะยักธรรมดา</li>
                    <li>การตรวจน้ำตาลปลายนิ้ว (DTX) อย่างเดียว</li>
                    <li>การทำแผลถลอกตื้นๆ หรือการใส่เฝือกชั่วคราวอย่างง่าย</li>
                    <li>การเขียนใบส่งตัว หรือการขอรับยาโรคประจำตัวเดิม</li>
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span className="font-medium">
            มาตรฐาน MOPH ED Triage 5 ระดับ • โรงพยาบาลหลวงพ่อเปิ่น
          </span>
          <button
            onClick={onClose}
            className="bg-[#1b5e20] hover:bg-[#144918] text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            เข้าใจแล้ว / ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
