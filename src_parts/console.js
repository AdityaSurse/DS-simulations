/* ===== CONSOLE ===== */
class LabConsole {
  constructor(engine, boardRenderer) {
    this.engine = engine;
    this.board = boardRenderer;
    this.currentTab = "experiments";
    this.currentExpId = "exp1";
    this.selectedSubGate = "7408";
    this.currentRefChip = "7408";
    this.verificationResults = null;
    this.selfTestResults = null;

    this.container = document.getElementById("laboratory-console");
    this.init();
  }

  init() {
    this.render();
  }

  setTab(tabName) {
    this.currentTab = tabName;
    this.verificationResults = null;
    this.render();
  }

  setExperiment(expId) {
    this.currentExpId = expId;
    this.verificationResults = null;
    if (expId === "exp1") {
      this.selectedSubGate = "7408";
    }
    this.render();
  }

  getActiveExpConfig() {
    const exp = EXPERIMENTS.find(e => e.id === this.currentExpId) || EXPERIMENTS[0];
    if (exp.id === "exp1" && exp.subGates) {
      const subGateId = this.selectedSubGate || "7408";
      const subGate = exp.subGates[subGateId] || exp.subGates["7408"];
      return {
        ...exp,
        ...subGate,
        title: subGate.title ? `${exp.title}: ${subGate.title}` : exp.title,
        aim: subGate.aim || exp.aim,
        apparatus: subGate.apparatus || exp.apparatus,
        stepByStep: subGate.stepByStep || exp.stepByStep,
        recommendedSocketICs: subGate.recommendedSocketICs || exp.recommendedSocketICs,
        recommendedWires: subGate.recommendedWires || exp.recommendedWires,
        tableHeaders: subGate.tableHeaders || exp.tableHeaders,
        tableRows: subGate.tableRows || exp.tableRows
      };
    }
    return exp;
  }

  autoWireExperiment(exp) {
    const target = exp || this.getActiveExpConfig();
    const activeConfig = (target.id === "exp1" && target.subGates && this.selectedSubGate)
      ? { ...target, ...target.subGates[this.selectedSubGate] }
      : target;

    // 1. Insert required ICs
    if (activeConfig.recommendedSocketICs) {
      for (const [sId, chip] of Object.entries(activeConfig.recommendedSocketICs)) {
        this.engine.setSocketLever(sId, false);
        this.engine.insertChip(sId, chip, "left");
        this.engine.setSocketLever(sId, true);
      }
    }
    // 2. Clear existing wires and add experiment wires
    this.engine.clearWires();
    if (activeConfig.recommendedWires) {
      for (const w of activeConfig.recommendedWires) {
        this.engine.addWire(w.from, w.to, w.color || "#f5c518");
      }
    }
    this.board.render();
    this.render();
  }

  verifyExperiment(exp) {
    const target = exp || this.getActiveExpConfig();
    const activeConfig = (target.id === "exp1" && target.subGates && this.selectedSubGate)
      ? { ...target, ...target.subGates[this.selectedSubGate] }
      : target;

    if (!activeConfig.tableRows || activeConfig.tableRows.length === 0) {
      this.verificationResults = { passed: true, message: "Interactive experiment verified." };
      this.render();
      return;
    }

    const savedInputs = { ...this.engine.inputs };
    let allPassed = true;
    const rowResults = [];

    for (const row of activeConfig.tableRows) {
      for (const [swId, val] of Object.entries(row.inputs)) {
        this.engine.inputs[swId] = val;
      }
      this.engine.evaluate();

      let rowPassed = true;
      for (const [outJack, expVal] of Object.entries(row.expected)) {
        const actualVal = this.engine.outputs[outJack];
        if (actualVal !== expVal) {
          rowPassed = false;
        }
      }
      if (!rowPassed) allPassed = false;
      rowResults.push(rowPassed);
    }

    this.engine.inputs = savedInputs;
    this.engine.evaluate();
    this.board.render();

    this.verificationResults = {
      passed: allPassed,
      rowResults,
      message: allPassed
        ? `✓ VERIFICATION PASSED: All ${activeConfig.tableRows.length} truth table states matched correctly for ${activeConfig.title}!`
        : "✗ VERIFICATION FAILED: Output mismatch detected. Check your wiring and power connections."
    };

    if (allPassed) {
      this.engine.playClickSound(1200);
    } else {
      this.engine.playShortBuzzer();
    }

    this.render();
  }

