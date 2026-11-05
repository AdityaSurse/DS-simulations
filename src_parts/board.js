/* ===== BOARD ===== */
class BoardRenderer {
  constructor(engine, svgElement, onJackHover) {
    this.engine = engine;
    this.svg = svgElement;
    this.onJackHover = onJackHover;

    this.jackCoords = {};
    this.selectedJack = null;
    this.dragStartJack = null;
    this.dragStartPos = null;
    this.isDraggingCord = false;
    this.hoverTargetJack = null;
    this.selectedCordId = null;
    this.tempMousePos = null;
    this.activeView = "full";
    this.activeColor = "#f5c518";
    this.deleteMode = false;

    // Pan & Zoom state
    this.viewBox = { x: 0, y: 0, w: 1600, h: 1160 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };

    // Clock knob dragging state
    this.isDraggingKnob = false;

    this.setupViewPresets();
    this.bindEvents();
    this.bindPanZoom();
    this.bindKnobDrag();
  }

  setupViewPresets() {
    this.viewPresets = {
      full: { x: 0, y: 0, w: 1600, h: 1160 },
      zif: { x: 360, y: 550, w: 1220, h: 540 },
      inputs: { x: 360, y: 20, w: 1220, h: 540 },
      outputs: { x: 1020, y: 20, w: 560, h: 330 },
      u5: { x: 20, y: 20, w: 380, h: 1080 }
    };
  }

  setView(viewName) {
    const preset = this.viewPresets[viewName] || this.viewPresets.full;
    this.activeView = viewName;
    this.viewBox = { ...preset };
    this.applyViewBox();
  }

