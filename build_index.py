import os

def build():
    with open("src_parts/tokens.css", "r", encoding="utf-8") as f:
        tokens_css = f.read()
    with open("src_parts/data_ics.js", "r", encoding="utf-8") as f:
        data_ics = f.read()
    with open("src_parts/data_experiments.js", "r", encoding="utf-8") as f:
        data_experiments = f.read()
    with open("src_parts/engine.js", "r", encoding="utf-8") as f:
        engine_js = f.read()
    with open("src_parts/components.js", "r", encoding="utf-8") as f:
        components_js = f.read()
    with open("src_parts/board.js", "r", encoding="utf-8") as f:
        board_js = f.read()
    with open("src_parts/console.js", "r", encoding="utf-8") as f:
        console_js = f.read()
    with open("src_parts/init.js", "r", encoding="utf-8") as f:
        init_js = f.read()

    svg_css = """
/* Silkscreen & Board SVG Typography */
.silkscreen-title {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 800;
  fill: var(--silkscreen);
  letter-spacing: 1px;
}
.silkscreen-text {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--silkscreen);
}
.silkscreen-text.bold {
  font-weight: 700;
  font-size: 11px;
}
.silkscreen-text.mini {
  font-size: 8.5px;
  fill: rgba(220, 240, 225, 0.8);
}
.brand-silkscreen {
  font-family: var(--font-ui);
  font-size: 16px;
  font-weight: 800;
  fill: #ffffff;
  letter-spacing: 1.5px;
}
.brand-silkscreen.gold {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 900;
  fill: var(--accent-amber);
  letter-spacing: 2px;
}
.brand-silkscreen.small {
  font-size: 11px;
  font-weight: 600;
  fill: #94a3b8;
  letter-spacing: 1px;
}

/* Hitboxes and cursors */
.jack-hitbox, .switch-hitbox, .btn-hitbox, .knob-hitbox {
  cursor: pointer;
}
.jack-group:hover .jack-hitbox {
  cursor: crosshair;
}
.jack-group:hover circle:nth-child(2) {
  filter: drop-shadow(0 0 6px rgba(255, 230, 100, 0.95));
}
.switch-group:hover rect:first-child {
  stroke: var(--accent-teal);
}
.pushbutton-group:hover circle:nth-child(3) {
  filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.85));
}
.knob-group:hover circle:nth-child(8) {
  stroke: var(--accent-teal);
}

.patch-cord-group {
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.patch-cord-group:hover {
  opacity: 0.95;
}
.patch-cord-group:hover .cord-delete-handle,
.patch-cord-group.selected .cord-delete-handle {
  opacity: 1;
  pointer-events: all;
}
.cord-delete-handle {
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.12s ease;
}
.cord-delete-handle:hover {
  transform: scale(1.3);
}
.cord-delete-handle.visible {
  opacity: 1;
  pointer-events: all;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}
.jack-selection-ring.active,
.jack-group.selected .jack-selection-ring,
.jack-group.target .jack-selection-ring {
  animation: pulse-ring 1.2s infinite ease-in-out;
  transform-origin: center center;
}
.jack-drop-glow {
  animation: pulse-ring 1s infinite ease-in-out;
  transform-origin: center center;
}
"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DS Simulation — IC Trainer Kit Simulation</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230f172a'/%3E%3Crect x='6' y='9' width='20' height='14' rx='2.5' fill='%231e293b' stroke='%2338bdf8' stroke-width='1.5'/%3E%3Cline x1='10' y1='4' x2='10' y2='9' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='16' y1='4' x2='16' y2='9' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='22' y1='4' x2='22' y2='9' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='10' y1='23' x2='10' y2='28' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='16' y1='23' x2='16' y2='28' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='22' y1='23' x2='22' y2='28' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='3' fill='%2322c55e'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
{tokens_css}
{svg_css}
  </style>
</head>
<body>
  <!-- Boot Splash Screen (Hardware POST) -->
  <div id="boot-splash">
    <div class="splash-terminal">
      <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 8px; letter-spacing: 1px;">
        DS SIMULATION — IC TRAINER KIT SIMULATOR
      </div>
      <div style="font-size: 11px; color: #86efac; line-height: 1.6;">
        ROM BIOS v2.4 (c) 1988-2026 DIGITAL SYSTEMS LAB<br>
        INITIALIZING TTL LOGIC CORES & UNION-FIND MATRIX...<br>
        TESTING 74-SERIES IC LIBRARY (16 MODELS)... OK<br>
        VERIFYING VOLTAGE REGULATORS (+5V, +12V, GND)... NORMAL<br>
        CALIBRATING TIMEBASE GENERATOR (0.5Hz – 10kHz)... STABLE<br>
        SYSTEM READY.
      </div>
      <div class="splash-progress-bar">
        <div class="splash-progress-fill" id="splash-fill"></div>
      </div>
    </div>
  </div>

  <!-- Header Bar -->
  <header class="app-header">
    <div class="brand-section">
      <div class="logo-badge" title="DS Simulation — IC Trainer Kit Simulation">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1.3" />
          <path d="M 2 9 A 2 2 0 0 1 2 15" stroke="#38bdf8" stroke-width="1.2" fill="#0f172a" />
          <line x1="6" y1="2" x2="6" y2="5" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" />
          <line x1="12" y1="2" x2="12" y2="5" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" />
          <line x1="18" y1="2" x2="18" y2="5" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" />
          <line x1="6" y1="19" x2="6" y2="22" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" />
          <line x1="12" y1="19" x2="12" y2="22" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" />
          <line x1="18" y1="19" x2="18" y2="22" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="12" cy="12" r="2.2" fill="#22c55e" />
        </svg>
      </div>
      <div class="brand-titles">
        <h1 class="brand-title">
          DS SIMULATION
          <span class="pill-badge">FREE LAB EDITION</span>
          <span class="pill-badge" style="color: var(--accent-teal); border-color: rgba(20, 184, 166, 0.3);">DIGITAL SYSTEMS</span>
        </h1>
        <span class="brand-subtitle">IC Trainer Kit Simulation</span>
      </div>
    </div>

    <div class="header-controls">
      <!-- Fast Experiment Switcher -->
      <select id="header-exp-select" style="width: 175px; padding: 4px 8px; font-size: 11px;">
        <option value="exp1">Exp 1: Logic Gates</option>
        <option value="exp2">Exp 2: MUX 74153</option>
        <option value="exp3">Exp 3: DEMUX 74138</option>
        <option value="exp4">Exp 4: Adder 7483</option>
        <option value="exp5">Exp 5: Counter 7490</option>
        <option value="exp6">Exp 6: Shift Reg 7474</option>
        <option value="exp7">Exp 7: Comparator 7485</option>
        <option value="exp8">Exp 8: Counter 74191</option>
      </select>

      <button class="btn" id="btn-exam-mode" title="Toggle Exam Mode (hides Auto-wire, Hint, and Auto-check for realistic exam practice)">🎓 Exam Mode</button>
      <button class="btn" id="btn-open-guide" title="Open Lab Guide & Controls">📖 Guide</button>
      <button class="btn" id="btn-open-manual" title="View Datasheet Reference">📋 Manual</button>
      <button class="btn" id="btn-toggle-sound" title="Toggle Mechanical Audio Effects (Default: OFF)">🔇 Sound: OFF</button>
      <button class="btn" id="btn-toggle-theme" title="Toggle Light / Dark Shell Theme">🌓 Theme</button>
      <button class="btn" id="btn-toggle-contrast" title="Toggle High Contrast Mode">👁️ Contrast</button>
      <button class="btn" id="btn-open-qa" title="Run Comprehensive QA & Benchmarks (Ctrl+Shift+Q)">🛠️ QA</button>
      <button class="btn" id="btn-reset-trainer" title="Reset all patch cords and switches">↺ Reset</button>
      <button class="btn" id="btn-clear-cords" title="Clear All Patch Cords">⊘ Clear Cords</button>

      <!-- Wire Color Palette (Yellow, Red, Blue, Green, White, Black) -->
      <div class="wire-palette">
        <div class="color-swatch active" data-color="#f5c518" style="background: #f5c518;" title="Yellow Wire (Default)"></div>
        <div class="color-swatch" data-color="#ef4444" style="background: #ef4444;" title="Red (+5V / VCC)"></div>
        <div class="color-swatch" data-color="#3b82f6" style="background: #3b82f6;" title="Blue (Signals)"></div>
        <div class="color-swatch" data-color="#10b981" style="background: #10b981;" title="Green (Clock/Pulse)"></div>
        <div class="color-swatch" data-color="#f8fafc" style="background: #f8fafc;" title="White"></div>
        <div class="color-swatch" data-color="#1e293b" style="background: #1e293b;" title="Black (GND)"></div>
      </div>

      <button class="btn" id="btn-undo-wire" title="Undo Last Wire (Ctrl+Z)">⤺ Undo</button>
      <button class="btn" id="btn-redo-wire" title="Redo Wire (Ctrl+Y)">⤻ Redo</button>
      <button class="btn" id="btn-delete-mode" title="Click wire to remove">✕ Delete Wire</button>

      <!-- Master Power Switch in Header -->
      <button class="master-power-btn on" id="master-pwr-header" title="Master 230V Mains Power">
        <div class="power-indicator"></div>
        <span class="power-text">230V ON</span>
      </button>
    </div>
  </header>

  <!-- Sub-bar: Patch field navigation & quick status -->
  <div class="sub-bar">
    <div class="subbar-left">
      <span class="subbar-label">PATCH FIELD</span>
      <div class="view-tabs">
        <button class="view-tab-btn active" data-view="full">Full Board</button>
        <button class="view-tab-btn" data-view="zif">ZIF Sockets (U1–U4)</button>
        <button class="view-tab-btn" data-view="inputs">Inputs & Power</button>
        <button class="view-tab-btn" data-view="outputs">Outputs & 7-Seg</button>
        <button class="view-tab-btn" data-view="u5">40-Pin ZIF (U5)</button>
      </div>
    </div>

    <div class="subbar-right">
      <span class="status-chip healthy" id="status-netlist-chip">● Netlist: Healthy</span>
      <span class="status-chip" id="status-counters">0 cords · 0 ICs</span>
      <span class="status-chip" id="clock-readout" style="color: var(--accent-amber);">CLK: 1Hz (LO)</span>

      <!-- Zoom Controls -->
      <div class="zoom-controls">
        <button class="zoom-btn" id="btn-zoom-out" title="Zoom Out">−</button>
        <button class="zoom-btn" id="btn-zoom-in" title="Zoom In">+</button>
        <button class="zoom-btn fit" id="btn-zoom-fit" title="Fit to Screen">Fit</button>
      </div>
    </div>
  </div>

  <!-- Main Workspace -->
  <main class="main-workspace">
    <!-- Board Canvas -->
    <div class="board-container">
      <svg id="board-svg" viewBox="0 0 1600 1160" preserveAspectRatio="xMidYMid meet"></svg>

      <!-- Floating Logic Probe HUD -->
      <div class="probe-hud" id="probe-hud" style="opacity: 0;">
        <div class="probe-dot" id="probe-dot"></div>
        <div>
          <div style="font-size: 10px; color: #8b949e;">PROBE TEST POINT</div>
          <div style="font-weight: 700; color: #fff;" id="probe-jack-name">--</div>
        </div>
        <div style="border-left: 1px solid var(--border-strong); padding-left: 10px;">
          <div style="font-size: 10px; color: #8b949e;" id="probe-state">--</div>
          <div style="font-weight: 700; color: #38bdf8;" id="probe-voltage">0.00 V</div>
        </div>
      </div>
    </div>

    <!-- Laboratory Console Sidebar -->
    <aside class="console-panel" id="laboratory-console"></aside>
  </main>

  <!-- Quick Guide Modal Dialog -->
  <div class="modal-overlay" id="guide-modal">
    <div class="modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
        <h2 style="font-size: 16px; color: #fff; display: flex; align-items: center; gap: 8px;">
          📖 DIT 9005 Trainer Quick Guide
        </h2>
        <button class="btn btn-danger" id="btn-close-guide" style="padding: 2px 8px;">✕ Close</button>
      </div>

      <div style="font-size: 12.5px; line-height: 1.6; color: #cbd5e1; display: flex; flex-direction: column; gap: 10px;">
        <p><b>Welcome to the DIT 9005 Digital IC Trainer Simulator!</b> This virtual lab operates just like the physical hardware at your university lab bench.</p>

        <h3 style="color: var(--accent-amber); font-size: 13px; margin-top: 4px;">Wiring Circuits with Patch Cords:</h3>
        <ul style="padding-left: 18px;">
          <li><b>Connect a Cord:</b> Click any brass jack terminal, then click the destination jack. A realistic sagging wire will connect them.</li>
          <li><b>Delete a Cord:</b> Right-click any wire or banana plug, or toggle the <b>✕ Delete Wire</b> mode button in the header.</li>
          <li><b>Undo Wire:</b> Press <b>Ctrl+Z</b> or click the <b>⤺ Undo</b> button.</li>
          <li><b>Wire Colors:</b> Choose Yellow (default), Red (Power), Black (GND), Blue (Signals), or Green (Clock) from the header palette.</li>
        </ul>

        <h3 style="color: var(--accent-teal); font-size: 13px; margin-top: 4px;">Hardware Operation & Features:</h3>
        <ul style="padding-left: 18px;">
          <li><b>Pan & Zoom:</b> Use the mouse wheel to zoom in/out. Hold <b>Space + Drag</b> to pan around the board. Click <b>Fit</b> in the sub-bar to reset.</li>
          <li><b>Data Inputs:</b> Click any of the 12 metal toggle switches (C3–C0, B3–B0, A3–A0) to flip between 0 (Down) and 1 (Up).</li>
          <li><b>Strict Power Mode:</b> By default, ICs require patch cords from <b>+5V</b> to the IC's VCC pin and from <b>GND</b> to the GND pin.</li>
          <li><b>Auto-Wire Demo:</b> In the right console, click <b>"⚡ Auto-Wire Circuit"</b> to immediately load and wire any of the 8 syllabus experiments!</li>
          <li><b>Auto-Check:</b> Click <b>"✓ Auto-Check"</b> to sweep all input combinations on a test engine without disturbing your live switch states.</li>
          <li><b>Hint:</b> Click <b>"💡 Hint"</b> to highlight the next missing connection with pulsing golden rings around the target jacks.</li>
          <li><b>Show Solution:</b> Click <b>"👁️ Show Solution"</b> to overlay ghost dashed patch cords for the current experiment.</li>
          <li><b>Exam Mode:</b> Toggle <b>"🎓 Exam Mode"</b> to hide auto-wire, hints, and solutions for realistic practical exam practice.</li>
          <li><b>Observation Sheet:</b> Click <b>"🖨️ Observation Sheet"</b> to export and print a completed lab observation sheet with roll number and conclusion.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- QA Diagnostics Modal (Ctrl+Shift+Q) -->
  <div class="modal-overlay" id="qa-modal">
    <div class="modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
        <h2 style="font-size: 15px; color: #fff; display: flex; align-items: center; gap: 8px;">
          🛠️ DIT 9005 Automated QA & Verification Suite
        </h2>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn btn-teal" id="btn-rerun-qa" style="padding: 3px 10px; font-size: 11px;">↺ Re-run QA</button>
          <button class="btn btn-danger" id="btn-close-qa" style="padding: 2px 8px;">✕ Close</button>
        </div>
      </div>
      <div id="qa-summary-banner" style="margin-bottom: 10px; padding: 10px; border-radius: 6px; font-size: 12px;"></div>
      <div class="qa-results-box" id="qa-log-container">
        Running tests...
      </div>
    </div>
  </div>

  <script>
{data_ics}
{data_experiments}
{engine_js}
{components_js}
{board_js}
{console_js}
{init_js}
  </script>
</body>
</html>
"""

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("index.html built successfully! Size:", len(html), "bytes")

if __name__ == "__main__":
    build()
