import React, { useState } from 'react';

interface GasCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasCodeModal: React.FC<GasCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'codegs' | 'indexhtml' | 'guide'>('codegs');
  const [copySuccess, setCopySuccess] = useState('');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(`คัดลอกโค้ด ${type} สำเร็จแล้ว! นำไปวางใน Google Apps Script ได้ทันที`);
    setTimeout(() => setCopySuccess(''), 4000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#1b5e20] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <div>
              <h3 className="font-bold text-base leading-tight">
                โค้ดฉบับสมบูรณ์ Google Apps Script (Code.gs & index.html)
              </h3>
              <p className="text-xs text-white/80">
                Single-file HTML + Google Apps Script V8 + Google Sheets + LINE Notify
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

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('codegs')}
            className={`py-2 px-4 rounded-t-lg transition-colors cursor-pointer border-t border-x ${
              activeTab === 'codegs'
                ? 'bg-white text-[#1b5e20] border-slate-200 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            📄 Code.gs (Apps Script Backend)
          </button>
          <button
            onClick={() => setActiveTab('indexhtml')}
            className={`py-2 px-4 rounded-t-lg transition-colors cursor-pointer border-t border-x ${
              activeTab === 'indexhtml'
                ? 'bg-white text-[#1b5e20] border-slate-200 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            🌐 index.html (Single-File Web App)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-4 rounded-t-lg transition-colors cursor-pointer border-t border-x ${
              activeTab === 'guide'
                ? 'bg-white text-[#1b5e20] border-slate-200 border-b-transparent shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            📋 วิธีติดตั้งใช้งาน (Step-by-Step)
          </button>
        </div>

        {/* Copy Notification Toast */}
        {copySuccess && (
          <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-medium">
            ✅ {copySuccess}
          </div>
        )}

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-900 text-slate-100 font-mono text-xs">
          
          {activeTab === 'codegs' && (
            <div className="relative">
              <div className="sticky top-0 z-10 flex justify-end gap-2 pb-2">
                <button
                  onClick={() => {
                    fetch('/Code.gs')
                      .then((r) => r.text())
                      .then((code) => copyToClipboard(code, 'Code.gs'))
                      .catch(() => copyToClipboard(GAS_CODE_GS_SAMPLE, 'Code.gs'));
                  }}
                  className="bg-[#1b5e20] hover:bg-[#144918] text-white px-3 py-1.5 rounded text-xs font-sans font-semibold cursor-pointer shadow-sm"
                >
                  📋 คัดลอก Code.gs ทั้งหมด
                </button>
                <button
                  onClick={() => {
                    fetch('/Code.gs')
                      .then((r) => r.text())
                      .then((code) => downloadFile('Code.gs', code))
                      .catch(() => downloadFile('Code.gs', GAS_CODE_GS_SAMPLE));
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-sans font-semibold cursor-pointer"
                >
                  💾 ดาวน์โหลด Code.gs
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
                {GAS_CODE_GS_SAMPLE}
              </pre>
            </div>
          )}

          {activeTab === 'indexhtml' && (
            <div className="relative">
              <div className="sticky top-0 z-10 flex justify-end gap-2 pb-2">
                <button
                  onClick={() => {
                    fetch('/google-apps-script-index.html')
                      .then((r) => r.text())
                      .then((code) => copyToClipboard(code, 'index.html'))
                      .catch(() => copyToClipboard(GAS_INDEX_HTML_SAMPLE, 'index.html'));
                  }}
                  className="bg-[#1b5e20] hover:bg-[#144918] text-white px-3 py-1.5 rounded text-xs font-sans font-semibold cursor-pointer shadow-sm"
                >
                  📋 คัดลอก index.html ทั้งหมด
                </button>
                <button
                  onClick={() => {
                    fetch('/google-apps-script-index.html')
                      .then((r) => r.text())
                      .then((code) => downloadFile('index.html', code))
                      .catch(() => downloadFile('index.html', GAS_INDEX_HTML_SAMPLE));
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-sans font-semibold cursor-pointer"
                >
                  💾 ดาวน์โหลด index.html
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg overflow-x-auto text-[11px] leading-relaxed text-sky-300">
                {GAS_INDEX_HTML_SAMPLE}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="p-4 bg-slate-800 text-slate-100 font-sans rounded-xl space-y-4 text-xs sm:text-sm">
              <h4 className="text-base font-bold text-emerald-400">
                🚀 วิธีการนำไปติดตั้งใช้งานจริงบน Google Apps Script + Google Sheets
              </h4>

              <div className="space-y-3 divide-y divide-slate-700">
                
                <div className="pt-2">
                  <h5 className="font-bold text-white text-sm mb-1">ขั้นตอนที่ 1 : สร้าง Google Sheet</h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>เปิด <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-sky-400 underline">sheets.new</a> ในเว็บเบราว์เซอร์</li>
                    <li>ตั้งชื่อแผ่นงาน เช่น <code>ระบบ Triage โรงพยาบาลหลวงพ่อเปิ่น</code></li>
                    <li>ไปที่เมนู <strong>ส่วนขยาย (Extensions)</strong> &gt; <strong>Apps Script</strong></li>
                  </ol>
                </div>

                <div className="pt-3">
                  <h5 className="font-bold text-white text-sm mb-1">ขั้นตอนที่ 2 : ใส่โค้ด Code.gs และ index.html</h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>ในหน้า Apps Script ให้ลบโค้ดเดิมใน <code>Code.gs</code> ออกทั้งหมด แล้วนำโค้ดจากแท็บ <strong>Code.gs</strong> ไปวางแทนที่</li>
                    <li>กดปุ่ม <strong>+ (เพิ่มไฟล์)</strong> &gt; เลือก <strong>HTML</strong> &gt; ตั้งชื่อไฟล์ว่า <code>index</code> (จะได้ไฟล์ <code>index.html</code>)</li>
                    <li>ลบโค้ดใน <code>index.html</code> แล้วนำโค้ดจากแท็บ <strong>index.html</strong> ไปวางแทนที่ทั้งหมด</li>
                    <li>กดปุ่ม <strong>บันทึกโครงการ (รูปแผ่นดิสก์)</strong></li>
                  </ol>
                </div>

                <div className="pt-3">
                  <h5 className="font-bold text-white text-sm mb-1">ขั้นตอนที่ 3 : ตั้งค่า LINE Notify Token</h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>ไปที่เว็บไซต์ <a href="https://notify-bot.line.me" target="_blank" rel="noreferrer" className="text-sky-400 underline">notify-bot.line.me</a> แล้วล็อกอินด้วยบัญชี LINE</li>
                    <li>เลือก <strong>ออกโทเค็น (Generate Token)</strong> &gt; ตั้งชื่อบอท (เช่น Triage Alert) และเลือกกลุ่ม LINE ที่ต้องการให้แจ้งเตือน</li>
                    <li>คัดลอก Token ที่ได้ นำไปใส่ในตัวแปร <code>CONFIG.LINE_NOTIFY_TOKEN</code> ใน <code>Code.gs</code> หรือกรอกผ่านหน้าจอตั้งค่าในเว็บแอป</li>
                  </ol>
                </div>

                <div className="pt-3">
                  <h5 className="font-bold text-white text-sm mb-1">ขั้นตอนที่ 4 : เผยแพร่เป็น Web App (Deploy)</h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>คลิกปุ่ม <strong>การทำให้ใช้งานได้ (Deploy)</strong> ที่มุมขวาบน &gt; เลือก <strong>การทำให้ใช้งานได้รายการใหม่ (New deployment)</strong></li>
                    <li>คลิกไอคอนฟันเฟือง &gt; เลือกประเภทเป็น <strong>เว็บแอปพลิเคชัน (Web app)</strong></li>
                    <li><strong>ดำเนินการในฐานะ (Execute as):</strong> ฉัน (บัญชี Google ของคุณ)</li>
                    <li><strong>ผู้มีสิทธิ์เข้าถึง (Who has access):</strong> ทุกคน (Anyone)</li>
                    <li>คลิก <strong>ทำให้ใช้งานได้ (Deploy)</strong> แล้วให้สิทธิ์การเข้าถึง (Authorize Access)</li>
                    <li>คัดลอก URL ของเว็บแอปที่ได้ นำไปเปิดใช้งานบนมือถือ แท็บเล็ต หรือคอมพิวเตอร์ในห้องฉุกเฉินได้ทันที!</li>
                  </ol>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span>ไฟล์ถูกบันทึกไว้ที่ <code>/Code.gs</code> และ <code>/google-apps-script-index.html</code> ใน workspace เรียบร้อยแล้ว</span>
          <button
            onClick={onClose}
            className="bg-[#1b5e20] hover:bg-[#144918] text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};

// Preview snippets
const GAS_CODE_GS_SAMPLE = `/**
 * MOPH ED TRIAGE SYSTEM - GOOGLE APPS SCRIPT (Code.gs)
 * Google Sheets Database + LINE Notify + MOPH 5-Level Criteria
 */

var CONFIG = {
  SHEET_NAME_PATIENTS: "Triage_Patients",
  LINE_NOTIFY_TOKEN: "YOUR_LINE_NOTIFY_TOKEN_HERE",
  LINE_OPENCHAT_NAME: "Triage LPH",
  LINE_OPENCHAT_URL: "https://line.me/ti/g2/V1UNTdetwPj4fS9-3Z3mzS3r-pzF8klqZLmyaQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
  HOSPITAL_NAME: "โรงพยาบาลหลวงพ่อเปิ่น",
  DEFAULT_NURSE_ADMIN: "พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ",
  TIMEZONE: "Asia/Bangkok"
};

function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    return handleApiGet(e.parameter);
  }
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("TRIAGE " + getHospitalName())
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var result = saveTriageData(data);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveTriageData(patientData) {
  var sheet = getOrCreateSheet();
  var id = "TRG-" + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 1000);
  var timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  var levelInfo = getLevelMeta(patientData.triageLevel);

  var row = [
    id, timestamp, patientData.cid, patientData.hn, patientData.prefix, patientData.fullName,
    patientData.age, patientData.visitDateTime, patientData.chiefComplaint, patientData.airway,
    patientData.rr, patientData.o2Sat, patientData.lungSound, patientData.pr, patientData.temp,
    patientData.bp, patientData.crt, patientData.bleeding, patientData.gcs, patientData.avpu,
    patientData.sirsScore, patientData.painScore, patientData.triageLevel, levelInfo.name,
    patientData.servicePoint, patientData.note, patientData.staffName, patientData.status, patientData.recommendedLevel
  ];

  sheet.appendRow(row);
  sendLineNotification(patientData, levelInfo);
  return { success: true, id: id };
}

// ดูโค้ดฉบับเต็มได้ในไฟล์ /Code.gs`;

const GAS_INDEX_HTML_SAMPLE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>TRIAGE โรงพยาบาลหลวงพ่อเปิ่น - ระบบคัดกรอง MOPH ED Triage 5 ระดับ</title>
  <style>
    /* Single-File CSS included */
    :root { --primary-green: #1b5e20; --color-lvl1: #dc2626; --color-lvl2: #e11d48; --color-lvl3: #d97706; --color-lvl4: #16a34a; --color-lvl5: #64748b; }
    ...
  </style>
</head>
<body>
  <!-- Full Single-File HTML5 + CSS3 + Vanilla JavaScript -->
  <!-- ดูโค้ดฉบับเต็มได้ในไฟล์ /google-apps-script-index.html -->
</body>
</html>`;
