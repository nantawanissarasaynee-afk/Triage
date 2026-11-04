import React from 'react';
import { HospitalSettings } from '../types/triage';

interface HeaderProps {
  settings: HospitalSettings;
  onOpenSettings: () => void;
  onOpenGasCode: () => void;
  onOpenQuickGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onOpenGasCode,
  onOpenQuickGuide
}) => {
  return (
    <header className="bg-[#1b5e20] text-white h-14 sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Brand Lockup with Luang Phor Pern Hospital Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/40">
            <img
              src="/assets/aistudio/IMG_1767_3b31df57.webp"
              alt="ตราสัญลักษณ์โรงพยาบาลหลวงพ่อเปิ่น"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-wide leading-none">TRIAGE</h1>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white/95 font-medium">MOPH ED 5-Level</span>
            </div>
            <p className="text-xs text-white/90 font-medium leading-none mt-1">{settings.hospitalName}</p>
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-2">
          
          {/* LINE OpenChat Button */}
          <a
            href={settings.lineOpenChatUrl || 'https://line.me/ti/g2/V1UNTdetwPj4fS9-3Z3mzS3r-pzF8klqZLmyaQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all hover:scale-105 active:scale-95"
            title="แตะเพื่อเข้าร่วม LINE OpenChat: Triage LPH โรงพยาบาลหลวงพ่อเปิ่น"
          >
            <span className="text-sm">💬</span>
            <span className="hidden sm:inline">LINE OpenChat: Triage LPH</span>
            <span className="sm:hidden">Triage LPH</span>
          </a>

          {/* Quick Guide Button */}
          <button
            onClick={onOpenQuickGuide}
            className="hidden md:inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors text-white font-medium"
          >
            <span>📖</span>
            <span>คู่มือ Triage</span>
          </button>

          {/* GAS Code Export Button */}
          <button
            onClick={onOpenGasCode}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-3 py-1.5 rounded-full shadow-sm transition-colors"
            title="ดูและคัดลอกโค้ด Google Apps Script (Code.gs & index.html)"
          >
            <span>📦</span>
            <span>โค้ด GAS</span>
          </button>

          {/* Staff Profile & Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
            title="ตั้งค่าระบบ / LINE OpenChat"
          >
            <span>👤</span>
            <span className="max-w-[140px] truncate">{settings.staffName}</span>
            <span className="text-white/70">⚙️</span>
          </button>

        </div>

      </div>
    </header>
  );
};
