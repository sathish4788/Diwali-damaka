/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare, MoreVertical, CheckCircle2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'android'
  );

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>App Installed</span>
      </div>
    );
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'hero' ? (
        <button
          onClick={handleButtonClick}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all duration-200 border border-amber-300/40 cursor-pointer pointer-events-auto"
        >
          <div className="p-1 rounded-lg bg-black/20 text-white">
            <Smartphone className="w-4 h-4 animate-bounce" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs uppercase tracking-wider text-amber-950 font-bold">Mobile App</div>
            <div className="text-sm font-extrabold text-white drop-shadow-sm flex items-center gap-1">
              <span>Install on Phone</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
            </div>
          </div>
        </button>
      ) : (
        <button
          onClick={handleButtonClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition border border-amber-300/40 cursor-pointer pointer-events-auto"
          title="Install Diwali Dhamaka as mobile app on your phone"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">📱 Install on Phone</span>
          <span className="sm:hidden">Install App</span>
        </button>
      )}

      {/* Installation Guide & Prompt Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border-2 border-amber-500/50 p-5 sm:p-6 shadow-2xl text-slate-100 overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Close */}
            <div className="flex items-start justify-between relative z-10 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="Diwali Dhamaka Logo"
                  className="w-12 h-12 rounded-2xl shadow-lg border border-amber-400/50 object-cover"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                    Diwali Dhamaka 🪔
                  </h3>
                  <p className="text-xs text-amber-200/80 font-medium">
                    Install & Manifest as Mobile App
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instant direct install button if Chrome prompt is ready */}
            {isInstallable && (
              <div className="mb-4 relative z-10">
                <button
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-black text-sm shadow-xl active:scale-98 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tap to Direct Install to Home Screen</span>
                </button>
              </div>
            )}

            {/* Platform selector tabs */}
            <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 mb-4 text-xs font-bold relative z-10">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'android'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🤖 Android</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'ios'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🍎 iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'desktop'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💻 Desktop</span>
              </button>
            </div>

            {/* Platform specific step-by-step instructions */}
            <div className="relative z-10 rounded-2xl bg-slate-950/60 border border-slate-800/80 p-4 text-xs space-y-3">
              {activeTab === 'android' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </div>
                    <p className="text-slate-300 leading-snug">
                      Open in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </div>
                    <div className="text-slate-300 leading-snug">
                      Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </div>
                    <p className="text-slate-300 leading-snug">
                      Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      4
                    </div>
                    <p className="text-slate-300 leading-snug">
                      Confirm <strong>"Install"</strong>. The Diwali Dhamaka icon will appear directly in your App Drawer & Home Screen!
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'ios' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </div>
                    <p className="text-slate-300 leading-snug">
                      Open this game in <strong>Safari</strong> on your iPhone or iPad.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </div>
                    <div className="text-slate-300 leading-snug flex items-center gap-1.5 flex-wrap">
                      <span>Tap the <strong>Share</strong> button</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                        <Share2 className="w-3 h-3 mr-1 inline" /> Share
                      </span>
                      <span>in Safari toolbar.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </div>
                    <div className="text-slate-300 leading-snug flex items-center gap-1.5 flex-wrap">
                      <span>Scroll down and tap</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                        <PlusSquare className="w-3 h-3 mr-1 inline" /> Add to Home Screen
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      4
                    </div>
                    <p className="text-slate-300 leading-snug">
                      Tap <strong>"Add"</strong> in the top-right corner. It opens in native full-screen mode with no browser URL bar!
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'desktop' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </div>
                    <p className="text-slate-300 leading-snug">
                      In Chrome or Edge, click the <strong>Install App icon (⊕)</strong> on the right side of the URL address bar.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </div>
                    <p className="text-slate-300 leading-snug">
                      Or click the browser menu <strong>(⋮)</strong> &rarr; <strong>"Save and share"</strong> &rarr; <strong>"Install Diwali Dhamaka"</strong>.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* App Features pill row */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-around text-[10px] text-amber-300/80 font-medium relative z-10">
              <span className="flex items-center gap-1">⚡ Fast 60 FPS 3D</span>
              <span>•</span>
              <span className="flex items-center gap-1">📴 Works Offline</span>
              <span>•</span>
              <span className="flex items-center gap-1">🔒 Safe & Ad-Free</span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
            >
              Got it, continue playing
            </button>
          </div>
        </div>
      )}
    </>
  );
};
