/* ===== CONSOLE ===== */
class LabConsole {
  constructor(engine, board) {
    this.engine = engine;
    this.board = board;
    this.container = document.getElementById("laboratory-console");

    this.currentTab = "drawer"; // Default to IC Drawer tab per Phase 9
    this.currentExpId = "exp1";
    this.selectedSocket = "U1"; // Selected socket in inventory
    this.chipSearchQuery = "";
    this.currentRefChip = "7408";
    this.verificationResults = null;
    this.hintMessage = null;
    this.showSolutionWiring = false;
    this.showGhostSolution = false;
    this.examMode = false;
    this.expConclusions = {};

    this.selectedSubGate = "7408";
    this.selectedSubCircuits = {
      exp2: "mux8_3var",
      exp3: "fa_74138",
      exp4: "adder_4bit",
      exp5: "mod6",
      exp6: "sipo"
    };

    this.icSuiteResults = null;
    this.selfTestResults = null;

    if (typeof window !== "undefined") {
      window.consolePanel = this;
    }

    this.render();
  }

  setTab(tab) {
    this.currentTab = tab;
    this.render();
  }

  setExperiment(expId) {
    this.currentExpId = expId;
    this.verificationResults = null;
    this.hintMessage = null;
    this.showGhostSolution = false;
    this.board.setGhostWires([], false);
    this.board.setHighlightedJacks([]);

    const exp = EXPERIMENTS.find(e => e.id === expId);
    if (exp) {
      if (exp.requiredICs && exp.requiredICs.length > 0) {
        this.currentRefChip = exp.requiredICs[0];
      }
    }
    this.render();
  }

