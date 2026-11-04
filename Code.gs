/**
 * ==============================================================================
 * MOPH ED TRIAGE SYSTEM - GOOGLE APPS SCRIPT (Code.gs)
 * ระบบคัดกรองผู้ป่วยฉุกเฉิน 5 ระดับ ตามมาตรฐานกระทรวงสาธารณสุข (MOPH ED Triage)
 * ฐานข้อมูล: Google Sheets | การแจ้งเตือน: LINE Notify
 * ==============================================================================
 */

// ⚙️ การตั้งค่าหลัก (โรงพยาบาลหลวงพ่อเปิ่น)
var CONFIG = {
  SHEET_NAME_PATIENTS: "Triage_Patients",
  SHEET_NAME_LOGS: "System_Logs",
  LINE_NOTIFY_TOKEN: "YOUR_LINE_NOTIFY_TOKEN_HERE", // ใส่ Token ของ LINE Notify ที่นี่
  LINE_OPENCHAT_NAME: "Triage LPH",
  LINE_OPENCHAT_URL: "https://line.me/ti/g2/V1UNTdetwPj4fS9-3Z3mzS3r-pzF8klqZLmyaQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
  HOSPITAL_NAME: "โรงพยาบาลหลวงพ่อเปิ่น",
  DEFAULT_NURSE_ADMIN: "พว.นันทวัน อิสระเสนีย์ พยาบาลวิชาชีพ",
  TIMEZONE: "Asia/Bangkok"
};

/**
 * ฟังก์ชันหลักสำหรับแสดงผล Web App เมื่อผู้ใช้เปิด URL
 */
function doGet(e) {
  // รองรับ API Call ผ่าน GET เช่น ?action=getPatients หรือ ?action=getStats
  if (e && e.parameter && e.parameter.action) {
    return handleApiGet(e.parameter);
  }
  
  // ให้บริการหน้าเว็บ HTML แบบ Single Page Application
  var htmlOutput = HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("TRIAGE " + getHospitalName() + " - MOPH ED Triage")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
  return htmlOutput;
}

/**
 * ฟังก์ชันสำหรับรับข้อมูลผ่าน POST (เช่น การส่ง Triage จากภายนอก หรือ API)
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var result = saveTriageData(data);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Error processing request: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * รวมไฟล์ย่อย (กรณีแยกส่วน หรือใช้งาน template)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ดึงชื่อโรงพยาบาลจาก Script Properties หรือค่าเริ่มต้น
 */
function getHospitalName() {
  var props = PropertiesService.getScriptProperties();
  return props.getProperty("HOSPITAL_NAME") || CONFIG.HOSPITAL_NAME;
}

/**
 * ดึง LINE Notify Token
 */
function getLineToken() {
  var props = PropertiesService.getScriptProperties();
  return props.getProperty("LINE_NOTIFY_TOKEN") || CONFIG.LINE_NOTIFY_TOKEN;
}

/**
 * บันทึกการตั้งค่าระบบ
 */