  applyViewBox() {
    this.svg.setAttribute("viewBox", `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
  }

  zoom(factor, center = { x: 800, y: 580 }) {
    const newW = Math.max(300, Math.min(2400, this.viewBox.w * factor));
    const newH = Math.max(220, Math.min(1740, this.viewBox.h * factor));
    const ratioX = (center.x - this.viewBox.x) / this.viewBox.w;
    const ratioY = (center.y - this.viewBox.y) / this.viewBox.h;

    this.viewBox.x = center.x - ratioX * newW;
    this.viewBox.y = center.y - ratioY * newH;
    this.viewBox.w = newW;
    this.viewBox.h = newH;
    this.applyViewBox();
  }

  fit() {
    this.setView("full");
  }

  setWireColor(color) {
    this.setColor(color);
  }

  setDeleteMode(val) {
    this.deleteMode = val;
    document.body.classList.toggle("delete-mode", val);
  }

  getSVGCoords(e) {
    const pt = this.svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = this.svg.getScreenCTM().inverse();
    return pt.matrixTransform(ctm);
  }

  bindPanZoom() {
    const container = this.svg.parentElement;

    container.addEventListener("wheel", (e) => {
      // If over clock knob, adjust frequency directly with mouse wheel
      if (e.target.closest(".knob-group")) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.03 : -0.03;
        this.engine.setClockT(this.engine.clock.knobT + delta);
        this.render();
        return;
      }

      e.preventDefault();
      const coords = this.getSVGCoords(e);
      const factor = e.deltaY > 0 ? 1.12 : 0.89;
      this.zoom(factor, coords);
    }, { passive: false });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !e.repeat && document.activeElement.tagName !== "INPUT") {
        container.classList.add("panning");
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        container.classList.remove("panning");
        this.isPanning = false;
      }
    });

    container.addEventListener("mousedown", (e) => {
      if (e.button === 1 || (e.button === 0 && e.spaceKey) || container.classList.contains("panning")) {
        this.isPanning = true;
        this.panStart = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isPanning) {
        const dx = (e.clientX - this.panStart.x) * (this.viewBox.w / this.svg.clientWidth);
        const dy = (e.clientY - this.panStart.y) * (this.viewBox.h / this.svg.clientHeight);
        this.viewBox.x -= dx;
        this.viewBox.y -= dy;
        this.panStart = { x: e.clientX, y: e.clientY };
        this.applyViewBox();
      }
    });

    window.addEventListener("mouseup", () => {
      this.isPanning = false;
    });
  }

  bindKnobDrag() {
    const knobCenter = { x: 1220, y: 446 };

    this.svg.addEventListener("mousedown", (e) => {
      const knobGroup = e.target.closest(".knob-group");
      if (knobGroup) {
        this.isDraggingKnob = true;
        e.preventDefault();
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isDraggingKnob) {
        const coords = this.getSVGCoords(e);
        const dx = coords.x - knobCenter.x;
        const dy = coords.y - knobCenter.y;
        // Calculate angle in degrees relative to bottom
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;

        // Map angle from 45 deg to 315 deg (270 degree span)
        let t = 0;
        if (angle <= 45) t = 0;
        else if (angle >= 315) t = 1;
        else t = (angle - 45) / 270;

        this.engine.setClockT(t);
        this.render();
      }
    });

    window.addEventListener("mouseup", () => {
      if (this.isDraggingKnob) {
        this.isDraggingKnob = false;
      }
    });
  }

  bindEvents() {
    // Mousedown for starting wire drag, switch flips, pulsers, knob
    this.svg.addEventListener("mousedown", (e) => {
      if (this.isPanning || this.isDraggingKnob) return;
      if (e.button !== 0) return; // Left click only for dragging

      // Jack mousedown -> start drag-to-connect
      const jackGroup = e.target.closest(".jack-group");
      if (jackGroup) {
        const jackId = jackGroup.dataset.jack;
        this.dragStartJack = jackId;
        this.dragStartPos = this.getSVGCoords(e);
        this.tempMousePos = this.dragStartPos;
        this.isDraggingCord = true;
        this.updateRubberBand();
        e.preventDefault();
        return;
      }

      // Manual Pulser press
      const btnGroup = e.target.closest(".pushbutton-group");
      if (btnGroup) {
        const pulserNum = parseInt(btnGroup.dataset.pulser, 10);
        this.engine.setPulser(pulserNum, true);
        e.preventDefault();
      }
    });

    // Click interactions (switches, levers, clock controls, cord selection/deletion)
    this.svg.addEventListener("click", (e) => {
      // 1. Midpoint ✕ delete handle on cord
      const deleteHandle = e.target.closest(".cord-delete-handle");
      if (deleteHandle) {
        const wireId = deleteHandle.dataset.wireId;
        this.engine.removeWire(wireId);
        this.selectedCordId = null;
        this.renderCordsOnly();
        return;
      }

      // 2. Click on a patch cord (select it or delete in deleteMode)
      const wireGroup = e.target.closest(".patch-cord-group");
      if (wireGroup) {
        const wireId = wireGroup.dataset.wireId;
        if (this.deleteMode || e.altKey) {
          this.engine.removeWire(wireId);
          this.selectedCordId = null;
          this.renderCordsOnly();
          return;
        }

        // Toggle selection
        this.selectedCordId = (this.selectedCordId === wireId ? null : wireId);
        this.renderCordsOnly();
        return;
      }

      // 3. Toggle Switch
      const switchGroup = e.target.closest(".switch-group");
      if (switchGroup) {
        const swId = switchGroup.dataset.switch;
        this.engine.toggleInput(swId);
        return;
      }

      // 4. ZIF Socket Lever Toggle
      const zifLever = e.target.closest(".zif-lever");
      if (zifLever) {
        const sId = zifLever.dataset.socket;
        const curLocked = this.engine.sockets[sId].leverLocked;
        this.engine.setSocketLever(sId, !curLocked);
        return;
      }

      // 5. Clock Run/Pause button
      const clkToggle = e.target.closest("#btn-clk-run-pause");
      if (clkToggle) {
        this.engine.toggleClockRun();
        return;
      }

      // 6. Clock Step button
      const clkStep = e.target.closest("#btn-clk-step");
      if (clkStep) {
        this.engine.stepClock();
        return;
      }

      // 7. Clicked on empty board background -> deselect
      if (this.selectedCordId) {
        this.selectedCordId = null;
        this.renderCordsOnly();
      }
      if (this.selectedJack && !this.isDraggingCord) {
        this.selectedJack = null;
        this.tempMousePos = null;
        this.updateRubberBand();
      }
    });

    // Window mouseup: ends drag-and-drop connecting or pulser press
    window.addEventListener("mouseup", (e) => {
      // Pulser releases
      if (this.engine.board.pulsers[1].pressed) this.engine.setPulser(1, false);
      if (this.engine.board.pulsers[2].pressed) this.engine.setPulser(2, false);

      // Handle cord dragging completion
      if (this.isDraggingCord && this.dragStartJack) {
        const curPos = this.getSVGCoords(e);
        const movedDist = Math.hypot(curPos.x - this.dragStartPos.x, curPos.y - this.dragStartPos.y);

        // Find drop target jack under pointer
        const elem = document.elementFromPoint(e.clientX, e.clientY);
        const targetGroup = elem ? elem.closest(".jack-group") : null;
        const targetJack = targetGroup ? targetGroup.dataset.jack : null;

        if (targetJack && targetJack !== this.dragStartJack) {
          // Dragged and dropped onto a different jack!
          this.engine.addWire(this.dragStartJack, targetJack, this.activeColor);
          this.selectedJack = null;
          this.selectedCordId = null;
        } else if (movedDist < 8) {
          // It was a click on the jack! Support click-to-click connection
          if (!this.selectedJack) {
            this.selectedJack = this.dragStartJack;
          } else if (this.selectedJack === this.dragStartJack) {
            this.selectedJack = null;
          } else {
            this.engine.addWire(this.selectedJack, this.dragStartJack, this.activeColor);
            this.selectedJack = null;
          }
        } else {
          // Dragged into empty space -> invalid drop cancelled gracefully
          if (this.selectedJack === this.dragStartJack) {
            this.selectedJack = null;
          }
        }

        this.isDraggingCord = false;
        this.dragStartJack = null;
        this.dragStartPos = null;
        this.hoverTargetJack = null;
        this.tempMousePos = null;
        this.updateRubberBand();
        this.renderCordsOnly();
      }
    });

    // Right-click cord deletion
    this.svg.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const deleteHandle = e.target.closest(".cord-delete-handle");
      if (deleteHandle) {
        this.engine.removeWire(deleteHandle.dataset.wireId);
        this.selectedCordId = null;
        this.renderCordsOnly();
        return;
      }
      const wireGroup = e.target.closest(".patch-cord-group");
      if (wireGroup) {
        this.engine.removeWire(wireGroup.dataset.wireId);
        this.selectedCordId = null;
        this.renderCordsOnly();
        return;
      }
      const jackGroup = e.target.closest(".jack-group");
      if (jackGroup) {
        const jackId = jackGroup.dataset.jack;
        const attached = this.engine.wires.filter(w => w.from === jackId || w.to === jackId);
        if (attached.length > 0) {
          this.engine.removeWire(attached[attached.length - 1].id);
          this.selectedCordId = null;
          this.renderCordsOnly();
        }
      }
    });

    // Mouse move for rubber-band wire, hover snap, and probe HUD
    this.svg.addEventListener("mousemove", (e) => {
      if (this.isPanning || this.isDraggingKnob) return;
      const coords = this.getSVGCoords(e);

      if (this.isDraggingCord || this.selectedJack) {
        this.tempMousePos = coords;

        // Check if mouse is hovering over candidate target jack
        const jackGroup = e.target.closest(".jack-group");
        const activeJack = this.dragStartJack || this.selectedJack;
        if (jackGroup && jackGroup.dataset.jack !== activeJack) {
          this.hoverTargetJack = jackGroup.dataset.jack;
        } else {
          this.hoverTargetJack = null;
        }
        this.updateRubberBand();
        return; // Suppress probe HUD while wiring
      }

      const jackGroup = e.target.closest(".jack-group");
      if (jackGroup) {
        const jackId = jackGroup.dataset.jack;
        if (this.onJackHover) this.onJackHover(jackId, e);
      } else {
        if (this.onJackHover) this.onJackHover(null, e);
      }
    });

    // Keyboard shortcuts: Delete, Escape, Undo/Redo, Pulsers, Clock
    window.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (this.selectedCordId) {
          e.preventDefault();
          this.engine.removeWire(this.selectedCordId);
          this.selectedCordId = null;
          this.renderCordsOnly();
        }
      } else if (e.key === "Escape") {
        this.selectedJack = null;
        this.selectedCordId = null;
        this.isDraggingCord = false;
        this.dragStartJack = null;
        this.hoverTargetJack = null;
        this.tempMousePos = null;
        this.updateRubberBand();
        this.renderCordsOnly();
      } else if ((e.key === "z" || e.key === "Z") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          this.engine.redo();
        } else {
          this.engine.undo();
        }
        this.renderCordsOnly();
      } else if ((e.key === "y" || e.key === "Y") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.engine.redo();
        this.renderCordsOnly();
      } else if (e.key === " " && !e.repeat && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        this.engine.setPulser(1, true);
      } else if (e.key === "ArrowUp") {
        this.engine.setClockT(this.engine.clock.knobT + 0.05);
        this.render();
      } else if (e.key === "ArrowDown") {
        this.engine.setClockT(this.engine.clock.knobT - 0.05);
        this.render();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === " ") {
        this.engine.setPulser(1, false);
      }
    });
  }

  setColor(color) {
    this.activeColor = color;
    if (this.selectedCordId) {
      this.engine.setWireColor(this.selectedCordId, color);
      this.renderCordsOnly();
    }
  }

  updateRubberBand() {
    let rubberBand = this.svg.querySelector("#rubber-band-wire");
    const activeJack = this.dragStartJack || this.selectedJack;

    if (!activeJack || !this.tempMousePos) {
      if (rubberBand) rubberBand.remove();
      // Remove any leftover drop target glow rings
      this.svg.querySelectorAll(".jack-drop-glow").forEach(el => el.remove());
      return;
    }

    const p1 = this.jackCoords[activeJack];
    // If hovering over target jack, snap rubber band tip to that jack's center!
    const p2 = (this.hoverTargetJack && this.jackCoords[this.hoverTargetJack])
      ? this.jackCoords[this.hoverTargetJack]
      : this.tempMousePos;

    if (!p1) return;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);

    // Natural gravity sag using Cubic Bezier
    const droop = Math.max(35, 25 + dist * 0.22);
    const cx1 = p1.x + dx * 0.25;
    const cy1 = p1.y + droop + Math.max(0, dy * 0.25);
    const cx2 = p2.x - dx * 0.25;
    const cy2 = p2.y + droop - Math.max(0, -dy * 0.25);

    const pathData = `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
    const shadowPath = `M ${p1.x} ${p1.y + 8} C ${cx1} ${cy1 + 16}, ${cx2} ${cy2 + 16}, ${p2.x} ${p2.y + 8}`;

    if (!rubberBand) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("id", "rubber-band-wire");
      g.setAttribute("pointer-events", "none");
      g.innerHTML = `
        <path class="rb-shadow" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="8" stroke-linecap="round" filter="url(#cordShadowFilter)" />
        <path class="rb-border" fill="none" stroke="#090d14" stroke-width="7" stroke-linecap="round" />
        <path class="rb-body" fill="none" stroke="${this.activeColor}" stroke-width="5" stroke-linecap="round" opacity="0.95" />
        <path class="rb-specular" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.6" />
        <g class="rb-plug-start" transform="translate(${p1.x}, ${p1.y})">
          <circle r="8" fill="${this.activeColor}" stroke="#0f172a" stroke-width="1.4" filter="url(#shadowBevel)" />
          <circle r="4.8" fill="url(#brassJack)" stroke="#3a2e0a" stroke-width="0.8" />
        </g>
        <g class="rb-plug-end" transform="translate(${p2.x}, ${p2.y})">
          <circle r="8" fill="${this.activeColor}" stroke="#0f172a" stroke-width="1.4" filter="url(#shadowBevel)" />
          <circle r="4.8" fill="url(#brassJack)" stroke="#3a2e0a" stroke-width="0.8" />
          <circle r="12" fill="none" stroke="${this.activeColor}" stroke-width="2" class="jack-selection-ring" opacity="0.9" />
        </g>
      `;
      this.svg.querySelector("#wires-layer").appendChild(g);
      rubberBand = g;
    }

    rubberBand.querySelector(".rb-shadow").setAttribute("d", shadowPath);
    rubberBand.querySelector(".rb-border").setAttribute("d", pathData);
    const bodyPath = rubberBand.querySelector(".rb-body");
    bodyPath.setAttribute("d", pathData);
    bodyPath.setAttribute("stroke", this.activeColor);
    rubberBand.querySelector(".rb-specular").setAttribute("d", pathData);

    const startPlug = rubberBand.querySelector(".rb-plug-start");
    startPlug.setAttribute("transform", `translate(${p1.x}, ${p1.y})`);
    startPlug.querySelector("circle").setAttribute("fill", this.activeColor);

    const endPlug = rubberBand.querySelector(".rb-plug-end");
    endPlug.setAttribute("transform", `translate(${p2.x}, ${p2.y})`);
    endPlug.querySelector("circle").setAttribute("fill", this.activeColor);

    // Drop target snap halo
    let dropGlow = this.svg.querySelector(".jack-drop-glow");
    if (this.hoverTargetJack && this.jackCoords[this.hoverTargetJack]) {
      const hp = this.jackCoords[this.hoverTargetJack];
      if (!dropGlow) {
        dropGlow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dropGlow.setAttribute("class", "jack-drop-glow");
        dropGlow.setAttribute("r", "16");
        dropGlow.setAttribute("fill", "rgba(56, 189, 248, 0.2)");
        dropGlow.setAttribute("stroke", "#38bdf8");
        dropGlow.setAttribute("stroke-width", "2.5");
        dropGlow.setAttribute("pointer-events", "none");
        dropGlow.setAttribute("filter", "url(#glowTeal)");
        this.svg.querySelector("#wires-layer").appendChild(dropGlow);
      }
      dropGlow.setAttribute("cx", hp.x);
      dropGlow.setAttribute("cy", hp.y);
    } else if (dropGlow) {
      dropGlow.remove();
    }
  }