  render() {
    if (!this.container) return;

    let content = "";
    if (this.currentTab === "experiments") {
      content = this.renderExperimentsTab();
    } else if (this.currentTab === "drawer") {
      content = this.renderDrawerTab();
    } else if (this.currentTab === "reference") {
      content = this.renderReferenceTab();
    } else if (this.currentTab === "diagnostics") {
      content = this.renderDiagnosticsTab();
    }

    this.container.innerHTML = `
      <div class="console-tabs">
        <button class="console-tab ${this.currentTab === 'experiments' ? 'active' : ''}" data-tab="experiments">
          <span>📋 AIM / LAB</span>
        </button>
        <button class="console-tab ${this.currentTab === 'drawer' ? 'active' : ''}" data-tab="drawer">
          <span>📦 IC DRAWER</span>
        </button>
        <button class="console-tab ${this.currentTab === 'reference' ? 'active' : ''}" data-tab="reference">
          <span>📖 REFERENCE</span>
        </button>
        <button class="console-tab ${this.currentTab === 'diagnostics' ? 'active' : ''}" data-tab="diagnostics">
          <span>⚡ DIAGNOSTICS</span>
        </button>
      </div>
      <div class="console-content">
        ${content}
      </div>
    `;

    this.bindConsoleEvents();
  }

