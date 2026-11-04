import React from 'react';

export type NavTab = 'dashboard' | 'form' | 'list' | 'report';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 shadow-lg flex items-center justify-around px-2 no-print">
      
      {/* 1. Dashboard */}
      <button
        onClick={() => onChangeTab('dashboard')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
          activeTab === 'dashboard' ? 'text-[#1b5e20] font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="text-xl">⏱️</span>
        <span className="text-xs mt-0.5">Dashboard</span>
      </button>

      {/* 2. บันทึก Triage */}
      <button
        onClick={() => onChangeTab('form')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
          activeTab === 'form' ? 'text-[#1b5e20] font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shadow-sm text-sm">
          ✚
        </div>
        <span className="text-xs mt-0.5">บันทึก Triage</span>
      </button>

      {/* 3. รายการ */}
      <button
        onClick={() => onChangeTab('list')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
          activeTab === 'list' ? 'text-[#1b5e20] font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="text-xl">📋</span>
        <span className="text-xs mt-0.5">รายการ</span>
      </button>

      {/* 4. รายงาน */}
      <button
        onClick={() => onChangeTab('report')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
          activeTab === 'report' ? 'text-[#1b5e20] font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="text-xl">📊</span>
        <span className="text-xs mt-0.5">รายงาน</span>
      </button>

    </nav>
  );
};
