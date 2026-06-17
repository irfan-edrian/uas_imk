import { useState } from 'react';

function App() {
  // 1. Buat state untuk melacak menu mana yang sedang aktif
  const [activeMenu, setActiveMenu] = useState('AUTOPILOT');

  return (
    <div className="flex h-screen bg-[#030914] text-white">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-1/4 border-r border-cyan-900/30 p-6">
        <button 
          onClick={() => setActiveMenu('AUTOPILOT')}
          className={`w-full text-left py-3 px-4 rounded ${activeMenu === 'AUTOPILOT' ? 'text-cyan-400 bg-cyan-950/40' : 'text-gray-400'}`}
        >
          🚀 AUTOPILOT
        </button>
        <button 
          onClick={() => setActiveMenu('ADV_ADAS')}
          className={`w-full text-left py-3 px-4 rounded ${activeMenu === 'ADV_ADAS' ? 'text-cyan-400 bg-cyan-950/40' : 'text-gray-400'}`}
        >
          🛡️ ADV. ADAS
        </button>
        {/* Tambahkan tombol menu lainnya dengan pola yang sama */}
      </div>

      {/* CONTENT AREA */}
      <div className="w-3/4 p-8">
        {/* 2. Kondisi untuk menampilkan konten sesuai menu yang di-klik */}
        {activeMenu === 'AUTOPILOT' && (
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-cyan-400">Autopilot Control</h2>
            {/* Taruh komponen/tampilan Autopilot di sini */}
          </div>
        )}

        {activeMenu === 'ADV_ADAS' && (
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-cyan-400">Adv. ADAS Control</h2>
            {/* Taruh komponen/tampilan ADAS di sini */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;