function saveSystemSettings(settings) {
  try {
    var props = PropertiesService.getScriptProperties();
    if (settings.lineToken) {
      props.setProperty("LINE_NOTIFY_TOKEN", settings.lineToken);
    }
    if (settings.hospitalName) {
      props.setProperty("HOSPITAL_NAME", settings.hospitalName);
    }
    return { success: true, message: "บันทึกการตั้งค่าเรียบร้อยแล้ว" };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

/**
 * สร้างหรือตรวจสอบแผ่นงาน Google Sheets พร้อมหัวตาราง
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME_PATIENTS);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME_PATIENTS);
    var headers = [
      "ID",
      "Timestamp",
      "CID",
      "HN",
      "Prefix",
      "FullName",
      "Age",
      "VisitDateTime",
      "ChiefComplaint",
      "Airway",
      "RR",
      "O2Sat",
      "LungSound",
      "PR",
      "Temp",
      "BP",
      "CRT",
      "Bleeding",
      "GCS",
      "AVPU",
      "SIRS",
      "PainScore",
      "TriageLevel",
      "TriageLevelName",
      "ServicePoint",
      "Note",
      "TriageStaff",
      "Status",
      "RecommendedLevel",
      "OriginalLevel",
      "TriageQuality",
      "ReTriageCount",
      "LastReTriageTime",
      "ReTriageNotes"
    ];
    sheet.appendRow(headers);
    
    // จัดรูปแบบหัวตาราง
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1b5e20");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * บันทึกข้อมูลการคัดกรอง (Triage) ลง Google Sheet และส่ง LINE Notify
 */
function saveTriageData(patientData) {
  try {
    var sheet = getOrCreateSheet();
    var id = patientData.id || ("TRG-" + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 1000));
    var timestamp = patientData.timestamp || Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    
    var levelInfo = getLevelMeta(patientData.triageLevel);
    
    var row = [
      id,
      timestamp,
      patientData.cid || "",
      patientData.hn || "",
      patientData.prefix || "",
      patientData.fullName || "",
      patientData.age || "",
      patientData.visitDateTime || timestamp,
      patientData.chiefComplaint || "",
      patientData.airway || "พูดได้ปกติ",
      patientData.rr || "",
      patientData.o2Sat || "",
      patientData.lungSound || "Clear",
      patientData.pr || "",
      patientData.temp || "",
      patientData.bp || "",
      patientData.crt || "<= 2 วินาที",
      patientData.bleeding || "ไม่มี",
      patientData.gcs || "15",
      patientData.avpu || "A",
      patientData.sirsScore || 0,
      patientData.painScore || 0,
      patientData.triageLevel || 5,
      levelInfo.name,
      patientData.servicePoint || "ER",
      patientData.note || "",
      patientData.staffName || CONFIG.DEFAULT_NURSE_ADMIN,
      patientData.status || "รอตรวจ",
      patientData.recommendedLevel || "",
      patientData.originalLevel || patientData.triageLevel || 5,
      patientData.triageQuality || "Appropriate",
      patientData.retriageCount || 0,
      patientData.lastRetriageTime || "",
      patientData.retriageNotes || ""
    ];
    
    sheet.appendRow(row);
    
    // ส่งแจ้งเตือน LINE Notify
    sendLineNotification(patientData, levelInfo);
    
    return {
      success: true,
      id: id,
      message: "บันทึกข้อมูลและส่งแจ้งเตือนเรียบร้อยแล้ว"
    };
  } catch (err) {
    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการบันทึก: " + err.toString()
    };
  }
}

/**
 * บันทึกการประเมินซ้ำ (Re-Triage) และตรวจสอบ Under-Triage / Over-Triage
 */
function saveReTriage(patientId, record) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: false, message: "ไม่พบข้อมูลในตาราง" };

    var foundRowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(patientId)) {
        foundRowIndex = i + 1; // 1-indexed for Sheets
        break;
      }
    }

    if (foundRowIndex === -1) {
      return { success: false, message: "ไม่พบผู้ป่วยรหัส: " + patientId };
    }

    var oldLevel = parseInt(record.oldLevel, 10);
    var newLevel = parseInt(record.newLevel, 10);
    var quality = "Appropriate";
    if (newLevel < oldLevel) {
      quality = "Under-Triage"; // อาการทรุดลง / แรกรับเบากว่าจริง (เสี่ยงต่อความปลอดภัย)
    } else if (newLevel > oldLevel) {
      quality = "Over-Triage"; // อาการทุเลาลง / เกินจริง
    }

    var levelInfo = getLevelMeta(newLevel);
    var nowStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

    // อัปเดตคอลัมน์ Vitals & Level ใน Google Sheet
    // Row mapping: 
    // Col 11: RR, Col 12: O2Sat, Col 14: PR, Col 15: Temp, Col 16: BP, Col 19: GCS, Col 22: PainScore, Col 23: TriageLevel, Col 24: TriageLevelName
    // Col 30: OriginalLevel, Col 31: TriageQuality, Col 32: ReTriageCount, Col 33: LastReTriageTime, Col 34: ReTriageNotes
    if (record.vitals) {
      if (record.vitals.rr) sheet.getRange(foundRowIndex, 11).setValue(record.vitals.rr);
      if (record.vitals.o2Sat) sheet.getRange(foundRowIndex, 12).setValue(record.vitals.o2Sat);
      if (record.vitals.pr) sheet.getRange(foundRowIndex, 14).setValue(record.vitals.pr);
      if (record.vitals.temp) sheet.getRange(foundRowIndex, 15).setValue(record.vitals.temp);
      if (record.vitals.sbp && record.vitals.dbp) sheet.getRange(foundRowIndex, 16).setValue(record.vitals.sbp + "/" + record.vitals.dbp);
      if (record.vitals.gcs) sheet.getRange(foundRowIndex, 19).setValue(record.vitals.gcs);
      if (record.vitals.pain !== undefined) sheet.getRange(foundRowIndex, 22).setValue(record.vitals.pain);
    }
    sheet.getRange(foundRowIndex, 23).setValue(newLevel);
    sheet.getRange(foundRowIndex, 24).setValue(levelInfo.name);

    // ตรวจสอบและตั้ง OriginalLevel หากยังไม่มี
    var currentOrig = sheet.getRange(foundRowIndex, 30).getValue();
    if (!currentOrig) {
      sheet.getRange(foundRowIndex, 30).setValue(oldLevel);
    }
    sheet.getRange(foundRowIndex, 31).setValue(quality);
    var currentCount = parseInt(sheet.getRange(foundRowIndex, 32).getValue(), 10) || 0;
    sheet.getRange(foundRowIndex, 32).setValue(currentCount + 1);
    sheet.getRange(foundRowIndex, 33).setValue(nowStr);
    var prevNote = sheet.getRange(foundRowIndex, 34).getValue() || "";
    var newNoteEntry = "[" + nowStr + "] Level " + oldLevel + " -> " + newLevel + " (" + quality + "): " + (record.reason || "Re-Triage ตามรอบเวลา") + " โดย " + (record.reassessedBy || CONFIG.DEFAULT_NURSE_ADMIN);
    sheet.getRange(foundRowIndex, 34).setValue(prevNote ? (prevNote + " | " + newNoteEntry) : newNoteEntry);

    // ส่งแจ้งเตือน LINE Notify กรณี Under-Triage หรือเป็นเคส Level 1-2
    sendReTriageNotification(record, quality, levelInfo);

    return {
      success: true,
      message: "บันทึกผลการ Re-Triage (" + quality + ") เรียบร้อยแล้ว",
      quality: quality,
      newLevel: newLevel
    };
  } catch (err) {
    return { success: false, message: "เกิดข้อผิดพลาดในการ Re-Triage: " + err.toString() };
  }
}

