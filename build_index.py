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
  font-family: var(--font-sans);
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
  fill: rgba(220, 235, 220, 0.75);
}
.brand-silkscreen {
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 800;
  fill: #ffffff;
  letter-spacing: 1.5px;
}
.brand-silkscreen.gold {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 900;
  fill: #f59e0b;
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
  filter: drop-shadow(0 0 6px rgba(255, 230, 100, 0.9));
}
.switch-group:hover rect:first-child {
  stroke: #7dd3fc;
}
.pushbutton-group:hover circle:nth-child(3) {
  filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
}
.knob-group:hover circle:nth-child(8) {
  stroke: #7dd3fc;
}

.patch-cord-group {
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.patch-cord-group:hover {
  opacity: 0.85;
}
.patch-cord-group:hover path:nth-child(3) {
  stroke-width: 7;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}
.jack-selection-ring {
  animation: pulse-ring 1.2s infinite ease-in-out;
  transform-origin: center center;
}
"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIT 9005 Digital IC Trainer Simulator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
{tokens_css}
{svg_css}
  </style>
</head>
<body>
  <!-- Header Bar -->
  <header class="app-header">
    <div class="brand-section">
      <span class="brand-badge">HI-TECH</span>
      <h1 class="brand-title">DIT 9005 <span style="font-weight: 400; color: #94a3b8; font-size: 14px;">Digital IC Trainer Simulator</span></h1>
      <span class="brand-subtitle">Digital Systems Lab</span>
    </div>

    <div class="header-controls">
      <!-- Wire Color Palette -->
      <div class="wire-palette">
        <span class="wire-palette-label">Wire:</span>
        <div class="color-swatch active" data-color="#facc15" style="background: #facc15;" title="Yellow Wire (Default)"></div>
        <div class="color-swatch" data-color="#ef4444" style="background: #ef4444;" title="Red (+5V / VCC)"></div>
        <div class="color-swatch" data-color="#1f2937" style="background: #1f2937;" title="Black (GND)"></div>
        <div class="color-swatch" data-color="#38bdf8" style="background: #38bdf8;" title="Blue (Signals)"></div>
        <div class="color-swatch" data-color="#22c55e" style="background: #22c55e;" title="Green (Clock/Pulse)"></div>
        <div class="color-swatch" data-color="#f8fafc" style="background: #f8fafc;" title="White"></div>
      </div>

      <button class="btn" id="btn-undo-wire" title="Undo Last Wire (Ctrl+Z)">⤺ Undo</button>
      <button class="btn" id="btn-delete-mode" title="Click wire to remove">✕ Delete Wire</button>
      <button class="btn btn-danger" id="btn-clear-wires" title="Remove all patch cords">Clear Wires</button>

      <!-- Master Power Switch in Header -->
      <button class="master-power-btn on" id="master-pwr-header" title="Master 230V Mains Power">
        <div class="power-indicator"></div>
        <span class="power-text">230V ON</span>
      </button>
    </div>
  </header>

  <!-- Sub-bar: Patch field navigation & quick status -->
  <div class="sub-bar">
    <div class="view-tabs">
      <span style="font-size: 11px; color: var(--text-dim); margin-right: 6px; font-weight: 600;">PATCH FIELD:</span>
      <button class="view-tab-btn active" data-view="full">Full Board</button>
      <button class="view-tab-btn" data-view="zif">ZIF Sockets (U1–U4)</button>
      <button class="view-tab-btn" data-view="inputs">Inputs & Power</button>
      <button class="view-tab-btn" data-view="outputs">Outputs & 7-Seg</button>
      <button class="view-tab-btn" data-view="u5">40-Pin ZIF (U5)</button>
    </div>

    <div class="subbar-status">
      <span class="status-pill" id="status-wire-count">0 Wires</span>
      <span class="status-pill" id="status-alarm-pill">✓ Healthy</span>
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
          <div style="font-size: 10px; color: var(--text-muted);">PROBE TEST POINT</div>
          <div style="font-weight: 700; color: #fff;" id="probe-jack-name">--</div>
        </div>
        <div style="border-left: 1px solid var(--border-strong); padding-left: 10px;">
          <div style="font-size: 10px; color: var(--text-muted);" id="probe-state">--</div>
          <div style="font-weight: 700; color: #38bdf8;" id="probe-voltage">0.00 V</div>
        </div>
      </div>
    </div>

    <!-- Laboratory Console Sidebar -->
    <aside class="console-panel" id="laboratory-console"></aside>
  </main>

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

