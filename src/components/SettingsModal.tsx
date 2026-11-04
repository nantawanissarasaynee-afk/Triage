import React, { useState } from 'react';
import { HospitalSettings } from '../types/triage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HospitalSettings;
  onSave: (newSettings: HospitalSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [hospitalName, setHospitalName] = useState(settings.hospitalName);
  const [staffName, setStaffName] = useState(settings.staffName);
  const [lineToken, setLineToken] = useState(settings.lineToken);
  const [gasWebappUrl, setGasWebappUrl] = useState(settings.gasWebappUrl);
  const [enableSound, setEnableSound] = useState(settings.enableSound);
  const [testResult, setTestResult] = useState<{ message: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...settings,
      hospitalName,
      staffName,
      lineToken,
      gasWebappUrl,
      enableSound
    });
    onClose();
  };

  const handleTestLineNotify = () => {
    if (!lineToken.trim()) {
      alert('กรุณากรอก LINE Notify Token ก่อนทดสอบ');
      return;
    }

    setTestResult({
      message: 'จำลองการส่งแจ้งเตือนสำเร็จ! ในระบบ Google Apps Script จริง ระบบจะส่งข้อความเข้าห้องแชต/กลุ่ม LINE ทันที',
      success: true
    });
    setTimeout(() => setTestResult(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#1b5e20] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="font-bold text-base">ตั้งค่าระบบ (Settings)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          
          {/* Hospital Logo & Info Banner */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <img
              src="/assets/aistudio/IMG_1767_3b31df57.webp"
              alt="ตราสัญลักษณ์โรงพยาบาลหลวงพ่อเปิ่น"
              className="w-12 h-12 object-contain rounded-full bg-white p-0.5 border border-emerald-300 shrink-0"
            />
            <div>
              <div className="font-bold text-emerald-950 text-sm">โรงพยาบาลหลวงพ่อเปิ่น</div>
              <div className="text-emerald-800 text-xs mt-0.5">พยาบาลผู้ดูแลระบบ: พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อโรงพยาบาล / หน่วยงาน (ล็อกเป็นค่าเริ่มต้น)
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="โรงพยาบาลหลวงพ่อเปิ่น"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              พยาบาลผู้ดูแลระบบ / เจ้าหน้าที่คัดกรอง
            </label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20] font-medium"
            />
          </div>

          {/* LINE OpenChat Section */}
          <div className="p-3.5 bg-green-50/80 border border-green-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-green-950 text-xs sm:text-sm flex items-center gap-1.5">
                <span>💬</span>
                <span>LINE OpenChat: Triage LPH</span>
              </div>
              <span className="text-[10px] bg-[#06C755] text-white px-2 py-0.5 rounded-full font-bold">
                เชื่อมต่อแล้ว
              </span>
            </div>
            <p className="text-[11px] text-green-800">
              ลิงก์คำเชิญสำหรับเจ้าหน้าที่ ER และทีมแพทย์เพื่อเข้าร่วมห้องประสานงานคัดกรอง:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="https://line.me/ti/g2/V1UNTdetwPj4fS9-3Z3mzS3r-pzF8klqZLmyaQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                className="w-full px-2.5 py-1.5 bg-white border border-green-300 rounded text-[11px] font-mono text-slate-700 select-all"
              />
              <a
                href="https://line.me/ti/g2/V1UNTdetwPj4fS9-3Z3mzS3r-pzF8klqZLmyaQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-[#06C755] hover:bg-[#05b34c] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
              >
                <span>เปิดแชต</span>
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              LINE Notify Token (สำหรับส่งการแจ้งเตือนอัตโนมัติ)
            </label>
            <input
              type="text"
              value={lineToken}
              onChange={(e) => setLineToken(e.target.value)}
              placeholder="วาง LINE Notify Token ที่นี่"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              สร้าง Token ได้ฟรีจาก <a href="https://notify-bot.line.me" target="_blank" rel="noreferrer" className="text-sky-600 underline">notify-bot.line.me</a> เพื่อส่งแจ้งเตือนเคสใหม่และ Under-Triage Alert เข้ากลุ่ม LINE
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Google Apps Script Web App URL (ถ้าเชื่อมต่อ Web App จริง)
            </label>
            <input
              type="text"
              value={gasWebappUrl}
              onChange={(e) => setGasWebappUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />
          </div>

          {/* Sound Alert Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-semibold text-slate-800 block text-xs">ระบบเสียงแจ้งเตือนเคสใหม่ (ER Audio Alert)</span>
              <span className="text-[11px] text-slate-500">ส่งเสียงสัญญาณเมื่อมีผู้ป่วยฉุกเฉินระดับ 1 และ 2 เข้ามา</span>
            </div>
            <button
              type="button"
              onClick={() => setEnableSound(!enableSound)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                enableSound ? 'bg-[#1b5e20] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
            </button>
          </div>

          {/* Test Notification Banner */}
          {testResult && (
            <div className={`p-3 rounded-lg text-xs ${testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {testResult.message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestLineNotify}
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>📲</span>
              <span>ทดสอบส่งแจ้งเตือน LINE Notify</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="bg-[#1b5e20] hover:bg-[#144918] text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
          >
            บันทึกการตั้งค่า
          </button>
        </div>

      </div>
    </div>
  );
};