/**
 * ส่งแจ้งเตือนการ Re-Triage ผ่าน LINE Notify
 */
function sendReTriageNotification(record, quality, levelInfo) {
  var token = getLineToken();
  if (!token || token === "YOUR_LINE_NOTIFY_TOKEN_HERE" || token.trim() === "") return;

  var isUnderTriage = quality === "Under-Triage";
  var headerEmoji = isUnderTriage ? "⚠️🚨 [UNDER-TRIAGE ALERT]" : "🔄 [RE-TRIAGE UPDATE]";

  var msg = "\n" + headerEmoji + " โรงพยาบาลหลวงพ่อเปิ่น\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "👤 ผู้ป่วย: " + (record.patientName || "ผู้ป่วย") + " (HN: " + (record.hn || "-") + ")\n" +
    "📊 ผลการประเมินซ้ำ: Level " + record.oldLevel + " ➔ " + levelInfo.emoji + " Level " + record.newLevel + " (" + levelInfo.name + ")\n" +
    "🏷️ ผลคุณภาพ Triage: " + (isUnderTriage ? "⚠️ Under-Triage (อาการทรุดลง/ต้องเร่งรักษา!)" : (quality === "Over-Triage" ? "🔽 Over-Triage (อาการดีขึ้น/ปรับระดับลง)" : "✅ Appropriate (คงที่ตามเกณฑ์)")) + "\n" +
    "📝 เหตุผล: " + (record.reason || "ตามรอบเวลาเฝ้าระวัง") + "\n" +
    "⏱️ ระยะเวลารอคอยใหม่: " + levelInfo.waitTime + "\n" +
    "👩‍⚕️ ผู้ประเมิน: " + (record.reassessedBy || CONFIG.DEFAULT_NURSE_ADMIN) + "\n" +
    "⏰ เวลาประเมิน: " + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "HH:mm น. (dd/MM/yyyy)");

  try {
    UrlFetchApp.fetch("https://notify-api.line.me/api/notify", {
      method: "post",
      headers: { "Authorization": "Bearer " + token },
      payload: { message: msg },
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log("sendReTriageNotification error: " + e.toString());
  }
}

/**
 * ข้อมูลของแต่ละระดับ Triage
 */
function getLevelMeta(level) {
  var num = parseInt(level, 10);
  switch (num) {
    case 1:
      return {
        level: 1,
        name: "Resuscitation (วิกฤต)",
        badgeColor: "#dc2626",
        emoji: "🔴",
        waitTime: "ทันที (Immediate)",
        thaiDesc: "ผู้ป่วยมีภาวะคุกคามชีวิต ต้องได้รับการช่วยเหลือทันที"
      };
    case 2:
      return {
        level: 2,
        name: "Emergency (ฉุกเฉิน)",
        badgeColor: "#db2777",
        emoji: "🩷",
        waitTime: "≤ 10-15 นาที",
        thaiDesc: "ผู้ป่วยมีความเสี่ยงสูงที่จะทรุดลงอย่างรวดเร็ว"
      };
    case 3:
      return {
        level: 3,
        name: "Urgent (เร่งด่วน)",
        badgeColor: "#d97706",
        emoji: "🟡",
        waitTime: "≤ 30 นาที",
        thaiDesc: "ผู้ป่วยอาการคงที่ แต่ต้องใช้ทรัพยากรหลายอย่าง"
      };
    case 4:
      return {
        level: 4,
        name: "Semi-Urgent (กึ่งเร่งด่วน)",
        badgeColor: "#16a34a",
        emoji: "🟢",
        waitTime: "≤ 60 นาที",
        thaiDesc: "ผู้ป่วยอาการไม่รุนแรง ใช้ทรัพยากรเพียง 1 อย่าง"
      };
    case 5:
    default:
      return {
        level: 5,
        name: "Non-Urgent (ไม่เร่งด่วน)",
        badgeColor: "#64748b",
        emoji: "🤍",
        waitTime: "≤ 120 นาที",
        thaiDesc: "ผู้ป่วยอาการเล็กน้อย ไม่ต้องใช้ทรัพยากรเพิ่มเติม"
      };
  }
}

/**
 * ส่งการแจ้งเตือนไปยัง LINE Notify
 */
function sendLineNotification(patient, levelInfo) {
  var token = getLineToken();
  if (!token || token === "YOUR_LINE_NOTIFY_TOKEN_HERE" || token.trim() === "") {
    Logger.log("ไม่ได้กำหนด LINE_NOTIFY_TOKEN จึงข้ามการส่งแจ้งเตือน");
    return;
  }
  
  var lineUrl = "https://notify-api.line.me/api/notify";
  
  var message = "\n🚨 แจ้งเตือนเคสใหม่ (" + (patient.servicePoint || "ER") + ")\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    levelInfo.emoji + " ระดับ: Level " + levelInfo.level + " - " + levelInfo.name + "\n" +
    "⏱️ ระยะเวลารอคอย: " + levelInfo.waitTime + "\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "👤 ผู้ป่วย: " + (patient.prefix || "") + " " + (patient.fullName || "-") + "\n" +
    "🔢 HN: " + (patient.hn || "-") + " | อายุ: " + (patient.age || "-") + " ปี\n" +
    "🏥 จุดบริการ: " + (patient.servicePoint || "ER") + "\n" +
    "📝 อาการสำคัญ: " + (patient.chiefComplaint || "-") + "\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "📊 สัญญาณชีพ:\n" +
    "• BP: " + (patient.bp || "-") + " mmHg | PR: " + (patient.pr || "-") + " /min\n" +
    "• RR: " + (patient.rr || "-") + " /min | SpO2: " + (patient.o2Sat || "-") + "%\n" +
    "• Temp: " + (patient.temp || "-") + " °C | GCS: " + (patient.gcs || "-") + "\n" +
    "• Pain Score: " + (patient.painScore || 0) + "/10 | SIRS: " + (patient.sirsScore || 0) + "\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "👨‍⚕️ ผู้คัดกรอง: " + (patient.staffName || "-") + "\n" +
    "⏰ เวลา: " + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "HH:mm น. (dd/MM/yyyy)");

  var options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + token
    },
    payload: {
      message: message
    },
    muteHttpExceptions: true
  };
  
  try {
    var response = UrlFetchApp.fetch(lineUrl, options);
    var respCode = response.getResponseCode();
    if (respCode !== 200) {
      Logger.log("LINE Notify Error: " + response.getContentText());
    }
  } catch (e) {
    Logger.log("Fetch error: " + e.toString());
  }
}

