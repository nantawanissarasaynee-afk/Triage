import * as XLSX from 'xlsx';
import { Patient } from '../types/triage';

export const HOSPITAL_LOGO_PATH = '/assets/aistudio/IMG_1767_3b31df57.webp';
export const DEFAULT_HOSPITAL_NAME = 'โรงพยาบาลหลวงพ่อเปิ่น';
export const DEFAULT_NURSE_ADMIN = 'พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ';
export const DEFAULT_LINE_OPENCHAT_NAME = 'Triage LPH';
export const DEFAULT_LINE_OPENCHAT_URL = 'https://line.me/ti/g2/V1UNTdetwPj4fS9-3Z3mzS3r-pzF8klqZLmyaQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default';

/**
 * ส่งออกข้อมูลผู้ป่วย Triage เป็นไฟล์ Excel (.xlsx) ภาษาไทย
 */
export function exportPatientsToExcel(patients: Patient[], filenamePrefix = 'Triage_LuangPhorPern_Hospital') {
  if (!patients || patients.length === 0) {
    alert('ไม่มีข้อมูลผู้ป่วยสำหรับส่งออก');
    return;
  }

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = `${filenamePrefix}_${dateStr}.xlsx`;

  // สร้างแถวข้อมูลภาษาไทย
  const rows = patients.map((p, index) => ({
    'ลำดับ': index + 1,
    'รหัส Triage': p.id,
    'วันเวลาที่มา': p.visitDateTime || p.timestamp,
    'HN': p.hn || '-',
    'เลขบัตรประชาชน (CID)': p.cid || '-',
    'คำนำหน้า': p.prefix,
    'ชื่อ-นามสกุล': p.fullName,
    'อายุ (ปี)': p.age,
    'ระดับ Triage': `Level ${p.triageLevel}`,
    'ความรุนแรง': p.triageLevelName,
    'จุดบริการ': p.servicePoint,
    'อาการสำคัญ (Chief Complaint)': p.chiefComplaint,
    'ความดันโลหิต BP (mmHg)': `${p.sbp}/${p.dbp}`,
    'ชีพจร PR (/min)': p.pr,
    'หายใจ RR (/min)': p.rr,
    'ออกซิเจน SpO2 (%)': p.o2Sat,
    'อุณหภูมิ Temp (°C)': p.temp,
    'GCS (3-15)': p.gcs,
    'AVPU': p.avpu,
    'Pain Score (0-10)': p.painScore,
    'SIRS Score (0-4)': p.sirsScore,
    'Airway': p.airway,
    'Lung Sound': p.lungSound,
    'CRT': p.crt,
    'Bleeding': p.bleeding,
    'หมายเหตุ/การดูแลเบื้องต้น': p.note || '-',
    'ผู้คัดกรอง': p.staffName,
    'สถานะผู้ป่วย': p.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // กำหนดความกว้างคอลัมน์อัตโนมัติ
  const colWidths = [
    { wch: 6 },  // ลำดับ
    { wch: 22 }, // รหัส Triage
    { wch: 18 }, // วันเวลา
    { wch: 12 }, // HN
    { wch: 16 }, // CID
    { wch: 10 }, // คำนำหน้า
    { wch: 22 }, // ชื่อ-สกุล
    { wch: 8 },  // อายุ
    { wch: 12 }, // ระดับ
    { wch: 16 }, // ความรุนแรง
    { wch: 10 }, // จุดบริการ
    { wch: 35 }, // อาการสำคัญ
    { wch: 14 }, // BP
    { wch: 10 }, // PR
    { wch: 10 }, // RR
    { wch: 12 }, // SpO2
    { wch: 12 }, // Temp
    { wch: 10 }, // GCS
    { wch: 8 },  // AVPU
    { wch: 12 }, // Pain
    { wch: 12 }, // SIRS
    { wch: 14 }, // Airway
    { wch: 14 }, // Lung
    { wch: 12 }, // CRT
    { wch: 14 }, // Bleeding
    { wch: 30 }, // หมายเหตุ
    { wch: 22 }, // ผู้คัดกรอง
    { wch: 12 }  // สถานะ
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ผู้ป่วย Triage');

  XLSX.writeFile(workbook, filename);
}

/**
 * ส่งออกรายงานสรุป PDF / พิมพ์ พร้อมหัวกระดาษและตราสัญลักษณ์ รพ.หลวงพ่อเปิ่น
 */
export function exportPatientsToPrintPdf(patients: Patient[], options?: {
  title?: string;
  hospitalName?: string;
  nurseName?: string;
}) {
  const hospital = options?.hospitalName || DEFAULT_HOSPITAL_NAME;
  const nurse = options?.nurseName || DEFAULT_NURSE_ADMIN;
  const title = options?.title || 'รายงานสรุปการคัดกรองผู้ป่วยฉุกเฉิน (MOPH ED Triage)';
  const now = new Date();
  const printDateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear() + 543} เวลา ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

  // สร้างหน้าต่างพิมพ์รายงานที่เป็นเอกสารทางการ
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const levelColorMap: Record<number, string> = {
    1: '#dc2626',
    2: '#e11d48',
    3: '#d97706',
    4: '#16a34a',
    5: '#64748b'
  };

  let rowsHtml = '';
  patients.forEach((p, index) => {
    const color = levelColorMap[p.triageLevel] || '#475569';
    rowsHtml += `
      <tr>
        <td style="text-align: center; font-weight: bold;">${index + 1}</td>
        <td>${p.visitDateTime || p.timestamp}</td>
        <td><strong>${p.hn || '-'}</strong></td>
        <td>${p.prefix} ${p.fullName}</td>
        <td style="text-align: center;">${p.age}</td>
        <td style="text-align: center;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-weight: bold; font-size: 11px; color: ${color}; border: 1px solid ${color};">
            Level ${p.triageLevel} (${p.triageLevelName})
          </span>
        </td>
        <td style="text-align: center;">${p.servicePoint}</td>
        <td>${p.chiefComplaint}</td>
        <td style="text-align: center; font-family: monospace;">${p.sbp}/${p.dbp}</td>
        <td style="text-align: center; font-family: monospace;">${p.pr}</td>
        <td style="text-align: center; font-family: monospace;">${p.o2Sat}%</td>
        <td>${p.staffName}</td>
      </tr>
    `;
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${hospital}</title>
      <style>
        body {
          font-family: 'Sarabun', 'Prompt', sans-serif;
          margin: 20px;
          color: #0f172a;
          font-size: 12px;
          line-height: 1.4;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 2px solid #1b5e20;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .logo {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }
        .header-text h1 {
          margin: 0;
          font-size: 18px;
          color: #1b5e20;
        }
        .header-text h2 {
          margin: 2px 0 0 0;
          font-size: 14px;
          color: #334155;
          font-weight: 600;
        }
        .meta-bar {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 6px 8px;
          text-align: left;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          font-size: 11px;
        }
        .signature-block {
          margin-top: 40px;
          display: flex;
          justify-content: flex-end;
        }
        .sig-box {
          text-align: center;
          width: 250px;
        }
        .sig-line {
          border-bottom: 1px dotted #475569;
          height: 40px;
          margin-bottom: 8px;
        }
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${HOSPITAL_LOGO_PATH}" alt="Logo" class="logo" onerror="this.style.display='none'">
        <div class="header-text">
          <h1>${hospital}</h1>
          <h2>${title}</h2>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            งานอุบัติเหตุ-ฉุกเฉินและนิติเวช | ระบบคัดกรอง 5 ระดับ MOPH ED Triage
          </div>
        </div>
      </div>

      <div class="meta-bar">
        <span>พิมพ์เมื่อ: ${printDateStr}</span>
        <span>พยาบาลผู้ดูแลระบบ: <strong>${nurse}</strong></span>
        <span>จำนวนผู้ป่วยทั้งหมด: <strong>${patients.length}</strong> ราย</span>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">ที่</th>
            <th style="width: 80px;">วัน-เวลา</th>
            <th style="width: 60px;">HN</th>
            <th style="width: 130px;">ชื่อ-นามสกุล</th>
            <th style="width: 35px; text-align: center;">อายุ</th>
            <th style="width: 120px; text-align: center;">ระดับ Triage</th>
            <th style="width: 45px; text-align: center;">จุด</th>
            <th>อาการสำคัญ (Chief Complaint)</th>
            <th style="width: 65px; text-align: center;">BP</th>
            <th style="width: 40px; text-align: center;">PR</th>
            <th style="width: 45px; text-align: center;">SpO2</th>
            <th style="width: 110px;">ผู้คัดกรอง</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="signature-block">
        <div class="sig-box">
          <div class="sig-line"></div>
          <div>( ${nurse} )</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">พยาบาลผู้ดูแลระบบ / ผู้รับรองข้อมูล</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
