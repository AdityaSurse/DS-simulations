/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  const svgBoard = document.getElementById("board-svg");
  const probeHud = document.getElementById("probe-hud");
  const probeJackName = document.getElementById("probe-jack-name");
  const probeState = document.getElementById("probe-state");
  const probeVoltage = document.getElementById("probe-voltage");
  const probeDot = document.getElementById("probe-dot");
  const statusWireCount = document.getElementById("status-wire-count");
  const statusAlarmPill = document.getElementById("status-alarm-pill");

  // 1. Instantiate Core Engine
  const engine = new TTLEngine();

  // 2. Logic Probe HUD Handler
  const handleJackHover = (jackId, mouseEvent) => {
    if (!jackId) {
      probeHud.style.opacity = "0";
      return;
    }
    const info = engine.probeJack(jackId);
    probeHud.style.opacity = "1";
    probeJackName.textContent = jackId;

    let vText = `${info.voltage.toFixed(2)} V`;
    let sText = "FLOAT";
    probeDot.className = "probe-dot";

    if (info.state === "OFF") {
      sText = "OFF (0V)";
      vText = "0.00 V";
    } else if (info.state === "SHORT") {
      sText = "SHORT CIRCUIT";
      probeDot.classList.add("short");
    } else if (info.state === 1) {
      sText = "HIGH (Logic 1)";
      probeDot.classList.add("high");
    } else if (info.state === 0) {
      sText = "LOW (Logic 0)";
      probeDot.classList.add("low");
    } else if (info.state === "12V") {
      sText = "+12V DC";
      probeDot.classList.add("high");
    } else {
      sText = "TTL FLOAT (High)";
    }

    probeState.textContent = sText;
    probeVoltage.textContent = vText;
  };

  // 3. Instantiate Board Renderer & Console
  const board = new BoardRenderer(engine, svgBoard, handleJackHover);
  const consolePanel = new LabConsole(engine, board);

  // 4. Update UI Status on Engine State Changes
  const updateStatusBar = () => {
    if (statusWireCount) statusWireCount.textContent = `${engine.wires.length} Wires`;
    if (statusAlarmPill) {
      if (engine.shorts.length > 0) {
        statusAlarmPill.className = "status-pill alarm";
        statusAlarmPill.innerHTML = `⚠️ SHORT CIRCUIT (${engine.shorts.length})`;
      } else {
        statusAlarmPill.className = "status-pill";
        statusAlarmPill.innerHTML = `✓ Healthy`;
      }
    }
    const masterPwrBtn = document.getElementById("master-pwr-header");
    if (masterPwrBtn) {
      masterPwrBtn.classList.toggle("on", engine.masterPower);
      masterPwrBtn.querySelector(".power-text").textContent = engine.masterPower ? "230V ON" : "OFF";
    }
  };

  engine.onChange(() => {
    board.render();
    updateStatusBar();
  });

  // 5. Header Control Bindings
  // Wire Color Palette
  const colorSwatches = document.querySelectorAll(".color-swatch");
  colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      colorSwatches.forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      board.setWireColor(swatch.dataset.color);
    });
  });

  // Undo Wire
  const btnUndo = document.getElementById("btn-undo-wire");
  if (btnUndo) {
    btnUndo.addEventListener("click", () => engine.undoWire());
  }

  // Clear All Wires
  const btnClear = document.getElementById("btn-clear-wires");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (confirm("Clear all connected patch cords?")) {
        engine.clearWires();
      }
    });
  }

  // Delete Wire Mode Toggle
  const btnDeleteMode = document.getElementById("btn-delete-mode");
  if (btnDeleteMode) {
    btnDeleteMode.addEventListener("click", () => {
      const active = !board.deleteMode;
      board.setDeleteMode(active);
      btnDeleteMode.classList.toggle("btn-active", active);
      btnDeleteMode.textContent = active ? "✕ Delete Mode (ON)" : "✕ Delete Wire";
    });
  }

  // Master Power in Header
  const headerPwrBtn = document.getElementById("master-pwr-header");
  if (headerPwrBtn) {
    headerPwrBtn.addEventListener("click", () => {
      engine.toggleMasterPower();
    });
  }

  // 6. Sub-bar View Navigation Tabs
  const viewTabs = document.querySelectorAll(".view-tab-btn");
  viewTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      viewTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      board.setView(tab.dataset.view);
    });
  });

  // 7. Load Default Initial Circuit (Exp 1: AND gate ready to test)
  consolePanel.autoWireExperiment(EXPERIMENTS[0]);
  board.render();
  updateStatusBar();
});

