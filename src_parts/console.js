/* ===== CONSOLE ===== */
class LabConsole {
  constructor(engine, boardRenderer) {
    this.engine = engine;
    this.board = boardRenderer;
    this.currentTab = "experiments";
    this.currentExpId = "exp1";
    this.currentRefChip = "7408";
    this.verificationResults = null;

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
    this.render();
  }

  autoWireExperiment(exp) {
    // 1. Insert required ICs
    if (exp.recommendedSocketICs) {
      for (const [sId, chip] of Object.entries(exp.recommendedSocketICs)) {
        this.engine.insertChip(sId, chip, "left");
        this.engine.setSocketLever(sId, true);
      }
    }
    // 2. Clear existing wires and add experiment wires
    this.engine.clearWires();
    if (exp.recommendedWires) {
      for (const w of exp.recommendedWires) {
        this.engine.addWire(w.from, w.to, w.color || "#facc15");
      }
    }
    this.board.render();
    this.render();
  }

  verifyExperiment(exp) {
    if (!exp.tableRows || exp.tableRows.length === 0) {
      this.verificationResults = { passed: true, message: "No static truth table required for this interactive clock/counter experiment." };
      this.render();
      return;
    }

    // Save current switch state
    const savedInputs = { ...this.engine.inputs };
    let allPassed = true;
    const rowResults = [];

    for (const row of exp.tableRows) {
      // Apply input vector
      for (const [swId, val] of Object.entries(row.inputs)) {
        this.engine.inputs[swId] = val;
      }
      this.engine.evaluate();

      // Check expected outputs
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

    // Restore original inputs and evaluate
    this.engine.inputs = savedInputs;
    this.engine.evaluate();
    this.board.render();

    this.verificationResults = {
      passed: allPassed,
      rowResults,
      message: allPassed
        ? "✓ VERIFICATION PASSED: All truth table states matched correctly!"
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

    // Build truth table rows HTML
    let tableRowsHtml = "";
    if (exp.tableRows && exp.tableRows.length > 0) {
      tableRowsHtml = exp.tableRows.map((r, idx) => {
        let isCurrent = true;
        for (const [swId, val] of Object.entries(r.inputs)) {
          if (this.engine.inputs[swId] !== val) isCurrent = false;
        }

        let rowClass = isCurrent ? "active-row" : "";
        if (this.verificationResults && this.verificationResults.rowResults) {
          rowClass += this.verificationResults.rowResults[idx] ? " passed" : " failed";
        }

        const inputCells = Object.values(r.inputs).map(v => `<td>${v}</td>`).join("");
        const expectedCells = Object.values(r.expected).map(v => `<td><b>${v}</b></td>`).join("");
        const actualVal = this.engine.outputs["OUT.Y0"];
        const actualCell = `<td>${actualVal !== undefined ? actualVal : "-"}</td>`;

        return `
          <tr class="${rowClass}">
            ${inputCells}
            ${expectedCells}
            ${actualCell}
          </tr>
        `;
      }).join("");
    }

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

      <div class="card">
        <div class="card-header">
          <span class="card-title">Aim & Apparatus</span>
        </div>
        <p style="font-size: 12px; margin-bottom: 8px;"><b>Aim:</b> ${exp.aim}</p>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;"><b>Apparatus:</b> ${exp.apparatus}</p>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary" id="btn-auto-wire" style="flex: 1;">
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

      <div class="card">
        <div class="card-header">
          <span class="card-title">Truth Table & Real-Time State</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted);">Highlighted row indicates active input switch settings.</p>
        <table class="truth-table">
          <thead>
            <tr>
              ${exp.tableHeaders.map(h => `<th>${h}</th>`).join("")}
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
        <ul style="font-size: 11px; line-height: 1.6; padding-left: 14px; color: var(--text-muted);">
          ${exp.stepByStep.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  renderDrawerTab() {
    const sockets = ["U1", "U2", "U3", "U4", "U5"];
    const chips = Object.keys(IC_LIBRARY);

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">ZIF Socket Chip Inventory</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">
          Insert ICs into sockets U1–U4 (20-pin) or U5 (40-pin). Lock the lever to make electrical contact.
        </p>

        ${sockets.map(sId => {
          const s = this.engine.sockets[sId];
          const is40 = (sId === "U5");
          const icDef = s.chip ? IC_LIBRARY[s.chip] : null;

          return `
            <div class="socket-card">
              <div class="socket-card-header">
                <span class="socket-id">${sId} (${is40 ? "40-Pin ZIF" : "20-Pin ZIF"})</span>
                <span class="socket-chip-badge">${s.chip ? s.chip : "Empty"}</span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <div>
                  <label class="form-label">Chip Type</label>
                  <select class="socket-chip-select" data-socket="${sId}">
                    <option value="">-- Empty --</option>
                    ${chips.map(c => `
                      <option value="${c}" ${s.chip === c ? "selected" : ""}>${c} (${IC_LIBRARY[c].title})</option>
                    `).join("")}
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
                <button class="btn socket-lever-btn" data-socket="${sId}" style="padding: 3px 8px; font-size: 11px;">
                  Lever: ${s.leverLocked ? "🔒 Locked (Engaged)" : "🔓 Released"}
                </button>
                ${s.chip ? `
                  <button class="btn btn-danger socket-remove-btn" data-socket="${sId}" style="padding: 3px 8px; font-size: 11px;">
                    Remove
                  </button>
                ` : ""}
              </div>

              ${icDef ? `
                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--border-subtle); font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">
                  VCC: Pin ${icDef.vccPin} (Jack ${this.engine.getJackForICPin(sId, icDef.vccPin, icDef.pinCount, s.alignment)}) |
                  GND: Pin ${icDef.gndPin} (Jack ${this.engine.getJackForICPin(sId, icDef.gndPin, icDef.pinCount, s.alignment)})
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderReferenceTab() {
    const chipNames = Object.keys(IC_LIBRARY);
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
          <span style="font-size: 11px; font-family: var(--font-mono); color: #38bdf8;">${ic.package}</span>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">
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
                <td style="color: ${p.type === 'pwr' ? '#ef4444' : (p.type === 'gnd' ? '#60a5fa' : '#facc15')}">${p.name}</td>
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
            <div style="font-size: 10px; color: var(--text-muted);">Requires patch cords to VCC and GND</div>
          </div>
          <button class="btn ${this.engine.strictPowerMode ? 'btn-primary' : ''}" id="diag-strict-toggle" style="padding: 4px 10px; font-size: 11px;">
            ${this.engine.strictPowerMode ? "Strict (Active)" : "Auto-Power"}
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Circuit Status & Shorts</span>
        </div>
        ${this.engine.shorts.length > 0 ? `
          <div class="verdict-banner failure" style="margin-bottom: 8px;">
            ⚠️ SHORT CIRCUIT DETECTED (${this.engine.shorts.length})
          </div>
          <ul style="font-size: 11px; color: #fca5a5; line-height: 1.5; padding-left: 16px;">
            ${this.engine.shorts.map(s => `<li>${s}</li>`).join("")}
          </ul>
        ` : `
          <div class="verdict-banner success">
            ✓ Circuit Healthy: No short circuits detected.
          </div>
        `}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Netlist & Patch Cords (${this.engine.wires.length})</span>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <button class="btn" id="btn-export-wires" style="flex: 1;">Export JSON</button>
          <button class="btn" id="btn-import-wires" style="flex: 1;">Import JSON</button>
        </div>

        <div style="max-height: 160px; overflow-y: auto; font-family: var(--font-mono); font-size: 11px;">
          ${this.engine.wires.length === 0 ? `<div style="color: var(--text-dim); text-align: center; padding: 12px;">No wires patched</div>` : `
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
    `;
  }

  bindConsoleEvents() {
    // Tab switching
    this.container.querySelectorAll(".console-tab").forEach(btn => {
      btn.addEventListener("click", () => this.setTab(btn.dataset.tab));
    });

    // Experiment selection
    const expSelect = this.container.querySelector("#exp-select");
    if (expSelect) {
      expSelect.addEventListener("change", (e) => this.setExperiment(e.target.value));
    }

    // Auto-Wire button
    const btnAutoWire = this.container.querySelector("#btn-auto-wire");
    if (btnAutoWire) {
      btnAutoWire.addEventListener("click", () => {
        const exp = EXPERIMENTS.find(e => e.id === this.currentExpId);
        if (exp) this.autoWireExperiment(exp);
      });
    }

    // Verify Experiment button
    const btnVerify = this.container.querySelector("#btn-verify-exp");
    if (btnVerify) {
      btnVerify.addEventListener("click", () => {
        const exp = EXPERIMENTS.find(e => e.id === this.currentExpId);
        if (exp) this.verifyExperiment(exp);
      });
    }

    // IC Drawer selects
    this.container.querySelectorAll(".socket-chip-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const sId = e.target.dataset.socket;
        const chip = e.target.value;
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
        this.engine.removeChip(sId);
        this.board.render();
        this.render();
      });
    });

    // Reference chip select
    const refChipSelect = this.container.querySelector("#ref-chip-select");
    if (refChipSelect) {
      refChipSelect.addEventListener("change", (e) => {
        this.currentRefChip = e.target.value;
        this.render();
      });
    }

    // Diagnostics buttons
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

    // Delete single wire in netlist
    this.container.querySelectorAll(".btn-del-wire").forEach(btn => {
      btn.addEventListener("click", () => {
        this.engine.removeWire(btn.dataset.wire);
        this.board.render();
        this.render();
      });
    });

    // Wire export/import
    const btnExport = this.container.querySelector("#btn-export-wires");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const json = JSON.stringify(this.engine.wires, null, 2);
        navigator.clipboard.writeText(json).then(() => {
          alert("Wire configuration copied to clipboard!");
        }).catch(() => {
          prompt("Copy wire configuration JSON:", json);
        });
      });
    }

    const btnImport = this.container.querySelector("#btn-import-wires");
    if (btnImport) {
      btnImport.addEventListener("click", () => {
        const json = prompt("Paste Wire configuration JSON:");
        if (json) {
          try {
            const arr = JSON.parse(json);
            if (Array.isArray(arr)) {
              this.engine.wires = arr;
              this.engine.evaluate();
              this.board.render();
              this.render();
            }
          } catch (err) {
            alert("Invalid JSON format!");
          }
        }
      });
    }
  }
}