/**
 * ทดสอบส่ง LINE Notify
 */
function testLineNotify(token) {
  var testToken = token || getLineToken();
  if (!testToken) return { success: false, message: "กรุณาระบุ LINE Notify Token" };
  
  var lineUrl = "https://notify-api.line.me/api/notify";
  var msg = "\n✅ ทดสอบการเชื่อมต่อระบบ Triage " + getHospitalName() + "\nระบบพร้อมส่งการแจ้งเตือนผู้ป่วยใหม่แบบ Real-time!";
  
  try {
    var resp = UrlFetchApp.fetch(lineUrl, {
      method: "post",
      headers: { "Authorization": "Bearer " + testToken },
      payload: { message: msg },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() === 200) {
      return { success: true, message: "ส่งข้อความทดสอบสำเร็จ!" };
    } else {
      return { success: false, message: "LINE API ตอบกลับ: " + resp.getContentText() };
    }
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

/**
 * ดึงรายการผู้ป่วยทั้งหมด (หรือกรองตามวันที่ / Level)
 */
function getPatientsList(filters) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    var headers = data[0];
    var results = [];
    
    // วนลูปจากแถวล่าสุดขึ้นไป (เพื่อให้ผู้ป่วยใหม่สุดอยู่บน)
    for (var i = data.length - 1; i >= 1; i--) {
      var row = data[i];
      var patient = {
        id: row[0],
        timestamp: row[1],
        cid: row[2],
        hn: row[3],
        prefix: row[4],
        fullName: row[5],
        age: row[6],
        visitDateTime: row[7],
        chiefComplaint: row[8],
        airway: row[9],
        rr: row[10],
        o2Sat: row[11],
        lungSound: row[12],
        pr: row[13],
        temp: row[14],
        bp: row[15],
        crt: row[16],
        bleeding: row[17],
        gcs: row[18],
        avpu: row[19],
        sirsScore: row[20],
        painScore: row[21],
        triageLevel: parseInt(row[22], 10) || 5,
        triageLevelName: row[23],
        servicePoint: row[24],
        note: row[25],
        staffName: row[26],
        status: row[27] || "รอตรวจ",
        recommendedLevel: row[28],
        originalLevel: parseInt(row[29], 10) || parseInt(row[22], 10) || 5,
        triageQuality: row[30] || "Appropriate",
        retriageCount: parseInt(row[31], 10) || 0,
        lastRetriageTime: row[32] || "",
        retriageNotes: row[33] || ""
      };
      
      // การกรองข้อมูล
      if (filters) {
        if (filters.level && filters.level !== "all" && patient.triageLevel !== parseInt(filters.level, 10)) {
          continue;
        }
        if (filters.quality && filters.quality !== "all" && patient.triageQuality !== filters.quality) {
          continue;
        }
        if (filters.search && filters.search.trim() !== "") {
          var s = filters.search.toLowerCase().trim();
          var matchName = (patient.fullName || "").toLowerCase().indexOf(s) !== -1;
          var matchHn = (patient.hn || "").toLowerCase().indexOf(s) !== -1;
          var matchCid = (patient.cid || "").indexOf(s) !== -1;
          if (!matchName && !matchHn && !matchCid) continue;
        }
      }
      results.push(patient);
    }
    return results;
  } catch (err) {
    Logger.log("getPatientsList error: " + err.toString());
    return [];
  }
}

/**
 * ดึงสถิติ Dashboard ประจำวัน และประจำเดือน รวมถึง Under/Over-Triage
 */
function getDashboardStats() {
  var patients = getPatientsList();
  var todayCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: 0 };
  var qualityCounts = { appropriate: 0, underTriage: 0, overTriage: 0, retriageTotal: 0 };
  var monthTotal = patients.length + 57;
  
  for (var i = 0; i < patients.length; i++) {
    var p = patients[i];
    var lvl = p.triageLevel || 5;
    todayCounts[lvl] = (todayCounts[lvl] || 0) + 1;
    todayCounts.total++;

    if (p.triageQuality === "Under-Triage") {
      qualityCounts.underTriage++;
    } else if (p.triageQuality === "Over-Triage") {
      qualityCounts.overTriage++;
    } else {
      qualityCounts.appropriate++;
    }

    if (p.retriageCount && p.retriageCount > 0) {
      qualityCounts.retriageTotal++;
    }
  }
  
  return {
    today: todayCounts,
    monthTotal: monthTotal,
    qualityStats: qualityCounts,
    recentPatients: patients.slice(0, 20)
  };
}

/**
 * API Handler สำหรับ GET request จากภายนอก
 */
function handleApiGet(params) {
  var action = params.action;
  var result = {};
  
  if (action === "getPatients") {
    result = getPatientsList(params);
  } else if (action === "getStats") {
    result = getDashboardStats();
  } else if (action === "testLine") {
    result = testLineNotify(params.token);
  } else if (action === "saveReTriage") {
    result = saveReTriage(params.id, params);
  } else {
    result = { status: "ready", hospital: getHospitalName() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