  // High performance cord-layer update (instant 60fps with 60+ cords)
  renderCordsOnly() {
    const layer = this.svg.querySelector("#wires-layer");
    if (!layer) return;

    let svg = "";
    for (const w of this.engine.wires) {
      const p1 = this.jackCoords[w.from];
      const p2 = this.jackCoords[w.to];
      if (p1 && p2) {
        svg += SVG_COMPONENTS.renderPatchCord(w, p1, p2, this.selectedCordId === w.id);
      }
    }
    layer.innerHTML = svg;

    // Highlight selected source jack if active
    const activeJack = this.dragStartJack || this.selectedJack;
    this.svg.querySelectorAll(".jack-selection-ring").forEach(el => el.setAttribute("opacity", "0"));
    if (activeJack) {
      const g = this.svg.querySelector(`[data-jack="${activeJack}"]`);
      if (g) {
        const ring = g.querySelector(".jack-selection-ring");
        if (ring) {
          ring.setAttribute("opacity", "1");
          ring.setAttribute("stroke", this.activeColor);
        }
      }
    }
  }

  render() {
    this.jackCoords = {};
    let svgContent = SVG_COMPONENTS.renderDefs();

    // 1. Copper/Wood Outer Frame (1600 x 1160)
    svgContent += `
      <rect x="0" y="0" width="1600" height="1160" rx="8" fill="url(#copperFrameTop)" stroke="#2d1808" stroke-width="3" />
      <rect x="12" y="12" width="1576" height="1136" rx="6" fill="url(#copperFrameSide)" />
      <rect x="24" y="24" width="1552" height="1112" rx="4" fill="#38200f" />

      ${SVG_COMPONENTS.renderScrew(16, 16)}
      ${SVG_COMPONENTS.renderScrew(1584, 16)}
      ${SVG_COMPONENTS.renderScrew(16, 1144)}
      ${SVG_COMPONENTS.renderScrew(1584, 1144)}
      ${SVG_COMPONENTS.renderScrew(800, 16)}
      ${SVG_COMPONENTS.renderScrew(800, 1144)}
      ${SVG_COMPONENTS.renderScrew(16, 580)}
      ${SVG_COMPONENTS.renderScrew(1584, 580)}

      <rect x="30" y="30" width="1540" height="1100" rx="4" fill="url(#pcbGradient)" stroke="#04160c" stroke-width="2" />
      <rect x="30" y="30" width="1540" height="1100" fill="url(#pcbTracePattern)" opacity="0.35" />
    `;

    // 2. ZONE 1: Left Strip - 40-Pin ZIF Expansion (U5) (x: 42, y: 42, w: 316, h: 1030)
    svgContent += `
      <g id="zone-left-strip">
        <rect x="42" y="42" width="316" height="1030" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="200" y="70" class="silkscreen-title" text-anchor="middle">40 PIN ZIF EXPANSION</text>
        <text x="200" y="90" class="silkscreen-text mini" text-anchor="middle">UNIVERSAL MICROCONTROLLER / LSI INTERFACE (U5)</text>

        ${SVG_COMPONENTS.drawZIFSocket({
          socketId: "U5",
          x: 130, y: 120, width: 140, height: 840,
          pinCount: 40,
          leverLocked: this.engine.sockets.U5.leverLocked
        })}
        ${SVG_COMPONENTS.drawICChip({
          socketId: "U5",
          chipName: this.engine.sockets.U5.chip,
          marking: this.engine.sockets.U5.chip ? (IC_LIBRARY[this.engine.sockets.U5.chip]?.marking || ("SN" + this.engine.sockets.U5.chip + "N")) : "",
          socketX: 130, socketY: 120, socketW: 140, socketH: 840,
          icPinCount: 40, alignment: "left"
        })}
      </g>
    `;

    const vertPitch = (840 - 50) / 19;
    for (let i = 0; i < 20; i++) {
      const pinLeft = i + 1;
      const jLeftId = `U5.J${pinLeft}`;
      const lx = 92;
      const ly = 145 + i * vertPitch;
      this.jackCoords[jLeftId] = { x: lx, y: ly };
      svgContent += SVG_COMPONENTS.drawJack({
        id: jLeftId, label: `${pinLeft}`, cx: lx, cy: ly, labelSide: "left",
        isSelected: this.selectedJack === jLeftId
      });

      const pinRight = 21 + i;
      const jRightId = `U5.J${pinRight}`;
      const rx = 308;
      const ry = 145 + (19 - i) * vertPitch;
      this.jackCoords[jRightId] = { x: rx, y: ry };
      svgContent += SVG_COMPONENTS.drawJack({
        id: jRightId, label: `${pinRight}`, cx: rx, cy: ry, labelSide: "right",
        isSelected: this.selectedJack === jRightId
      });
    }

    // 3. ZONE 2: 12-Bit Data Input (x: 376, y: 42, w: 648, h: 290)
    svgContent += `
      <g id="zone-data-input">
        <rect x="376" y="42" width="648" height="290" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="700" y="322" class="silkscreen-title" text-anchor="middle">12 BIT DATA INPUT</text>
        <line x1="592" y1="42" x2="592" y2="300" stroke="var(--silkscreen)" stroke-width="1" stroke-dasharray="4, 4" />
        <line x1="808" y1="42" x2="808" y2="300" stroke="var(--silkscreen)" stroke-width="1" stroke-dasharray="4, 4" />
        <text x="484" y="66" class="silkscreen-text bold" text-anchor="middle">GROUP C (C3 - C0)</text>
        <text x="700" y="66" class="silkscreen-text bold" text-anchor="middle">GROUP B (B3 - B0)</text>
        <text x="916" y="66" class="silkscreen-text bold" text-anchor="middle">GROUP A (A3 - A0)</text>

        <rect x="444" y="196" width="80" height="24" rx="2" fill="url(#icBody)" stroke="#333" stroke-width="0.8" />
        <text x="484" y="212" fill="#94a3b8" font-family="var(--font-mono)" font-size="8" text-anchor="middle">74LS244 (C)</text>
        <rect x="660" y="196" width="80" height="24" rx="2" fill="url(#icBody)" stroke="#333" stroke-width="0.8" />
        <text x="700" y="212" fill="#94a3b8" font-family="var(--font-mono)" font-size="8" text-anchor="middle">74LS244 (B)</text>
        <rect x="876" y="196" width="80" height="24" rx="2" fill="url(#icBody)" stroke="#333" stroke-width="0.8" />
        <text x="916" y="212" fill="#94a3b8" font-family="var(--font-mono)" font-size="8" text-anchor="middle">74LS244 (A)</text>
      </g>
    `;

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
      svgContent += SVG_COMPONENTS.drawToggleSwitch({
        id: ch.id, label: ch.name, cx: ch.x, cy: 110, isHigh: swVal
      });
      svgContent += SVG_COMPONENTS.drawLED({
        id: `LED_${ch.id}`, cx: ch.x, cy: 168,
        isOn: swVal && this.engine.masterPower,
        color: "red"
      });
      this.jackCoords[ch.id] = { x: ch.x, y: 260 };
      svgContent += SVG_COMPONENTS.drawJack({
        id: ch.id, label: ch.name, cx: ch.x, cy: 260, labelSide: "bottom",
        isSelected: this.selectedJack === ch.id
      });
    }

