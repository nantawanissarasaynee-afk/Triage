import React, { useState, useEffect } from 'react';
import { Patient, TriageLevel } from '../types/triage';
import { evaluateMophTriage, TRIAGE_LEVELS_META } from '../services/triageLogic';

interface TriageFormViewProps {
  currentStaff: string;
  onSubmit: (patient: Patient) => void;
  onOpenQuickGuide?: () => void;
}

export const TriageFormView: React.FC<TriageFormViewProps> = ({ currentStaff, onSubmit, onOpenQuickGuide }) => {
  // Patient Personal Info
  const [cid, setCid] = useState('');
  const [prefix, setPrefix] = useState('น.ส.');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>(35);
  const [hn, setHn] = useState('');
  const [visitDateTime, setVisitDateTime] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');

  // Primary Survey
  const [airway, setAirway] = useState('พูดได้ปกติ');
  const [rr, setRr] = useState<number | ''>(18);
  const [o2Sat, setO2Sat] = useState<number | ''>(98);
  const [lungSound, setLungSound] = useState('Clear');
  const [pr, setPr] = useState<number | ''>(80);
  const [temp, setTemp] = useState<number | ''>(36.5);
  const [sbp, setSbp] = useState<number | ''>(120);
  const [dbp, setDbp] = useState<number | ''>(80);
  const [crt, setCrt] = useState('<= 2 วินาที');
  const [bleeding, setBleeding] = useState('ไม่มี');
  const [gcs, setGcs] = useState<number | ''>(15);
  const [avpu, setAvpu] = useState('A');
  const [sirsScore, setSirsScore] = useState<number>(0);
  const [painScore, setPainScore] = useState<number>(0);

  // Triage Selection & Auto Evaluation
  const [selectedLevel, setSelectedLevel] = useState<TriageLevel>(5);
  const [recLevel, setRecLevel] = useState<TriageLevel>(5);
  const [recReason, setRecReason] = useState('Vital signs ปกติ หรือยังไม่ได้กรอกข้อมูล');

  // Service Point & Notes
  const [servicePoint, setServicePoint] = useState('ER');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default current date/time on mount
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const defaultDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setVisitDateTime(defaultDateTime);
  }, []);

  // Run auto triage evaluation whenever clinical parameters change
  useEffect(() => {
    const evaluation = evaluateMophTriage({
      airway,
      rr: Number(rr) || 18,
      o2Sat: Number(o2Sat) || 98,
      sbp: Number(sbp) || 120,
      pr: Number(pr) || 80,
      gcs: Number(gcs) || 15,
      painScore,
      sirsScore,
      complaint: chiefComplaint
    });

    setRecLevel(evaluation.level);
    setRecReason(evaluation.reason);
  }, [airway, rr, o2Sat, sbp, pr, gcs, painScore, sirsScore, chiefComplaint]);

  // Generate mock CID for quick hospital testing
  const handleGenerateCid = () => {
    const random13 = '1' + Math.floor(100000000000 + Math.random() * 900000000000);
    setCid(random13);
    if (!hn) {
      setHn('0' + Math.floor(100000 + Math.random() * 900000));
    }
  };

  // Quick Preset Complaints for fast clinical triage demo
  const handleQuickPreset = (preset: 'arrest' | 'chestpain' | 'abdomen' | 'wound' | 'cold') => {
    if (preset === 'arrest') {
      setChiefComplaint('หมดสติ ไม่รู้สึกตัว คลำชีพจรไม่ได้ หยุดหายใจ ทำ CPR จากบ้าน');
      setAirway('มีสิ่งอุดกั้น');
      setGcs(3);
      setAvpu('U');
      setO2Sat(75);
      setSbp(0);
      setDbp(0);
      setPr(0);
      setSelectedLevel(1);
    } else if (preset === 'chestpain') {
      setChiefComplaint('เจ็บแน่นหน้าอกร้าวไปกรามซ้าย เหงื่อแตกใจสั่น onset 1 ชม. ก่อนมา รพ.');
      setAirway('พูดได้ปกติ');
      setGcs(15);
      setAvpu('A');
      setPainScore(9);
      setO2Sat(95);
      setSbp(150);
      setDbp(95);
      setPr(96);
      setSelectedLevel(2);
    } else if (preset === 'abdomen') {
      setChiefComplaint('ปวดท้องด้านขวาล่าง 1 วัน คลื่นไส้ กดเจ็บ RLQ');
      setAirway('พูดได้ปกติ');
      setPainScore(6);
      setTemp(37.8);
      setSelectedLevel(3);
    } else if (preset === 'wound') {
      setChiefComplaint('มีดบาดนิ้วมือขวา แผลฉีกขาด 2 ซม. เลือดออกซึม');
      setAirway('พูดได้ปกติ');
      setPainScore(3);
      setBleeding('แผลฉีกขาดเลือดซึม');
      setSelectedLevel(4);
    } else if (preset === 'cold') {
      setChiefComplaint('มีน้ำมูก ไอเล็กน้อย ไม่มีไข้ มารับยาแก้แพ้');
      setAirway('พูดได้ปกติ');
      setPainScore(0);
      setSelectedLevel(5);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('กรุณาระบุชื่อ-นามสกุลผู้ป่วย');
      return;
    }
    if (!chiefComplaint.trim()) {
      alert('กรุณาระบุอาการสำคัญ (Chief Complaint)');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedVisitTime = visitDateTime
      ? visitDateTime.replace('T', ' ')
      : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPatient: Patient = {
      id: `TRG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: now.toISOString().slice(0, 19).replace('T', ' '),
      cid: cid || '1' + Math.floor(100000000000 + Math.random() * 900000000000),
      hn: hn || `HN-${Math.floor(100000 + Math.random() * 900000)}`,
      prefix,
      fullName,
      age: Number(age) || 0,
      visitDateTime: formattedVisitTime,
      chiefComplaint,
      airway,
      rr: Number(rr) || 18,
      o2Sat: Number(o2Sat) || 98,
      lungSound,
      pr: Number(pr) || 80,
      temp: Number(temp) || 36.5,
      sbp: Number(sbp) || 120,
      dbp: Number(dbp) || 80,
      crt,
      bleeding,
      gcs: Number(gcs) || 15,
      avpu,
      sirsScore,
      painScore,
      triageLevel: selectedLevel,
      triageLevelName: TRIAGE_LEVELS_META[selectedLevel].name,
      recommendedLevel: recLevel,
      recommendedReason: recReason,
      servicePoint,
      note,
      staffName: currentStaff,
      status: 'รอตรวจ'
    };

    setTimeout(() => {
      onSubmit(newPatient);
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-8">
      
      {/* Title & Quick Case Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>✚</span>
          <span>บันทึก Triage</span>
        </h2>
        
        {/* Preset buttons for testing convenience */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">จำลองเคส:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('arrest')}
            className="text-[11px] bg-red-100 hover:bg-red-200 text-red-800 px-2 py-0.5 rounded cursor-pointer font-medium"
          >
            🔴 Cardiac Arrest
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('chestpain')}
            className="text-[11px] bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-0.5 rounded cursor-pointer font-medium"
          >
            🩷 Chest Pain (MI)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('abdomen')}
            className="text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-0.5 rounded cursor-pointer font-medium"
          >
            🟡 ปวดท้อง
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('wound')}
            className="text-[11px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded cursor-pointer font-medium"
          >
            🟢 ทำแผล
          </button>
        </div>
      </div>

      {/* 1. ข้อมูลผู้ป่วย (Patient Info) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center gap-2">
          <span>👤</span>
          <span>ข้อมูลผู้ป่วย</span>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* CID 13 Digits */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เลขบัตรประชาชน (CID) <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={13}
                value={cid}
                onChange={(e) => setCid(e.target.value.replace(/\D/g, ''))}
                placeholder="กรอก 13 หลัก ระบบค้นหาอัตโนมัติ"
                className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20] font-mono tabular-nums"
                required
              />
              <button
                type="button"
                onClick={handleGenerateCid}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0"
              >
                สุ่ม CID
              </button>
            </div>
          </div>

          {/* Prefix & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                คำนำหน้า <span className="text-red-600">*</span>
              </label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              >
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="น.ส.">น.ส.</option>
                <option value="ด.ช.">ด.ช.</option>
                <option value="ด.ญ.">ด.ญ.</option>
                <option value="พระภิกษุ">พระภิกษุ</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ-นามสกุล <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ชื่อ นามสกุล"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                required
              />
            </div>
          </div>

          {/* Age & HN & Visit DateTime */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">อายุ (ปี)</label>
              <input
                type="number"
                min={0}
                max={130}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="อายุ"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">HN</label>
              <input
                type="text"
                value={hn}
                onChange={(e) => setHn(e.target.value)}
                placeholder="เช่น 0006387"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่/เวลาที่มา <span className="text-red-600">*</span>
              </label>
              <input
                type="datetime-local"
                value={visitDateTime}
                onChange={(e) => setVisitDateTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                required
              />
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อาการสำคัญ (Chief Complaint) <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={2}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="ระบุอาการที่มา เช่น เจ็บแน่นหน้าอก หายใจเหนื่อย ปวดท้อง..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              required
            />
          </div>

        </div>
      </div>

      {/* 2. Primary Survey */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center gap-2">
          <span>🩺</span>
          <span>Primary Survey</span>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* 1. AIRWAY */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">🫁 1. AIRWAY</label>
            <div className="grid grid-cols-3 gap-2">
              {['พูดได้ปกติ', 'ไม่มีสิ่งอุดกั้น', 'มีสิ่งอุดกั้น'].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setAirway(item)}
                  className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                    airway === item
                      ? 'bg-[#1b5e20] text-white border-[#1b5e20] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 2. BREATHING */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">💨 2. BREATHING</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">RR (/min)</label>
                <input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="18"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">O2 Sat (%RA)</label>
                <input
                  type="number"
                  value={o2Sat}
                  onChange={(e) => setO2Sat(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="98"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Lung Sound</label>
                <input
                  type="text"
                  value={lungSound}
                  onChange={(e) => setLungSound(e.target.value)}
                  placeholder="Clear / Wheezing / Crackle"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
            </div>
          </div>

          {/* 3. CIRCULATION */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">❤️ 3. CIRCULATION</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">PR (/min)</label>
                <input
                  type="number"
                  value={pr}
                  onChange={(e) => setPr(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="80"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Body Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="36.5"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">BP (mmHg) — ปกติ 90-140 / 60-90</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={sbp}
                    onChange={(e) => setSbp(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="120"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                  <span className="text-slate-400 font-bold">/</span>
                  <input
                    type="number"
                    value={dbp}
                    onChange={(e) => setDbp(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="80"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">CRT</label>
                <div className="grid grid-cols-2 gap-2">
                  {['<= 2 วินาที', '> 2 วินาที'].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setCrt(item)}
                      className={`py-1.5 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        crt === item
                          ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item === '<= 2 วินาที' ? '≤ 2 วินาที' : '> 2 วินาที'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Bleeding</label>
                <input
                  type="text"
                  value={bleeding}
                  onChange={(e) => setBleeding(e.target.value)}
                  placeholder="ระบุ เช่น ไม่มี, เลือดซึม, เลือดพุ่ง"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
            </div>
          </div>

          {/* 4. DISABILITY */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">🧠 4. DISABILITY</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">GCS (3-15)</label>
                <input
                  type="number"
                  min={3}
                  max={15}
                  value={gcs}
                  onChange={(e) => setGcs(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">AVPU</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['A', 'V', 'P', 'U'].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setAvpu(item)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        avpu === item
                          ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SIRS Score Interactive Slider */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                SIRS Score (0-4) <small className="text-slate-500 font-normal">(Temp &gt;38/&lt;36, PR &gt;90, RR &gt;20, WBC &gt;12k/&lt;4k)</small>
              </span>
              <span className="text-lg font-bold text-[#1b5e20] tabular-nums">{sirsScore}</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              value={sirsScore}
              onChange={(e) => setSirsScore(Number(e.target.value))}
              className="w-full accent-[#1b5e20] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>0: ปกติ</span>
              <span>2: SIRS Positive</span>
              <span>4: วิกฤต</span>
            </div>
          </div>

          {/* Pain Score Interactive Slider */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Pain Score (0-10)</span>
              <span className="text-lg font-bold text-[#1b5e20] tabular-nums">{painScore}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              className="w-full accent-[#1b5e20] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>0 ไม่ปวด</span>
              <span>5 ปานกลาง</span>
              <span>10 ปวดมาก</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Triage Level Section with Recommendation */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>Triage Level <span className="text-red-300">*</span></span>
          </div>
          {onOpenQuickGuide && (
            <button
              type="button"
              onClick={onOpenQuickGuide}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md font-medium cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>📖</span>
              <span>ดูเกณฑ์ MOPH Triage</span>
            </button>
          )}
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* AI / Clinical Criteria Recommendation Banner */}
          <div className="bg-[#144918] text-white rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🤖</span>
              <div>
                <div className="font-bold text-sm">
                  แนะนำ: {TRIAGE_LEVELS_META[recLevel].name} (Level {recLevel})
                </div>
                <div className="text-xs text-white/90 leading-relaxed mt-0.5">
                  {recReason}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLevel(recLevel)}
              className="bg-white hover:bg-slate-100 text-[#144918] text-xs font-bold px-4 py-2 rounded-lg shadow-sm self-start sm:self-center transition-colors cursor-pointer shrink-0"
            >
              ใช้ค่านี้
            </button>
          </div>

          {/* 5 Big Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Level 1: Resuscitation */}
            <button
              type="button"
              onClick={() => setSelectedLevel(1)}
              className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedLevel === 1
                  ? 'border-red-600 bg-red-50/80 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 shrink-0"></span>
                <div>
                  <div className="font-bold text-sm text-slate-900">Resuscitation</div>
                  <div className="text-xs text-slate-500">วิกฤต - รักษาทันที</div>
                </div>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                0 นาที
              </span>
            </button>

            {/* Level 2: Emergency */}
            <button
              type="button"
              onClick={() => setSelectedLevel(2)}
              className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedLevel === 2
                  ? 'border-pink-600 bg-pink-50/80 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-pink-600 shrink-0"></span>
                <div>
                  <div className="font-bold text-sm text-slate-900">Emergency</div>
                  <div className="text-xs text-slate-500">ฉุกเฉิน - ≤ 10 นาที</div>
                </div>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                ≤ 10 นาที
              </span>
            </button>

            {/* Level 3: Urgency */}
            <button
              type="button"
              onClick={() => setSelectedLevel(3)}
              className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedLevel === 3
                  ? 'border-amber-500 bg-amber-50/80 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0"></span>
                <div>
                  <div className="font-bold text-sm text-slate-900">Urgency</div>
                  <div className="text-xs text-slate-500">เร่งด่วน - ≤ 30 นาที</div>
                </div>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                ≤ 30 นาที
              </span>
            </button>

            {/* Level 4: Semi-Urgency */}
            <button
              type="button"
              onClick={() => setSelectedLevel(4)}
              className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedLevel === 4
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0"></span>
                <div>
                  <div className="font-bold text-sm text-slate-900">Semi Urgency</div>
                  <div className="text-xs text-slate-500">กึ่งเร่งด่วน - ≤ 60 นาที</div>
                </div>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                ≤ 60 นาที
              </span>
            </button>

            {/* Level 5: Non-Urgency (Full width) */}
            <button
              type="button"
              onClick={() => setSelectedLevel(5)}
              className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between sm:col-span-2 transition-all cursor-pointer ${
                selectedLevel === 5
                  ? 'border-slate-500 bg-slate-100 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-400 shrink-0"></span>
                <div>
                  <div className="font-bold text-sm text-slate-900">Non Urgency</div>
                  <div className="text-xs text-slate-500">ไม่เร่งด่วน - ≤ 120 นาที</div>
                </div>
              </div>
              <span className="text-xs bg-white px-2 py-0.5 rounded text-slate-700 font-medium border border-slate-200">
                รอได้
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* 4. จุดบริการ (Service Point) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center gap-2">
          <span>📍</span>
          <span>จุดบริการ <span className="text-red-300">*</span></span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['ER', 'OPD', 'LR', 'ทันตกรรม', 'อื่นๆ'].map((point) => (
              <button
                type="button"
                key={point}
                onClick={() => setServicePoint(point)}
                className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                  servicePoint === point
                    ? 'bg-[#1b5e20] text-white border-[#1b5e20] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {point}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. หมายเหตุ / การดูแลเบื้องต้น */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1b5e20] text-white px-4 py-2.5 font-semibold text-sm flex items-center gap-2">
          <span>💬</span>
          <span>หมายเหตุ / การดูแลเบื้องต้น</span>
        </div>
        <div className="p-4">
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="หมายเหตุเพิ่มเติม เช่น ให้ออกซิเจน Cannula 3 LPM, ให้ IV Fluid, ทำแผลกดห้ามเลือด..."
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1b5e20] hover:bg-[#144918] text-white py-3.5 px-6 rounded-xl font-semibold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
      >
        <span>💾</span>
        <span>{isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึก Triage'}</span>
      </button>

    </form>
  );
};
