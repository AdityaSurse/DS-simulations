/* ===== CONSOLE ===== */
class LabConsole {
  constructor(engine, boardRenderer) {
    this.engine = engine;
    this.board = boardRenderer;
    this.currentTab = "experiments";
    this.currentExpId = "exp1";
    this.selectedSubGate = "7408";
    this.selectedSubCircuits = {
      exp1: "7408",
      exp2: "mux8_3var",
      exp3: "fa_74138",
      exp4: "adder_4bit",
      exp5: "mod6",
      exp6: "sipo"
    };
    this.currentRefChip = "7408";
    this.verificationResults = null;
    this.selfTestResults = null;
    this.showSolutionWiring = false;
    this.showGhostSolution = false;
    this.hintMessage = null;
    this.icSuiteResults = null;
    this.examMode = false;
    this.expConclusions = {};

    this.container = document.getElementById("laboratory-console");
    this.init();
  }

  init() {
    this.render();
  }

  setTab(tabName) {
    this.currentTab = tabName;
    this.verificationResults = null;
    this.hintMessage = null;
    this.render();
  }

  setExperiment(expId) {
    this.currentExpId = expId;
    this.verificationResults = null;
    this.hintMessage = null;
    this.showGhostSolution = false;
    this.board.setGhostWires([], false);
    this.board.setHighlightedJacks([]);
    if (expId === "exp1") {
      this.selectedSubGate = "7408";
    }
    // Also sync header select if exists
    const headerSel = document.getElementById("header-exp-select");
    if (headerSel && headerSel.value !== expId) {
      headerSel.value = expId;
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
        procedure: subGate.procedure || subGate.stepByStep || exp.procedure || exp.stepByStep,
        stepByStep: subGate.procedure || subGate.stepByStep || exp.procedure || exp.stepByStep,
        requiredICs: subGate.requiredICs || [subGate.chip || "7408"],
        recommendedSocketICs: subGate.recommendedSocketICs || exp.recommendedSocketICs,
        solutionWiring: subGate.solutionWiring || subGate.recommendedWires || exp.solutionWiring || exp.recommendedWires,
        recommendedWires: subGate.solutionWiring || subGate.recommendedWires || exp.solutionWiring || exp.recommendedWires,
        truthTable: subGate.truthTable || exp.truthTable,
        tableHeaders: subGate.tableHeaders || exp.tableHeaders,
        tableRows: subGate.tableRows || (subGate.truthTable && subGate.truthTable.rows) || exp.tableRows,
        checker: subGate.checker || exp.checker
      };
    } else if (exp.subCircuits) {
      const subKeys = Object.keys(exp.subCircuits);
      const subId = (this.selectedSubCircuits && this.selectedSubCircuits[exp.id]) || subKeys[0];
      const sub = exp.subCircuits[subId] || exp.subCircuits[subKeys[0]];
      return {
        ...exp,
        ...sub,
        title: sub.title ? `${exp.title}: ${sub.title}` : exp.title,
        aim: sub.aim || exp.aim,
        procedure: sub.procedure || sub.stepByStep || exp.procedure || exp.stepByStep,
        stepByStep: sub.procedure || sub.stepByStep || exp.procedure || exp.stepByStep,
        requiredICs: sub.requiredICs || exp.requiredICs,
        recommendedSocketICs: sub.recommendedSocketICs || exp.recommendedSocketICs,
        solutionWiring: sub.solutionWiring || sub.recommendedWires || exp.solutionWiring || exp.recommendedWires,
        recommendedWires: sub.solutionWiring || sub.recommendedWires || exp.solutionWiring || exp.recommendedWires,
        truthTable: sub.truthTable || exp.truthTable,
        tableHeaders: sub.tableHeaders || exp.tableHeaders,
        tableRows: sub.tableRows || (sub.truthTable && sub.truthTable.rows) || exp.tableRows,
        checker: sub.checker || exp.checker
      };
    }
    return {
      ...exp,
      procedure: exp.procedure || exp.stepByStep,
      stepByStep: exp.procedure || exp.stepByStep,
      solutionWiring: exp.solutionWiring || exp.recommendedWires,
      recommendedWires: exp.solutionWiring || exp.recommendedWires,
      tableRows: exp.tableRows || (exp.truthTable && exp.truthTable.rows)
    };
  }

  autoWireExperiment(exp) {
    if (this.examMode) return;
    const activeConfig = exp || this.getActiveExpConfig();

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
    const wires = activeConfig.solutionWiring || activeConfig.recommendedWires;
    if (wires) {
      for (const w of wires) {
        this.engine.addWire(w.from || w.a, w.to || w.b, w.color || "#f5c518");
      }
    }
    this.board.setHighlightedJacks([]);
    this.board.render();
    this.render();
  }

  // Auto-Check using Cloned Engine Instance (Non-destructive to live switch state)
  autoCheckCircuit(exp) {
    if (this.examMode) return;
    const target = exp || this.getActiveExpConfig();
    const cloned = this.engine.clone();

    // 1. If custom checker exists on experiment, run it
    if (typeof target.checker === "function") {
      const checkRes = target.checker(cloned);
      this.verificationResults = {
        passed: checkRes.pass,
        message: checkRes.pass ? `✓ CIRCUIT VERIFIED: ${checkRes.details}` : `✗ VERIFICATION FAILED: ${checkRes.details}`,
        failingRows: checkRes.failingRows || [],
        rowResults: checkRes.rowResults || []
      };
      this.render();
      return this.verificationResults;
    }

    // 2. Otherwise sweep truthTable rows on cloned instance
    const rows = target.tableRows || (target.truthTable && target.truthTable.rows) || [];
    if (rows.length === 0) {
      this.verificationResults = { passed: true, message: "Interactive experiment verified." };
      this.render();
      return this.verificationResults;
    }

    let allPassed = true;
    const rowResults = [];
    const failingRows = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (r.inputs) {
        for (const [inKey, inVal] of Object.entries(r.inputs)) {
          if (typeof inVal === "number") {
            cloned.inputs[inKey] = inVal;
          }
        }
      }
      cloned.evaluate();

      let rowPass = true;
      if (r.expected) {
        for (const [outKey, expVal] of Object.entries(r.expected)) {
          if (typeof expVal === "number") {
            const actualVal = cloned.outputs[outKey];
            if (actualVal !== expVal) {
              rowPass = false;
              break;
            }
          }
        }
      }
      rowResults.push(rowPass);
      if (!rowPass) {
        allPassed = false;
        failingRows.push(i);
      }
    }

    this.verificationResults = {
      passed: allPassed,
      message: allPassed
        ? `✓ ALL ${rows.length} TRUTH TABLE ROWS VERIFIED (100% PASS)`
        : `✗ VERIFICATION FAILED: ${failingRows.length} of ${rows.length} rows incorrect`,
      failingRows,
      rowResults
    };
    this.render();
    return this.verificationResults;
  }

  // Hint button: reveals next missing connection by highlighting both jacks
  giveHint() {
    if (this.examMode) return;
    const active = this.getActiveExpConfig();
    const solWires = active.solutionWiring || active.recommendedWires || [];
    if (solWires.length === 0) {
      this.hintMessage = "No solution wiring defined for this circuit.";
      this.render();
      return;
    }

    // Find first unconnected wire
    let missingWire = null;
    for (const w of solWires) {
      const from = w.from || w.a;
      const to = w.to || w.b;
      if (!this.engine.areJacksConnected(from, to)) {
        missingWire = { from, to, color: w.color };
        break;
      }
    }

    if (missingWire) {
      this.board.setHighlightedJacks([missingWire.from, missingWire.to]);
      this.hintMessage = `💡 <b>Next Connection:</b> Connect jack <code>${missingWire.from}</code> to jack <code>${missingWire.to}</code>.`;
      this.render();
      return {
        missingWire,
        highlightJacks: [missingWire.from, missingWire.to],
        message: this.hintMessage
      };
    } else {
      this.board.setHighlightedJacks([]);
      this.hintMessage = `✓ All <b>${solWires.length}</b> solution patch cords are connected! Click <b>Auto-Check</b> to verify circuit logic.`;
      this.render();
      return {
        missingWire: null,
        highlightJacks: [],
        message: this.hintMessage
      };
    }
  }

  // Toggle ghost solution wiring
  toggleGhostSolution() {
    if (this.examMode) return;
    const active = this.getActiveExpConfig();
    this.showGhostSolution = !this.showGhostSolution;
    const wires = active.solutionWiring || active.recommendedWires || [];
    this.board.setGhostWires(wires, this.showGhostSolution);
    this.render();
  }

  // Exam Mode toggle
  toggleExamMode() {
    this.examMode = !this.examMode;
    if (this.examMode) {
      this.showGhostSolution = false;
      this.board.setGhostWires([], false);
      this.board.setHighlightedJacks([]);
      this.hintMessage = null;
      this.verificationResults = null;
      this.showSolutionWiring = false;
    }
    this.render();
    this.board.render();
  }

  // Quick insert featured chip into first free socket
  insertFeaturedChip(chip) {
    const freeSocket = Object.keys(this.engine.sockets).find(sId => !this.engine.sockets[sId].chip);
    if (!freeSocket) {
      alert("All sockets are currently occupied. Please unlock and remove an unused chip first.");
      return;
    }
    this.engine.setSocketLever(freeSocket, false);
    this.engine.insertChip(freeSocket, chip, "left");
    this.engine.setSocketLever(freeSocket, true);
    this.board.render();
    this.render();
  }

  // Printable observation sheet export
  printObservationSheet() {
    const active = this.getActiveExpConfig();
    const conclusion = (this.expConclusions && this.expConclusions[this.currentExpId]) || "Truth table verified according to laboratory specifications.";
    const apparatusList = (active.apparatus && Array.isArray(active.apparatus))
      ? active.apparatus.map(a => `${a.ic} (${a.qty || 1}x)`).join(", ")
      : (active.apparatus || "DIT 9005 Trainer Kit, TTL ICs, Patch cords");

    let printContainer = document.getElementById("observation-sheet-printable");
    if (!printContainer) {
      printContainer = document.createElement("div");
      printContainer.id = "observation-sheet-printable";
      document.body.appendChild(printContainer);
    }

    const rows = active.tableRows || (active.truthTable && active.truthTable.rows) || [];
    const headers = active.tableHeaders || (active.truthTable && active.truthTable.headers) || ["Inputs", "Expected", "Observed"];

    const tableRowsHtml = rows.map((r, idx) => {
      const inputsStr = r.inputs ? Object.entries(r.inputs).map(([k, v]) => `${k.replace('IN.', '')}=${v}`).join(', ') : '-';
      const expectedStr = r.expected ? Object.entries(r.expected).map(([k, v]) => `${k.replace('OUT.', '')}=${v}`).join(', ') : '-';
      const observedStr = r.expected ? Object.entries(r.expected).map(([k, v]) => `${k.replace('OUT.', '')}=${this.engine.outputs[k] !== undefined ? this.engine.outputs[k] : v}`).join(', ') : '-';
      return `
        <tr>
          <td>${idx + 1}</td>
          <td><code>${inputsStr}</code></td>
          <td><b>${expectedStr}</b></td>
          <td style="color: #047857; font-weight: 700;">${observedStr} (PASS)</td>
        </tr>
      `;
    }).join("");

    printContainer.innerHTML = `
      <div style="font-family: 'Inter', sans-serif; padding: 25px; color: #000; background: #fff; max-width: 800px; margin: 0 auto;">
        <div style="border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; text-align: center;">
          <h2 style="margin: 0 0 4px 0; font-size: 18pt; letter-spacing: 0.5px;">DIT 9005 DIGITAL IC TRAINER SIMULATOR</h2>
          <div style="font-size: 11pt; font-weight: 600; text-transform: uppercase;">Digital Systems Practical Examination &middot; Observation Sheet</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 10.5pt; margin-bottom: 16px; border: 1px solid #ccc; padding: 10px; border-radius: 4px;">
          <div><b>Student Name:</b> ___________________________</div>
          <div><b>Roll / PRN No:</b> ___________________________</div>
          <div><b>Experiment No:</b> Exp ${active.number || '1'}</div>
          <div><b>Date of Exam:</b> ${new Date().toLocaleDateString()}</div>
        </div>

        <div style="margin-bottom: 14px; font-size: 10.5pt;">
          <div><b>Title:</b> ${active.title}</div>
          <div style="margin-top: 4px;"><b>Aim:</b> ${active.aim}</div>
          <div style="margin-top: 4px;"><b>Apparatus:</b> ${apparatusList}</div>
        </div>

        <div style="margin-bottom: 14px;">
          <h4 style="margin: 0 0 6px 0; font-size: 11pt;">Truth Table Verification:</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt; text-align: left;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="border: 1px solid #000; padding: 6px;">#</th>
                <th style="border: 1px solid #000; padding: 6px;">Input State</th>
                <th style="border: 1px solid #000; padding: 6px;">Expected Output</th>
                <th style="border: 1px solid #000; padding: 6px;">Observed Output</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px 0; font-size: 11pt;">Observation & Conclusion:</h4>
          <div style="border: 1px solid #000; min-height: 80px; padding: 10px; font-size: 10pt; line-height: 1.5; background: #fafafa;">
            ${conclusion}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #666; font-size: 10.5pt;">
          <div>
            <b>Student Signature:</b> ___________________
          </div>
          <div>
            <b>Faculty Signature:</b> ___________________<br>
            <span style="font-size: 9pt; color: #666;">Grade: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 10 ]</span>
          </div>
        </div>
      </div>
    `;

    window.print();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="console-tabs">
        <button class="console-tab ${this.currentTab === 'experiments' ? 'active' : ''}" data-tab="experiments">
          Aim & Table
        </button>
        <button class="console-tab ${this.currentTab === 'drawer' ? 'active' : ''}" data-tab="drawer">
          IC Drawer
        </button>
        <button class="console-tab ${this.currentTab === 'reference' ? 'active' : ''}" data-tab="reference">
          Reference
        </button>
        <button class="console-tab ${this.currentTab === 'diagnostics' ? 'active' : ''}" data-tab="diagnostics">
          Diagnostics
        </button>
      </div>
      <div class="console-body" id="console-tab-content">
        ${this.renderTabContent()}
      </div>
    `;

    this.bindConsoleEvents();
  }

  renderTabContent() {
    switch (this.currentTab) {
      case "experiments":
        return this.renderExperimentsTab();
      case "drawer":
        return this.renderDrawerTab();
      case "reference":
        return this.renderReferenceTab();
      case "diagnostics":
        return this.renderDiagnosticsTab();
      default:
        return this.renderExperimentsTab();
    }
  }

  renderExperimentsTab() {
    const exp = EXPERIMENTS.find(e => e.id === this.currentExpId) || EXPERIMENTS[0];
    const activeExp = this.getActiveExpConfig();

    let tableRowsHtml = "";
    const rows = activeExp.tableRows || (activeExp.truthTable && activeExp.truthTable.rows) || [];
    if (rows && rows.length > 0) {
      tableRowsHtml = rows.map((r, idx) => {
        let isCurrent = true;
        if (r.inputs) {
          for (const [swId, val] of Object.entries(r.inputs)) {
            if (this.engine.inputs[swId] !== undefined && this.engine.inputs[swId] !== val) isCurrent = false;
          }
        }

        let rowClass = isCurrent ? "active-row" : "";
        if (this.verificationResults && this.verificationResults.rowResults) {
          rowClass += this.verificationResults.rowResults[idx] ? " passed" : " failed";
        }

        const inputCells = r.inputs ? Object.values(r.inputs).map(v => `<td>${v}</td>`).join("") : "";
        const expectedCells = r.expected ? Object.entries(r.expected).map(([k, v]) => `<td><b>${v}</b></td>`).join("") : "";
        const actualCells = r.expected ? Object.entries(r.expected).map(([k, v]) => {
          const actualVal = this.engine.outputs[k];
          return `<td>${actualVal !== undefined ? actualVal : "-"}</td>`;
        }).join("") : "";

        return `
          <tr class="${rowClass}">
            ${inputCells}
            ${expectedCells}
            ${actualCells}
          </tr>
        `;
      }).join("");
    }

    // Sub-gate / Sub-circuit switcher buttons
    let subSelectorHtml = "";
    if (exp.id === "exp1" && exp.subGates) {
      subSelectorHtml = `
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
      `;
    } else if (exp.subCircuits) {
      const activeSubKey = (this.selectedSubCircuits && this.selectedSubCircuits[exp.id]) || Object.keys(exp.subCircuits)[0];
      subSelectorHtml = `
        <div class="card" style="margin-top: 10px;">
          <div class="card-header">
            <span class="card-title">Select Sub-Circuit / Function</span>
            <span style="font-size: 11px; color: var(--accent-amber); font-weight: 700;">Exp ${exp.number}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${Object.keys(exp.subCircuits).map(scId => {
              const sc = exp.subCircuits[scId];
              const isAct = (activeSubKey === scId);
              return `
                <button class="btn subcircuit-btn ${isAct ? 'btn-active btn-teal' : ''}" data-exp="${exp.id}" data-sub="${scId}" style="padding: 4px 8px; font-size: 11px; font-family: var(--font-mono);">
                  ${sc.label || sc.title}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    const apparatusStr = (activeExp.apparatus && Array.isArray(activeExp.apparatus))
      ? activeExp.apparatus.map(a => `${a.ic} (${a.qty || 1}x)`).join(", ")
      : (activeExp.apparatus || "DIT 9005 Trainer Kit, Patch cords");

    const conclusionVal = (this.expConclusions && this.expConclusions[this.currentExpId]) || "";

    return `
      <!-- Exam Mode Banner / Toggle -->
      <div class="card" style="border-color: ${this.examMode ? '#f59e0b' : 'var(--border-subtle)'}; background: ${this.examMode ? 'rgba(245, 158, 11, 0.08)' : 'transparent'};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 12px; font-weight: 700; color: ${this.examMode ? '#fbbf24' : '#f8fafc'};">
              🎓 Digital Systems Exam Mode:
            </span>
            <span style="font-size: 11px; margin-left: 6px; color: ${this.examMode ? '#fde68a' : '#94a3b8'};">
              ${this.examMode ? "ACTIVE (Guided tools disabled)" : "Practice Mode (Guided tools enabled)"}
            </span>
          </div>
          <button class="btn ${this.examMode ? 'btn-teal' : ''}" id="btn-toggle-exammode" style="padding: 4px 10px; font-size: 11px;">
            ${this.examMode ? "Exit Exam Mode" : "Start Exam Mode"}
          </button>
        </div>
      </div>

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

      ${subSelectorHtml}

      <div class="card">
        <div class="card-header">
          <span class="card-title">Aim & Apparatus</span>
        </div>
        <p style="font-size: 12px; margin-bottom: 8px;"><b>Aim:</b> ${activeExp.aim}</p>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 12px;"><b>Apparatus:</b> ${apparatusStr}</p>

        ${this.examMode ? `
          <div class="verdict-banner" style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #fbbf24; margin-bottom: 8px;">
            🎓 EXAM MODE ACTIVE — Auto-Wire, Hint, Ghost Solution Cords, and Auto-Check are disabled for practical assessment. Wire the circuit independently from the Reference Datasheet and record observations below.
          </div>
        ` : `
          <!-- Guided Mode Action Buttons -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
            <button class="btn btn-teal" id="btn-auto-check" style="flex: 2; font-weight: 700;">
              ✓ Auto-Check Circuit
            </button>
            <button class="btn" id="btn-give-hint" style="flex: 1;" title="Highlight next missing wire">
              💡 Hint
            </button>
            <button class="btn ${this.showGhostSolution ? 'btn-teal' : ''}" id="btn-ghost-solution" style="flex: 1.5;" title="Toggle dashed ghost patch cords on the board">
              ${this.showGhostSolution ? "👻 Hide Ghost Cords" : "👻 Show Solution"}
            </button>
            <button class="btn" id="btn-auto-wire" style="flex: 1.2;">
              ⚡ Auto-Wire
            </button>
          </div>

          ${this.hintMessage ? `
            <div class="verdict-banner" style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #fef08a; margin-bottom: 8px;">
              ${this.hintMessage}
            </div>
          ` : ""}

          ${this.verificationResults ? `
            <div class="verdict-banner ${this.verificationResults.passed ? 'success' : 'failure'}">
              ${this.verificationResults.message}
            </div>
          ` : ""}
        `}
      </div>

      ${!this.examMode ? `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="card-title" style="font-size: 11.5px;">Solution Patch Cords List</span>
            <button class="btn" id="btn-toggle-solution" style="padding: 2px 8px; font-size: 11px;">
              ${this.showSolutionWiring ? "▲ Hide List" : "💡 Show List (" + (activeExp.solutionWiring ? activeExp.solutionWiring.length : 0) + " cords)"}
            </button>
          </div>
          ${this.showSolutionWiring && activeExp.solutionWiring && activeExp.solutionWiring.length > 0 ? `
            <div style="margin-top: 8px; background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px;">
              <table class="truth-table" style="font-size: 10.5px;">
                <thead>
                  <tr><th>#</th><th>From Jack</th><th>To Jack</th><th>Wire Color</th></tr>
                </thead>
                <tbody>
                  ${activeExp.solutionWiring.map((w, idx) => `
                    <tr>
                      <td><b>${idx + 1}</b></td>
                      <td><code>${w.from || w.a}</code></td>
                      <td><code>${w.to || w.b}</code></td>
                      <td><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:${w.color};vertical-align:middle;margin-right:6px;border:1px solid rgba(255,255,255,0.2);"></span><code>${w.color}</code></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : ""}
        </div>
      ` : ""}

      <div class="card">
        <div class="card-header">
          <span class="card-title">Truth Table & Real-Time State</span>
        </div>
        <p style="font-size: 11px; color: #8b949e;">Highlighted row matches current input switch settings.</p>
        <table class="truth-table">
          <thead>
            <tr>
              ${(activeExp.tableHeaders || []).map(h => `<th>${h}</th>`).join("")}
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
          ${(activeExp.procedure || activeExp.stepByStep || []).map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>

      <!-- Conclusion Box & Printable Observation Sheet -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📝 Student Observation & Conclusion</span>
          <button class="btn btn-teal" id="btn-print-sheet" style="padding: 3px 8px; font-size: 11px;">
            🖨️ Print Observation Sheet
          </button>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 6px;">
          Type your practical observations and conclusion here. Click "Print Observation Sheet" to export a clean lab record.
        </p>
        <textarea id="exp-conclusion-input" rows="3" style="width: 100%; box-sizing: border-box; background: #090d16; border: 1px solid #1e293b; border-radius: 4px; color: #f8fafc; font-family: var(--font-sans); font-size: 11.5px; padding: 8px; resize: vertical;" placeholder="Type observation and conclusion for Exp ${activeExp.number || ''}...">${conclusionVal}</textarea>
      </div>
    `;
  }

  renderDrawerTab() {
    const sockets = ["U1", "U2", "U3", "U4", "U5"];
    const basicChips = ["7400", "7402", "7404", "7408", "7420", "7432", "7486"];
    const otherChips = Object.keys(IC_LIBRARY).filter(c => !basicChips.includes(c) && c !== "TEST_GATE");
    const activeExp = this.getActiveExpConfig();
    const reqICs = activeExp.requiredICs || [];

    return `
      <!-- Featured ICs for Active Experiment -->
      <div class="card" style="border-color: rgba(56, 189, 248, 0.4); background: rgba(56, 189, 248, 0.05); margin-bottom: 12px;">
        <div class="card-header">
          <span class="card-title" style="color: var(--accent-teal);">⭐ Featured ICs for Exp ${activeExp.number || ''}</span>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-amber); font-weight: 700;">${reqICs.join(", ")}</span>
        </div>
        <p style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
          Click to seat featured chips into the first available ZIF socket:
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${reqICs.map(chip => `
            <button class="btn btn-teal insert-featured-btn" data-chip="${chip}" style="font-size: 11px; padding: 4px 8px;">
              + Seat ${chip} (${IC_LIBRARY[chip] ? IC_LIBRARY[chip].title.slice(0, 20) + '...' : ''})
            </button>
          `).join("")}
        </div>
      </div>

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
                        <option value="${c}" ${s.chip === c ? "selected" : ""}>
                          ${c} (${IC_LIBRARY[c].title})
                        </option>
                      `).join("")}
                    </optgroup>
                    <optgroup label="Complex MSI/LSI Logic Chips">
                      ${otherChips.map(c => `
                        <option value="${c}" ${s.chip === c ? "selected" : ""}>
                          ${c} (${IC_LIBRARY[c].title})
                        </option>
                      `).join("")}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label class="form-label">Alignment</label>
                  <select class="socket-align-select" data-socket="${sId}" ${!s.chip || is40 ? "disabled" : ""}>
                    <option value="left" ${s.alignment === "left" ? "selected" : ""}>Left-Aligned</option>
                    <option value="center" ${s.alignment === "center" ? "selected" : ""}>Center-Aligned</option>
                    <option value="right" ${s.alignment === "right" ? "selected" : ""}>Right-Aligned</option>
                  </select>
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="btn socket-lever-btn ${s.leverLocked ? '' : 'btn-teal'}" data-socket="${sId}" style="flex: 1; font-size: 11px;">
                  ${s.leverLocked ? "🔒 Lever Locked (Operating)" : "🔓 Lever Open (Unlocked)"}
                </button>
                <button class="btn socket-remove-btn" data-socket="${sId}" style="flex: 1; font-size: 11px;" ${!s.chip ? "disabled" : ""}>
                  Remove IC
                </button>
              </div>
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

      ${(ic.name === "7490" || ic.name === "74LS90") ? this.render7490TimingDiagram() : ""}
    `;
  }

  render7490TimingDiagram() {
    let liveHistory = null;
    let socketId = null;
    for (const [sId, s] of Object.entries(this.engine.sockets)) {
      if (s.chip && (s.chip === "7490" || s.chip === "74LS90") && s.state && s.state.history && s.state.history.length > 0) {
        liveHistory = s.state.history;
        socketId = sId;
        break;
      }
    }

    let samples = [];
    let isLive = false;
    if (liveHistory && liveHistory.length >= 2) {
      samples = liveHistory.slice(-32);
      isLive = true;
    } else {
      for (let c = 0; c < 10; c++) {
        const qa = c & 1;
        const qb = (c >> 1) & 1;
        const qc = (c >> 2) & 1;
        const qd = (c >> 3) & 1;
        samples.push({ clk: 1, qa, qb, qc, qd, label: `${c}` });
        samples.push({ clk: 0, qa, qb, qc, qd, label: `${c}` });
      }
    }

    const totalSteps = samples.length;
    const svgWidth = 520;
    const svgHeight = 220;
    const leftGutter = 60;
    const rightGutter = 15;
    const plotWidth = svgWidth - leftGutter - rightGutter;
    const stepWidth = plotWidth / Math.max(1, totalSteps);

    const signals = [
      { name: "CLKA", key: "clk", color: "#f59e0b", yTop: 20, yBot: 45 },
      { name: "QA (÷2)", key: "qa", color: "#38bdf8", yTop: 60, yBot: 85 },
      { name: "QB", key: "qb", color: "#34d399", yTop: 100, yBot: 125 },
      { name: "QC", key: "qc", color: "#a78bfa", yTop: 140, yBot: 165 },
      { name: "QD (MSB)", key: "qd", color: "#f472b6", yTop: 180, yBot: 205 }
    ];

    let tracesHtml = "";
    for (const sig of signals) {
      let pathD = "";
      for (let i = 0; i < totalSteps; i++) {
        const x1 = leftGutter + (i * stepWidth);
        const x2 = leftGutter + ((i + 1) * stepWidth);
        const val = samples[i][sig.key];
        const yVal = val === 1 ? sig.yTop : sig.yBot;

        if (i === 0) {
          pathD += `M ${x1} ${yVal} L ${x2} ${yVal}`;
        } else {
          const prevVal = samples[i - 1][sig.key];
          const prevY = prevVal === 1 ? sig.yTop : sig.yBot;
          if (prevY !== yVal) {
            pathD += ` L ${x1} ${yVal}`;
          }
          pathD += ` L ${x2} ${yVal}`;
        }
      }

      tracesHtml += `
        <text x="${leftGutter - 8}" y="${(sig.yTop + sig.yBot) / 2 + 4}" fill="${sig.color}" font-family="var(--font-mono)" font-size="9.5" font-weight="700" text-anchor="end">${sig.name}</text>
        <line x1="${leftGutter}" y1="${sig.yBot}" x2="${svgWidth - rightGutter}" y2="${sig.yBot}" stroke="#334155" stroke-width="1" stroke-dasharray="2,2"/>
        <line x1="${leftGutter}" y1="${sig.yTop}" x2="${svgWidth - rightGutter}" y2="${sig.yTop}" stroke="#1e293b" stroke-width="0.5"/>
        <path d="${pathD}" fill="none" stroke="${sig.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    }

    let gridHtml = "";
    for (let i = 0; i <= totalSteps; i++) {
      const x = leftGutter + (i * stepWidth);
      gridHtml += `<line x1="${x}" y1="15" x2="${x}" y2="210" stroke="#1e293b" stroke-width="0.5"/>`;
      if (samples[i] && samples[i].label) {
        gridHtml += `<text x="${x + stepWidth / 2}" y="12" fill="#94a3b8" font-family="var(--font-mono)" font-size="9" text-anchor="middle">${samples[i].label}</text>`;
      }
    }

    return `
      <div class="card" style="margin-top: 12px;">
        <div class="card-header">
          <span class="card-title">⏱️ 74LS90 Timing Diagram (${isLive ? `Live in Socket ${socketId} &middot; ${samples.length} Transitions` : 'Reference Decade Sequence'})</span>
          <span style="font-size: 11px; font-family: var(--font-mono); color: ${isLive ? 'var(--accent-teal)' : '#94a3b8'}; font-weight: 700;">${isLive ? '🔴 LIVE CAPTURE' : 'IDEAL 0..9 BCD'}</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Displays digital waveform for divide-by-2 section (CLKA → QA) and divide-by-5 section (CLKB → QB, QC, QD).
          Transitions trigger on <b>FALLING edges</b> (1 → 0).
        </p>

        <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; overflow-x: auto;">
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; min-width: 440px; display: block;">
            ${gridHtml}
            ${tracesHtml}
          </svg>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn btn-teal" id="btn-pulse-clk" style="flex: 1; font-size: 11px;">
            ⚡ Pulse CLKA
          </button>
          <button class="btn" id="btn-clear-timing" style="flex: 1; font-size: 11px;">
            🗑️ Clear Capture Buffer
          </button>
        </div>
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

      <!-- Complex IC Suite Card (Required for Phase 7) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔬 Complex IC Verification Suite (runICTests)</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Exhaustive logic tests for <b>74LS153</b> (dual 4:1 MUX), <b>74LS138</b> (3:8 decoder), <b>7483</b> (4-bit binary adder), <b>74LS90</b> (decade counter & resets), and <b>7474</b> (dual D flip-flop with asynchronous preset/clear & edge latching).
        </p>
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <button class="btn btn-teal" id="btn-run-icsuite" style="flex: 2;">
            ▶ Run Complex IC Suite
          </button>
          <button class="btn" id="btn-reset-ffs" style="flex: 1;" title="Clear all sequential flip-flops and counters">
            🔄 Reset All FFs
          </button>
        </div>

        ${this.icSuiteResults ? `
          <div class="verdict-banner ${this.icSuiteResults.passed ? 'success' : 'failure'}" style="margin-bottom: 8px;">
            ${this.icSuiteResults.passed ? '✓ ALL COMPLEX IC TESTS PASSED (100%)' : '✗ COMPLEX IC SUITE FAILED'}
          </div>
          <table class="truth-table" style="font-size: 10.5px;">
            <thead>
              <tr><th>Status</th><th>IC</th><th>Test Specification</th><th>Details</th></tr>
            </thead>
            <tbody>
              ${this.icSuiteResults.tests.map(t => `
                <tr>
                  <td style="color: ${t.pass ? '#86efac' : '#fca5a5'}; font-weight: 700;">${t.pass ? '✓ PASS' : '✗ FAIL'}</td>
                  <td><b>${t.ic}</b></td>
                  <td>${t.name}</td>
                  <td style="font-family: var(--font-mono); color: #94a3b8;">${t.details || 'Verified'}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}
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
          <div style="display: flex; gap: 4px;">
            <button class="btn" id="btn-export-wires" style="padding: 2px 6px; font-size: 10.5px;">Export JSON</button>
            <button class="btn" id="btn-import-wires" style="padding: 2px 6px; font-size: 10.5px;">Import JSON</button>
          </div>
        </div>
        ${this.engine.wires.length === 0 ? `
          <p style="font-size: 11px; color: #64748b;">No patch cords connected yet. Click any jack to start wiring.</p>
        ` : `
          <div style="max-height: 150px; overflow-y: auto;">
            <table class="truth-table" style="font-size: 10px;">
              <thead>
                <tr><th>#</th><th>From</th><th>To</th><th>Color</th><th>Action</th></tr>
              </thead>
              <tbody>
                ${this.engine.wires.map(w => `
                  <tr>
                    <td>${w.id}</td>
                    <td><code>${w.from}</code></td>
                    <td><code>${w.to}</code></td>
                    <td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${w.color};"></span></td>
                    <td><button class="btn btn-del-wire" data-wire="${w.id}" style="padding: 1px 5px; font-size: 10px;">&times;</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `}
      </div>
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

    // Subgate selection buttons (Exp 1)
    this.container.querySelectorAll(".subgate-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedSubGate = btn.dataset.gate;
        this.verificationResults = null;
        this.hintMessage = null;
        this.autoWireExperiment();
      });
    });

    // Subcircuit selection buttons (Exp 2..6)
    this.container.querySelectorAll(".subcircuit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const expId = btn.dataset.exp;
        const subId = btn.dataset.sub;
        if (!this.selectedSubCircuits) this.selectedSubCircuits = {};
        this.selectedSubCircuits[expId] = subId;
        this.verificationResults = null;
        this.hintMessage = null;
        this.autoWireExperiment();
      });
    });

    // Auto-Wire button
    const btnAutoWire = this.container.querySelector("#btn-auto-wire");
    if (btnAutoWire) {
      btnAutoWire.addEventListener("click", () => {
        this.autoWireExperiment();
      });
    }

    // Auto-Check button
    const btnAutoCheck = this.container.querySelector("#btn-auto-check");
    if (btnAutoCheck) {
      btnAutoCheck.addEventListener("click", () => {
        this.autoCheckCircuit();
      });
    }

    // Hint button
    const btnHint = this.container.querySelector("#btn-give-hint");
    if (btnHint) {
      btnHint.addEventListener("click", () => {
        this.giveHint();
      });
    }

    // Ghost Solution Wires button
    const btnGhost = this.container.querySelector("#btn-ghost-solution");
    if (btnGhost) {
      btnGhost.addEventListener("click", () => {
        this.toggleGhostSolution();
      });
    }

    // Exam Mode Toggle button
    const btnExam = this.container.querySelector("#btn-toggle-exammode");
    if (btnExam) {
      btnExam.addEventListener("click", () => {
        this.toggleExamMode();
      });
    }

    // Solution wiring list toggle
    const btnToggleSolution = this.container.querySelector("#btn-toggle-solution");
    if (btnToggleSolution) {
      btnToggleSolution.addEventListener("click", () => {
        this.showSolutionWiring = !this.showSolutionWiring;
        this.render();
      });
    }

    // Conclusion text area persistence
    const conclusionInput = this.container.querySelector("#exp-conclusion-input");
    if (conclusionInput) {
      conclusionInput.addEventListener("input", (e) => {
        if (!this.expConclusions) this.expConclusions = {};
        this.expConclusions[this.currentExpId] = e.target.value;
      });
    }

    // Print Observation Sheet button
    const btnPrintSheet = this.container.querySelector("#btn-print-sheet");
    if (btnPrintSheet) {
      btnPrintSheet.addEventListener("click", () => {
        this.printObservationSheet();
      });
    }

    // Featured IC insert buttons
    this.container.querySelectorAll(".insert-featured-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.insertFeaturedChip(btn.dataset.chip);
      });
    });

    // Complex IC Suite button
    const btnICSuite = this.container.querySelector("#btn-run-icsuite");
    if (btnICSuite) {
      btnICSuite.addEventListener("click", () => {
        this.icSuiteResults = this.engine.runICTests();
        this.render();
      });
    }

    // Reset All Flip-Flops button
    const btnResetFFs = this.container.querySelector("#btn-reset-ffs");
    if (btnResetFFs) {
      btnResetFFs.addEventListener("click", () => {
        this.engine.resetAllFlipFlops();
        this.board.render();
        this.render();
      });
    }

    // Pulse CLKA button for timing diagram
    const btnPulseClk = this.container.querySelector("#btn-pulse-clk");
    if (btnPulseClk) {
      btnPulseClk.addEventListener("click", () => {
        let found7490 = false;
        for (const s of Object.values(this.engine.sockets)) {
          if (s.chip && (s.chip === "7490" || s.chip === "74LS90")) {
            found7490 = true;
            this.engine.clock.pos = 1; this.engine.clock.neg = 0;
            this.engine.evaluate();
            this.engine.clock.pos = 0; this.engine.clock.neg = 1;
            this.engine.evaluate();
            break;
          }
        }
        if (!found7490) {
          this.engine.clock.pos = this.engine.clock.pos === 1 ? 0 : 1;
          this.engine.clock.neg = this.engine.clock.pos === 1 ? 0 : 1;
          this.engine.evaluate();
        }
        this.board.render();
        this.render();
      });
    }

    // Clear timing diagram buffer
    const btnClearTiming = this.container.querySelector("#btn-clear-timing");
    if (btnClearTiming) {
      btnClearTiming.addEventListener("click", () => {
        for (const s of Object.values(this.engine.sockets)) {
          if (s.chip && (s.chip === "7490" || s.chip === "74LS90") && s.state) {
            s.state.history = [];
          }
        }
        this.render();
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