    // 4. ZONE 3: 8-Bit Data Output (x: 1040, y: 42, w: 520, h: 290)
    svgContent += `
      <g id="zone-data-output">
        <rect x="1040" y="42" width="520" height="290" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="1300" y="322" class="silkscreen-title" text-anchor="middle">8 BIT DATA OUTPUT</text>
        <text x="1170" y="66" class="silkscreen-text" text-anchor="middle">HIGH NIBBLE (Y7-Y4)</text>
        <text x="1430" y="66" class="silkscreen-text" text-anchor="middle">LOW NIBBLE (Y3-Y0)</text>

        <rect x="1150" y="112" width="60" height="28" rx="2" fill="url(#icBody)" stroke="#333" stroke-width="0.8" />
        <text x="1180" y="130" fill="#94a3b8" font-family="var(--font-mono)" font-size="8" text-anchor="middle">74LS47 (H)</text>
        <rect x="1380" y="112" width="60" height="28" rx="2" fill="url(#icBody)" stroke="#333" stroke-width="0.8" />
        <text x="1410" y="130" fill="#94a3b8" font-family="var(--font-mono)" font-size="8" text-anchor="middle">74LS47 (L)</text>

        ${SVG_COMPONENTS.drawSevenSeg({
          id: "output-7seg",
          x: 1249, y: 78,
          digits: this.engine.segDigits
        })}
      </g>
    `;

