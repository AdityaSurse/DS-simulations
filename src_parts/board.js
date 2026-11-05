/* ===== BOARD ===== */
class BoardRenderer {
  constructor(engine, svgElement, onJackHover) {
    this.engine = engine;
    this.svg = svgElement;
    this.onJackHover = onJackHover;

    this.jackCoords = {}; // Map of jackId -> { x, y }
    this.selectedJack = null; // Jack currently clicked for wiring
    this.tempMousePos = null; // Current mouse coords during wire drag
    this.activeView = "full"; // full, zif, inputs, outputs, u5
    this.activeColor = "#facc15"; // Selected wire color
    this.deleteMode = false;

    this.setupViewPresets();
    this.bindEvents();
  }

  setupViewPresets() {
    this.viewPresets = {
      full: { x: 0, y: 0, w: 1600, h: 1160 },
      zif: { x: 360, y: 550, w: 1220, h: 540 },
      inputs: { x: 360, y: 20, w: 1220, h: 550 },
      outputs: { x: 1020, y: 20, w: 560, h: 330 },
      u5: { x: 20, y: 20, w: 380, h: 1080 }
    };
  }

  setView(viewName) {
    const preset = this.viewPresets[viewName] || this.viewPresets.full;
    this.activeView = viewName;
    this.svg.setAttribute("viewBox", `${preset.x} ${preset.y} ${preset.w} ${preset.h}`);
  }

  setWireColor(color) {
    this.activeColor = color;
  }

  setDeleteMode(val) {
    this.deleteMode = val;
    document.body.classList.toggle("delete-mode", val);
  }

  // Convert client (screen) mouse coordinates to SVG board space coordinates
  getSVGCoords(e) {
    const pt = this.svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = this.svg.getScreenCTM().inverse();
    return pt.matrixTransform(ctm);
  }

