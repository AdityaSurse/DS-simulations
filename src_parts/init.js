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
  const qaModal = document.getElementById("qa-modal");

  // 1. Boot Splash Screen (Hardware POST)
  const bootSplash = document.getElementById("boot-splash");
  const splashFill = document.getElementById("splash-fill");
  if (bootSplash) {
    if (splashFill) {
      setTimeout(() => { splashFill.style.width = "100%"; }, 50);
    }
    const dismissSplash = () => {
      bootSplash.classList.add("fade-out");
      setTimeout(() => {
        if (bootSplash.parentNode) bootSplash.style.display = "none";
      }, 550);
    };
    setTimeout(dismissSplash, 700);
    bootSplash.addEventListener("click", dismissSplash);
    window.addEventListener("keydown", (e) => {
      if (!bootSplash.classList.contains("fade-out")) {
        dismissSplash();
      }
    }, { once: true });
  }

  // 2. Core TTL Engine
  const engine = new TTLEngine();

  // Expose engine globally
  window.ditEngine = engine;
  window.boardState = engine.board;

  // 3. Logic Probe Hover Handler
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

  // 4. Board Renderer & Console
  const board = new BoardRenderer(engine, svgBoard, handleJackHover);
  const consolePanel = new LabConsole(engine, board);
  window.board = board;
  window.boardRenderer = board;
  window.consolePanel = consolePanel;

  // 5. Update UI Status on Engine State Changes
  const updateStatusBar = () => {
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
      if (!engine.masterPower) {
        clockReadout.innerHTML = `CLK: ${engine.formatClockFreq()} <span style="color:#64748b; font-weight:600;">(OFF)</span>`;
      } else {
        const runStatus = engine.clock.running ? "RUN" : "PAUSED";
        const overrunBadge = engine.sim.overrun ? ' <span style="color:#ef4444; font-weight:700;">[OVERRUN]</span>' : '';
        clockReadout.innerHTML = `CLK: ${engine.formatClockFreq()} (${runStatus})${overrunBadge}`;
      }
    }

    const masterPwrBtn = document.getElementById("master-pwr-header");
    if (masterPwrBtn) {
      masterPwrBtn.classList.toggle("on", engine.masterPower);
      masterPwrBtn.querySelector(".power-text").textContent = engine.masterPower ? "230V ON" : "OFF";
    }

    const btnExamMode = document.getElementById("btn-exam-mode");
    if (btnExamMode && typeof consolePanel !== "undefined") {
      btnExamMode.classList.toggle("btn-active", !!consolePanel.examMode);
      btnExamMode.textContent = consolePanel.examMode ? "🎓 Exam Mode (ON)" : "🎓 Exam Mode";
    }

    const expSelect = document.getElementById("header-exp-select");
    if (expSelect && typeof consolePanel !== "undefined" && expSelect.value !== consolePanel.currentExpId) {
      expSelect.value = consolePanel.currentExpId;
    }
  };
  window.updateStatusBar = updateStatusBar;

  engine.onChange(() => {
    board.render();
    updateStatusBar();
  });

  // 6. Header Control Bindings & Event Listeners
  window.addEventListener("cordsChanged", () => {
    updateStatusBar();
  });

  const colorSwatches = document.querySelectorAll(".color-swatch");
  colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      colorSwatches.forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      board.setColor(swatch.dataset.color);
    });
  });

  const btnUndo = document.getElementById("btn-undo-wire");
  if (btnUndo) {
    btnUndo.addEventListener("click", () => engine.undo());
  }

  const btnRedo = document.getElementById("btn-redo-wire");
  if (btnRedo) {
    btnRedo.addEventListener("click", () => engine.redo());
  }

  const btnClearCords = document.getElementById("btn-clear-cords");
  if (btnClearCords) {
    btnClearCords.addEventListener("click", () => {
      if (engine.wires.length > 0) {
        engine.clearWires();
      }
    });
  }

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

  const btnDeleteMode = document.getElementById("btn-delete-mode");
  if (btnDeleteMode) {
    btnDeleteMode.addEventListener("click", () => {
      const active = !board.deleteMode;
      board.setDeleteMode(active);
      btnDeleteMode.classList.toggle("btn-active", active);
      btnDeleteMode.textContent = active ? "✕ Delete (ON)" : "✕ Delete Wire";
    });
  }

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

  const btnExamMode = document.getElementById("btn-exam-mode");
  if (btnExamMode) {
    btnExamMode.addEventListener("click", () => {
      consolePanel.toggleExamMode();
      btnExamMode.classList.toggle("btn-active", consolePanel.examMode);
      btnExamMode.textContent = consolePanel.examMode ? "🎓 Exam Mode (ON)" : "🎓 Exam Mode";
    });
  }

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

  const btnManual = document.getElementById("btn-open-manual");
  if (btnManual) {
    btnManual.addEventListener("click", () => {
      consolePanel.setTab("reference");
    });
  }

  const headerPwrBtn = document.getElementById("master-pwr-header");
  if (headerPwrBtn) {
    headerPwrBtn.addEventListener("click", () => {
      engine.toggleMasterPower();
    });
  }

  // Clickable Netlist Status Chip -> opens Diagnostics tab & highlights shorts
  if (statusNetlistChip) {
    statusNetlistChip.style.cursor = "pointer";
    statusNetlistChip.title = "Click to inspect circuit diagnostics & locate shorts";
    statusNetlistChip.addEventListener("click", () => {
      if (typeof consolePanel !== "undefined") {
        consolePanel.setTab("diagnostics");
      }
      if (engine.shorts.length > 0 && typeof board !== "undefined") {
        const shortJacks = [];
        for (const net of engine.nets) {
          if (net.val === "X") {
            for (const j of net.jacks) shortJacks.push(j);
          }
        }
        board.setHighlightedJacks(shortJacks);
      }
    });
  }

  // 7. Phase 10 Toggles: Sound, Theme, Contrast
  const btnToggleSound = document.getElementById("btn-toggle-sound");
  const updateSoundBtn = () => {
    if (!btnToggleSound) return;
    const on = !!engine.soundEnabled;
    btnToggleSound.textContent = on ? "🔊 Sound: ON" : "🔇 Sound: OFF";
    btnToggleSound.classList.toggle("btn-active", on);
  };
  updateSoundBtn();
  if (btnToggleSound) {
    btnToggleSound.addEventListener("click", () => {
      engine.toggleSound();
      updateSoundBtn();
    });
  }

  const btnToggleTheme = document.getElementById("btn-toggle-theme");
  const savedTheme = localStorage.getItem("dit9005_theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
  const updateThemeBtn = () => {
    if (!btnToggleTheme) return;
    const isLight = document.body.classList.contains("light-theme");
    btnToggleTheme.classList.toggle("btn-active", isLight);
    btnToggleTheme.title = isLight ? "Switch to Dark Theme" : "Switch to Light Shell Theme";
  };
  updateThemeBtn();
  if (btnToggleTheme) {
    btnToggleTheme.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      const isLight = document.body.classList.contains("light-theme");
      localStorage.setItem("dit9005_theme", isLight ? "light" : "dark");
      updateThemeBtn();
    });
  }

  const btnToggleContrast = document.getElementById("btn-toggle-contrast");
  const savedContrast = localStorage.getItem("dit9005_contrast");
  if (savedContrast === "high") {
    document.body.classList.add("high-contrast");
  }
  const updateContrastBtn = () => {
    if (!btnToggleContrast) return;
    const isHigh = document.body.classList.contains("high-contrast");
    btnToggleContrast.classList.toggle("btn-active", isHigh);
  };
  updateContrastBtn();
  if (btnToggleContrast) {
    btnToggleContrast.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
      const isHigh = document.body.classList.contains("high-contrast");
      localStorage.setItem("dit9005_contrast", isHigh ? "high" : "normal");
      updateContrastBtn();
    });
  }

  // 8. Phase 10 QA Suite Modal & Hotkey (Ctrl+Shift+Q)
  const btnOpenQA = document.getElementById("btn-open-qa");
  const btnCloseQA = document.getElementById("btn-close-qa");
  const btnRerunQA = document.getElementById("btn-rerun-qa");
  const qaBanner = document.getElementById("qa-summary-banner");
  const qaLogContainer = document.getElementById("qa-log-container");

  const runAndDisplayQA = () => {
    if (!qaModal || !qaLogContainer) return;
    qaModal.classList.add("open");
    qaLogContainer.innerHTML = '<div style="color: #38bdf8; padding: 12px;">⏳ Running automated QA test suite & latency benchmarks...</div>';
    if (qaBanner) {
      qaBanner.style.background = "#1e293b";
      qaBanner.style.color = "#94a3b8";
      qaBanner.textContent = "Executing tests across 15 IC models, 8 experiments, and engine cores...";
    }

    setTimeout(() => {
      const res = engine.runAllTests();
      const allPass = res.passed;
      if (qaBanner) {
        qaBanner.style.background = allPass ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)";
        qaBanner.style.border = allPass ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)";
        qaBanner.style.color = allPass ? "#86efac" : "#fca5a5";
        qaBanner.innerHTML = `<b>${allPass ? "✓ ALL QA CHECKS PASSED" : "⚠️ QA FAILURES DETECTED"}</b> — ` +
          `${res.summary.passedCount}/${res.summary.totalTests} tests passed · ` +
          `Benchmark: <b>${res.benchmark.avgSettleMs.toFixed(2)} ms / settle</b> (Target: &lt;16ms) · ` +
          `Total Time: ${res.summary.totalDurationMs} ms`;
      }

      let html = "";

      // Section 1: Benchmark
      html += `<div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-weight: 700; color: #f59e0b; margin-bottom: 4px;">⚡ PERFORMANCE BENCHMARK (5 ICs, 60 cords, 50 cycles)</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Average Engine Settle Latency: <b>${res.benchmark.avgSettleMs.toFixed(2)} ms</b></span>
          <span class="${res.benchmark.passPerformance ? 'qa-pass-chip' : 'qa-fail-chip'}">${res.benchmark.passPerformance ? 'PASS (&lt;16ms)' : 'FAIL'}</span>
        </div>
      </div>`;

      // Section 2: Core Self Tests
      html += `<div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🔌 ENGINE & NETLIST SELF-TESTS (${res.selfTests.tests.filter(t => t.pass).length}/${res.selfTests.tests.length})</div>`;
      for (const t of res.selfTests.tests) {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; font-size: 11px;">
          <span style="color: ${t.pass ? '#cbd5e1' : '#f87171'};">● ${t.name}: <span style="color: #94a3b8;">${t.details || ''}</span></span>
          <span class="${t.pass ? 'qa-pass-chip' : 'qa-fail-chip'}">${t.pass ? 'PASS' : 'FAIL'}</span>
        </div>`;
      }
      html += `</div>`;

      // Section 3: Complex IC Models
      html += `<div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-weight: 700; color: #a78bfa; margin-bottom: 6px;">🔲 COMPLEX IC MODEL TESTS (${res.icTests.tests.filter(t => t.pass).length}/${res.icTests.tests.length})</div>`;
      for (const t of res.icTests.tests) {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; font-size: 11px;">
          <span style="color: ${t.pass ? '#cbd5e1' : '#f87171'};">● ${t.name}: <span style="color: #94a3b8;">${t.details || ''}</span></span>
          <span class="${t.pass ? 'qa-pass-chip' : 'qa-fail-chip'}">${t.pass ? 'PASS' : 'FAIL'}</span>
        </div>`;
      }
      html += `</div>`;

      // Section 4: Experiment Solution Verification
      html += `<div>
        <div style="font-weight: 700; color: #34d399; margin-bottom: 6px;">🧪 EXPERIMENT SOLUTION VERIFICATION (${res.experimentTests.filter(t => t.pass).length}/${res.experimentTests.length})</div>`;
      for (const t of res.experimentTests) {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; font-size: 11px;">
          <span style="color: ${t.pass ? '#cbd5e1' : '#f87171'};">● ${t.name}: <span style="color: #94a3b8;">${t.details || ''}</span></span>
          <span class="${t.pass ? 'qa-pass-chip' : 'qa-fail-chip'}">${t.pass ? 'PASS' : 'FAIL'}</span>
        </div>`;
      }
      html += `</div>`;

      qaLogContainer.innerHTML = html;
    }, 40);
  };

  if (btnOpenQA) btnOpenQA.addEventListener("click", runAndDisplayQA);
  if (btnRerunQA) btnRerunQA.addEventListener("click", runAndDisplayQA);
  if (btnCloseQA && qaModal) {
    btnCloseQA.addEventListener("click", () => qaModal.classList.remove("open"));
  }
  if (qaModal) {
    qaModal.addEventListener("click", (e) => {
      if (e.target === qaModal) qaModal.classList.remove("open");
    });
  }

  // Keyboard shortcut Ctrl+Shift+Q or Cmd+Shift+Q for QA modal, and Esc for modals
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "q" || e.key === "Q")) {
      e.preventDefault();
      if (qaModal.classList.contains("open")) {
        qaModal.classList.remove("open");
      } else {
        runAndDisplayQA();
      }
    } else if (e.key === "Escape") {
      if (qaModal && qaModal.classList.contains("open")) qaModal.classList.remove("open");
      if (guideModal && guideModal.classList.contains("open")) guideModal.classList.remove("open");
    }
  });

  // 9. Sub-bar View Navigation Tabs
  const viewTabs = document.querySelectorAll(".view-tab-btn");
  viewTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      viewTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      board.setView(tab.dataset.view);
    });
  });

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

  // 10. Load Circuit: Restore from localStorage if present, else load Exp 1
  const hasSavedCircuit = engine.loadSavedCircuit();
  if (!hasSavedCircuit) {
    consolePanel.autoWireExperiment(EXPERIMENTS[0]);
  }
  board.render();
  updateStatusBar();
});