    for (let i = 0; i < 8; i++) {
      const bitNum = 7 - i;
      const jId = `OUT.Y${bitNum}`;
      const jx = 1075 + i * 64;
      const brightness = this.engine.board.leds[`LED_${jId}`] || (this.engine.outputs[jId] ? 1.0 : 0.0);

      svgContent += SVG_COMPONENTS.drawLED({
        id: `LED_${jId}`, label: `Y${bitNum}`, cx: jx, cy: 185,
        brightness: this.engine.masterPower ? brightness : 0.0,
        color: "red", labelPos: "top"
      });
      this.jackCoords[jId] = { x: jx, y: 260 };
      svgContent += SVG_COMPONENTS.drawJack({
        id: jId, label: `Y${bitNum}`, cx: jx, cy: 260, labelSide: "bottom",
        isSelected: this.selectedJack === jId
      });
    }

    // 5. ZONE 4: Power Supply (x: 376, y: 348, w: 344, h: 204)
    svgContent += `
      <g id="zone-power">
        <rect x="376" y="348" width="344" height="204" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="548" y="370" class="silkscreen-title" text-anchor="middle">POWER SUPPLY</text>

        <rect x="394" y="386" width="144" height="68" rx="3" fill="none" stroke="var(--silkscreen)" stroke-width="1.2" />
        <text x="466" y="404" class="silkscreen-text bold" text-anchor="middle">+12 V</text>

        <rect x="554" y="386" width="148" height="68" rx="3" fill="none" stroke="var(--silkscreen)" stroke-width="1.2" />
        <text x="628" y="404" class="silkscreen-text bold" text-anchor="middle">+5 V (VCC)</text>

        <rect x="394" y="466" width="308" height="74" rx="3" fill="none" stroke="var(--silkscreen)" stroke-width="1.2" />
        <text x="548" y="484" class="silkscreen-text bold" text-anchor="middle">GROUND (GND)</text>
      </g>
    `;