  bindEvents() {
    // Jack click / wire start & end
    this.svg.addEventListener("click", (e) => {
      // Wire deletion
      const wireGroup = e.target.closest(".patch-cord-group");
      if (wireGroup) {
        const wireId = wireGroup.dataset.wireId;
        if (this.deleteMode || e.altKey) {
          this.engine.removeWire(wireId);
          return;
        }
      }

      // Switch click
      const switchGroup = e.target.closest(".switch-group");
      if (switchGroup) {
        const swId = switchGroup.dataset.switch;
        this.engine.toggleInput(swId);
        return;
      }

      // Knob click (cycle frequency)
      const knobGroup = e.target.closest(".knob-group");
      if (knobGroup) {
        const freqs = [1, 5, 10, 50, 100, 500];
        const nextIdx = (freqs.indexOf(this.engine.clock.freq) + 1) % freqs.length;
        this.engine.setClockFreq(freqs[nextIdx]);
        return;
      }

      // Jack interaction
      const jackGroup = e.target.closest(".jack-group");
      if (jackGroup) {
        const jackId = jackGroup.dataset.jack;
        if (this.deleteMode) {
          // Remove wires connected to this jack
          const attached = this.engine.wires.filter(w => w.from === jackId || w.to === jackId);
          attached.forEach(w => this.engine.removeWire(w.id));
          return;
        }

        if (!this.selectedJack) {
          // Start wire
          this.selectedJack = jackId;
          this.render();
        } else {
          // Complete wire
          if (this.selectedJack !== jackId) {
            this.engine.addWire(this.selectedJack, jackId, this.activeColor);
          }
          this.selectedJack = null;
          this.tempMousePos = null;
          this.render();
        }
        return;
      }

      // Clicked on blank PCB space -> cancel wire creation
      if (this.selectedJack) {
        this.selectedJack = null;
        this.tempMousePos = null;
        this.render();
      }
    });

    // Right-click wire deletion
    this.svg.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const wireGroup = e.target.closest(".patch-cord-group");
      if (wireGroup) {
        const wireId = wireGroup.dataset.wireId;
        this.engine.removeWire(wireId);
        return;
      }
      const jackGroup = e.target.closest(".jack-group");
      if (jackGroup) {
        const jackId = jackGroup.dataset.jack;
        const attached = this.engine.wires.filter(w => w.from === jackId || w.to === jackId);
        if (attached.length > 0) {
          this.engine.removeWire(attached[attached.length - 1].id);
        }
      }
    });

    // Mouse move for rubber-band wire and probe HUD
    this.svg.addEventListener("mousemove", (e) => {
      const coords = this.getSVGCoords(e);
      if (this.selectedJack) {
        this.tempMousePos = coords;
        this.updateRubberBand();
      }

      const jackGroup = e.target.closest(".jack-group");
      if (jackGroup) {
        const jackId = jackGroup.dataset.jack;
        if (this.onJackHover) this.onJackHover(jackId, e);
      } else {
        if (this.onJackHover) this.onJackHover(null, e);
      }
    });

    // Manual pulser press and release
    this.svg.addEventListener("mousedown", (e) => {
      const btnGroup = e.target.closest(".pushbutton-group");
      if (btnGroup) {
        const pulserNum = parseInt(btnGroup.dataset.pulser, 10);
        this.engine.setPulser(pulserNum, true);
      }
    });

    window.addEventListener("mouseup", () => {
      if (this.engine.pulsers[1].pressed) this.engine.setPulser(1, false);
      if (this.engine.pulsers[2].pressed) this.engine.setPulser(2, false);
    });

    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.selectedJack = null;
        this.tempMousePos = null;
        this.render();
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        this.engine.undoWire();
      } else if (e.key === " " && !e.repeat && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        this.engine.setPulser(1, true);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === " ") {
        this.engine.setPulser(1, false);
      }
    });
  }

  // Update only the interactive rubber-band wire during mousemove for max performance
  updateRubberBand() {
    let rubberBand = this.svg.querySelector("#rubber-band-wire");
    if (!this.selectedJack || !this.tempMousePos) {
      if (rubberBand) rubberBand.remove();
      return;
    }

    const p1 = this.jackCoords[this.selectedJack];
    const p2 = this.tempMousePos;
    if (!p1) return;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    const droop = Math.max(25, 20 + dist * 0.15);
    const midX = (p1.x + p2.x) / 2;
    const midY = Math.max(p1.y, p2.y) + droop;

    const pathData = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

    if (!rubberBand) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("id", "rubber-band-wire");
      g.innerHTML = `
        <path class="rb-outer" fill="none" stroke="${this.activeColor}" stroke-width="5" stroke-linecap="round" opacity="0.8" />
        <path class="rb-inner" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
        <circle cx="${p2.x}" cy="${p2.y}" r="6" fill="${this.activeColor}" stroke="#fff" stroke-width="1.5" />
      `;
      this.svg.querySelector("#wires-layer").appendChild(g);
      rubberBand = g;
    }

    rubberBand.querySelector(".rb-outer").setAttribute("d", pathData);
    rubberBand.querySelector(".rb-inner").setAttribute("d", pathData);
    const cursorDot = rubberBand.querySelector("circle");
    cursorDot.setAttribute("cx", p2.x);
    cursorDot.setAttribute("cy", p2.y);
  }

  // Full SVG Assembly & Render
  render() {
    this.jackCoords = {}; // Rebuild coordinates table
    let svgContent = SVG_COMPONENTS.renderDefs();

    // 1. Wooden Outer Frame (0 0 1600 1160)
    svgContent += `
      <!-- Wooden Frame -->
      <rect x="0" y="0" width="1600" height="1160" rx="8" fill="url(#woodBevelTop)" stroke="#1a0b03" stroke-width="3" />
      <rect x="12" y="12" width="1576" height="1136" rx="6" fill="url(#woodBevelLeft)" />
      <rect x="24" y="24" width="1552" height="1112" rx="4" fill="#301908" />

      <!-- Frame Corner Screws -->
      ${SVG_COMPONENTS.renderScrew(16, 16)}
      ${SVG_COMPONENTS.renderScrew(1584, 16)}
      ${SVG_COMPONENTS.renderScrew(16, 1144)}
      ${SVG_COMPONENTS.renderScrew(1584, 1144)}
      ${SVG_COMPONENTS.renderScrew(800, 16)}
      ${SVG_COMPONENTS.renderScrew(800, 1144)}
      ${SVG_COMPONENTS.renderScrew(16, 580)}
      ${SVG_COMPONENTS.renderScrew(1584, 580)}

      <!-- Dark Green PCB Surface -->
      <rect x="30" y="30" width="1540" height="1100" rx="4" fill="#0a351d" stroke="#04160c" stroke-width="2" />
      <!-- Subtle PCB ground plane mesh/traces -->
      <pattern id="pcbMesh" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 0 40 L 40 0 M 0 0 L 40 40" stroke="#0d3f23" stroke-width="0.5" />
      </pattern>
      <rect x="30" y="30" width="1540" height="1100" fill="url(#pcbMesh)" opacity="0.4" />
    `;

    // 2. ZONE 1: Left Strip - 40-Pin ZIF Expansion (U5) (x: 40, y: 40, w: 320, h: 1030)
    svgContent += `
      <g id="zone-left-strip">
        <rect x="42" y="42" width="316" height="1030" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="200" y="70" class="silkscreen-title" text-anchor="middle">40 PIN ZIF EXPANSION</text>
        <text x="200" y="90" class="silkscreen-text mini" text-anchor="middle">UNIVERSAL MICROCONTROLLER / LSI INTERFACE (U5)</text>

        <!-- 40-Pin ZIF Socket Body -->
        ${SVG_COMPONENTS.renderZIFSocket("U5", 130, 120, 140, 840, 40, this.engine.sockets.U5.leverLocked)}
        ${SVG_COMPONENTS.renderInsertedIC("U5", this.engine.sockets.U5.chip, 130, 120, 140, 840, 40, "left")}
      </g>
    `;

    // U5 Jacks: Left column 1..20 (top to bottom), Right column 21..40 (bottom to top)
    const vertPitch = (840 - 50) / 19;
    for (let i = 0; i < 20; i++) {
      const pinLeft = i + 1;
      const jLeftId = `U5.J${pinLeft}`;
      const lx = 92;
      const ly = 145 + i * vertPitch;
      this.jackCoords[jLeftId] = { x: lx, y: ly };
      svgContent += SVG_COMPONENTS.renderBrassJack(jLeftId, `${pinLeft}`, lx, ly, "left");

      const pinRight = 21 + i;
      const jRightId = `U5.J${pinRight}`;
      const rx = 308;
      const ry = 145 + (19 - i) * vertPitch; // 21 at bottom, 40 at top!
      this.jackCoords[jRightId] = { x: rx, y: ry };
      svgContent += SVG_COMPONENTS.renderBrassJack(jRightId, `${pinRight}`, rx, ry, "right");
    }

    // 3. ZONE 2: 12-Bit Data Input (x: 376, y: 42, w: 648, h: 290)
    svgContent += `
      <g id="zone-data-input">
        <rect x="376" y="42" width="648" height="290" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="700" y="322" class="silkscreen-title" text-anchor="middle">12 BIT DATA INPUT</text>
        <!-- Division markers between groups C, B, A -->
        <line x1="592" y1="42" x2="592" y2="300" stroke="var(--silkscreen)" stroke-width="1" stroke-dasharray="4, 4" />
        <line x1="808" y1="42" x2="808" y2="300" stroke="var(--silkscreen)" stroke-width="1" stroke-dasharray="4, 4" />
        <text x="484" y="66" class="silkscreen-text bold" text-anchor="middle">GROUP C (C3 - C0)</text>
        <text x="700" y="66" class="silkscreen-text bold" text-anchor="middle">GROUP B (B3 - B0)</text>
        <text x="916" y="66" class="silkscreen-text bold" text-anchor="middle">GROUP A (A3 - A0)</text>
      </g>
    `;

    // 12 Input switches, LEDs, and Jacks
    const inputChannels = [
      { name: "C3", id: "IN.C3", x: 418 },
      { name: "C2", id: "IN.C2", x: 468 },
      { name: "C1", id: "IN.C1", x: 518 },
      { name: "C0", id: "IN.C0", x: 568 },
      { name: "B3", id: "IN.B3", x: 634 },
      { name: "B2", id: "IN.B2", x: 684 },
      { name: "B1", id: "IN.B1", x: 734 },
      { name: "B0", id: "IN.B0", x: 784 },
      { name: "A3", id: "IN.A3", x: 850 },
      { name: "A2", id: "IN.A2", x: 900 },
      { name: "A1", id: "IN.A1", x: 950 },
      { name: "A0", id: "IN.A0", x: 1000 }
    ];

    for (const ch of inputChannels) {
      const swVal = this.engine.inputs[ch.id] === 1;
      // Switch at top
      svgContent += SVG_COMPONENTS.renderToggleSwitch(ch.id, ch.name, ch.x, 110, swVal);
      // Red LED below switch (lit when switch is 1)
      svgContent += SVG_COMPONENTS.renderLed(`LED_${ch.id}`, null, ch.x, 168, swVal && this.engine.masterPower);
      // Resistor & trace graphics
      svgContent += `
        <line x1="${ch.x}" y1="178" x2="${ch.x}" y2="225" stroke="#a3e635" stroke-width="1" opacity="0.6" />
        <rect x="${ch.x - 3}" y="194" width="6" height="14" rx="2" fill="#c29b38" stroke="#523d0c" stroke-width="0.5" />
      `;
      // Brass jack at bottom
      this.jackCoords[ch.id] = { x: ch.x, y: 260 };
      svgContent += SVG_COMPONENTS.renderBrassJack(ch.id, ch.name, ch.x, 260, "bottom");
    }

    // 4. ZONE 3: 8-Bit Data Output (x: 1040, y: 42, w: 520, h: 290)
    svgContent += `
      <g id="zone-data-output">
        <rect x="1040" y="42" width="520" height="290" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="1300" y="322" class="silkscreen-title" text-anchor="middle">8 BIT DATA OUTPUT</text>
        <text x="1170" y="66" class="silkscreen-text" text-anchor="middle">HIGH NIBBLE (Y7-Y4)</text>
        <text x="1430" y="66" class="silkscreen-text" text-anchor="middle">LOW NIBBLE (Y3-Y0)</text>

        <!-- Two Seven-Segment Displays -->
        ${SVG_COMPONENTS.renderSevenSegmentDisplay("output-7seg", 1249, 78, this.engine.segDigits)}
      </g>
    `;

    // 8 Output LEDs and Jacks
    for (let i = 0; i < 8; i++) {
      const bitNum = 7 - i;
      const jId = `OUT.Y${bitNum}`;
      const jx = 1075 + i * 64;
      const isOutHigh = this.engine.outputs[jId] === 1;

      // Red output LED
      svgContent += SVG_COMPONENTS.renderLed(`LED_${jId}`, `Y${bitNum}`, jx, 185, isOutHigh && this.engine.masterPower, "top");
      // Resistor
      svgContent += `
        <line x1="${jx}" y1="195" x2="${jx}" y2="230" stroke="#a3e635" stroke-width="1" opacity="0.6" />
        <rect x="${jx - 3}" y="205" width="6" height="14" rx="2" fill="#c29b38" stroke="#523d0c" stroke-width="0.5" />
      `;
      // Brass jack
      this.jackCoords[jId] = { x: jx, y: 260 };
      svgContent += SVG_COMPONENTS.renderBrassJack(jId, `Y${bitNum}`, jx, 260, "bottom");
    }

    // 5. ZONE 4: Power Supply (x: 376, y: 348, w: 344, h: 204)
    svgContent += `
      <g id="zone-power">
        <rect x="376" y="348" width="344" height="204" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="548" y="370" class="silkscreen-title" text-anchor="middle">POWER SUPPLY</text>

        <!-- 12V Section -->
        <rect x="394" y="386" width="144" height="68" rx="3" fill="none" stroke="var(--silkscreen)" stroke-width="1.2" />
        <text x="466" y="404" class="silkscreen-text bold" text-anchor="middle">+12 V</text>

        <!-- 5V Section -->
        <rect x="554" y="386" width="148" height="68" rx="3" fill="none" stroke="var(--silkscreen)" stroke-width="1.2" />
        <text x="628" y="404" class="silkscreen-text bold" text-anchor="middle">+5 V (VCC)</text>

        <!-- GND Section -->
        <rect x="394" y="466" width="308" height="74" rx="3" fill="none" stroke="var(--silkscreen)" stroke-width="1.2" />
        <text x="548" y="484" class="silkscreen-text bold" text-anchor="middle">GROUND (GND)</text>
      </g>
    `;

    // 12V Jacks (2 jacks)
    this.jackCoords["PWR.12V_1"] = { x: 436, y: 432 };
    this.jackCoords["PWR.12V_2"] = { x: 496, y: 432 };
    svgContent += SVG_COMPONENTS.renderBrassJack("PWR.12V_1", null, 436, 432);
    svgContent += SVG_COMPONENTS.renderBrassJack("PWR.12V_2", null, 496, 432);

    // 5V Jacks (2 jacks)
    this.jackCoords["PWR.5V_1"] = { x: 596, y: 432 };
    this.jackCoords["PWR.5V_2"] = { x: 660, y: 432 };
    svgContent += SVG_COMPONENTS.renderBrassJack("PWR.5V_1", null, 596, 432);
    svgContent += SVG_COMPONENTS.renderBrassJack("PWR.5V_2", null, 660, 432);

    // GND Jacks (4 jacks)
    const gndX = [436, 510, 584, 660];
    for (let i = 1; i <= 4; i++) {
      const gId = `PWR.GND_${i}`;
      this.jackCoords[gId] = { x: gndX[i - 1], y: 516 };
      svgContent += SVG_COMPONENTS.renderBrassJack(gId, null, gndX[i - 1], 516);
    }

    // 6. ZONE 5: Manual Pulser (x: 736, y: 348, w: 376, h: 204)
    svgContent += `
      <g id="zone-pulser">
        <rect x="736" y="348" width="376" height="204" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="924" y="370" class="silkscreen-title" text-anchor="middle">MANUAL PULSER</text>
        <text x="924" y="388" class="silkscreen-text mini" text-anchor="middle">DEBOUNCED SCHMITT-TRIGGER (CD4093)</text>

        <!-- Pulser 1 and Pulser 2 buttons -->
        ${SVG_COMPONENTS.renderPushButton(1, "PULSER 1", 790, 440, this.engine.pulsers[1].pressed)}
        ${SVG_COMPONENTS.renderPushButton(2, "PULSER 2", 1058, 440, this.engine.pulsers[2].pressed)}

        <!-- Decorative Debounce IC in Center -->
        <rect x="894" y="420" width="60" height="36" rx="2" fill="url(#icBody)" stroke="#333" stroke-width="0.8" />
        <text x="924" y="442" fill="#cbd5e1" font-family="var(--font-mono)" font-size="9" text-anchor="middle">CD4093</text>

        <!-- Pulse waveform silkscreen graphics -->
        <path d="M 830 424 L 840 424 L 840 410 L 855 410 L 855 424 L 865 424" fill="none" stroke="var(--silkscreen)" stroke-width="1.5" />
        <path d="M 983 424 L 993 424 L 993 410 L 1008 410 L 1008 424 L 1018 424" fill="none" stroke="var(--silkscreen)" stroke-width="1.5" />
      </g>
    `;

    // Pulser 1 Jacks: Q and QN
    this.jackCoords["PULSE1.Q"] = { x: 846, y: 494 };
    this.jackCoords["PULSE1.QN"] = { x: 884, y: 494 };
    svgContent += SVG_COMPONENTS.renderBrassJack("PULSE1.Q", "Q", 846, 494, "bottom");
    svgContent += SVG_COMPONENTS.renderBrassJack("PULSE1.QN", "Q'", 884, 494, "bottom");

    // Pulser 2 Jacks: Q and QN
    this.jackCoords["PULSE2.Q"] = { x: 964, y: 494 };
    this.jackCoords["PULSE2.QN"] = { x: 1002, y: 494 };
    svgContent += SVG_COMPONENTS.renderBrassJack("PULSE2.Q", "Q", 964, 494, "bottom");
    svgContent += SVG_COMPONENTS.renderBrassJack("PULSE2.QN", "Q'", 1002, 494, "bottom");

    // 7. ZONE 6: Clock Generator (x: 1128, y: 348, w: 432, h: 204)
    svgContent += `
      <g id="zone-clock">
        <rect x="1128" y="348" width="432" height="204" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="1344" y="370" class="silkscreen-title" text-anchor="middle">CLOCK GENERATOR</text>

        <!-- Rotary frequency knob -->
        ${SVG_COMPONENTS.renderKnob("clock-knob", "FREQUENCY", 1230, 446, this.engine.clock.freq)}

        <!-- Clock Output LED indicator -->
        ${SVG_COMPONENTS.renderLed("LED_CLK", "CLK", 1374, 430, this.engine.clock.state === 1 && this.engine.masterPower, "top")}
      </g>
    `;

    // Clock Jacks: CLK.OUT and CLK.DIV
    this.jackCoords["CLK.OUT"] = { x: 1440, y: 446 };
    this.jackCoords["CLK.DIV"] = { x: 1506, y: 446 };
    svgContent += SVG_COMPONENTS.renderBrassJack("CLK.OUT", "CLK OUT", 1440, 446, "bottom");
    svgContent += SVG_COMPONENTS.renderBrassJack("CLK.DIV", "CLK / 2", 1506, 446, "bottom");

    // 8. ZONE 7: 2×2 Socket Grid (U1, U2, U3, U4) (x: 376, y: 566, w: 1184, h: 504)
    svgContent += `
      <g id="zone-socket-grid">
        <rect x="376" y="566" width="1184" height="504" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <!-- Grid division lines -->
        <line x1="968" y1="566" x2="968" y2="1070" stroke="var(--silkscreen)" stroke-width="1.5" />
        <line x1="376" y1="818" x2="1560" y2="818" stroke="var(--silkscreen)" stroke-width="1.5" />
      </g>
    `;

    // Four 20-Pin ZIF Sockets: U1, U2, U3, U4
    const socketCells = [
      { id: "U1", label: "U1", x: 420, y: 658 },
      { id: "U2", label: "U2", x: 1012, y: 658 },
      { id: "U3", label: "U3", x: 420, y: 910 },
      { id: "U4", label: "U4", x: 1012, y: 910 }
    ];

    const zifW = 480;
    const zifH = 76;
    const zifPitch = (zifW - 40) / 9;

    for (const cell of socketCells) {
      const sData = this.engine.sockets[cell.id];
      const icDef = sData.chip ? IC_LIBRARY[sData.chip] : null;

      // Socket cell silkscreen label
      svgContent += `
        <text x="${cell.x + 10}" y="${cell.y - 48}" class="silkscreen-title bold">${cell.label}</text>
        <text x="${cell.x + 60}" y="${cell.y - 48}" class="silkscreen-text">${sData.chip ? `${sData.chip} (${icDef ? icDef.title : ''})` : '[EMPTY SOCKET]'}</text>
      `;

      // 20-Pin ZIF Socket Body and Lever
      svgContent += SVG_COMPONENTS.renderZIFSocket(cell.id, cell.x, cell.y - zifH / 2, zifW, zifH, 20, sData.leverLocked);

      // Inserted IC
      if (sData.chip && icDef) {
        svgContent += SVG_COMPONENTS.renderInsertedIC(cell.id, sData.chip, cell.x, cell.y - zifH / 2, zifW, zifH, icDef.pinCount, sData.alignment);
      }

      // Top Jack Row: labelled 20 19 18 ... 11 (left to right)
      for (let i = 0; i < 10; i++) {
        const pinNum = 20 - i;
        const jId = `${cell.id}.J${pinNum}`;
        const jx = cell.x + 20 + i * zifPitch;
        const jy = cell.y - 58;
        this.jackCoords[jId] = { x: jx, y: jy };
        svgContent += SVG_COMPONENTS.renderBrassJack(jId, `${pinNum}`, jx, jy, "top");
      }

      // Bottom Jack Row: labelled 1 2 3 ... 10 (left to right)
      for (let i = 0; i < 10; i++) {
        const pinNum = 1 + i;
        const jId = `${cell.id}.J${pinNum}`;
        const jx = cell.x + 20 + i * zifPitch;
        const jy = cell.y + 58;
        this.jackCoords[jId] = { x: jx, y: jy };
        svgContent += SVG_COMPONENTS.renderBrassJack(jId, `${pinNum}`, jx, jy, "bottom");
      }
    }

    // 9. ZONE 8: Bottom Silkscreen Strip (y93–100%)
    svgContent += `
      <g id="zone-label-strip">
        <rect x="42" y="1084" width="1518" height="38" rx="3" fill="#082916" stroke="var(--silkscreen)" stroke-width="1.2" />
        <!-- Hi-Tech Logo Badge -->
        <rect x="52" y="1089" width="80" height="28" rx="3" fill="#111827" stroke="#f59e0b" stroke-width="1" />
        <text x="92" y="1108" fill="#f59e0b" font-family="var(--font-mono)" font-size="13" font-weight="900" text-anchor="middle">Hi-Tech</text>
        <!-- Trainer Model Name -->
        <text x="230" y="1109" class="brand-silkscreen gold" text-anchor="middle">DIT 9005</text>
        <text x="560" y="1109" class="brand-silkscreen" text-anchor="middle">DIGITAL IC TRAINER</text>
        <text x="1220" y="1108" class="brand-silkscreen small" text-anchor="middle">HI-TECH ELECTRONICS, PUNE - 30</text>
      </g>
    `;

    // 10. PATCH CORDS LAYER
    let wiresSvg = "";
    for (const w of this.engine.wires) {
      const p1 = this.jackCoords[w.from];
      const p2 = this.jackCoords[w.to];
      if (p1 && p2) {
        wiresSvg += SVG_COMPONENTS.renderPatchCord(w, p1, p2);
      }
    }

    svgContent += `<g id="wires-layer">${wiresSvg}</g>`;

    // Update SVG in DOM
    this.svg.innerHTML = svgContent;

    // Apply selection highlight on currently selected jack
    if (this.selectedJack) {
      const g = this.svg.querySelector(`[data-jack="${this.selectedJack}"]`);
      if (g) {
        const ring = g.querySelector(".jack-selection-ring");
        if (ring) {
          ring.setAttribute("opacity", "1");
          ring.setAttribute("stroke", this.activeColor);
        }
      }
    }
  }
}