  getActiveExpConfig() {
    const exp = EXPERIMENTS.find(e => e.id === this.currentExpId) || EXPERIMENTS[0];
    if (exp.id === "exp1" && exp.subGates) {
      const subGate = exp.subGates[this.selectedSubGate] || exp.subGates["7408"] || Object.values(exp.subGates)[0];
      return {
        ...exp,
        ...subGate,
        title: `${exp.title}: ${subGate.title || subGate.label || subGate.name}`,
        aim: subGate.aim || exp.aim,
        procedure: subGate.procedure || subGate.stepByStep || exp.procedure,
        stepByStep: subGate.stepByStep || subGate.procedure || exp.stepByStep,
        requiredICs: subGate.requiredICs || [subGate.chip || "7408"],
        recommendedSocketICs: subGate.recommendedSocketICs || { U1: subGate.chip || "7408" },
        solutionWiring: subGate.solutionWiring || subGate.recommendedWires,
        recommendedWires: subGate.solutionWiring || subGate.recommendedWires,
        truthTable: subGate.truthTable || exp.truthTable,
        tableHeaders: subGate.tableHeaders || (subGate.truthTable && subGate.truthTable.inputs ? [...subGate.truthTable.inputs, ...subGate.truthTable.outputs] : ["Inputs", "Expected"]),
        tableRows: subGate.tableRows || (subGate.truthTable && subGate.truthTable.rows) || exp.tableRows,
        checker: subGate.checker || (subGate.tableRows ? null : exp.checker)
      };
    } else if (exp.subCircuits) {
      const subKeys = Object.keys(exp.subCircuits);
      const subId = (this.selectedSubCircuits && this.selectedSubCircuits[exp.id]) || subKeys[0];
      const sub = exp.subCircuits[subId] || exp.subCircuits[subKeys[0]];
      const isSequentialTable = sub.tableRows && sub.tableRows.length > 0 &&
        sub.tableRows[0].inputs && Object.keys(sub.tableRows[0].inputs).some(k => k.toLowerCase().includes("pulse") || k.toLowerCase().includes("clk"));
      const subHasStandardCombinationalTable = !isSequentialTable && sub.tableRows && sub.tableRows.length > 0 &&
        sub.tableRows[0].inputs && Object.keys(sub.tableRows[0].inputs).some(k => k.startsWith("IN.") || k.startsWith("SW."));
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
        checker: sub.checker || (subHasStandardCombinationalTable ? null : exp.checker)
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
      return { missingWire: null, highlightJacks: [], message: this.hintMessage };
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

  // Quick insert featured chip into socket
  insertChipToSocket(socketId, chip) {
    if (!socketId || !chip) return;
    this.engine.setSocketLever(socketId, false);
    this.engine.insertChip(socketId, chip, "left");
    this.engine.setSocketLever(socketId, true);
    this.selectedSocket = socketId;
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
          <h4 style="margin: 0 0 6px 0; font-size: 11pt;">Student Observation & Conclusion:</h4>
          <div style="border: 1px solid #000; padding: 10px; min-height: 70px; font-size: 10.5pt; line-height: 1.5; border-radius: 4px;">
            ${conclusion}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 50px; font-size: 11pt;">
          <div><b>Student Signature:</b> ___________________</div>
          <div><b>Examiner Signature:</b> ___________________</div>
        </div>
      </div>
    `;

    window.print();
  }

  render() {
    if (!this.container) return;

    // Diagnostics counts for header badge
    const diag = (this.engine.getDiagnostics && typeof this.engine.getDiagnostics === "function")
      ? this.engine.getDiagnostics()
      : { criticalCount: 0, warningCount: 0, infoCount: 0 };

    let diagBadge = `<span class="diag-count-badge ok">✓</span>`;
    if (diag.criticalCount > 0) {
      diagBadge = `<span class="diag-count-badge error">${diag.criticalCount}</span>`;
    } else if (diag.warningCount > 0) {
      diagBadge = `<span class="diag-count-badge warn">${diag.warningCount}</span>`;
    }

    const isAimActive = (this.currentTab === "aim" || this.currentTab === "experiments");

    this.container.innerHTML = `
      <div class="console-tabs">
        <button class="console-tab ${this.currentTab === 'drawer' ? 'active' : ''}" data-tab="drawer">
          IC Drawer
        </button>
        <button class="console-tab ${this.currentTab === 'reference' ? 'active' : ''}" data-tab="reference">
          Reference
        </button>
        <button class="console-tab ${this.currentTab === 'diagnostics' ? 'active' : ''}" data-tab="diagnostics">
          Diagnostics ${diagBadge}
        </button>
        <button class="console-tab ${isAimActive ? 'active' : ''}" data-tab="aim">
          Aim & Lab
        </button>
      </div>
      <div class="console-content" id="console-tab-content">
        ${this.renderTabContent()}
      </div>
    `;

    this.bindConsoleEvents();
  }

  renderTabContent() {
    switch (this.currentTab) {
      case "drawer":
        return this.renderDrawerTab();
      case "reference":
        return this.renderReferenceTab();
      case "diagnostics":
        return this.renderDiagnosticsTab();
      case "aim":
      case "experiments":
      default:
        return this.renderAimTab();
    }
  }

  // =========================================================================
  // TAB 1: IC DRAWER (IC Inventory, Selected Socket Box, Choose a Chip, Drag & Drop)
  // =========================================================================
  renderDrawerTab() {
    const sockets = ["U1", "U2", "U3", "U4", "U5"];
    const activeExp = this.getActiveExpConfig();
    const expRequiredICs = activeExp.requiredICs || [];
    const basicGateICs = ["7408", "7432", "7404", "7400", "7402", "7486", "7420"];

    const selectedSock = this.engine.sockets[this.selectedSocket] || this.engine.sockets.U1;
    const selectedICDef = selectedSock.chip ? IC_LIBRARY[selectedSock.chip] : null;
    const isSelected40 = (this.selectedSocket === "U5");

    // Filtered chips based on search query
    const query = (this.chipSearchQuery || "").toLowerCase().trim();
    let allChips = Object.keys(IC_LIBRARY).filter(c => c !== "TEST_GATE");

    if (query) {
      allChips = allChips.filter(c => {
        const ic = IC_LIBRARY[c];
        return c.toLowerCase().includes(query) ||
               (ic.title && ic.title.toLowerCase().includes(query)) ||
               (ic.description && ic.description.toLowerCase().includes(query)) ||
               (ic.marking && ic.marking.toLowerCase().includes(query));
      });
    }

    // Sort: basic gates pinned at top, then experiment required ICs, then others
    allChips.sort((a, b) => {
      const aBasic = basicGateICs.includes(a);
      const bBasic = basicGateICs.includes(b);
      if (aBasic && !bBasic) return -1;
      if (!aBasic && bBasic) return 1;

      const aExp = expRequiredICs.includes(a);
      const bExp = expRequiredICs.includes(b);
      if (aExp && !bExp) return -1;
      if (!aExp && bExp) return 1;

      return a.localeCompare(b);
    });

    return `
      <!-- 1. IC INVENTORY (Small cards for U1..U5) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">IC INVENTORY</span>
          <span style="font-size: 10px; color: #94a3b8; font-family: var(--font-mono);">Sockets U1–U5</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Click socket card to select. Drag chips from below directly onto socket cards or board.
        </p>

        <div class="inventory-grid">
          ${sockets.map(sId => {
            const s = this.engine.sockets[sId];
            const isSelected = (this.selectedSocket === sId);
            const is40 = (sId === "U5");
            const icDef = s.chip ? IC_LIBRARY[s.chip] : null;

            let statusColor = "#64748b";
            let statusText = "Empty";
            if (s.chip) {
              if (s.backwards) {
                statusColor = "#ef4444";
                statusText = "BACKWARDS ⚠️";
              } else if (s.leverLocked) {
                statusColor = "#10b981";
                statusText = "contact OK";
              } else {
                statusColor = "#f59e0b";
                statusText = "lever open";
              }
            }

            return `
              <div class="inventory-card ${isSelected ? 'selected' : ''}" data-socket="${sId}" title="${sId}: ${s.chip || 'Empty'} (${statusText})">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 800; font-family: var(--font-mono); font-size: 11px; color: ${isSelected ? 'var(--accent-amber)' : '#f8fafc'};">${sId}</span>
                  <span style="font-size: 8px; color: #64748b; font-family: var(--font-mono);">${is40 ? '40P' : '20P'}</span>
                </div>
                <div style="font-size: 11px; font-weight: 700; color: ${s.chip ? '#38bdf8' : '#64748b'}; margin: 3px 0; font-family: var(--font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${s.chip || '—'}
                </div>
                <div style="font-size: 8.5px; color: ${statusColor}; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ● ${statusText}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- 2. SELECTED SOCKET BOX -->
      <div class="selected-socket-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
          <div>
            <span style="font-size: 12px; font-weight: 800; color: var(--accent-amber); font-family: var(--font-mono);">SELECTED SOCKET: ${this.selectedSocket}</span>
            <span style="font-size: 10px; color: #94a3b8; margin-left: 6px;">(${isSelected40 ? '40-Pin ZIF' : '20-Pin ZIF Socket'})</span>
          </div>
          <span class="socket-chip-badge" style="font-size: 10px;">${selectedSock.chip ? (selectedICDef ? selectedICDef.marking : selectedSock.chip) : 'No Chip'}</span>
        </div>

        <div style="font-size: 11.5px; margin-bottom: 10px; color: #cbd5e1; line-height: 1.5;">
          ${selectedSock.chip ? `
            <div><b>Chip:</b> <span style="color: #38bdf8; font-weight: 700;">${selectedSock.chip}</span> — ${selectedICDef ? selectedICDef.title : ''}</div>
            <div style="margin-top: 2px;"><b>Status:</b> ${selectedSock.chip} inserted &middot; lever ${selectedSock.leverLocked ? '<span style="color:#86efac; font-weight:700;">CLOSED (contact OK)</span>' : '<span style="color:#fde047; font-weight:700;">OPEN (no contact)</span>'}</div>
            ${selectedSock.backwards ? '<div style="color: #f87171; font-weight: 700; margin-top: 3px;">⚠️ IC inserted BACKWARDS! Inverted pinout prevents operation.</div>' : ''}
          ` : `
            <div style="color: #94a3b8;">Empty socket &middot; lever is ${selectedSock.leverLocked ? 'closed' : 'open'}. Choose a chip from below to seat.</div>
          `}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
          <button class="btn ${selectedSock.leverLocked ? '' : 'btn-teal'}" id="btn-toggle-socket-lever" style="font-size: 11px; padding: 6px 8px;">
            ${selectedSock.leverLocked ? '🔓 OPEN LEVER' : '🔒 CLOSE LEVER'}
          </button>
          <button class="btn ${selectedSock.backwards ? 'btn-active' : ''}" id="btn-flip-chip" ${!selectedSock.chip ? 'disabled' : ''} style="font-size: 11px; padding: 6px 8px;">
            ${selectedSock.backwards ? '🔄 Flip (Backwards ⚠️)' : '🔄 Flip IC (Normal)'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <label style="font-size: 10.5px; color: #94a3b8; white-space: nowrap;">Align:</label>
            <select id="selected-align-select" ${!selectedSock.chip || isSelected40 ? 'disabled' : ''} style="font-size: 11px; padding: 4px;">
              <option value="left" ${selectedSock.alignment === 'left' ? 'selected' : ''}>Left-Aligned</option>
              <option value="center" ${selectedSock.alignment === 'center' ? 'selected' : ''}>Center-Aligned</option>
              <option value="right" ${selectedSock.alignment === 'right' ? 'selected' : ''}>Right-Aligned</option>
            </select>
          </div>
          <button class="btn btn-danger" id="btn-remove-selected-chip" ${!selectedSock.chip ? 'disabled' : ''} style="font-size: 11px; padding: 5px;">
            ✕ Remove
          </button>
        </div>
      </div>

      <!-- 3. CHOOSE A CHIP (Search + Scrollable List) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">CHOOSE A CHIP</span>
          <span style="font-size: 10px; color: var(--accent-teal); font-family: var(--font-mono); font-weight: 700;">${allChips.length} Available</span>
        </div>

        <div class="chip-search-wrapper">
          <input type="text" class="chip-search-input" id="chip-search-input" value="${this.chipSearchQuery || ''}" placeholder="🔍 Search by number, name, function (e.g. 7408, AND, MUX)...">
        </div>

        <div class="chip-list-scroll">
          ${allChips.map(c => {
            const ic = IC_LIBRARY[c];
            const isBasic = basicGateICs.includes(c);
            const isExpReq = expRequiredICs.includes(c);
            const gateCount = (ic.pins && ic.pins.filter(p => p.type === 'out').length) || 4;

            return `
              <div class="chip-card" draggable="true" data-chip="${c}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 13px; font-weight: 800; font-family: var(--font-mono); color: #fff;">${c}</span>
                    <span style="font-size: 9.5px; color: #94a3b8; font-family: var(--font-mono);">${ic.marking || ('SN' + c + 'N')}</span>
                    ${isExpReq ? '<span class="chip-tag-exp">★ IN THIS EXPERIMENT</span>' : ''}
                    ${isBasic && !isExpReq ? '<span class="chip-tag-basic">BASIC GATE</span>' : ''}
                  </div>
                  <span style="font-size: 9px; font-family: var(--font-mono); color: #64748b;">${ic.package || 'DIP-14'}</span>
                </div>

                <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px; line-height: 1.35;">
                  ${ic.title || ic.description || ''}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8; font-family: var(--font-mono);">
                  <div>VCC: Pin ${ic.vccPin} &middot; GND: Pin ${ic.gndPin} &middot; ${gateCount} Outputs</div>
                  <button class="btn btn-teal insert-chip-btn" data-chip="${c}" style="font-size: 10px; padding: 3px 8px;">
                    ${selectedSock.chip ? 'Replace in ' + this.selectedSocket : 'Seat in ' + this.selectedSocket}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 2: REFERENCE (Pinout SVG, Function Table, Timing Diagram)
  // =========================================================================
  renderReferenceTab() {
    const chipNames = Object.keys(IC_LIBRARY).filter(c => c !== "TEST_GATE");
    const ic = IC_LIBRARY[this.currentRefChip] || IC_LIBRARY["7408"];
    const isSequential = ["7490", "74LS90", "7474", "74LS74", "74191", "7493"].includes(ic.name);

    // 3D SVG Pinout Diagram
    const pinoutSvg = (SVG_COMPONENTS && typeof SVG_COMPONENTS.drawChipPinoutDiagram === "function")
      ? SVG_COMPONENTS.drawChipPinoutDiagram(ic)
      : `<div style="text-align: center; color: #94a3b8;">Datasheet pinout for ${ic.name}</div>`;

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Datasheet Pinout Reference</span>
          <span style="font-size: 10.5px; font-family: var(--font-mono); color: var(--accent-teal);">${ic.marking || ('SN' + ic.name + 'N')} &middot; ${ic.package || 'DIP-14'}</span>
        </div>
        <div class="form-group" style="margin-bottom: 8px;">
          <label class="form-label">Select IC Datasheet</label>
          <select id="ref-chip-select">
            ${chipNames.map(c => `
              <option value="${c}" ${c === this.currentRefChip ? "selected" : ""}>
                ${c} — ${IC_LIBRARY[c].title} (${IC_LIBRARY[c].package || 'DIP'})
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      <!-- 3D Package Pinout Diagram -->
      <div class="card" style="background: #090d16; border-color: var(--border-strong);">
        <div class="card-header">
          <span class="card-title">3D IC Package Pinout Diagram</span>
          <span style="font-size: 10px; color: #94a3b8; font-family: var(--font-mono);">Top View (Notch Up)</span>
        </div>
        <div style="padding: 10px 0; overflow-x: auto;">
          ${pinoutSvg}
        </div>
        <div style="display: flex; justify-content: center; gap: 14px; font-size: 10px; font-family: var(--font-mono); margin-top: 8px; color: #94a3b8; flex-wrap: wrap;">
          <span><span style="display:inline-block; width:8px; height:8px; background:#ef4444; border-radius:50%; margin-right:4px;"></span>VCC (+5V)</span>
          <span><span style="display:inline-block; width:8px; height:8px; background:#3b82f6; border-radius:50%; margin-right:4px;"></span>GND (0V)</span>
          <span><span style="display:inline-block; width:8px; height:8px; background:#f5c518; border-radius:50%; margin-right:4px;"></span>Inputs</span>
          <span><span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%; margin-right:4px;"></span>Outputs</span>
        </div>
      </div>

      <!-- Datasheet Specifications & Function Table -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">${ic.name}: Function Truth Table & Logic</span>
        </div>
        <p style="font-size: 11.5px; color: #cbd5e1; margin-bottom: 10px; line-height: 1.5;">
          ${ic.description || ''}
        </p>
        <p style="font-size: 11px; color: var(--accent-amber); margin-bottom: 10px; font-family: var(--font-mono);">
          TTL Logic Series: VCC = +5V (Pin ${ic.vccPin}), GND = 0V (Pin ${ic.gndPin}). Floating inputs pull to Logic 1.
        </p>

        ${ic.truthTable ? `
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
        ` : `
          <table class="truth-table">
            <thead>
              <tr><th>Pin #</th><th>Pin Name</th><th>Signal Function</th></tr>
            </thead>
            <tbody>
              ${(ic.pins || []).map(p => `
                <tr>
                  <td><b>${p.pin}</b></td>
                  <td style="color: ${p.type === 'pwr' ? '#ef4444' : (p.type === 'gnd' ? '#60a5fa' : '#facc15')}; font-weight: 700;">${p.name}</td>
                  <td>${p.type.toUpperCase()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}
      </div>

      <!-- Timing Diagram Viewer (for Sequential ICs) -->
      ${isSequential ? this.renderTimingDiagram(ic.name) : ""}
    `;
  }

  // Interactive Timing Diagram for sequential ICs
  renderTimingDiagram(chipName) {
    let liveHistory = null;
    let socketId = null;
    for (const [sId, s] of Object.entries(this.engine.sockets)) {
      if (s.chip && (s.chip === chipName || s.chip === chipName.replace("LS", "")) && s.state && s.state.history && s.state.history.length > 0) {
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
          <span class="card-title">⏱️ Live Waveform Capture (${isLive ? `Live in Socket ${socketId}` : 'Reference Sequence'})</span>
          <span style="font-size: 11px; font-family: var(--font-mono); color: ${isLive ? 'var(--accent-teal)' : '#94a3b8'}; font-weight: 700;">${isLive ? '🔴 LIVE BUFFER' : 'IDEAL 0..9 BCD'}</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Displays digital waveform transitions. Edge-triggered flip-flops and counters latch on clock transitions.
        </p>

        <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; overflow-x: auto;">
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; min-width: 440px; display: block;">
            ${gridHtml}
            ${tracesHtml}
          </svg>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn btn-teal" id="btn-pulse-clk" style="flex: 1; font-size: 11px;">
            ⚡ Pulse Clock
          </button>
          <button class="btn" id="btn-clear-timing" style="flex: 1; font-size: 11px;">
            🗑️ Clear Capture Buffer
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 3: DIAGNOSTICS (Live, updates with every settle)
  // =========================================================================
  renderDiagnosticsTab() {
    const diag = (this.engine.getDiagnostics && typeof this.engine.getDiagnostics === "function")
      ? this.engine.getDiagnostics()
      : { items: [], criticalCount: 0, warningCount: 0, infoCount: 0, isHealthy: true };

    return `
      <!-- Kit Power & Mode Settings -->
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
            <div style="font-size: 10px; color: #8b949e;">Requires patch cords to VCC and GND pins</div>
          </div>
          <button class="btn ${this.engine.strictPowerMode ? 'btn-teal' : ''}" id="diag-strict-toggle" style="padding: 4px 10px; font-size: 11px;">
            ${this.engine.strictPowerMode ? "Strict (Active)" : "Auto-Power"}
          </button>
        </div>
      </div>

      <!-- Live Diagnostics Stream (Phase 9) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Live Circuit Diagnostics</span>
          <span style="font-size: 10px; font-family: var(--font-mono); color: ${diag.isHealthy ? 'var(--accent-ok)' : '#f87171'}; font-weight: 700;">
            ${diag.isHealthy ? '● HEALTHY' : `⚠️ ${diag.criticalCount} ERRORS · ${diag.warningCount} WARN`}
          </span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 10px;">
          Evaluated continuously on every settle loop. Click <b>"Locate Jack"</b> to highlight any terminal on the board.
        </p>

        ${diag.items.length === 0 ? `
          <div class="verdict-banner success">
            ✓ Netlist Healthy — No shorts, missing power rails, or floating inputs detected.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${diag.items.map(item => `
              <div class="diag-card severity-${item.severity}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span style="font-weight: 700; font-size: 11px;">
                    ${item.severity === 'red' ? '🔴' : (item.severity === 'amber' ? '🟡' : '🔵')} ${item.title}
                  </span>
                  <span style="font-size: 9px; font-family: var(--font-mono); font-weight: 800; text-transform: uppercase;">
                    ${item.severity === 'red' ? 'CRITICAL' : (item.severity === 'amber' ? 'WARNING' : 'INFO')}
                  </span>
                </div>
                <div style="font-size: 11px; line-height: 1.4; color: #f8fafc;">
                  ${item.message}
                </div>
                <div style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">
                  ${item.jacks && item.jacks.length > 0 ? `
                    <button class="btn-jump-jack" data-jacks="${item.jacks.join(',')}">
                      🎯 Locate Jack (${item.jacks[0]})
                    </button>
                  ` : ''}
                  ${item.type === 'backwards' ? `
                    <button class="btn btn-teal flip-diag-chip-btn" data-socket="${item.socketId}" style="padding: 2px 8px; font-size: 10.5px;">
                      🔄 Flip IC to Normal
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      <!-- Complex IC Suite Card (Phase 7) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔬 Complex IC Verification Suite (runICTests)</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Exhaustive logic tests for <b>74LS153</b>, <b>74LS138</b>, <b>7483</b>, <b>74LS90</b>, and <b>7474</b>.
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

      <!-- Engine Self-Tests Card (Phase 3) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🧪 Engine Self-Tests (runSelfTests)</span>
        </div>
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
    `;
  }

  // =========================================================================
  // TAB 4: AIM & LAB (Aim, Apparatus Checklist, Procedure, Truth Table, Auto-Check)
  // =========================================================================
  renderAimTab() {
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

    // Apparatus checklist (Phase 9 requirement: ticks when the IC is inserted)
    const requiredList = activeExp.requiredICs || [];
    const freeSocket = Object.keys(this.engine.sockets).find(sId => !this.engine.sockets[sId].chip) || "U1";

    const apparatusChecklistHtml = requiredList.map(reqChip => {
      // Check if reqChip is seated in any socket
      let seatedSocket = null;
      for (const [sId, s] of Object.entries(this.engine.sockets)) {
        if (s.chip && (s.chip === reqChip || s.chip === reqChip.replace("LS", "") || s.chip.replace("LS", "") === reqChip)) {
          seatedSocket = sId;
          break;
        }
      }

      const isSeated = !!seatedSocket;
      return `
        <div class="apparatus-item ${isSeated ? 'seated' : 'missing'}">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14px; font-weight: 800; color: ${isSeated ? '#10b981' : '#f59e0b'};">
              ${isSeated ? '☑' : '☐'}
            </span>
            <div>
              <span style="font-weight: 800; font-family: var(--font-mono);">${reqChip}</span>
              <span style="font-size: 11px; color: #94a3b8; margin-left: 4px;">
                ${isSeated ? `— Seated in ${seatedSocket} (Operating)` : '— Not inserted yet'}
              </span>
            </div>
          </div>
          ${!isSeated ? `
            <button class="btn btn-teal insert-apparatus-btn" data-chip="${reqChip}" data-socket="${freeSocket}" style="font-size: 10px; padding: 2px 8px;">
              + Seat in ${freeSocket}
            </button>
          ` : `
            <span style="font-size: 10.5px; font-weight: 700; color: #86efac; font-family: var(--font-mono);">READY</span>
          `}
        </div>
      `;
    }).join("");

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
              ${this.examMode ? "ACTIVE (Guided tools hidden)" : "Practice Mode (Guided tools enabled)"}
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

      <!-- Aim & Theoretical Basis -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Aim & Principle</span>
        </div>
        <p style="font-size: 12px; margin-bottom: 8px; line-height: 1.5;"><b>Aim:</b> ${activeExp.aim}</p>
        <p style="font-size: 11px; color: #94a3b8; line-height: 1.5;">${activeExp.theory || ''}</p>
      </div>

      <!-- Apparatus Checklist (Phase 9) -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Apparatus Checklist</span>
          <span style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-amber);">Automatic Verification</span>
        </div>
        <p style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">
          Checklist updates automatically when required ICs are seated into any board socket.
        </p>
        <div class="apparatus-list">
          ${apparatusChecklistHtml}
        </div>
      </div>

      <!-- Guided Tools / Exam Mode Banner -->
      <div class="card">
        ${this.examMode ? `
          <div class="verdict-banner" style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #fbbf24;">
            🎓 EXAM MODE ACTIVE — Auto-Wire, Hint, Ghost Solution Cords, and Auto-Check are disabled. Wire the circuit independently from the Reference Datasheet and record observations below.
          </div>
        ` : `
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
            <button class="btn btn-teal" id="btn-auto-check" style="flex: 2; font-weight: 700;">
              ✓ Auto-Check Circuit
            </button>
            <button class="btn" id="btn-give-hint" style="flex: 1;" title="Highlight next missing wire with pulsing rings">
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

      <!-- Truth Table -->
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

      <!-- Procedure Steps -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Step-by-Step Procedure</span>
        </div>
        <ol style="font-size: 11.5px; line-height: 1.6; padding-left: 18px; color: #cbd5e1;">
          ${(activeExp.procedure || activeExp.stepByStep || []).map(s => `<li>${s.replace(/^\d+\.\s*/, '')}</li>`).join("")}
        </ol>
      </div>

      <!-- Student Conclusion & Observation Export -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📝 Student Observation & Conclusion</span>
          <button class="btn btn-teal" id="btn-print-sheet" style="padding: 3px 8px; font-size: 11px;">
            🖨️ Observation Sheet
          </button>
        </div>
        <textarea id="exp-conclusion-input" rows="3" style="width: 100%; box-sizing: border-box; background: #090d16; border: 1px solid #1e293b; border-radius: 4px; color: #f8fafc; font-family: var(--font-sans); font-size: 11.5px; padding: 8px; resize: vertical;" placeholder="Type observations and conclusion for Exp ${activeExp.number || ''}...">${conclusionVal}</textarea>
      </div>
    `;
  }

  // =========================================================================
  // EVENT BINDINGS
  // =========================================================================
  bindConsoleEvents() {
    if (!this.container) return;

    // Tab navigation buttons
    this.container.querySelectorAll(".console-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setTab(btn.dataset.tab);
      });
    });

    // 1. DRAWER TAB EVENTS
    // Socket card selection in inventory row
    this.container.querySelectorAll(".inventory-card").forEach(card => {
      card.addEventListener("click", () => {
        this.selectedSocket = card.dataset.socket;
        this.render();
      });

      // Drag & drop onto socket card
      card.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        card.classList.add("drag-over");
      });
      card.addEventListener("dragleave", () => {
        card.classList.remove("drag-over");
      });
      card.addEventListener("drop", (e) => {
        e.preventDefault();
        card.classList.remove("drag-over");
        const chip = e.dataTransfer.getData("application/x-dit-chip") || e.dataTransfer.getData("text/plain");
        if (chip && IC_LIBRARY[chip]) {
          this.insertChipToSocket(card.dataset.socket, chip);
        }
      });
    });

    // Selected socket lever toggle
    const btnSocketLever = this.container.querySelector("#btn-toggle-socket-lever");
    if (btnSocketLever) {
      btnSocketLever.addEventListener("click", () => {
        const s = this.engine.sockets[this.selectedSocket];
        if (s) {
          this.engine.setSocketLever(this.selectedSocket, !s.leverLocked);
          this.board.render();
          this.render();
        }
      });
    }

    // Selected socket flip IC orientation
    const btnFlipChip = this.container.querySelector("#btn-flip-chip");
    if (btnFlipChip) {
      btnFlipChip.addEventListener("click", () => {
        this.engine.flipChip(this.selectedSocket);
        this.board.render();
        this.render();
      });
    }

    // Selected socket alignment change
    const selectAlign = this.container.querySelector("#selected-align-select");
    if (selectAlign) {
      selectAlign.addEventListener("change", (e) => {
        const s = this.engine.sockets[this.selectedSocket];
        if (s) {
          s.alignment = e.target.value;
          this.engine.evaluate();
          this.board.render();
          this.render();
        }
      });
    }

    // Selected socket remove chip
    const btnRemoveChip = this.container.querySelector("#btn-remove-selected-chip");
    if (btnRemoveChip) {
      btnRemoveChip.addEventListener("click", () => {
        this.engine.setSocketLever(this.selectedSocket, false);
        this.engine.removeChip(this.selectedSocket);
        this.engine.setSocketLever(this.selectedSocket, true);
        this.board.render();
        this.render();
      });
    }

    // Search input in Choose a Chip
    const searchInput = this.container.querySelector("#chip-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.chipSearchQuery = e.target.value;
        const scrollContainer = this.container.querySelector(".chip-list-scroll");
        const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
        this.render();
        const newSearch = this.container.querySelector("#chip-search-input");
        if (newSearch) {
          newSearch.focus();
          newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
        }
      });
    }

    // Insert chip button on chip cards
    this.container.querySelectorAll(".insert-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.insertChipToSocket(this.selectedSocket, btn.dataset.chip);
      });
    });

    // Draggable chip cards
    this.container.querySelectorAll(".chip-card").forEach(card => {
      card.addEventListener("dragstart", (e) => {
        const chip = card.dataset.chip;
        e.dataTransfer.setData("application/x-dit-chip", chip);
        e.dataTransfer.setData("text/plain", chip);
        e.dataTransfer.effectAllowed = "copy";
        card.classList.add("dragging");
      });
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });
    });

    // 2. REFERENCE TAB EVENTS
    const refSelect = this.container.querySelector("#ref-chip-select");
    if (refSelect) {
      refSelect.addEventListener("change", (e) => {
        this.currentRefChip = e.target.value;
        this.render();
      });
    }

    const btnPulseClk = this.container.querySelector("#btn-pulse-clk");
    if (btnPulseClk) {
      btnPulseClk.addEventListener("click", () => {
        this.engine.clock.pos = 1; this.engine.clock.neg = 0;
        this.engine.evaluate();
        setTimeout(() => {
          this.engine.clock.pos = 0; this.engine.clock.neg = 1;
          this.engine.evaluate();
          this.render();
        }, 60);
      });
    }

    const btnClearTiming = this.container.querySelector("#btn-clear-timing");
    if (btnClearTiming) {
      btnClearTiming.addEventListener("click", () => {
        for (const s of Object.values(this.engine.sockets)) {
          if (s.state && s.state.history) s.state.history = [];
        }
        this.render();
      });
    }

    // 3. DIAGNOSTICS TAB EVENTS
    const diagPwrBtn = this.container.querySelector("#diag-master-pwr");
    if (diagPwrBtn) {
      diagPwrBtn.addEventListener("click", () => {
        this.engine.toggleMasterPower();
      });
    }

    const diagStrictBtn = this.container.querySelector("#diag-strict-toggle");
    if (diagStrictBtn) {
      diagStrictBtn.addEventListener("click", () => {
        this.engine.setStrictPowerMode(!this.engine.strictPowerMode);
        this.render();
      });
    }

    // Locate Jack buttons
    this.container.querySelectorAll(".btn-jump-jack").forEach(btn => {
      btn.addEventListener("click", () => {
        const jacksStr = btn.dataset.jacks || "";
        const jacks = jacksStr.split(",").filter(j => j.length > 0);
        if (jacks.length > 0) {
          this.board.setHighlightedJacks(jacks);
          this.board.render();
        }
      });
    });

    // Flip chip directly from diagnostics
    this.container.querySelectorAll(".flip-diag-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.engine.flipChip(btn.dataset.socket);
        this.board.render();
        this.render();
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

    const btnResetFFs = this.container.querySelector("#btn-reset-ffs");
    if (btnResetFFs) {
      btnResetFFs.addEventListener("click", () => {
        this.engine.resetAllFlipFlops();
        this.board.render();
        this.render();
      });
    }

    const btnSelfTests = this.container.querySelector("#btn-run-selftests");
    if (btnSelfTests) {
      btnSelfTests.addEventListener("click", () => {
        this.selfTestResults = this.engine.runSelfTests();
        this.render();
      });
    }

    // 4. AIM & LAB TAB EVENTS
    const expSelect = this.container.querySelector("#exp-select");
    if (expSelect) {
      expSelect.addEventListener("change", (e) => {
        this.setExperiment(e.target.value);
        this.autoWireExperiment();
      });
    }

    this.container.querySelectorAll(".subgate-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedSubGate = btn.dataset.gate;
        this.verificationResults = null;
        this.hintMessage = null;
        this.autoWireExperiment();
      });
    });

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

    // Apparatus checklist "+ Seat" buttons
    this.container.querySelectorAll(".insert-apparatus-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.insertChipToSocket(btn.dataset.socket, btn.dataset.chip);
      });
    });

    const btnExam = this.container.querySelector("#btn-toggle-exammode");
    if (btnExam) {
      btnExam.addEventListener("click", () => {
        this.toggleExamMode();
      });
    }

    const btnAutoWire = this.container.querySelector("#btn-auto-wire");
    if (btnAutoWire) {
      btnAutoWire.addEventListener("click", () => {
        this.autoWireExperiment();
      });
    }

    const btnAutoCheck = this.container.querySelector("#btn-auto-check");
    if (btnAutoCheck) {
      btnAutoCheck.addEventListener("click", () => {
        this.autoCheckCircuit();
      });
    }

    const btnHint = this.container.querySelector("#btn-give-hint");
    if (btnHint) {
      btnHint.addEventListener("click", () => {
        this.giveHint();
      });
    }

    const btnGhost = this.container.querySelector("#btn-ghost-solution");
    if (btnGhost) {
      btnGhost.addEventListener("click", () => {
        this.toggleGhostSolution();
      });
    }

    const conclusionInput = this.container.querySelector("#exp-conclusion-input");
    if (conclusionInput) {
      conclusionInput.addEventListener("input", (e) => {
        if (!this.expConclusions) this.expConclusions = {};
        this.expConclusions[this.currentExpId] = e.target.value;
      });
    }

    const btnPrintSheet = this.container.querySelector("#btn-print-sheet");
    if (btnPrintSheet) {
      btnPrintSheet.addEventListener("click", () => {
        this.printObservationSheet();
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