    this.jackCoords["PWR.12V_1"] = { x: 436, y: 432 };
    this.jackCoords["PWR.12V_2"] = { x: 496, y: 432 };
    svgContent += SVG_COMPONENTS.drawTerminal({ id: "PWR.12V_1", type: "12V", cx: 436, cy: 432 });
    svgContent += SVG_COMPONENTS.drawTerminal({ id: "PWR.12V_2", type: "12V", cx: 496, cy: 432 });

    this.jackCoords["PWR.5V_1"] = { x: 596, y: 432 };
    this.jackCoords["PWR.5V_2"] = { x: 660, y: 432 };
    svgContent += SVG_COMPONENTS.drawTerminal({ id: "PWR.5V_1", type: "5V", cx: 596, cy: 432 });
    svgContent += SVG_COMPONENTS.drawTerminal({ id: "PWR.5V_2", type: "5V", cx: 660, cy: 432 });

    const gndX = [436, 510, 584, 660];
    for (let i = 1; i <= 4; i++) {
      const gId = `PWR.GND_${i}`;
      this.jackCoords[gId] = { x: gndX[i - 1], y: 516 };
      svgContent += SVG_COMPONENTS.drawTerminal({ id: gId, type: "GND", cx: gndX[i - 1], cy: 516 });
    }

    // 6. ZONE 5: Manual Pulser (x: 736, y: 348, w: 376, h: 204)
    // POS (idle 0, active 1) & NEG (idle 1, active 0)
    svgContent += `
      <g id="zone-pulser">
        <rect x="736" y="348" width="376" height="204" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="924" y="368" class="silkscreen-title" text-anchor="middle">MANUAL PULSER</text>
        <text x="924" y="384" class="silkscreen-text mini" text-anchor="middle">DEBOUNCED SCHMITT-TRIGGER (CD4093)</text>

        ${SVG_COMPONENTS.drawPushButton({
          id: 1, label: "PULSER 1", cx: 790, cy: 434,
          isPressed: this.engine.board.pulsers[1].pressed
        })}
        ${SVG_COMPONENTS.drawPushButton({
          id: 2, label: "PULSER 2", cx: 1058, cy: 434,
          isPressed: this.engine.board.pulsers[2].pressed
        })}

        <rect x="894" y="416" width="60" height="34" rx="2" fill="url(#icBody)" stroke="#333" stroke-width="0.8" />
        <text x="924" y="438" fill="#cbd5e1" font-family="var(--font-mono)" font-size="9" text-anchor="middle">CD4093</text>

        <!-- Silkscreen pulse diagrams (Positive pulse symbol & Inverted pulse symbol) -->
        <path d="M 836 432 L 844 432 L 844 418 L 856 418 L 856 432 L 864 432" fill="none" stroke="var(--silkscreen)" stroke-width="1.5" />
        <path d="M 876 418 L 884 418 L 884 432 L 896 432 L 896 418 L 904 418" fill="none" stroke="var(--silkscreen)" stroke-width="1.5" />

        <path d="M 946 432 L 954 432 L 954 418 L 966 418 L 966 432 L 974 432" fill="none" stroke="var(--silkscreen)" stroke-width="1.5" />
        <path d="M 986 418 L 994 418 L 994 432 L 1006 432 L 1006 418 L 1014 418" fill="none" stroke="var(--silkscreen)" stroke-width="1.5" />
      </g>
    `;

