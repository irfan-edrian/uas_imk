import { useState, useEffect } from "react";

type Screen = "home" | "menu";

// ─── Tachometer Arc Component ───────────────────────────────────────────────────
function TachometerArc({ speed }: { speed: number }) {
  const cx = 160, cy = 175, r = 140;
  const startAngle = -210, endAngle = 30;
  const totalDeg = endAngle - startAngle;
  const maxSpeed = 180;
  const progress = Math.min(speed / maxSpeed, 1);
  const currentAngle = startAngle + totalDeg * progress;

  function polarToXY(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arcPath(start: number, end: number, radius: number) {
    const s = polarToXY(start, radius);
    const e = polarToXY(end, radius);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= 18; i++) {
    const angle = startAngle + (totalDeg * i) / 18;
    const isMajor = i % 3 === 0;
    const outer = polarToXY(angle, r + 2);
    const inner = polarToXY(angle, isMajor ? r - 18 : r - 10);
    ticks.push(
      <line key={`t${i}`} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y}
        stroke={isMajor ? "#00e5ff" : "rgba(0,229,255,0.25)"} strokeWidth={isMajor ? 2 : 1} strokeLinecap="round" />
    );
    if (isMajor) {
      const label = polarToXY(angle, r - 30);
      ticks.push(
        <text key={`l${i}`} x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central"
          fill="rgba(0,229,255,0.55)" fontSize="9" fontFamily="Orbitron, monospace">
          {Math.round((i * maxSpeed) / 18)}
        </text>
      );
    }
  }

  const needleTip = polarToXY(currentAngle, r - 20);
  const needleBase1 = polarToXY(currentAngle + 90, 8);
  const needleBase2 = polarToXY(currentAngle - 90, 8);

  return (
    <svg width={320} height={280} style={{ overflow: "visible" }}>
      <defs>
        <filter id="cyanGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#00b4d8" stopOpacity="1"/>
        </linearGradient>
        <radialGradient id="cGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 20} fill="url(#cGlow)" />
      <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="rgba(0,229,255,0.07)" strokeWidth={18} strokeLinecap="round" />
      {progress > 0 && <>
        <path d={arcPath(startAngle, currentAngle, r)} fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth={22} strokeLinecap="round" filter="url(#cyanGlow)" />
        <path d={arcPath(startAngle, currentAngle, r)} fill="none" stroke="url(#arcGrad)" strokeWidth={6} strokeLinecap="round" filter="url(#cyanGlow)" />
        <path d={arcPath(startAngle, currentAngle, r)} fill="none" stroke="#00e5ff" strokeWidth={2.5} strokeLinecap="round" />
      </>}
      {ticks}
      <polygon points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${cx},${cy} ${needleBase2.x},${needleBase2.y}`}
        fill="#00e5ff" opacity={0.9} filter="url(#cyanGlow)" />
      <circle cx={cx} cy={cy} r={10} fill="#00e5ff" filter="url(#cyanGlow)" />
      <circle cx={cx} cy={cy} r={5} fill="#080b0f" />
      <circle cx={cx} cy={cy} r={22} fill="none" stroke="rgba(0,229,255,0.18)" strokeWidth={1} />
    </svg>
  );
}

// ─── Toggle Switch Component ────────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, label, subtitle }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; subtitle?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
      <div style={{ flex: 1, paddingRight: "12px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#e2eaf5", fontSize: "12px", letterSpacing: "0.05em" }}>{label}</div>
        {subtitle && <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: "#5a7a96", marginTop: "2px", lineHeight: 1.4 }}>{subtitle}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: "50px", height: "26px", borderRadius: "13px", flexShrink: 0, cursor: "pointer",
        background: checked ? "linear-gradient(135deg, #00e5ff, #0094b8)" : "#1e3a4a",
        border: checked ? "1px solid #00e5ff" : "1px solid rgba(0,229,255,0.15)",
        boxShadow: checked ? "0 0 12px rgba(0,229,255,0.45)" : "none",
        position: "relative", transition: "all 0.25s ease",
      }}>
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%",
          background: checked ? "#fff" : "#5a7a96", position: "absolute", top: "2px",
          left: checked ? "26px" : "2px", transition: "all 0.25s ease",
          boxShadow: checked ? "0 0 8px rgba(0,229,255,0.5)" : "none",
        }} />
      </button>
    </div>
  );
}

// ─── Home Screen Component ──────────────────────────────────────────────────────
function HomeScreen({ onOpenMenu }: { onOpenMenu: () => void }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => { const id = setInterval(() => setBlink(b => !b), 800); return () => clearInterval(id); }, []);

  return (
    <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "140px 1fr 160px", gridTemplateRows: "40px 1fr 90px", position: "relative", overflow: "hidden" }}>
      {/* Top Status Bar */}
      <div style={{ gridColumn: "1/4", gridRow: "1", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(0,229,255,0.1)", background: "rgba(8,11,15,0.9)" }}>
        <div style={{ fontFamily: "Orbitron, monospace", fontSize: "15px", fontWeight: 700, color: "#00e5ff", textShadow: "0 0 12px #00e5ff" }}>22:20</div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "9px", fontWeight: 600, color: "rgba(0,229,255,0.35)", letterSpacing: "0.2em" }}>SMART MOTO HUD · v2.4.1</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: "#00e5ff" }}>
          <span>BATT 92%</span>
          <span style={{ color: "#22c55e" }}>GPS ONLINE</span>
        </div>
      </div>

      {/* Left Panel: Fuel Status */}
      <div style={{ gridColumn: "1", gridRow: "2/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: "20px", gap: "10px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "9px", fontWeight: 700, color: "#f59e0b" }}>FUEL LEVEL</div>
        <div style={{ width: "18px", height: "100px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "9px", position: "relative" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: "linear-gradient(180deg,#f59e0b,#d97706)", borderRadius: "0 0 8px 8px" }} />
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "#f59e0b" }}>1.2L (45km)</div>
        <div style={{ padding: "4px 8px", background: blink ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.02)", border: "1px solid #f59e0b", borderRadius: "4px" }}>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "8px", color: "#f59e0b", fontWeight: 700 }}>LOW FUEL</span>
        </div>
      </div>

      {/* Center Panel: Speedometer Arc */}
      <div style={{ gridColumn: "2", gridRow: "2", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <TachometerArc speed={40} />
        <div style={{ position: "absolute", bottom: "72px", textAlign: "center" }}>
          <div style={{ fontFamily: "Orbitron, monospace", fontSize: "56px", fontWeight: 900, color: "#00e5ff", lineHeight: 1 }}>40</div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(0,229,255,0.55)", letterSpacing: "0.2em" }}>KM/H</div>
        </div>
      </div>

      {/* Bottom Panel Center: Cruise Status */}
      <div style={{ gridColumn: "2", gridRow: "3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "5px 14px", background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: "20px" }}>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "10px", fontWeight: 700, color: "#00e5ff" }}>✓ AUTOPILOT CRUISE ENGAGED</span>
        </div>
      </div>

      {/* Right Panel: Smart Menu Opener */}
      <div style={{ gridColumn: "3", gridRow: "2/4", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", paddingRight: "20px" }}>
        <button onClick={onOpenMenu} style={{
          width: "110px", height: "65px", background: "rgba(0,229,255,0.05)", border: "1px solid #00e5ff", borderRadius: "10px", cursor: "pointer"
        }}>
          <div style={{ fontFamily: "Orbitron, monospace", fontSize: "9px", color: "#00e5ff", fontWeight: 800 }}>SMART MENU</div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "7px", color: "rgba(0,229,255,0.5)", marginTop: "4px" }}>TAP TO OPEN</div>
        </button>
      </div>
    </div>
  );
}

// ─── Control Center Component ────────────────────────────────────────────────────
function ControlCenter({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: "20px", color: "#e2eaf5", fontFamily: "Rajdhani, sans-serif", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
      <div>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid #00e5ff", color: "#00e5ff", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", fontFamily: "Orbitron, monospace", fontSize: "9px" }}>
          ← BACK TO HOME
        </button>
      </div>
      <h2 style={{ fontFamily: "Orbitron, monospace", color: "#00e5ff", marginTop: "15px", fontSize: "16px", letterSpacing: "0.1em" }}>CONTROL CENTER</h2>
      <div style={{ padding: "15px", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.12)", borderRadius: "10px", marginTop: "10px", flex: 1 }}>
        <p style={{ fontSize: "12px", color: "#5a7a96", fontFamily: "JetBrains Mono, monospace", marginBottom: "15px" }}>INTERACTIVE MODULES // SYSTEM OK</p>
        <ToggleSwitch checked={true} onChange={() => {}} label="Adaptive Stabilizer" subtitle="Auto balance wheels at zero velocity" />
        <div style={{ height: "1px", background: "rgba(0,229,255,0.08)", margin: "10px 0" }} />
        <ToggleSwitch checked={true} onChange={() => {}} label="Collision Avoidance Radar" subtitle="Frontal laser ADAS tracking active" />
        <div style={{ height: "1px", background: "rgba(0,229,255,0.08)", margin: "10px 0" }} />
        <ToggleSwitch checked={false} onChange={() => {}} label="Anti-Theft GPS Tracker" subtitle="Secure double lock engine protection" />
      </div>
    </div>
  );
}

// ─── Main Root Component ─────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div style={{ width: "800px", height: "480px", background: "#080b0f", border: "2px solid rgba(0,229,255,0.25)", borderRadius: "16px", overflow: "hidden" }}>
      {screen === "home" ? (
        <HomeScreen onOpenMenu={() => setScreen("menu")} />
      ) : (
        <ControlCenter onBack={() => setScreen("home")} />
      )}
    </div>
  );
}