  renderExperimentsTab() {
    const exp = EXPERIMENTS.find(e => e.id === this.currentExpId) || EXPERIMENTS[0];
    const activeExp = this.getActiveExpConfig();

    let tableRowsHtml = "";
    if (activeExp.tableRows && activeExp.tableRows.length > 0) {
      tableRowsHtml = activeExp.tableRows.map((r, idx) => {
        let isCurrent = true;
        for (const [swId, val] of Object.entries(r.inputs)) {
          if (this.engine.inputs[swId] !== val) isCurrent = false;
        }

        let rowClass = isCurrent ? "active-row" : "";
        if (this.verificationResults && this.verificationResults.rowResults) {
          rowClass += this.verificationResults.rowResults[idx] ? " passed" : " failed";
        }

        const inputCells = Object.values(r.inputs).map(v => `<td>${v}</td>`).join("");
        const expectedEntries = Object.entries(r.expected);
        const expectedCells = expectedEntries.map(([k, v]) => `<td><b>${v}</b></td>`).join("");
        const actualCells = expectedEntries.map(([k, v]) => {
          const actualVal = this.engine.outputs[k];
          return `<td>${actualVal !== undefined ? actualVal : "-"}</td>`;
        }).join("");

        return `
          <tr class="${rowClass}">
            ${inputCells}
            ${expectedCells}
            ${actualCells}
          </tr>
        `;
      }).join("");
    }

    const subgateSelectorHtml = (exp.id === "exp1" && exp.subGates) ? `
      <div class="card" style="margin-top: 10px;">
        <div class="card-header">
          <span class="card-title">Study Sub-Gate (${activeExp.name || activeExp.chip})</span>
          <span style="font-size: 11px; color: var(--accent-amber); font-weight: 700;">DIP-14</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Select any of the 7 basic TTL logic gates to wire and verify:
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${Object.keys(exp.subGates).map(gId => {
            const g = exp.subGates[gId];
            const isAct = (this.selectedSubGate === gId);
            return `
              <button class="btn subgate-btn ${isAct ? 'btn-active btn-teal' : ''}" data-gate="${gId}" style="padding: 4px 8px; font-size: 11px; font-family: var(--font-mono);">
                ${g.label || g.name}
              </button>
            `;
          }).join("")}
        </div>
      </div>
    ` : "";

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Select Practical Experiment</span>
        </div>
        <div class="form-group">
          <select id="exp-select">
            ${EXPERIMENTS.map(e => `
              <option value="${e.id}" ${e.id === exp.id ? "selected" : ""}>
                Exp ${e.number}: ${e.title}
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      ${subgateSelectorHtml}

      <div class="card">
        <div class="card-header">
          <span class="card-title">Aim & Apparatus</span>
        </div>
        <p style="font-size: 12px; margin-bottom: 8px;"><b>Aim:</b> ${activeExp.aim}</p>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 12px;"><b>Apparatus:</b> ${activeExp.apparatus}</p>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-teal" id="btn-auto-wire" style="flex: 1;">
            ⚡ Auto-Wire Circuit
          </button>
          <button class="btn" id="btn-verify-exp" style="flex: 1;">
            ✓ Verify Truth Table
          </button>
        </div>

        ${this.verificationResults ? `
          <div class="verdict-banner ${this.verificationResults.passed ? 'success' : 'failure'}">
            ${this.verificationResults.message}
          </div>
        ` : ""}
      </div>

      <!-- Power Mode Configuration (Aim Tab) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Power Mode Configuration</span>
          <button class="btn ${this.engine.strictPowerMode ? 'btn-teal' : ''}" id="aim-strict-toggle" style="padding: 3px 8px; font-size: 11px;">
            ${this.engine.strictPowerMode ? "Strict Mode (VCC+GND Required)" : "Auto-Power Mode"}
          </button>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-top: 4px;">
          ${this.engine.strictPowerMode
            ? "<b>Strict Power Mode:</b> ICs require patch cords from +5V to VCC and GND to operate."
            : "<b>Auto-Power Mode:</b> Sockets are automatically powered when their levers are locked."}
        </p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Truth Table & Real-Time State</span>
        </div>
        <p style="font-size: 11px; color: #8b949e;">Highlighted row matches current input switch settings.</p>
        <table class="truth-table">
          <thead>
            <tr>
              ${activeExp.tableHeaders.map(h => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Step-by-Step Procedure</span>
        </div>
        <ul style="font-size: 11px; line-height: 1.6; padding-left: 14px; color: #8b949e;">
          ${activeExp.stepByStep.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  renderDrawerTab() {
    const sockets = ["U1", "U2", "U3", "U4", "U5"];
    const basicChips = ["7400", "7402", "7404", "7408", "7420", "7432", "7486"];
    const otherChips = Object.keys(IC_LIBRARY).filter(c => !basicChips.includes(c) && c !== "TEST_GATE");

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">ZIF Socket Chip Inventory</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 10px;">
          ⚠️ <b>Rule:</b> The ZIF lever must be <b>UNLOCKED (OPEN)</b> to seat or remove an IC, and <b>LOCKED</b> to make electrical contact.
        </p>

        ${sockets.map(sId => {
          const s = this.engine.sockets[sId];
          const is40 = (sId === "U5");
          const icDef = s.chip ? IC_LIBRARY[s.chip] : null;

          return `
            <div class="socket-card">
              <div class="socket-card-header">
                <span class="socket-id">${sId} (${is40 ? "40-Pin ZIF" : "20-Pin ZIF"})</span>
                <span class="socket-chip-badge">${s.chip ? (icDef ? (icDef.marking || ('SN' + s.chip + 'N')) : s.chip) : "Empty"}</span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <div>
                  <label class="form-label">Chip Type</label>
                  <select class="socket-chip-select" data-socket="${sId}">
                    <option value="">-- Empty (No IC) --</option>
                    <optgroup label="Basic TTL Gates (Always in Drawer)">
                      ${basicChips.filter(c => IC_LIBRARY[c]).map(c => `
                        <option value="${c}" ${s.chip === c ? "selected" : ""}>${c} (${IC_LIBRARY[c].title})</option>
                      `).join("")}
                    </optgroup>
                    <optgroup label="MSI Logic & Counter ICs">
                      ${otherChips.filter(c => IC_LIBRARY[c]).map(c => `
                        <option value="${c}" ${s.chip === c ? "selected" : ""}>${c} (${IC_LIBRARY[c].title})</option>
                      `).join("")}
                    </optgroup>
                  </select>
                </div>

                ${!is40 ? `
                  <div>
                    <label class="form-label">Alignment</label>
                    <select class="socket-align-select" data-socket="${sId}">
                      <option value="left" ${s.alignment === "left" ? "selected" : ""}>Left (Pin 1 @ J1)</option>
                      <option value="center" ${s.alignment === "center" ? "selected" : ""}>Center</option>
                      <option value="right" ${s.alignment === "right" ? "selected" : ""}>Right</option>
                    </select>
                  </div>
                ` : '<div></div>'}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                <button class="btn socket-lever-btn ${s.leverLocked ? '' : 'btn-active'}" data-socket="${sId}" style="padding: 3px 8px; font-size: 11px;">
                  Lever: ${s.leverLocked ? "🔒 Locked (Engaged)" : "🔓 Open (Unlocked)"}
                </button>
                ${s.chip ? `
                  <button class="btn btn-danger socket-remove-btn" data-socket="${sId}" style="padding: 3px 8px; font-size: 11px;">
                    Remove
                  </button>
                ` : ""}
              </div>

              ${icDef ? `
                <div style="margin-top: 8px; padding: 6px 8px; background: rgba(15, 23, 42, 0.7); border-radius: 4px; border-left: 3px solid var(--accent-teal); font-size: 10px; color: #cbd5e1; line-height: 1.5; font-family: var(--font-mono);">
                  <div><b>Marking:</b> ${icDef.marking || ('SN' + s.chip + 'N')} &middot; ${icDef.package}</div>
                  <div><b>Pin Count Enforcement:</b> ${icDef.pinCount}-Pin IC seated in ${is40 ? '40' : '20'}-Pin ZIF (${s.alignment === 'left' ? 'Left-Aligned: Pin 1 @ Socket J1' : s.alignment}).</div>
                  <div style="color: #94a3b8;">
                    Pins 1&ndash;${icDef.pinCount/2} map to J1&ndash;J${icDef.pinCount/2}; Pins ${icDef.pinCount/2 + 1}&ndash;${icDef.pinCount} map to J${20 - icDef.pinCount/2 + 1}&ndash;J20.
                  </div>
                  <div style="color: var(--accent-amber); margin-top: 2px;">
                    VCC: Pin ${icDef.vccPin} (Jack ${this.engine.getJackForICPin(sId, icDef.vccPin, icDef.pinCount, s.alignment)}) &middot;
                    GND: Pin ${icDef.gndPin} (Jack ${this.engine.getJackForICPin(sId, icDef.gndPin, icDef.pinCount, s.alignment)})
                  </div>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderReferenceTab() {
    const chipNames = Object.keys(IC_LIBRARY).filter(c => c !== "TEST_GATE");
    const ic = IC_LIBRARY[this.currentRefChip] || IC_LIBRARY["7408"];

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Datasheet Pinout Reference</span>
        </div>
        <div class="form-group">
          <label class="form-label">Select IC Datasheet</label>
          <select id="ref-chip-select">
            ${chipNames.map(c => `
              <option value="${c}" ${c === this.currentRefChip ? "selected" : ""}>
                ${c} - ${IC_LIBRARY[c].title} (${IC_LIBRARY[c].package})
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">${ic.name}: ${ic.title}</span>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-teal);">${ic.marking || ('SN' + ic.name + 'N')} &middot; ${ic.package}</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          ${ic.description || ''}
        </p>
        <p style="font-size: 11px; color: var(--accent-amber); margin-bottom: 10px; font-family: var(--font-mono);">
          TTL Logic Series. VCC = +5V (Pin ${ic.vccPin}), GND = 0V (Pin ${ic.gndPin}).
        </p>

        <div style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">Pin Configuration</div>
        <table class="truth-table" style="margin-bottom: 12px;">
          <thead>
            <tr><th>Pin #</th><th>Name</th><th>Function / Type</th></tr>
          </thead>
          <tbody>
            ${ic.pins.map(p => `
              <tr>
                <td><b>${p.pin}</b></td>
                <td style="color: ${p.type === 'pwr' ? '#ef4444' : (p.type === 'gnd' ? '#60a5fa' : (p.type === 'nc' ? '#6b7280' : '#facc15'))}">${p.name}</td>
                <td>${p.type.toUpperCase()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        ${ic.truthTable ? `
          <div style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">Function Truth Table</div>
          <table class="truth-table">
            <thead>
              <tr>${ic.truthTable.headers.map(h => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${ic.truthTable.rows.map(row => `
                <tr>${row.map(val => `<td>${val}</td>`).join("")}</tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}
      </div>
    `;
  }

  renderDiagnosticsTab() {
    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Kit Power Settings</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 12px;">Master Mains Power</span>
          <button class="master-power-btn ${this.engine.masterPower ? 'on' : ''}" id="diag-master-pwr">
            <div class="power-indicator"></div>
            <span class="power-text">${this.engine.masterPower ? "230V ON" : "OFF"}</span>
          </button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 12px; font-weight: 500;">Strict Power Mode</div>
            <div style="font-size: 10px; color: #8b949e;">Requires patch cords to VCC and GND</div>
          </div>
          <button class="btn ${this.engine.strictPowerMode ? 'btn-teal' : ''}" id="diag-strict-toggle" style="padding: 4px 10px; font-size: 11px;">
            ${this.engine.strictPowerMode ? "Strict (Active)" : "Auto-Power"}
          </button>
        </div>
      </div>

      <!-- Self-Tests Card (Required by Phase 3 Spec) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🧪 Engine Self-Tests (runSelfTests)</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Verify pulser POS/NEG complement, 1 Hz virtual time 10s edge counts, 10 kHz overrun cap tolerance, and 7490 falling-edge counting.
        </p>
        <button class="btn btn-teal" id="btn-run-selftests" style="width: 100%; margin-bottom: 8px;">
          ▶ Run Self-Tests
        </button>

        ${this.selfTestResults ? `
          <div class="verdict-banner ${this.selfTestResults.passed ? 'success' : 'failure'}" style="margin-bottom: 8px;">
            ${this.selfTestResults.passed ? '✓ ALL SELF-TESTS PASSED' : '✗ TEST SUITE FAILED'}
          </div>
          <ul style="font-size: 11px; line-height: 1.6; padding-left: 14px; color: #cbd5e1;">
            ${this.selfTestResults.tests.map(t => `
              <li style="color: ${t.pass ? '#86efac' : '#fca5a5'};">
                ${t.pass ? '✓' : '✗'} <b>${t.name}</b> ${t.details ? `(${t.details})` : ''}
              </li>
            `).join("")}
          </ul>
        ` : ""}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Circuit Status & Diagnostics</span>
        </div>
        ${this.engine.shorts.length > 0 ? `
          <div class="verdict-banner failure" style="margin-bottom: 8px;">
            ⚠️ SHORT CIRCUIT DETECTED (${this.engine.shorts.length})
          </div>
          <ul style="font-size: 11px; color: #fca5a5; line-height: 1.5; padding-left: 16px; margin-bottom: 8px;">
            ${this.engine.shorts.map(s => `<li>${s}</li>`).join("")}
          </ul>
        ` : ''}

        ${this.engine.oscillating ? `
          <div class="verdict-banner failure" style="margin-bottom: 8px;">
            🔄 FEEDBACK OSCILLATION DETECTED
          </div>
          <ul style="font-size: 11px; color: #fca5a5; line-height: 1.5; padding-left: 16px; margin-bottom: 8px;">
            ${this.engine.diagnostics.oscillations.map(o => `<li>${o}</li>`).join("")}
          </ul>
        ` : ''}

        ${this.engine.diagnostics.floatingInputs.length > 0 ? `
          <div style="font-size: 11px; color: #f59e0b; margin-bottom: 4px; font-weight: 600;">
            ⚡ Floating Inputs Detected (Defaulting to Logic 1):
          </div>
          <ul style="font-size: 10.5px; color: #cbd5e1; line-height: 1.4; padding-left: 16px; margin-bottom: 8px;">
            ${this.engine.diagnostics.floatingInputs.slice(0, 4).map(f => `<li>${f.message}</li>`).join("")}
            ${this.engine.diagnostics.floatingInputs.length > 4 ? `<li>... and ${this.engine.diagnostics.floatingInputs.length - 4} more</li>` : ''}
          </ul>
        ` : ''}

        ${this.engine.shorts.length === 0 && !this.engine.oscillating && this.engine.diagnostics.floatingInputs.length === 0 ? `
          <div class="verdict-banner success">
            ✓ Circuit Healthy: No shorts or feedback oscillations detected.
          </div>
        ` : ''}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Netlist & Patch Cords (${this.engine.wires.length})</span>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <button class="btn" id="btn-export-wires" style="flex: 1;">Export JSON</button>
          <button class="btn" id="btn-import-wires" style="flex: 1;">Import JSON</button>
        </div>

        <div style="max-height: 140px; overflow-y: auto; font-family: var(--font-mono); font-size: 11px;">
          ${this.engine.wires.length === 0 ? `<div style="color: #64748b; text-align: center; padding: 12px;">No wires patched</div>` : `
            <table class="truth-table">
              <thead><tr><th>From</th><th>To</th><th>Color</th><th>Action</th></tr></thead>
              <tbody>
                ${this.engine.wires.map(w => `
                  <tr>
                    <td>${w.from}</td>
                    <td>${w.to}</td>
                    <td><span style="display:inline-block; width:10px; height:10px; background:${w.color}; border-radius:50%;"></span></td>
                    <td><button class="btn btn-danger btn-del-wire" data-wire="${w.id}" style="padding:1px 6px; font-size:10px;">✕</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `}
        </div>
      </div>

      <!-- Collapsible Live Netlist Debug Panel (Phase 5 Requirement 9) -->
      <details class="card" style="margin-top: 10px;">
        <summary style="cursor: pointer; font-size: 12px; font-weight: 700; color: var(--accent-teal); padding: 4px 0;">
          🔍 Live Netlist Debug Panel (${this.engine.nets.length} Nets)
        </summary>
        <div style="max-height: 220px; overflow-y: auto; margin-top: 8px; font-family: var(--font-mono); font-size: 10px;">
          <table class="truth-table" style="font-size: 10px;">
            <thead>
              <tr>
                <th>Net Root</th>
                <th>Val</th>
                <th>V</th>
                <th>Drivers</th>
                <th>Connected Jacks</th>
              </tr>
            </thead>
            <tbody>
              ${this.engine.nets.map(n => `
                <tr>
                  <td style="font-weight: 600; color: #fff;">${n.root}</td>
                  <td>
                    <span class="status-chip ${n.val === 1 ? 'healthy' : (n.val === 'X' ? 'short' : '')}" style="padding: 1px 5px; font-size: 9px;">
                      ${n.val}
                    </span>
                  </td>
                  <td>${n.voltage.toFixed(2)}V</td>
                  <td style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${n.drivers.map(d => `${d.source}=${d.level}`).join(', ')}">
                    ${n.drivers.length > 0 ? n.drivers.map(d => d.source).join(', ') : 'None (Z)'}
                  </td>
                  <td style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${Array.from(n.jacks).join(', ')}">
                    ${Array.from(n.jacks).join(', ')}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }

  bindConsoleEvents() {
    this.container.querySelectorAll(".console-tab").forEach(btn => {
      btn.addEventListener("click", () => this.setTab(btn.dataset.tab));
    });

    const expSelect = this.container.querySelector("#exp-select");
    if (expSelect) {
      expSelect.addEventListener("change", (e) => this.setExperiment(e.target.value));
    }

    // Subgate selection buttons
    this.container.querySelectorAll(".subgate-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedSubGate = btn.dataset.gate;
        this.verificationResults = null;
        this.autoWireExperiment();
      });
    });

    const btnAutoWire = this.container.querySelector("#btn-auto-wire");
    if (btnAutoWire) {
      btnAutoWire.addEventListener("click", () => {
        this.autoWireExperiment();
      });
    }

    const btnVerify = this.container.querySelector("#btn-verify-exp");
    if (btnVerify) {
      btnVerify.addEventListener("click", () => {
        this.verifyExperiment();
      });
    }

    // Self-tests button
    const btnSelfTests = this.container.querySelector("#btn-run-selftests");
    if (btnSelfTests) {
      btnSelfTests.addEventListener("click", () => {
        this.selfTestResults = this.engine.runSelfTests();
        this.render();
      });
    }

    // IC Drawer selects
    this.container.querySelectorAll(".socket-chip-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const sId = e.target.dataset.socket;
        const chip = e.target.value;
        const socket = this.engine.sockets[sId];

        if (socket.leverLocked) {
          alert(`Socket ${sId} lever is LOCKED! Please click the lever to open/unlock it before inserting or changing a chip.`);
          e.target.value = socket.chip || "";
          return;
        }

        if (chip) this.engine.insertChip(sId, chip);
        else this.engine.removeChip(sId);
        this.board.render();
        this.render();
      });
    });

    this.container.querySelectorAll(".socket-align-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const sId = e.target.dataset.socket;
        if (this.engine.sockets[sId].chip) {
          this.engine.sockets[sId].alignment = e.target.value;
          this.engine.evaluate();
          this.board.render();
          this.render();
        }
      });
    });

    this.container.querySelectorAll(".socket-lever-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.dataset.socket;
        const cur = this.engine.sockets[sId].leverLocked;
        this.engine.setSocketLever(sId, !cur);
        this.board.render();
        this.render();
      });
    });

    this.container.querySelectorAll(".socket-remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.dataset.socket;
        const socket = this.engine.sockets[sId];
        if (socket.leverLocked) {
          alert(`Socket ${sId} lever is LOCKED! Open the lever to release and remove the IC.`);
          return;
        }
        this.engine.removeChip(sId);
        this.board.render();
        this.render();
      });
    });

    const refChipSelect = this.container.querySelector("#ref-chip-select");
    if (refChipSelect) {
      refChipSelect.addEventListener("change", (e) => {
        this.currentRefChip = e.target.value;
        this.render();
      });
    }

    const diagPwr = this.container.querySelector("#diag-master-pwr");
    if (diagPwr) {
      diagPwr.addEventListener("click", () => {
        this.engine.toggleMasterPower();
        this.board.render();
        this.render();
      });
    }

    const diagStrict = this.container.querySelector("#diag-strict-toggle");
    if (diagStrict) {
      diagStrict.addEventListener("click", () => {
        this.engine.setStrictPowerMode(!this.engine.strictPowerMode);
        this.board.render();
        this.render();
      });
    }

    const aimStrict = this.container.querySelector("#aim-strict-toggle");
    if (aimStrict) {
      aimStrict.addEventListener("click", () => {
        this.engine.setStrictPowerMode(!this.engine.strictPowerMode);
        this.board.render();
        this.render();
      });
    }

    this.container.querySelectorAll(".btn-del-wire").forEach(btn => {
      btn.addEventListener("click", () => {
        this.engine.removeWire(btn.dataset.wire);
        this.board.render();
        this.render();
      });
    });

    const btnExport = this.container.querySelector("#btn-export-wires");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const json = this.engine.exportCircuitJSON();
        try {
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `dit9005_circuit_${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (e) {
          prompt("Copy Circuit JSON:", json);
        }
      });
    }

    const btnImport = this.container.querySelector("#btn-import-wires");
    if (btnImport) {
      btnImport.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json,application/json";
        input.onchange = (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              const ok = this.engine.importCircuitJSON(re.target.result);
              if (ok) {
                this.board.render();
                this.render();
              } else {
                alert("Failed to import circuit JSON: Invalid format.");
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      });
    }
  }
}
if (typeof window !== "undefined") {
  window.LabConsole = LabConsole;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LabConsole };
}
