/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  const svgBoard = document.getElementById("board-svg");
  const probeHud = document.getElementById("probe-hud");
  const probeJackName = document.getElementById("probe-jack-name");
  const probeState = document.getElementById("probe-state");
  const probeVoltage = document.getElementById("probe-voltage");
  const probeDot = document.getElementById("probe-dot");

  const statusCounterChip = document.getElementById("status-counters");
  const statusNetlistChip = document.getElementById("status-netlist-chip");
  const clockReadout = document.getElementById("clock-readout");
  const guideModal = document.getElementById("guide-modal");

  // 1. Core Engine
  const engine = new TTLEngine();

  // 2. Logic Probe Hover Handler
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

  // 3. Board Renderer & Console
  const board = new BoardRenderer(engine, svgBoard, handleJackHover);
  const consolePanel = new LabConsole(engine, board);

  // 4. Update UI Status on Engine State Changes
  const updateStatusBar = () => {
    // Count active seated ICs
    let icCount = 0;
    for (const s of Object.values(engine.sockets)) {
      if (s.chip) icCount++;
    }

    if (statusCounterChip) {
      statusCounterChip.textContent = `${engine.wires.length} cords · ${icCount} ICs`;
    }

    if (statusNetlistChip) {
      if (engine.shorts.length > 0) {
        statusNetlistChip.className = "status-chip short";
        statusNetlistChip.innerHTML = `⚠️ Short (${engine.shorts.length})`;
      } else {
        statusNetlistChip.className = "status-chip healthy";
        statusNetlistChip.innerHTML = `● Netlist: Healthy`;
      }
    }

    if (clockReadout) {
      clockReadout.textContent = `CLK: ${engine.clock.freq}Hz (${engine.clock.state === 1 ? 'HI' : 'LO'})`;
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

  // Clear / Reset
  const btnReset = document.getElementById("btn-reset-trainer");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Reset trainer kit? This clears all patch cords and resets switches.")) {
        engine.clearWires();
        for (const k of Object.keys(engine.inputs)) engine.inputs[k] = 0;
        engine.evaluate();
        board.fit();
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
      btnDeleteMode.textContent = active ? "✕ Delete (ON)" : "✕ Delete Wire";
    });
  }

  // Top Bar Experiments Dropdown
  const headerExpSelect = document.getElementById("header-exp-select");
  if (headerExpSelect) {
    headerExpSelect.addEventListener("change", (e) => {
      const expId = e.target.value;
      consolePanel.setExperiment(expId);
      consolePanel.setTab("experiments");
      const exp = EXPERIMENTS.find(x => x.id === expId);
      if (exp) consolePanel.autoWireExperiment(exp);
    });
  }

  // Guide Modal
  const btnGuide = document.getElementById("btn-open-guide");
  const btnCloseGuide = document.getElementById("btn-close-guide");
  if (btnGuide && guideModal) {
    btnGuide.addEventListener("click", () => guideModal.classList.add("open"));
  }
  if (btnCloseGuide && guideModal) {
    btnCloseGuide.addEventListener("click", () => guideModal.classList.remove("open"));
  }
  if (guideModal) {
    guideModal.addEventListener("click", (e) => {
      if (e.target === guideModal) guideModal.classList.remove("open");
    });
  }

  // PDF Manual button
  const btnManual = document.getElementById("btn-open-manual");
  if (btnManual) {
    btnManual.addEventListener("click", () => {
      consolePanel.setTab("reference");
    });
  }

  // Master Power
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

  // Zoom Controls
  const btnZoomIn = document.getElementById("btn-zoom-in");
  const btnZoomOut = document.getElementById("btn-zoom-out");
  const btnZoomFit = document.getElementById("btn-zoom-fit");

  if (btnZoomIn) btnZoomIn.addEventListener("click", () => board.zoom(0.85));
  if (btnZoomOut) btnZoomOut.addEventListener("click", () => board.zoom(1.18));
  if (btnZoomFit) {
    btnZoomFit.addEventListener("click", () => {
      board.fit();
      viewTabs.forEach(t => t.classList.toggle("active", t.dataset.view === "full"));
    });
  }

  // 7. Load Default Initial Circuit (Exp 1: AND gate)
  consolePanel.autoWireExperiment(EXPERIMENTS[0]);
  board.render();
  updateStatusBar();
});
