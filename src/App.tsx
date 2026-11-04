import React, { useState, useEffect } from 'react';
import { Patient, HospitalSettings, ReTriageRecord } from './types/triage';
import { INITIAL_PATIENTS, playHospitalBeep, TRIAGE_LEVELS_META } from './services/triageLogic';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TriageFormView } from './components/TriageFormView';
import { TriageListView } from './components/TriageListView';
import { ReportView } from './components/ReportView';
import { QuickGuideModal } from './components/QuickGuideModal';
import { PatientDetailModal } from './components/PatientDetailModal';
import { ReTriageModal } from './components/ReTriageModal';
import { GasCodeModal } from './components/GasCodeModal';
import { SettingsModal } from './components/SettingsModal';

import { DEFAULT_HOSPITAL_NAME, DEFAULT_NURSE_ADMIN, HOSPITAL_LOGO_PATH, DEFAULT_LINE_OPENCHAT_NAME, DEFAULT_LINE_OPENCHAT_URL } from './services/exportService';

const DEFAULT_SETTINGS: HospitalSettings = {
  hospitalName: DEFAULT_HOSPITAL_NAME,
  staffName: DEFAULT_NURSE_ADMIN,
  logoUrl: HOSPITAL_LOGO_PATH,
  lineToken: '',
  lineOpenChatUrl: DEFAULT_LINE_OPENCHAT_URL,
  lineOpenChatName: DEFAULT_LINE_OPENCHAT_NAME,
  gasWebappUrl: '',
  sheetId: '',
  enableSound: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('triage_patients_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PATIENTS;
      }
    }
    return INITIAL_PATIENTS;
  });

  const [settings, setSettings] = useState<HospitalSettings>(() => {
    const saved = localStorage.getItem('triage_hospital_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure Luang Phor Pern hospital and nurse admin are preserved
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          hospitalName: DEFAULT_HOSPITAL_NAME,
          staffName: DEFAULT_NURSE_ADMIN,
          lineOpenChatUrl: DEFAULT_LINE_OPENCHAT_URL,
          lineOpenChatName: DEFAULT_LINE_OPENCHAT_NAME,
          logoUrl: HOSPITAL_LOGO_PATH
        };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Modals state
  const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(false);
  const [isGasCodeOpen, setIsGasCodeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isReTriageOpen, setIsReTriageOpen] = useState(false);
  const [patientToReTriage, setPatientToReTriage] = useState<Patient | null>(null);

  // Toast alert
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle saving Re-Triage evaluation
  const handleSaveReTriage = (patientId: string, record: ReTriageRecord) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const updatedHistory = [record, ...(p.retriageHistory || [])];
        return {
          ...p,
          triageLevel: record.newLevel,
          triageLevelName: TRIAGE_LEVELS_META[record.newLevel].name,
          triageQuality: record.qualityCategory,
          lastRetriageTime: record.timestamp,
          sbp: record.vitals.sbp,
          dbp: record.vitals.dbp,
          pr: record.vitals.pr,
          rr: record.vitals.rr,
          o2Sat: record.vitals.o2Sat,
          temp: record.vitals.temp,
          painScore: record.vitals.pain,
          gcs: record.vitals.gcs,
          retriageHistory: updatedHistory
        };
      })
    );

    // Update selected patient modal view if open
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          triageLevel: record.newLevel,
          triageLevelName: TRIAGE_LEVELS_META[record.newLevel].name,
          triageQuality: record.qualityCategory,
          lastRetriageTime: record.timestamp,
          sbp: record.vitals.sbp,
          dbp: record.vitals.dbp,
          pr: record.vitals.pr,
          rr: record.vitals.rr,
          o2Sat: record.vitals.o2Sat,
          temp: record.vitals.temp,
          painScore: record.vitals.pain,
          gcs: record.vitals.gcs,
          retriageHistory: [record, ...(prev.retriageHistory || [])]
        };
      });
    }

    if (settings.enableSound && record.newLevel <= 2) {
      playHospitalBeep(record.newLevel);
    }

    showToast(
      `บันทึก Re-Triage เรียบร้อย! ปรับเป็น Level ${record.newLevel} (${record.qualityCategory})`,
      record.qualityCategory === 'Under-Triage' ? 'error' : 'success'
    );
  };

  // Save patients whenever modified
  useEffect(() => {
    localStorage.setItem('triage_patients_list', JSON.stringify(patients));
  }, [patients]);

  // Save settings whenever modified
  useEffect(() => {
    localStorage.setItem('triage_hospital_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle new triage patient submission
  const handleAddNewPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);

    // Play hospital alert sound if enabled
    if (settings.enableSound) {
      playHospitalBeep(newPatient.triageLevel);
    }

    showToast(`บันทึก Triage สำเร็จ! ผู้ป่วย: ${newPatient.fullName} (${newPatient.triageLevelName})`, 'success');
    setActiveTab('dashboard');
  };

  // Update patient status
  const handleUpdatePatientStatus = (patientId: string, newStatus: Patient['status']) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`อัปเดตสถานะผู้ป่วยเป็น "${newStatus}" เรียบร้อยแล้ว`, 'info');
  };

  // Delete patient
  const handleDeletePatient = (patientId: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    showToast('ลบรายการผู้ป่วยเรียบร้อยแล้ว', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#1e293b] flex flex-col font-sans selection:bg-[#1b5e20] selection:text-white pb-20">
      
      {/* Top Header */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGasCode={() => setIsGasCodeOpen(true)}
        onOpenQuickGuide={() => setIsQuickGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-4">
        
        {/* View 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            soundEnabled={settings.enableSound}
            onToggleSound={() => {
              const updated = !settings.enableSound;
              setSettings((s) => ({ ...s, enableSound: updated }));
              if (updated) {
                playHospitalBeep(3);
                showToast('เปิดเสียงแจ้งเตือนเคสห้องฉุกเฉินแล้ว', 'info');
              } else {
                showToast('ปิดเสียงแจ้งเตือนแล้ว', 'info');
              }
            }}
            onGoToForm={() => setActiveTab('form')}
            onSelectPatient={(p) => setSelectedPatient(p)}
            onOpenQuickGuide={() => setIsQuickGuideOpen(true)}
          />
        )}

        {/* View 2: Form (บันทึก Triage) */}
        {activeTab === 'form' && (
          <TriageFormView
            currentStaff={settings.staffName}
            onSubmit={handleAddNewPatient}
            onOpenQuickGuide={() => setIsQuickGuideOpen(true)}
          />
        )}

        {/* View 3: List (รายการ Triage) */}
        {activeTab === 'list' && (
          <TriageListView
            patients={patients}
            hospitalName={settings.hospitalName}
            nurseName={settings.staffName}
            onAddNew={() => setActiveTab('form')}
            onSelectPatient={(p) => setSelectedPatient(p)}
            onOpenReTriage={(p) => {
              setPatientToReTriage(p);
              setIsReTriageOpen(true);
            }}
          />
        )}

        {/* View 4: Report (รายงาน) */}
        {activeTab === 'report' && (
          <ReportView
            patients={patients}
            hospitalName={settings.hospitalName}
            nurseName={settings.staffName}
          />
        )}

      </main>

      {/* Floating Quick Guide Button (Bottom Right) matching screenshot */}
      <button
        onClick={() => setIsQuickGuideOpen(true)}
        className="fixed bottom-20 right-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2 px-3.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 z-30 transition-transform hover:-translate-y-0.5 cursor-pointer no-print"
      >
        <span>📖</span>
        <span>คู่มือ Triage ด่วน</span>
      </button>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />

      {/* Modals */}
      <QuickGuideModal
        isOpen={isQuickGuideOpen}
        onClose={() => setIsQuickGuideOpen(false)}
      />

      <PatientDetailModal
        patient={selectedPatient}
        hospitalName={settings.hospitalName}
        nurseName={settings.staffName}
        onClose={() => setSelectedPatient(null)}
        onUpdateStatus={handleUpdatePatientStatus}
        onDeletePatient={handleDeletePatient}
        onOpenReTriage={(p) => {
          setPatientToReTriage(p);
          setIsReTriageOpen(true);
        }}
      />

      <ReTriageModal
        patient={patientToReTriage}
        isOpen={isReTriageOpen}
        onClose={() => {
          setIsReTriageOpen(false);
          setPatientToReTriage(null);
        }}
        onSaveReTriage={handleSaveReTriage}
        nurseAdmin={settings.staffName}
      />

      <GasCodeModal
        isOpen={isGasCodeOpen}
        onClose={() => setIsGasCodeOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว', 'success');
        }}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`fixed top-16 right-4 z-50 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl flex items-center gap-2 transition-all animate-fade-in ${
            toast.type === 'success'
              ? 'bg-[#1b5e20]'
              : toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-sky-700'
          }`}
        >
          <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