    // Pulser 1 Jacks: POS and NEG + LEDs
    this.jackCoords["PULSER.1.POS"] = { x: 846, y: 494 };
    this.jackCoords["PULSER.1.NEG"] = { x: 888, y: 494 };
    this.jackCoords["PULSE1.Q"] = this.jackCoords["PULSER.1.POS"];
    this.jackCoords["PULSE1.QN"] = this.jackCoords["PULSER.1.NEG"];

    const p1PosVal = this.engine.board.pulsers[1].pos;
    const p1NegVal = this.engine.board.pulsers[1].neg;
    const p1PosB = this.engine.board.leds["LED_PULSER_1_POS"] !== undefined ? this.engine.board.leds["LED_PULSER_1_POS"] : (p1PosVal ? 1.0 : 0.0);

    svgContent += SVG_COMPONENTS.drawLED({ id: "LED_P1_POS", cx: 846, cy: 468, brightness: p1PosB, color: "red" });
    svgContent += SVG_COMPONENTS.drawLED({ id: "LED_P1_NEG", cx: 888, cy: 468, brightness: p1NegVal ? 1.0 : 0.0, color: "red" });
    svgContent += SVG_COMPONENTS.drawJack({ id: "PULSER.1.POS", label: "POS ⎍", cx: 846, cy: 494, labelSide: "bottom", isSelected: this.selectedJack === "PULSER.1.POS" });
    svgContent += SVG_COMPONENTS.drawJack({ id: "PULSER.1.NEG", label: "NEG ⎎", cx: 888, cy: 494, labelSide: "bottom", isSelected: this.selectedJack === "PULSER.1.NEG" });

    // Pulser 2 Jacks: POS and NEG + LEDs
    this.jackCoords["PULSER.2.POS"] = { x: 960, y: 494 };
    this.jackCoords["PULSER.2.NEG"] = { x: 1002, y: 494 };
    this.jackCoords["PULSE2.Q"] = this.jackCoords["PULSER.2.POS"];
    this.jackCoords["PULSE2.QN"] = this.jackCoords["PULSER.2.NEG"];

    const p2PosVal = this.engine.board.pulsers[2].pos;
    const p2NegVal = this.engine.board.pulsers[2].neg;
    const p2PosB = this.engine.board.leds["LED_PULSER_2_POS"] !== undefined ? this.engine.board.leds["LED_PULSER_2_POS"] : (p2PosVal ? 1.0 : 0.0);

    svgContent += SVG_COMPONENTS.drawLED({ id: "LED_P2_POS", cx: 960, cy: 468, brightness: p2PosB, color: "red" });
    svgContent += SVG_COMPONENTS.drawLED({ id: "LED_P2_NEG", cx: 1002, cy: 468, brightness: p2NegVal ? 1.0 : 0.0, color: "red" });
    svgContent += SVG_COMPONENTS.drawJack({ id: "PULSER.2.POS", label: "POS ⎍", cx: 960, cy: 494, labelSide: "bottom", isSelected: this.selectedJack === "PULSER.2.POS" });
    svgContent += SVG_COMPONENTS.drawJack({ id: "PULSER.2.NEG", label: "NEG ⎎", cx: 1002, cy: 494, labelSide: "bottom", isSelected: this.selectedJack === "PULSER.2.NEG" });

    // 7. ZONE 6: Clock Generator (x: 1128, y: 348, w: 432, h: 204)
    // CLK.POS (square wave) & CLK.NEG (exact inverse)
    svgContent += `
      <g id="zone-clock">
        <rect x="1128" y="348" width="432" height="204" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <text x="1344" y="368" class="silkscreen-title" text-anchor="middle">AUTOMATIC CLOCK GENERATOR</text>
        <text x="1344" y="384" class="silkscreen-text mini" text-anchor="middle">0.5 Hz - 10 kHz VARIABLE OSCILLATOR</text>

        ${SVG_COMPONENTS.drawClockKnob({
          id: "clock-knob", label: this.engine.formatClockFreq(),
          cx: 1220, cy: 446,
          freq: this.engine.clock.freq,
          knobT: this.engine.clock.knobT,
          running: this.engine.clock.running
        })}

        <!-- Clock control buttons (Run/Pause & Step) -->
        <g id="btn-clk-run-pause" transform="translate(1310, 420)" style="cursor: pointer;">
          <rect x="-24" y="-12" width="48" height="24" rx="4" fill="${this.engine.clock.running ? '#0f766e' : '#b45309'}" stroke="#38bdf8" stroke-width="0.8" />
          <text x="0" y="4" fill="#fff" font-family="var(--font-mono)" font-size="10" font-weight="700" text-anchor="middle">${this.engine.clock.running ? 'PAUSE' : 'RUN'}</text>
        </g>
        <g id="btn-clk-step" transform="translate(1310, 460)" style="cursor: pointer;">
          <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="0.8" />
          <text x="0" y="4" fill="#fff" font-family="var(--font-mono)" font-size="10" font-weight="700" text-anchor="middle">STEP ⏯</text>
        </g>
      </g>
    `;

    this.jackCoords["CLK.POS"] = { x: 1410, y: 446 };
    this.jackCoords["CLK.NEG"] = { x: 1490, y: 446 };
    this.jackCoords["CLK.OUT"] = this.jackCoords["CLK.POS"];
    this.jackCoords["CLK.DIV"] = this.jackCoords["CLK.NEG"];

    const clkPosB = this.engine.board.leds["LED_CLK_POS"] !== undefined ? this.engine.board.leds["LED_CLK_POS"] : (this.engine.clock.pos ? 1.0 : 0.0);
    const clkNegB = this.engine.board.leds["LED_CLK_NEG"] !== undefined ? this.engine.board.leds["LED_CLK_NEG"] : (this.engine.clock.neg ? 1.0 : 0.0);

    svgContent += SVG_COMPONENTS.drawLED({ id: "LED_CLK_POS", cx: 1410, cy: 412, brightness: this.engine.masterPower ? clkPosB : 0.0, color: "red" });
    svgContent += SVG_COMPONENTS.drawLED({ id: "LED_CLK_NEG", cx: 1490, cy: 412, brightness: this.engine.masterPower ? clkNegB : 0.0, color: "red" });
    svgContent += SVG_COMPONENTS.drawJack({ id: "CLK.POS", label: "CLK.POS", cx: 1410, cy: 446, labelSide: "bottom", isSelected: this.selectedJack === "CLK.POS" });
    svgContent += SVG_COMPONENTS.drawJack({ id: "CLK.NEG", label: "CLK.NEG", cx: 1490, cy: 446, labelSide: "bottom", isSelected: this.selectedJack === "CLK.NEG" });

    // 8. ZONE 7: 2×2 Socket Grid (U1, U2, U3, U4) (x: 376, y: 566, w: 1184, h: 504)
    svgContent += `
      <g id="zone-socket-grid">
        <rect x="376" y="566" width="1184" height="504" rx="4" fill="none" stroke="var(--silkscreen)" stroke-width="1.8" />
        <line x1="968" y1="566" x2="968" y2="1070" stroke="var(--silkscreen)" stroke-width="1.5" />
        <line x1="376" y1="818" x2="1560" y2="818" stroke="var(--silkscreen)" stroke-width="1.5" />
      </g>
    `;

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
      const leverText = sData.leverLocked ? "🔒 LOCKED" : "🔓 OPEN (UNLOCKED)";

      svgContent += `
        <text x="${cell.x + 10}" y="${cell.y - 48}" class="silkscreen-title bold">${cell.label}</text>
        <text x="${cell.x + 60}" y="${cell.y - 48}" class="silkscreen-text">${sData.chip ? `${sData.chip} (${icDef ? icDef.title : ''}) - ${leverText}` : `[EMPTY 20-PIN ZIF] - ${leverText}`}</text>
      `;

      svgContent += SVG_COMPONENTS.drawZIFSocket({
        socketId: cell.id,
        x: cell.x, y: cell.y - zifH / 2, width: zifW, height: zifH,
        pinCount: 20,
        leverLocked: sData.leverLocked
      });

      if (sData.chip && icDef) {
        svgContent += SVG_COMPONENTS.drawICChip({
          socketId: cell.id,
          chipName: sData.chip,
          marking: icDef.marking || ("SN" + sData.chip + "N"),
          socketX: cell.x, socketY: cell.y - zifH / 2, socketW: zifW, socketH: zifH,
          icPinCount: icDef.pinCount,
          alignment: sData.alignment
        });
      }

      // Top Jack Row: labelled 20 19 18 ... 11 (left to right)
      for (let i = 0; i < 10; i++) {
        const pinNum = 20 - i;
        const jId = `${cell.id}.J${pinNum}`;
        const jx = cell.x + 20 + i * zifPitch;
        const jy = cell.y - 58;
        this.jackCoords[jId] = { x: jx, y: jy };
        svgContent += SVG_COMPONENTS.drawJack({
          id: jId, label: `${pinNum}`, cx: jx, cy: jy, labelSide: "top",
          isSelected: this.selectedJack === jId
        });
      }

      // Bottom Jack Row: labelled 1 2 3 ... 10 (left to right)
      for (let i = 0; i < 10; i++) {
        const pinNum = 1 + i;
        const jId = `${cell.id}.J${pinNum}`;
        const jx = cell.x + 20 + i * zifPitch;
        const jy = cell.y + 58;
        this.jackCoords[jId] = { x: jx, y: jy };
        svgContent += SVG_COMPONENTS.drawJack({
          id: jId, label: `${pinNum}`, cx: jx, cy: jy, labelSide: "bottom",
          isSelected: this.selectedJack === jId
        });
      }
    }

    // 9. ZONE 8: Bottom Silkscreen Strip (y93–100%)
    svgContent += `
      <g id="zone-label-strip">
        <rect x="42" y="1084" width="1518" height="38" rx="3" fill="#082b18" stroke="var(--silkscreen)" stroke-width="1.2" />
        <rect x="52" y="1089" width="80" height="28" rx="3" fill="#0a0d12" stroke="var(--copper-1)" stroke-width="1" />
        <text x="92" y="1108" fill="var(--accent-amber)" font-family="var(--font-mono)" font-size="13" font-weight="900" text-anchor="middle">Hi-Tech</text>
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
        wiresSvg += SVG_COMPONENTS.renderPatchCord(w, p1, p2, this.selectedCordId === w.id);
      }
    }

    svgContent += `<g id="wires-layer" pointer-events="none">${wiresSvg}</g>`;

    this.svg.innerHTML = svgContent;

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
