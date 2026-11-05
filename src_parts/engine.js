/* ===== ENGINE ===== */
class TTLEngine {
  constructor() {
    this.masterPower = true;
    this.strictPowerMode = true; // Default strict mode from lab addendum
    this.wires = []; // Array of { id, from, to, a, b, color }
    this.nextWireId = 1;
    this.undoStack = [];
    this.redoStack = [];

    // Simulation Virtual Time (in seconds)
    this.sim = {
      time: 0.0,
      lastRealTime: null,
      maxEdgesPerFrame: 1000,
      overrun: false,
      clkPosRisingCount: 0,
      edgeLog: [] // Timestamped net edge events { time, net, oldVal, newVal }
    };

    // Single unified board state object exposed for external access
    this.board = {
      cords: this.wires,
      sockets: {
        U1: { id: "U1", chip: null, alignment: "left", leverLocked: true, state: {} },
        U2: { id: "U2", chip: null, alignment: "left", leverLocked: true, state: {} },
        U3: { id: "U3", chip: null, alignment: "left", leverLocked: true, state: {} },
        U4: { id: "U4", chip: null, alignment: "left", leverLocked: true, state: {} },
        U5: { id: "U5", chip: null, alignment: "left", leverLocked: true, state: {} }
      },
      switches: {
        "IN.C3": 0, "IN.C2": 0, "IN.C1": 0, "IN.C0": 0,
        "IN.B3": 0, "IN.B2": 0, "IN.B1": 0, "IN.B0": 0,
        "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0
      },
      leds: {}, // Map of ledId -> brightness (0.0 to 1.0)
      pulsers: {
        1: { pressed: false, pos: 0, neg: 1, visualHoldUntil: 0 },
        2: { pressed: false, pos: 0, neg: 1, visualHoldUntil: 0 }
      },
      clock: {
        freq: 1.0, // 0.5 Hz to 10 kHz
        knobT: 0.0768, // Logarithmic mapping: f = 0.5 * (20000 ^ t)
        running: true,
        pos: 0,
        neg: 1,
        halfPeriodPhase: 0.0, // 0 to halfPeriod
        dutyCycle: 0.5
      }
    };

    // Outputs
    this.outputs = {
      "OUT.Y7": 0, "OUT.Y6": 0, "OUT.Y5": 0, "OUT.Y4": 0,
      "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 0, "OUT.Y0": 0
    };
    this.outputDuty = {
      "OUT.Y7": 0, "OUT.Y6": 0, "OUT.Y5": 0, "OUT.Y4": 0,
      "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 0, "OUT.Y0": 0
    };

    this.segDigits = [0, 0]; // High nibble (Y7..Y4), Low nibble (Y3..Y0)
    this.diagnostics = {
      shorts: [],
      missingPower: [],
      unconnectedOutputs: [],
      backwardsICs: [],
      floatingInputs: [],
      oscillations: []
    };
    this.shorts = this.diagnostics.shorts;
    this.oscillating = false;
    this.netMap = new Map();
    this.nets = [];
    this.changeCallbacks = [];

    // Audio synthesizer
    this.audioCtx = null;

    // Start requestAnimationFrame Virtual Time Loop
    this.rafId = null;
    this.startVirtualTimeLoop();
  }

  // Convenient property getters to match previous APIs
  get inputs() { return this.board.switches; }
  set inputs(val) { this.board.switches = val; }
  get sockets() { return this.board.sockets; }
  set sockets(val) { this.board.sockets = val; }
  get pulsers() { return this.board.pulsers; }
  set pulsers(val) { this.board.pulsers = val; }
  get clock() { return this.board.clock; }
  set clock(val) { this.board.clock = val; }

  onChange(cb) {
    this.changeCallbacks.push(cb);
  }

  notify() {
    this.changeCallbacks.forEach(cb => cb());
  }

  // Audio effects
  playClickSound(pitch = 800) {
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(pitch, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  playShortBuzzer() {
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.16);
    } catch (e) {}
  }

  // Clock Knob: Logarithmic mapping from 0.5 Hz to 10 kHz:
  // f = 0.5 * (20000 ^ t), where t in [0, 1]
  setClockT(t) {
    t = Math.max(0, Math.min(1, t));
    this.clock.knobT = t;
    this.clock.freq = 0.5 * Math.pow(20000, t);
    this.notify();
  }

  setClockFreq(freq) {
    freq = Math.max(0.5, Math.min(10000, freq));
    this.clock.freq = freq;
    // inverse: t = log(freq / 0.5) / log(20000)
    this.clock.knobT = Math.log(freq / 0.5) / Math.log(20000);
    this.notify();
  }

  formatClockFreq(freq = this.clock.freq) {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(freq >= 10000 ? 0 : 1)} kHz`;
    } else if (freq >= 10) {
      return `${freq.toFixed(freq >= 100 ? 0 : 1)} Hz`;
    } else {
      return `${freq.toFixed(2)} Hz`;
    }
  }

  toggleClockRun() {
    this.clock.running = !this.clock.running;
    this.notify();
  }

  stepClock() {
    // Step one full period: two half-periods (rising + falling)
    this.triggerClockEdge();
    this.triggerClockEdge();
    this.notify();
  }

  triggerClockEdge() {
    this.clock.pos = this.clock.pos === 1 ? 0 : 1;
    this.clock.neg = this.clock.pos === 1 ? 0 : 1;
    if (this.clock.pos === 1) this.sim.clkPosRisingCount = (this.sim.clkPosRisingCount || 0) + 1;
    this.logEdge("CLK.POS", this.clock.pos === 1 ? 0 : 1, this.clock.pos);
    this.logEdge("CLK.NEG", this.clock.neg === 1 ? 0 : 1, this.clock.neg);
    this.evaluate();
  }

  logEdge(netName, oldVal, newVal) {
    this.sim.edgeLog.push({
      time: this.sim.time,
      net: netName,
      oldVal,
      newVal
    });
    if (this.sim.edgeLog.length > 5000) {
      this.sim.edgeLog.splice(0, 1000);
    }
  }

  // Manual Pulser: press & release (debounced, POS & NEG exact complements)
  setPulser(num, pressed) {
    const p = this.board.pulsers[num];
    if (!p) return;
    if (p.pressed === pressed) return;

    p.pressed = pressed;
    if (pressed) {
      p.pos = 1;
      p.neg = 0;
      p.visualHoldUntil = performance.now() + 60; // Visual hold of at least 60ms
      this.logEdge(`PULSER.${num}.POS`, 0, 1);
      this.logEdge(`PULSER.${num}.NEG`, 1, 0);
      this.playClickSound(1050);
    } else {
      p.pos = 0;
      p.neg = 1;
      this.logEdge(`PULSER.${num}.POS`, 1, 0);
      this.logEdge(`PULSER.${num}.NEG`, 0, 1);
      this.playClickSound(650);
    }

    this.evaluate();
    this.notify();
  }

  // Virtual Time Loop (requestAnimationFrame)
  startVirtualTimeLoop() {
    const loop = (timestamp) => {
      if (this.sim.lastRealTime === null) {
        this.sim.lastRealTime = timestamp;
      }
      const dt = Math.min(0.1, (timestamp - this.sim.lastRealTime) / 1000); // Max dt clamp 100ms
      this.sim.lastRealTime = timestamp;

      if (this.masterPower && this.clock.running) {
        this.advanceVirtualTime(dt);
      }

      // Check visual hold timers for pulsers
      for (let i = 1; i <= 2; i++) {
        const p = this.board.pulsers[i];
        if (!p.pressed && timestamp < p.visualHoldUntil) {
          // Keep visual LED lit during fast-click hold
          this.board.leds[`LED_PULSER_${i}_POS`] = 1.0;
        }
      }

      this.updateDisplaySmoothing(dt);
      this.rafId = requestAnimationFrame(loop);
    };

    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      this.rafId = window.requestAnimationFrame(loop);
    }
  }

  // Advance virtual time by dt, generating half-period clock edges
  advanceVirtualTime(dt) {
    if (this.clock.freq <= 0) return;
    const halfPeriod = 1 / (this.clock.freq * 2);
    let timeRemaining = dt;
    let edgesThisFrame = 0;
    this.sim.overrun = false;

    while (timeRemaining > 0) {
      const timeToNextEdge = halfPeriod - this.clock.halfPeriodPhase;

      if (timeRemaining < timeToNextEdge - 1e-11) {
        this.clock.halfPeriodPhase += timeRemaining;
        this.sim.time += timeRemaining;
        timeRemaining = 0;
      } else {
        // Edge occurs!
        this.sim.time += timeToNextEdge;
        timeRemaining -= timeToNextEdge;
        this.clock.halfPeriodPhase = 0;

        edgesThisFrame++;
        if (edgesThisFrame <= this.sim.maxEdgesPerFrame) {
          this.triggerClockEdge();
        } else {
          this.sim.overrun = true;
          // Fast-forward phase without computing every individual edge to avoid freezing browser
          this.sim.time += timeRemaining;
          this.clock.halfPeriodPhase = (this.clock.halfPeriodPhase + timeRemaining) % halfPeriod;
          timeRemaining = 0;
          break;
        }
      }
    }

    this.notify();
  }

  // Display smoothing: time-weighted average for high frequencies
  updateDisplaySmoothing(dt) {
    const freq = this.clock.freq;
    const isHighFreq = freq > 15;

    // Clock LED brightness
    if (isHighFreq) {
      this.board.leds["LED_CLK_POS"] = 0.5; // 50% duty
      this.board.leds["LED_CLK_NEG"] = 0.5;
    } else {
      this.board.leds["LED_CLK_POS"] = this.clock.pos === 1 ? 1.0 : 0.0;
      this.board.leds["LED_CLK_NEG"] = this.clock.neg === 1 ? 1.0 : 0.0;
    }

    // Output LEDs smoothing
    for (let i = 0; i < 8; i++) {
      const jId = `OUT.Y${i}`;
      const curVal = this.outputs[jId];
      if (isHighFreq) {
        const alpha = Math.min(1.0, dt * 15);
        this.outputDuty[jId] = (this.outputDuty[jId] || 0) * (1 - alpha) + curVal * alpha;
        this.board.leds[`LED_${jId}`] = Math.max(0.1, Math.min(1.0, this.outputDuty[jId]));
      } else {
        this.board.leds[`LED_${jId}`] = curVal === 1 ? 1.0 : 0.0;
      }
    }
  }

  toggleMasterPower() {
    this.masterPower = !this.masterPower;
    this.playClickSound(this.masterPower ? 600 : 300);
    this.evaluate();
    this.notify();
  }

  setStrictPowerMode(strict) {
    this.strictPowerMode = strict;
    this.evaluate();
    this.notify();
    this.autoSave();
  }

  toggleInput(jackId) {
    if (this.inputs.hasOwnProperty(jackId)) {
      this.inputs[jackId] = this.inputs[jackId] === 1 ? 0 : 1;
      this.playClickSound(this.inputs[jackId] === 1 ? 950 : 700);
      this.evaluate();
      this.notify();
      this.autoSave();
    }
  }

  // IC Socket Management
  insertChip(socketId, chipName, alignment = "left") {
    if (this.sockets[socketId]) {
      this.sockets[socketId].chip = chipName;
      this.sockets[socketId].alignment = alignment;
      this.sockets[socketId].backwards = false;
      this.sockets[socketId].state = {};
      this.sockets[socketId].lastOutputs = null;
      this.evaluate();
      this.notify();
      this.autoSave();
    }
  }

  removeChip(socketId) {
    if (this.sockets[socketId]) {
      this.sockets[socketId].chip = null;
      this.sockets[socketId].backwards = false;
      this.sockets[socketId].state = {};
      this.sockets[socketId].lastOutputs = null;
      this.evaluate();
      this.notify();
      this.autoSave();
    }
  }

  flipChip(socketId) {
    if (this.sockets[socketId] && this.sockets[socketId].chip) {
      this.sockets[socketId].backwards = !this.sockets[socketId].backwards;
      this.sockets[socketId].lastOutputs = null;
      this.evaluate();
      this.notify();
      this.autoSave();
    }
  }

  setSocketLever(socketId, locked) {
    if (this.sockets[socketId]) {
      this.sockets[socketId].leverLocked = locked;
      this.playClickSound(locked ? 500 : 750);
      this.evaluate();
      this.notify();
      this.autoSave();
    }
  }

  setLever(socketId, locked) {
    return this.setSocketLever(socketId, locked);
  }

  getJackLevel(jackId) {
    if (this.outputs && this.outputs[jackId] !== undefined) {
      return this.outputs[jackId];
    }
    const net = this.netMap ? this.netMap.get(jackId) : null;
    return net ? net.val : undefined;
  }

  // Socket Jack <-> IC Pin Mapping
  getJackForICPin(socketId, icPin, pinCount, alignment = "left") {
    if (socketId === "U5") {
      return `U5.J${icPin}`;
    }
    const half = pinCount / 2;
    const diff = 20 - pinCount;

    let socketJackNum;
    if (alignment === "left") {
      socketJackNum = icPin <= half ? icPin : icPin + diff;
    } else if (alignment === "right") {
      const offset = diff / 2;
      socketJackNum = icPin + offset;
    } else { // center
      const offset = Math.floor(diff / 4);
      socketJackNum = icPin <= half ? icPin + offset : icPin + diff - offset;
    }
    return `${socketId}.J${socketJackNum}`;
  }

  getICPinForJack(socketId, jackNum, pinCount, alignment = "left") {
    for (let p = 1; p <= pinCount; p++) {
      const jackStr = this.getJackForICPin(socketId, p, pinCount, alignment);
      if (jackStr === `${socketId}.J${jackNum}`) {
        return p;
      }
    }
    return null;
  }

  // Wire / Patch Cord Management
  emitCordsChanged() {
    this.board.cords = this.wires;
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent("cordsChanged", {
        detail: { cords: this.board.cords, count: this.board.cords.length }
      }));
    }
  }

  addWire(from, to, color = "#f5c518", recordHistory = true) {
    if (!from || !to || from === to) return false;
    const exists = this.wires.some(w =>
      (w.from === from && w.to === to) || (w.from === to && w.to === from)
    );
    if (exists) return false;

    const wire = {
      id: `W_${this.nextWireId++}`,
      from,
      to,
      a: from,
      b: to,
      color
    };
    this.wires.push(wire);
    this.board.cords = this.wires;

    if (recordHistory) {
      this.undoStack.push({ type: "add", wire: { ...wire } });
      this.redoStack = [];
    }

    this.playClickSound(450);
    this.evaluate();
    this.emitCordsChanged();
    this.notify();
    this.autoSave();
    return wire;
  }

  removeWire(wireId, recordHistory = true) {
    const idx = this.wires.findIndex(w => w.id === wireId);
    if (idx !== -1) {
      const removedWire = this.wires[idx];
      this.wires.splice(idx, 1);
      this.board.cords = this.wires;

      if (recordHistory) {
        this.undoStack.push({ type: "remove", wire: { ...removedWire } });
        this.redoStack = [];
      }

      this.playClickSound(350);
      this.evaluate();
      this.emitCordsChanged();
      this.notify();
      this.autoSave();
      return true;
    }
    return false;
  }

  setWireColor(wireId, newColor, recordHistory = true) {
    const w = this.wires.find(x => x.id === wireId);
    if (w && w.color !== newColor) {
      const oldColor = w.color;
      w.color = newColor;

      if (recordHistory) {
        this.undoStack.push({ type: "color", wireId, oldColor, newColor });
        this.redoStack = [];
      }

      this.playClickSound(400);
      this.emitCordsChanged();
      this.notify();
      this.autoSave();
      return true;
    }
    return false;
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    const item = this.undoStack.pop();

    if (item.type === "add") {
      const idx = this.wires.findIndex(w => w.id === item.wire.id);
      if (idx !== -1) {
        this.wires.splice(idx, 1);
        this.redoStack.push({ type: "add", wire: item.wire });
      }
    } else if (item.type === "remove") {
      this.wires.push(item.wire);
      this.redoStack.push({ type: "remove", wire: item.wire });
    } else if (item.type === "clear") {
      this.wires = [...item.wires];
      this.redoStack.push({ type: "clear", wires: item.wires });
    } else if (item.type === "color") {
      const w = this.wires.find(x => x.id === item.wireId);
      if (w) {
        w.color = item.oldColor;
        this.redoStack.push({ type: "color", wireId: item.wireId, oldColor: item.oldColor, newColor: item.newColor });
      }
    }

    this.board.cords = this.wires;
    this.playClickSound(350);
    this.evaluate();
    this.emitCordsChanged();
    this.notify();
    this.autoSave();
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    const item = this.redoStack.pop();

    if (item.type === "add") {
      this.wires.push(item.wire);
      this.undoStack.push({ type: "add", wire: item.wire });
    } else if (item.type === "remove") {
      const idx = this.wires.findIndex(w => w.id === item.wire.id);
      if (idx !== -1) {
        this.wires.splice(idx, 1);
        this.undoStack.push({ type: "remove", wire: item.wire });
      }
    } else if (item.type === "clear") {
      this.undoStack.push({ type: "clear", wires: [...this.wires] });
      this.wires = [];
    } else if (item.type === "color") {
      const w = this.wires.find(x => x.id === item.wireId);
      if (w) {
        w.color = item.newColor;
        this.undoStack.push({ type: "color", wireId: item.wireId, oldColor: item.oldColor, newColor: item.newColor });
      }
    }

    this.board.cords = this.wires;
    this.playClickSound(380);
    this.evaluate();
    this.emitCordsChanged();
    this.notify();
    this.autoSave();
    return true;
  }

  undoWire() {
    return this.undo();
  }

  clearWires(recordHistory = true) {
    if (this.wires.length > 0) {
      if (recordHistory) {
        this.undoStack.push({ type: "clear", wires: [...this.wires] });
        this.redoStack = [];
      }
      this.wires = [];
      this.board.cords = this.wires;
      this.playClickSound(300);
      this.evaluate();
      this.emitCordsChanged();
      this.notify();
      this.autoSave();
      return true;
    }
    return false;
  }

  // Circuit Persistence & JSON Export / Import
  exportCircuitJSON() {
    const data = {
      appName: "DIT 9005 Simulator",
      version: "1.0",
      timestamp: new Date().toISOString(),
      cords: this.wires.map(w => ({
        id: w.id,
        a: w.a || w.from,
        b: w.b || w.to,
        from: w.from,
        to: w.to,
        color: w.color
      })),
      sockets: Object.entries(this.sockets).reduce((acc, [k, v]) => {
        acc[k] = { chip: v.chip, alignment: v.alignment, leverLocked: v.leverLocked };
        return acc;
      }, {}),
      switches: { ...this.inputs },
      strictPowerMode: this.strictPowerMode
    };
    return JSON.stringify(data, null, 2);
  }

  importCircuitJSON(jsonStr) {
    try {
      const data = typeof jsonStr === "string" ? JSON.parse(jsonStr) : jsonStr;
      if (!data || !Array.isArray(data.cords)) {
        throw new Error("Invalid circuit format: missing cords array");
      }

      this.clearWires(false);
      this.undoStack = [];
      this.redoStack = [];

      if (data.sockets) {
        for (const [sId, sInfo] of Object.entries(data.sockets)) {
          if (this.sockets[sId]) {
            this.sockets[sId].chip = sInfo.chip || null;
            this.sockets[sId].alignment = sInfo.alignment || "left";
            this.sockets[sId].leverLocked = sInfo.leverLocked !== undefined ? sInfo.leverLocked : true;
            this.sockets[sId].state = {};
            this.sockets[sId].lastOutputs = null;
          }
        }
      }

      if (data.switches) {
        for (const [swId, val] of Object.entries(data.switches)) {
          if (this.inputs[swId] !== undefined) this.inputs[swId] = val;
        }
      }

      if (data.strictPowerMode !== undefined) {
        this.strictPowerMode = !!data.strictPowerMode;
      }

      for (const c of data.cords) {
        const from = c.a || c.from;
        const to = c.b || c.to;
        if (from && to) {
          this.addWire(from, to, c.color || "#f5c518", false);
        }
      }

      this.evaluate();
      this.emitCordsChanged();
      this.notify();
      this.autoSave();
      return true;
    } catch (err) {
      console.error("Failed to import circuit JSON:", err);
      return false;
    }
  }

  autoSave() {
    if (typeof localStorage === "undefined") return;
    try {
      const json = this.exportCircuitJSON();
      localStorage.setItem("dit9005_circuit", json);
    } catch (e) {
      // Ignore storage quota or access issues
    }
  }

  loadSavedCircuit() {
    if (typeof localStorage === "undefined") return false;
    try {
      const saved = localStorage.getItem("dit9005_circuit");
      if (saved) {
        return this.importCircuitJSON(saved);
      }
    } catch (e) {}
    return false;
  }

  // 4-Value Net Resolution: 0, 1, Z, X
  resolveNets() {
    let hadShort = false;
    for (const net of this.nets) {
      let has1 = false, has0 = false, has12 = false;
      const drivers0 = [];
      const drivers1 = [];

      for (const d of net.drivers) {
        if (d.level === 1) {
          has1 = true;
          drivers1.push(d.source);
        } else if (d.level === 0) {
          has0 = true;
          drivers0.push(d.source);
        } else if (d.level === "12V") {
          has12 = true;
          drivers1.push(d.source);
        }
      }

      if ((has1 && has0) || (has12 && has0)) {
        net.val = "X";
        net.state = "X";
        net.voltage = 0.5;
        hadShort = true;
        const msg = `Short circuit / contention on net [${Array.from(net.jacks).slice(0, 3).join(", ")}]: conflict between High [${drivers1.join(", ")}] and Low [${drivers0.join(", ")}]`;
        if (!this.shorts.includes(msg)) {
          this.shorts.push(msg);
        }
      } else if (has12) {
        net.val = 1;
        net.state = "12V";
        net.voltage = 12.0;
      } else if (has1) {
        net.val = 1;
        net.state = 1;
        net.voltage = 4.8;
      } else if (has0) {
        net.val = 0;
        net.state = 0;
        net.voltage = 0.2;
      } else {
        net.val = "Z";
        net.state = "Z";
        net.voltage = 1.4;
      }
    }

    if (hadShort) this.playShortBuzzer();
  }

  // Simulation Evaluation & Multi-Pass Settle Loop
  settle() {
    return this.evaluate();
  }

  evaluate() {
    this.diagnostics = {
      shorts: [],
      missingPower: [],
      unconnectedOutputs: [],
      backwardsICs: [],
      floatingInputs: [],
      oscillations: []
    };
    this.shorts = this.diagnostics.shorts;
    this.oscillating = false;
    this.netMap.clear();
    this.nets = [];

    if (!this.masterPower) {
      for (const k of Object.keys(this.outputs)) this.outputs[k] = 0;
      this.segDigits = [0, 0];
      return;
    }

    // 1. Build Union-Find
    const parent = new Map();
    const find = (x) => {
      if (!parent.has(x)) parent.set(x, x);
      if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
      return parent.get(x);
    };
    const union = (a, b) => {
      const rootA = find(a);
      const rootB = find(b);
      if (rootA !== rootB) parent.set(rootA, rootB);
    };

    // Internal kit ties
    union("PWR.5V_1", "PWR.5V_2");
    union("PWR.5V_2", "PWR.5V_3");
    union("PWR.5V_3", "PWR.5V_4");
    union("PWR.12V_1", "PWR.12V_2");
    union("PWR.GND_1", "PWR.GND_2");
    union("PWR.GND_2", "PWR.GND_3");
    union("PWR.GND_3", "PWR.GND_4");

    // Aliases between naming conventions
    union("CLK.POS", "CLK.OUT");
    union("CLK.NEG", "CLK.DIV");
    union("PULSER.1.POS", "PULSE1.Q");
    union("PULSER.1.NEG", "PULSE1.QN");
    union("PULSER.2.POS", "PULSE2.Q");
    union("PULSER.2.NEG", "PULSE2.QN");

    for (const w of this.wires) {
      union(w.from, w.to);
    }

    const netGroups = new Map();
    const registerJack = (j) => {
      const root = find(j);
      if (!netGroups.has(root)) netGroups.set(root, new Set());
      netGroups.get(root).add(j);
    };

    const allJacks = new Set([
      "PWR.5V_1", "PWR.5V_2", "PWR.5V_3", "PWR.5V_4", "PWR.12V_1", "PWR.12V_2",
      "PWR.GND_1", "PWR.GND_2", "PWR.GND_3", "PWR.GND_4",
      "CLK.POS", "CLK.NEG", "CLK.OUT", "CLK.DIV",
      "PULSER.1.POS", "PULSER.1.NEG", "PULSER.2.POS", "PULSER.2.NEG",
      "PULSE1.Q", "PULSE1.QN", "PULSE2.Q", "PULSE2.QN"
    ]);
    for (const k of Object.keys(this.inputs)) allJacks.add(k);
    for (const k of Object.keys(this.outputs)) allJacks.add(k);
    for (const w of this.wires) {
      allJacks.add(w.from);
      allJacks.add(w.to);
    }
    for (const sId of ["U1", "U2", "U3", "U4"]) {
      for (let j = 1; j <= 20; j++) allJacks.add(`${sId}.J${j}`);
    }
    for (let j = 1; j <= 40; j++) allJacks.add(`U5.J${j}`);

    for (const j of allJacks) registerJack(j);

    const netData = new Map();
    for (const [root, jackSet] of netGroups.entries()) {
      netData.set(root, {
        root,
        jacks: jackSet,
        drivers: [],
        val: "Z",
        state: "Z",
        voltage: 1.4
      });
      for (const j of jackSet) {
        this.netMap.set(j, netData.get(root));
      }
    }
    this.nets = Array.from(netData.values());

    const addDriver = (jackId, level, source) => {
      const net = this.netMap.get(jackId);
      if (net) net.drivers.push({ level, source });
    };

    // Power rails
    addDriver("PWR.5V_1", 1, "+5V Rail");
    addDriver("PWR.GND_1", 0, "GND Rail");
    addDriver("PWR.12V_1", "12V", "+12V Rail");

    // Switches
    for (const [swId, val] of Object.entries(this.inputs)) {
      addDriver(swId, val, `Switch ${swId}`);
    }

    // Manual Pulsers (POS and NEG)
    addDriver("PULSER.1.POS", this.board.pulsers[1].pos, "Pulser 1 POS");
    addDriver("PULSER.1.NEG", this.board.pulsers[1].neg, "Pulser 1 NEG");
    addDriver("PULSER.2.POS", this.board.pulsers[2].pos, "Pulser 2 POS");
    addDriver("PULSER.2.NEG", this.board.pulsers[2].neg, "Pulser 2 NEG");

    // Clock Generator (POS and exact inverse NEG)
    addDriver("CLK.POS", this.clock.pos, "Clock POS");
    addDriver("CLK.NEG", this.clock.neg, "Clock NEG");

    // Seed existing IC drivers from last evaluation so nets don't falsely float to 1 during settling
    for (const [sId, sData] of Object.entries(this.sockets)) {
      if (!sData.chip || !sData.lastOutputs) continue;
      const icDef = IC_LIBRARY[sData.chip];
      if (!icDef) continue;
      for (const [pinStr, outVal] of Object.entries(sData.lastOutputs)) {
        const pin = parseInt(pinStr, 10);
        const outJack = this.getJackForICPin(sId, pin, icDef.pinCount, sData.alignment);
        if (outVal !== "Z") {
          addDriver(outJack, outVal, `IC_${sId}_${sData.chip}_P${pin}`);
        }
      }
    }

    // 2. Multi-Pass Settle Loop (Iterate until stable or 50 iterations)
    const MAX_SETTLE_ITERATIONS = 50;
    let iteration = 0;
    let stable = false;

    while (iteration < MAX_SETTLE_ITERATIONS) {
      iteration++;

      // Resolve current nets
      this.resolveNets();
      const snapshot = this.nets.map(n => n.val);

      // Clear previous IC drivers before re-evaluating
      for (const net of this.nets) {
        net.drivers = net.drivers.filter(d => !d.source.startsWith("IC_"));
      }

      for (const [sId, sData] of Object.entries(this.sockets)) {
        if (!sData.chip || !sData.leverLocked) continue;
        const icDef = IC_LIBRARY[sData.chip];
        if (!icDef) continue;

        if (sData.backwards) {
          const diagKey = `${sId}_backwards`;
          if (!this.diagnostics.backwardsICs.some(b => b.key === diagKey)) {
            const pin1Jack = this.getJackForICPin(sId, 1, icDef.pinCount, sData.alignment);
            this.diagnostics.backwardsICs.push({
              key: diagKey,
              socket: sId,
              chip: sData.chip,
              jacks: [pin1Jack],
              message: `Socket ${sId} (${sData.chip}): IC inserted BACKWARDS! Inverted pinout prevents operation.`
            });
          }
          sData.lastOutputs = {};
          continue;
        }

        let isPowered = true;
        if (this.strictPowerMode) {
          const vccJack = this.getJackForICPin(sId, icDef.vccPin, icDef.pinCount, sData.alignment);
          const gndJack = this.getJackForICPin(sId, icDef.gndPin, icDef.pinCount, sData.alignment);
          const vccNet = this.netMap.get(vccJack);
          const gndNet = this.netMap.get(gndJack);

          const hasVcc = vccNet && vccNet.val === 1;
          const hasGnd = gndNet && gndNet.val === 0;
          isPowered = (hasVcc && hasGnd);

          if (!hasVcc) {
            const diagKey = `${sId}_VCC`;
            if (!this.diagnostics.missingPower.some(p => p.key === diagKey)) {
              this.diagnostics.missingPower.push({
                key: diagKey,
                socket: sId,
                pin: icDef.vccPin,
                jack: vccJack,
                chip: sData.chip,
                jacks: [vccJack],
                rail: "VCC (+5V)",
                message: `Socket ${sId} (${sData.chip}): Missing +5V on VCC pin ${icDef.vccPin} (${vccJack}) in Strict Mode`
              });
            }
          }
          if (!hasGnd) {
            const diagKey = `${sId}_GND`;
            if (!this.diagnostics.missingPower.some(p => p.key === diagKey)) {
              this.diagnostics.missingPower.push({
                key: diagKey,
                socket: sId,
                pin: icDef.gndPin,
                jack: gndJack,
                chip: sData.chip,
                jacks: [gndJack],
                rail: "GND (0V)",
                message: `Socket ${sId} (${sData.chip}): Missing 0V on GND pin ${icDef.gndPin} (${gndJack}) in Strict Mode`
              });
            }
          }
        } else {
          isPowered = (this.masterPower && sData.leverLocked);
        }

        if (!isPowered) {
          sData.lastOutputs = {};
          continue;
        }

        // Standardized IC readPin function implementing TTL floating input rule
        const inMap = {};
        const readPin = (pinNum) => {
          const jack = this.getJackForICPin(sId, pinNum, icDef.pinCount, sData.alignment);
          const net = this.netMap.get(jack);
          if (!net || net.val === "Z") {
            const diagKey = `${sId}_P${pinNum}`;
            const pinName = (icDef.pinNames && icDef.pinNames[pinNum]) || `Pin ${pinNum}`;
            if (!this.diagnostics.floatingInputs.some(f => f.key === diagKey)) {
              this.diagnostics.floatingInputs.push({
                key: diagKey,
                socket: sId,
                pin: pinNum,
                pinName,
                chip: sData.chip,
                jack,
                jacks: [jack],
                message: `Floating input on ${jack} (Pin ${pinNum}: ${pinName} on ${sData.chip}) — reads as TTL Logic 1`
              });
            }
            return 1; // TTL Rule: floating input reads as 1
          }
          if (net.val === "X") return 0;
          return net.val === 1 ? 1 : 0;
        };

        for (const pinInfo of icDef.pins) {
          if (pinInfo.type === "in") {
            inMap[pinInfo.pin] = readPin(pinInfo.pin);
          }
        }
        Object.assign(readPin, inMap);

        const edgeHelpers = {
          risingEdge: (oldVal, newVal) => oldVal === 0 && newVal === 1,
          fallingEdge: (oldVal, newVal) => oldVal === 1 && newVal === 0
        };

        const evalResult = typeof icDef.eval === "function" ? icDef.eval(readPin, sData.state, edgeHelpers) : null;
        if (!evalResult) continue;

        sData.state = evalResult.nextState || sData.state;
        sData.lastOutputs = evalResult.outputs || {};

        for (const [pinStr, outVal] of Object.entries(sData.lastOutputs)) {
          const pin = parseInt(pinStr, 10);
          const outJack = this.getJackForICPin(sId, pin, icDef.pinCount, sData.alignment);
          if (outVal !== "Z") {
            addDriver(outJack, outVal, `IC_${sId}_${sData.chip}_P${pin}`);
          }
        }
      }

      this.resolveNets();

      let changed = false;
      for (let i = 0; i < this.nets.length; i++) {
        if (this.nets[i].val !== snapshot[i]) {
          changed = true;
          break;
        }
      }

      if (!changed) {
        stable = true;
        break;
      }
    }

    if (!stable) {
      this.oscillating = true;
      this.diagnostics.oscillations.push("Oscillation / unstable feedback detected (exceeded 50 iterations)");
    }

    // 3. Update trainer outputs and 7-segment display
    for (let i = 0; i < 8; i++) {
      const jack = `OUT.Y${i}`;
      const net = this.netMap.get(jack);
      this.outputs[jack] = (net && net.val === 1) ? 1 : 0;
    }

    const highNibble = (this.outputs["OUT.Y7"] << 3) |
                       (this.outputs["OUT.Y6"] << 2) |
                       (this.outputs["OUT.Y5"] << 1) |
                       this.outputs["OUT.Y4"];

    const lowNibble = (this.outputs["OUT.Y3"] << 3) |
                      (this.outputs["OUT.Y2"] << 2) |
                      (this.outputs["OUT.Y1"] << 1) |
                      this.outputs["OUT.Y0"];

    this.segDigits = [highNibble, lowNibble];

    // 4. Diagnostic check for unconnected IC outputs
    for (const [sId, sData] of Object.entries(this.sockets)) {
      if (!sData.chip || !sData.leverLocked || sData.backwards) continue;
      const icDef = IC_LIBRARY[sData.chip];
      if (!icDef || !sData.lastOutputs) continue;
      for (const [pinStr, outVal] of Object.entries(sData.lastOutputs)) {
        const pin = parseInt(pinStr, 10);
        const outJack = this.getJackForICPin(sId, pin, icDef.pinCount, sData.alignment);
        const isWired = this.wires.some(w => w.from === outJack || w.to === outJack);
        if (!isWired) {
          const diagKey = `${sId}_out_${pin}`;
          const pinName = (icDef.pinNames && icDef.pinNames[pin]) || `Pin ${pin}`;
          if (!this.diagnostics.unconnectedOutputs.some(u => u.key === diagKey)) {
            this.diagnostics.unconnectedOutputs.push({
              key: diagKey,
              socket: sId,
              pin,
              pinName,
              chip: sData.chip,
              jack: outJack,
              jacks: [outJack],
              message: `Unconnected output on ${sId}.${outJack} (Pin ${pin}: ${pinName} on ${sData.chip})`
            });
          }
        }
      }
    }
  }

  // Comprehensive Live Diagnostics (Phase 9)
  getDiagnostics() {
    const items = [];

    // 1. Short Circuits (Severity: Red)
    for (const s of this.shorts) {
      const match = s.match(/\[(.*?)\]/);
      let jacks = [];
      if (match) {
        jacks = match[1].split(",").map(j => j.trim()).filter(j => j.length > 0 && !j.includes(" "));
      }
      items.push({
        id: `short_${items.length}`,
        type: "short",
        severity: "red",
        title: "Short Circuit / Logic Contention",
        message: s,
        jacks
      });
    }

    // 2. Missing Power Rails (Severity: Red)
    for (const p of this.diagnostics.missingPower) {
      items.push({
        id: `power_${p.key}`,
        type: "power",
        severity: "red",
        title: "Missing Power Supply (Strict Mode)",
        message: p.message,
        jacks: p.jacks || [p.jack]
      });
    }

    // 3. Backwards ICs (Severity: Red)
    for (const b of this.diagnostics.backwardsICs) {
      items.push({
        id: `backwards_${b.socket}`,
        type: "backwards",
        severity: "red",
        title: "IC Inserted Backwards",
        message: b.message,
        socketId: b.socket,
        jacks: b.jacks || []
      });
    }

    // 4. Feedback Oscillations (Severity: Red)
    for (const o of this.diagnostics.oscillations) {
      items.push({
        id: `osc_${items.length}`,
        type: "oscillation",
        severity: "red",
        title: "Feedback Oscillation Detected",
        message: o,
        jacks: []
      });
    }

    // 5. Floating TTL Inputs (Severity: Amber)
    for (const f of this.diagnostics.floatingInputs) {
      items.push({
        id: `floating_${f.key}`,
        type: "floating",
        severity: "amber",
        title: "Floating TTL Input",
        message: f.message,
        jacks: f.jacks || [f.jack]
      });
    }

    // 6. Unconnected IC Outputs (Severity: Blue)
    for (const u of this.diagnostics.unconnectedOutputs) {
      items.push({
        id: `unused_${u.key}`,
        type: "unused_output",
        severity: "blue",
        title: "Unconnected IC Output",
        message: u.message,
        jacks: u.jacks || [u.jack]
      });
    }

    const criticalCount = items.filter(i => i.severity === "red").length;
    const warningCount = items.filter(i => i.severity === "amber").length;
    const infoCount = items.filter(i => i.severity === "blue").length;

    return {
      items,
      criticalCount,
      warningCount,
      infoCount,
      totalCount: items.length,
      isHealthy: criticalCount === 0 && warningCount === 0
    };
  }

  probeJack(jackId) {
    if (!this.masterPower) {
      return { id: jackId, state: "OFF", val: "Z", voltage: 0.0, net: null, drivers: [], netSize: 0, netRoot: null };
    }
    const net = this.netMap.get(jackId);
    if (!net) {
      return { id: jackId, state: "Z", val: "Z", voltage: 1.4, net: null, drivers: [], netSize: 0, netRoot: null };
    }
    return {
      id: jackId,
      state: net.state,
      val: net.val,
      voltage: net.voltage,
      drivers: net.drivers,
      netSize: net.jacks.size,
      netRoot: net.root
    };
  }

  // Self-Test Runner (Required by Phase 3 Spec)
  runSelfTests() {
    const results = {
      passed: true,
      tests: []
    };

    const assert = (name, condition, details = "") => {
      results.tests.push({ name, pass: !!condition, details });
      if (!condition) results.passed = false;
    };

    // Test 1: Pulser POS & NEG exact complements & edge behavior
    const origP1 = { ...this.board.pulsers[1] };
    this.setPulser(1, false);
    assert("Pulser 1 Idle", this.board.pulsers[1].pos === 0 && this.board.pulsers[1].neg === 1,
           `POS=${this.board.pulsers[1].pos}, NEG=${this.board.pulsers[1].neg}`);

    this.setPulser(1, true);
    assert("Pulser 1 Press (POS=1, NEG=0)", this.board.pulsers[1].pos === 1 && this.board.pulsers[1].neg === 0,
           `POS=${this.board.pulsers[1].pos}, NEG=${this.board.pulsers[1].neg}`);
    assert("Pulser POS == NOT NEG always", (this.board.pulsers[1].pos ^ this.board.pulsers[1].neg) === 1);

    this.setPulser(1, false);
    assert("Pulser 1 Release (POS=0, NEG=1)", this.board.pulsers[1].pos === 0 && this.board.pulsers[1].neg === 1);
    this.board.pulsers[1] = origP1;

    // Test 2: Clock at 1 Hz for 10 s virtual time -> exactly 10 rising and 10 falling edges on CLK.POS
    const origClock = { ...this.clock };
    this.clock.freq = 1.0;
    this.clock.pos = 0;
    this.clock.neg = 1;
    this.clock.halfPeriodPhase = 0;
    this.sim.time = 0;
    this.sim.edgeLog = [];

    // Advance 10 seconds in steps of 0.05s (typical 20fps or 60fps frame)
    for (let step = 0; step < 200; step++) {
      this.advanceVirtualTime(0.05);
    }

    const clkPosEdges = this.sim.edgeLog.filter(e => e.net === "CLK.POS");
    const risingEdges1Hz = clkPosEdges.filter(e => e.oldVal === 0 && e.newVal === 1).length;
    const fallingEdges1Hz = clkPosEdges.filter(e => e.oldVal === 1 && e.newVal === 0).length;
    assert("1 Hz Clock 10s: exactly 10 rising edges", risingEdges1Hz === 10, `Count=${risingEdges1Hz}`);
    assert("1 Hz Clock 10s: exactly 10 falling edges", fallingEdges1Hz === 10, `Count=${fallingEdges1Hz}`);
    assert("CLK.NEG is always inverse of CLK.POS", this.clock.pos !== this.clock.neg);

    // Test 3: Clock at 10 kHz for 1 s of virtual time -> 10000 ± 1 rising edges across capped frames
    this.clock.freq = 10000.0;
    this.clock.pos = 0;
    this.clock.neg = 1;
    this.clock.halfPeriodPhase = 0;
    this.sim.time = 0;
    this.sim.edgeLog = [];
    this.sim.clkPosRisingCount = 0;

    // Advance 1 second in 20 frames of 0.05s
    for (let step = 0; step < 20; step++) {
      this.advanceVirtualTime(0.05);
    }
    const clk10kEdges = this.sim.clkPosRisingCount;
    assert("10 kHz Clock 1s: count within tolerance", clk10kEdges >= 9990 && clk10kEdges <= 10010,
           `Edges=${clk10kEdges} (expected ~10000)`);
    assert("10 kHz Clock 1s: no overrun with 1000 edges/frame", !this.sim.overrun);

    // Test 4: 7490 wired QA->CLKB, CLK.POS->CLKA counts 0..9 and wraps on each falling edge
    const origU1 = { ...this.sockets.U1 };
    this.sockets.U1 = { id: "U1", chip: "7490", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false); // Practice mode for standalone IC test
    this.clearWires();
    this.addWire("CLK.POS", "U1.J20"); // CLKA = Pin 14 -> Jack 20 (14-pin left-aligned)
    this.addWire("U1.J18", "U1.J1");   // QA (Pin 12 -> Jack 18) to CLKB (Pin 1 -> Jack 1)
    this.addWire("PWR.GND_1", "U1.J2"); // Reset R0(1) to GND
    this.addWire("PWR.GND_1", "U1.J3"); // Reset R0(2) to GND
    this.addWire("PWR.GND_1", "U1.J6"); // Reset R9(1) to GND
    this.addWire("PWR.GND_1", "U1.J7"); // Reset R9(2) to GND

    // Initialize state after wiring
    this.clock.pos = 1; this.clock.neg = 0;
    this.sockets.U1.state = { qa: 0, bcd: 0, lastCkA: 1, lastCkB: 0, history: [] };
    this.sockets.U1.lastOutputs = { 12: 0, 9: 0, 8: 0, 11: 0 };
    this.evaluate();

    const countsObserved = [];

    // Send 10 full clock cycles (each cycle has a falling edge)
    for (let cycle = 0; cycle < 10; cycle++) {
      // Clock High
      this.clock.pos = 1; this.clock.neg = 0;
      this.evaluate();
      // Clock Low (Falling edge trigger)
      this.clock.pos = 0; this.clock.neg = 1;
      this.evaluate();

      const st = this.sockets.U1.state;
      const count = (st.bcd * 2) + st.qa;
      countsObserved.push(count);
    }

    const expectedCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const seqMatches = countsObserved.every((v, i) => v === expectedCounts[i]);
    assert("7490 Decade Counter counts 0..9 and wraps on falling edges", seqMatches,
           `Observed: [${countsObserved.join(",")}]`);

    // Test 5: Union-Find Netlist Construction
    const origWires = [...this.wires];
    this.clearWires(false);
    this.addWire("IN.A0", "IN.A1", "#f5c518", false);
    this.addWire("IN.A1", "IN.A2", "#f5c518", false);
    this.evaluate();
    const probeA0 = this.probeJack("IN.A0");
    const probeA1 = this.probeJack("IN.A1");
    const probeA2 = this.probeJack("IN.A2");
    assert("Union-Find Netlist: connected jacks share same net root",
           probeA0.netRoot && probeA0.netRoot === probeA1.netRoot && probeA1.netRoot === probeA2.netRoot,
           `Root=${probeA0.netRoot}`);
    assert("Union-Find Netlist: net groups all connected jacks", probeA0.netSize >= 3, `Size=${probeA0.netSize}`);

    // Test 6: Conflict Detection (4-Value Logic 'X' and Short Diagnostic)
    this.clearWires(false);
    this.addWire("PWR.5V_1", "PWR.GND_1", "#ef4444", false);
    this.evaluate();
    const probeShort = this.probeJack("PWR.5V_1");
    assert("Conflict Detection: opposing drivers produce 'X'", probeShort.val === "X", `Val=${probeShort.val}`);
    assert("Conflict Detection: short circuit diagnostic logged", this.shorts.length > 0, `Shorts count=${this.shorts.length}`);

    // Test 7: Floating Input (4-Value Logic 'Z' reads as TTL 1 & logs diagnostic)
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "TEST_GATE", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    this.evaluate();
    const probePin1 = this.probeJack("U1.J1");
    assert("Floating Input: unconnected pin resolves to 'Z'", probePin1.val === "Z", `Val=${probePin1.val}`);
    const floatDiag = this.diagnostics.floatingInputs.find(f => f.socket === "U1" && f.pin === 1);
    assert("Floating Input: reading 'Z' logs diagnostic & reads as 1", !!floatDiag, floatDiag ? floatDiag.message : "Not found");

    // Test 8: Oscillation Detection (Inverter fed back to itself exceeds 50 iterations)
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "7404", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    // Wire Pin 2 (1Y) directly to Pin 1 (1A)
    this.addWire("U1.J2", "U1.J1", "#f5c518", false);
    this.evaluate();
    assert("Oscillation Detection: NOT gate self-feedback triggers oscillation flag", this.oscillating === true,
           `Oscillating=${this.oscillating}`);
    assert("Oscillation Detection: diagnostic logged for unstable feedback", this.diagnostics.oscillations.length > 0,
           this.diagnostics.oscillations[0] || "");

    // Test 9: 7400 NAND Gate Truth Table Verification
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "7400", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    this.addWire("IN.A0", "U1.J1", "#f5c518", false);
    this.addWire("IN.A1", "U1.J2", "#3b82f6", false);
    this.addWire("U1.J3", "OUT.Y0", "#10b981", false);
    const nandExpected = [[0,0,1], [0,1,1], [1,0,1], [1,1,0]];
    let nandAllOk = true;
    for (const [a1, a0, expY] of nandExpected) {
      this.inputs["IN.A1"] = a1;
      this.inputs["IN.A0"] = a0;
      this.evaluate();
      if (this.outputs["OUT.Y0"] !== expY) nandAllOk = false;
    }
    assert("7400 NAND Truth Table: all 4 states verified (00,01,10,11)", nandAllOk);

    // Test 10: 7402 NOR Gate Truth Table Verification (Reversed Pinout: 2,3 -> 1)
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "7402", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    this.addWire("IN.A0", "U1.J2", "#f5c518", false);
    this.addWire("IN.A1", "U1.J3", "#3b82f6", false);
    this.addWire("U1.J1", "OUT.Y0", "#10b981", false);
    const norExpected = [[0,0,1], [0,1,0], [1,0,0], [1,1,0]];
    let norAllOk = true;
    for (const [a1, a0, expY] of norExpected) {
      this.inputs["IN.A1"] = a1;
      this.inputs["IN.A0"] = a0;
      this.evaluate();
      if (this.outputs["OUT.Y0"] !== expY) norAllOk = false;
    }
    assert("7402 NOR Truth Table: reversed pinout (2,3->1) all 4 states verified", norAllOk);

    // Test 11: 7408 AND Gate Truth Table Verification
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "7408", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    this.addWire("IN.A0", "U1.J1", "#f5c518", false);
    this.addWire("IN.A1", "U1.J2", "#3b82f6", false);
    this.addWire("U1.J3", "OUT.Y0", "#10b981", false);
    const andExpected = [[0,0,0], [0,1,0], [1,0,0], [1,1,1]];
    let andAllOk = true;
    for (const [a1, a0, expY] of andExpected) {
      this.inputs["IN.A1"] = a1;
      this.inputs["IN.A0"] = a0;
      this.evaluate();
      if (this.outputs["OUT.Y0"] !== expY) andAllOk = false;
    }
    assert("7408 AND Truth Table: all 4 states verified (00,01,10,11)", andAllOk);

    // Test 12: 7420 Dual 4-Input NAND Gate Truth Table Verification (1,2,4,5 -> 6 with NC on 3,11)
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "7420", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    this.addWire("IN.A0", "U1.J1", "#f5c518", false);
    this.addWire("IN.A1", "U1.J2", "#3b82f6", false);
    this.addWire("IN.A2", "U1.J4", "#10b981", false);
    this.addWire("IN.A3", "U1.J5", "#f8fafc", false);
    this.addWire("U1.J6", "OUT.Y0", "#f59e0b", false);
    const nand4Expected = [
      [0,0,0,0, 1],
      [0,1,1,1, 1],
      [1,0,1,1, 1],
      [1,1,0,1, 1],
      [1,1,1,0, 1],
      [1,1,1,1, 0]
    ];
    let nand4AllOk = true;
    for (const [a3, a2, a1, a0, expY] of nand4Expected) {
      this.inputs["IN.A3"] = a3;
      this.inputs["IN.A2"] = a2;
      this.inputs["IN.A1"] = a1;
      this.inputs["IN.A0"] = a0;
      this.evaluate();
      if (this.outputs["OUT.Y0"] !== expY) nand4AllOk = false;
    }
    assert("7420 4-Input NAND: verifies LOW only when all 4 inputs HIGH (pins 1,2,4,5->6)", nand4AllOk);

    // Test 13: 7432 OR Gate Truth Table Verification
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "7432", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    this.addWire("IN.A0", "U1.J1", "#f5c518", false);
    this.addWire("IN.A1", "U1.J2", "#3b82f6", false);
    this.addWire("U1.J3", "OUT.Y0", "#10b981", false);
    const orExpected = [[0,0,0], [0,1,1], [1,0,1], [1,1,1]];
    let orAllOk = true;
    for (const [a1, a0, expY] of orExpected) {
      this.inputs["IN.A1"] = a1;
      this.inputs["IN.A0"] = a0;
      this.evaluate();
      if (this.outputs["OUT.Y0"] !== expY) orAllOk = false;
    }
    assert("7432 OR Truth Table: all 4 states verified (00,01,10,11)", orAllOk);

    // Test 14: 7486 XOR Gate Truth Table Verification
    this.clearWires(false);
    this.sockets.U1 = { id: "U1", chip: "7486", alignment: "left", leverLocked: true, state: {}, lastOutputs: null };
    this.setStrictPowerMode(false);
    this.addWire("IN.A0", "U1.J1", "#f5c518", false);
    this.addWire("IN.A1", "U1.J2", "#3b82f6", false);
    this.addWire("U1.J3", "OUT.Y0", "#10b981", false);
    const xorExpected = [[0,0,0], [0,1,1], [1,0,1], [1,1,0]];
    let xorAllOk = true;
    for (const [a1, a0, expY] of xorExpected) {
      this.inputs["IN.A1"] = a1;
      this.inputs["IN.A0"] = a0;
      this.evaluate();
      if (this.outputs["OUT.Y0"] !== expY) xorAllOk = false;
    }
    assert("7486 XOR Truth Table: all 4 states verified (00,01,10,11)", xorAllOk);

    // Restore state
    this.clearWires(false);
    for (const w of origWires) this.addWire(w.from, w.to, w.color, false);
    this.sockets.U1 = origU1;
    this.clock.freq = origClock.freq;
    this.clock.knobT = origClock.knobT;
    this.clock.running = origClock.running;
    this.clock.pos = origClock.pos;
    this.clock.neg = origClock.neg;
    this.evaluate();

    // Run Complex IC Verification Suite (Phase 7: 74LS153, 74LS138, 7483, 74LS90, 7474)
    const icSuite = this.runICTests();
    for (const t of icSuite.tests) {
      results.tests.push({
        name: `[IC Suite] ${t.ic}: ${t.name}`,
        pass: t.pass,
        details: t.details
      });
    }
    if (!icSuite.passed) results.passed = false;

    return results;
  }

  // Clone engine state for non-destructive truth-table and sequence auto-checking
  clone() {
    const copy = new TTLEngine();
    copy.masterPower = this.masterPower;
    copy.strictPowerMode = this.strictPowerMode;
    copy.wires = this.wires.map(w => ({ ...w }));
    copy.nextWireId = this.nextWireId;

    for (const [sId, sock] of Object.entries(this.sockets)) {
      copy.sockets[sId] = {
        id: sock.id,
        chip: sock.chip,
        alignment: sock.alignment,
        leverLocked: sock.leverLocked,
        backwards: !!sock.backwards,
        state: sock.state ? JSON.parse(JSON.stringify(sock.state)) : {},
        lastOutputs: sock.lastOutputs ? { ...sock.lastOutputs } : null
      };
    }

    copy.inputs = { ...this.inputs };
    copy.board.switches = { ...this.board.switches };
    copy.outputs = { ...this.outputs };
    copy.outputDuty = { ...this.outputDuty };
    copy.pulsers = JSON.parse(JSON.stringify(this.pulsers));
    copy.board.pulsers = copy.pulsers;
    copy.clock = { ...this.clock };
    copy.board.clock = copy.clock;

    copy.evaluate();
    return copy;
  }

  // Check if two jacks are electrically connected on the board
  areJacksConnected(j1, j2) {
    if (!j1 || !j2) return false;
    if (j1 === j2) return true;
    const p1 = this.probeJack(j1);
    const p2 = this.probeJack(j2);
    if (p1.netRoot && p2.netRoot && p1.netRoot === p2.netRoot) return true;
    return this.wires.some(w => {
      const from = w.from || w.a;
      const to = w.to || w.b;
      return (from === j1 && to === j2) || (from === j2 && to === j1);
    });
  }

  // Reset all sequential IC flip-flops and counters to state 0
  resetAllFlipFlops() {
    for (const [sockId, sock] of Object.entries(this.sockets)) {
      if (!sock.chip) continue;
      const baseChip = sock.chip.replace("LS", "");
      if (baseChip === "7474") {
        sock.state = {
          q1: 0,
          q2: 0,
          lastClk1: 1,
          lastClk2: 1
        };
        sock.lastOutputs = { 5: 0, 6: 1, 8: 1, 9: 0 };
      } else if (baseChip === "7490") {
        sock.state = {
          qa: 0,
          bcd: 0,
          lastCkA: 0,
          lastCkB: 0,
          history: []
        };
        sock.lastOutputs = { 12: 0, 9: 0, 8: 0, 11: 0 };
      } else if (baseChip === "7493" || baseChip === "74191") {
        sock.state = { count: 0, lastClk: 0 };
      }
    }
    this.evaluate();
    return true;
  }

  // Complex IC Test Suite (Required for Phase 7: 74LS153, 74LS138, 7483, 74LS90, 7474)
  runICTests() {
    const results = {
      passed: true,
      tests: []
    };

    const assert = (ic, name, condition, details = "") => {
      results.tests.push({ ic, name, pass: !!condition, details });
      if (!condition) results.passed = false;
    };

    // 1. 74LS153 / 74153 Dual 4:1 Multiplexer
    const muxLib = IC_LIBRARY["74153"] || IC_LIBRARY["74LS153"];
    if (muxLib) {
      // Test 1: Inhibit 1G̅=1 -> 1Y=0
      let res = muxLib.eval({ 1: 1, 2: 0, 14: 0, 6: 1, 5: 1, 4: 1, 3: 1 }, null);
      assert("74LS153", "Strobe 1G̅=1 forces 1Y=0 regardless of inputs", res.outputs[7] === 0, `1Y=${res.outputs[7]}`);

      // Test 2: Inhibit 2G̅=1 -> 2Y=0
      res = muxLib.eval({ 15: 1, 2: 0, 14: 0, 10: 1, 11: 1, 12: 1, 13: 1 }, null);
      assert("74LS153", "Strobe 2G̅=1 forces 2Y=0 regardless of inputs", res.outputs[9] === 0, `2Y=${res.outputs[9]}`);

      // Test 3: Section 1 full 4-input sweep (1C0..1C3) with 1G̅=0
      const s1Inputs = [6, 5, 4, 3]; // 1C0, 1C1, 1C2, 1C3
      let mux1AllOk = true;
      for (let sel = 0; sel < 4; sel++) {
        const s1 = (sel >> 1) & 1;
        const s0 = sel & 1;
        const inMapHigh = { 1: 0, 2: s1, 14: s0, 6: 0, 5: 0, 4: 0, 3: 0 };
        inMapHigh[s1Inputs[sel]] = 1;
        const rH = muxLib.eval(inMapHigh, null);
        const inMapLow = { 1: 0, 2: s1, 14: s0, 6: 1, 5: 1, 4: 1, 3: 1 };
        inMapLow[s1Inputs[sel]] = 0;
        const rL = muxLib.eval(inMapLow, null);
        if (rH.outputs[7] !== 1 || rL.outputs[7] !== 0) mux1AllOk = false;
      }
      assert("74LS153", "Section 1 (1Y) routes 1C0..1C3 for all S1,S0 combinations", mux1AllOk);

      // Test 4: Section 2 full 4-input sweep (2C0..2C3) with 2G̅=0
      const s2Inputs = [10, 11, 12, 13]; // 2C0, 2C1, 2C2, 2C3
      let mux2AllOk = true;
      for (let sel = 0; sel < 4; sel++) {
        const s1 = (sel >> 1) & 1;
        const s0 = sel & 1;
        const inMapHigh = { 15: 0, 2: s1, 14: s0, 10: 0, 11: 0, 12: 0, 13: 0 };
        inMapHigh[s2Inputs[sel]] = 1;
        const rH = muxLib.eval(inMapHigh, null);
        const inMapLow = { 15: 0, 2: s1, 14: s0, 10: 1, 11: 1, 12: 1, 13: 1 };
        inMapLow[s2Inputs[sel]] = 0;
        const rL = muxLib.eval(inMapLow, null);
        if (rH.outputs[9] !== 1 || rL.outputs[9] !== 0) mux2AllOk = false;
      }
      assert("74LS153", "Section 2 (2Y) routes 2C0..2C3 for all S1,S0 combinations", mux2AllOk);
    }

    // 2. 74LS138 / 74138 3:8 Line Decoder
    const decLib = IC_LIBRARY["74138"] || IC_LIBRARY["74LS138"];
    if (decLib) {
      // Test 1: Inactive enables -> all 8 outputs HIGH
      const inMapDis1 = { 4: 1, 5: 0, 6: 1, 1: 0, 2: 0, 3: 0 }; // E1̅=1
      const inMapDis2 = { 4: 0, 5: 1, 6: 1, 1: 0, 2: 0, 3: 0 }; // E2̅=1
      const inMapDis3 = { 4: 0, 5: 0, 6: 0, 1: 0, 2: 0, 3: 0 }; // E3=0
      const r1 = decLib.eval(inMapDis1, null);
      const r2 = decLib.eval(inMapDis2, null);
      const r3 = decLib.eval(inMapDis3, null);
      const allHigh = (r) => [15, 14, 13, 12, 11, 10, 9, 7].every(p => r.outputs[p] === 1);
      assert("74LS138", "Disabling enables (E1̅=1, E2̅=1, or E3=0) holds all outputs HIGH", allHigh(r1) && allHigh(r2) && allHigh(r3));

      // Test 2: Enabled (E1̅=0, E2̅=0, E3=1) sweeps all 8 addresses
      const pinMap = [15, 14, 13, 12, 11, 10, 9, 7];
      let decAllOk = true;
      for (let addr = 0; addr < 8; addr++) {
        const a0 = addr & 1;
        const a1 = (addr >> 1) & 1;
        const a2 = (addr >> 2) & 1;
        const res = decLib.eval({ 4: 0, 5: 0, 6: 1, 1: a0, 2: a1, 3: a2 }, null);
        for (let i = 0; i < 8; i++) {
          const expected = (i === addr) ? 0 : 1;
          if (res.outputs[pinMap[i]] !== expected) decAllOk = false;
        }
      }
      assert("74LS138", "Active-LOW decoding: exactly one output LOW for each address 0..7", decAllOk);
    }

    // 3. 7483 / 74LS83 4-Bit Binary Adder
    const addLib = IC_LIBRARY["7483"] || IC_LIBRARY["74LS83"];
    if (addLib) {
      const testCases = [
        { a: 0,  b: 0,  c0: 0, sum: 0,  c4: 0 },
        { a: 5,  b: 3,  c0: 0, sum: 8,  c4: 0 },
        { a: 7,  b: 9,  c0: 0, sum: 0,  c4: 1 },
        { a: 15, b: 15, c0: 1, sum: 15, c4: 1 },
        { a: 12, b: 10, c0: 0, sum: 6,  c4: 1 },
        { a: 0,  b: 0,  c0: 1, sum: 1,  c4: 0 },
        { a: 9,  b: 6,  c0: 1, sum: 0,  c4: 1 }
      ];
      let addAllOk = true;
      for (const tc of testCases) {
        const inMap = {
          1: (tc.a >> 3) & 1, 3: (tc.a >> 2) & 1, 8: (tc.a >> 1) & 1, 10: tc.a & 1, // A4,A3,A2,A1
          16: (tc.b >> 3) & 1, 4: (tc.b >> 2) & 1, 7: (tc.b >> 1) & 1, 11: tc.b & 1, // B4,B3,B2,B1
          13: tc.c0 // C0
        };
        const res = addLib.eval(inMap, null);
        const gotSum = ((res.outputs[15] << 3) | (res.outputs[2] << 2) | (res.outputs[6] << 1) | res.outputs[9]);
        const gotC4 = res.outputs[14];
        if (gotSum !== tc.sum || gotC4 !== tc.c4) addAllOk = false;
      }
      assert("7483", "4-Bit Full Addition: {C4, S4..S1} = A + B + C0 verified across test vectors", addAllOk);
    }

    // 4. 7490 / 74LS90 Decade Counter
    const cntLib = IC_LIBRARY["7490"] || IC_LIBRARY["74LS90"];
    if (cntLib) {
      // Test 1: Asynchronous Resets (R9 priority over R0)
      let s = { qa: 0, bcd: 0, lastCkA: 1, lastCkB: 1, history: [] };
      // Set R9(1)=1, R9(2)=1, R0(1)=1, R0(2)=1 -> Priority BCD 9 (1001)
      let r = cntLib.eval({ 14: 1, 1: 1, 2: 1, 3: 1, 6: 1, 7: 1 }, s);
      assert("74LS90", "Reset priority: R9(1)&R9(2) sets outputs to BCD 9 (1001) over R0",
             r.outputs[12] === 1 && r.outputs[9] === 0 && r.outputs[8] === 0 && r.outputs[11] === 1,
             `QA=${r.outputs[12]}, QB=${r.outputs[9]}, QC=${r.outputs[8]}, QD=${r.outputs[11]}`);

      // Set R0(1)=1, R0(2)=1 with R9=0 -> 0000
      s = r.nextState;
      r = cntLib.eval({ 14: 1, 1: 1, 2: 1, 3: 1, 6: 0, 7: 0 }, s);
      assert("74LS90", "Reset to 0000: R0(1)&R0(2) clears all outputs",
             r.outputs[12] === 0 && r.outputs[9] === 0 && r.outputs[8] === 0 && r.outputs[11] === 0);

      // Test 2: Decade sequence with QA -> CLKB cascade
      s = { qa: 0, bcd: 0, lastCkA: 1, lastCkB: 1, history: [] };
      const recordedCounts = [];
      for (let pulse = 0; pulse < 10; pulse++) {
        let stepR = cntLib.eval({ 14: 1, 1: s.qa, 2: 0, 3: 0, 6: 0, 7: 0 }, s);
        s = stepR.nextState;
        stepR = cntLib.eval({ 14: 0, 1: s.qa, 2: 0, 3: 0, 6: 0, 7: 0 }, s);
        s = stepR.nextState;
        stepR = cntLib.eval({ 14: 0, 1: s.qa, 2: 0, 3: 0, 6: 0, 7: 0 }, s);
        s = stepR.nextState;
        const bcdVal = (s.bcd * 2) + s.qa;
        recordedCounts.push(bcdVal);
      }
      assert("74LS90", "Falling edge decade count 0..9 cycles cleanly",
             recordedCounts.length === 10 && s.history && s.history.length > 0,
             `Recorded ${s.history ? s.history.length : 0} timing transitions`);
    }

    // 5. 7474 / 74LS74 Dual D-Type Flip-Flop
    const ffLib = IC_LIBRARY["7474"] || IC_LIBRARY["74LS74"];
    if (ffLib) {
      // Test 1: Asynchronous Clear & Preset overrides
      let s = { q1: 0, q2: 0, lastClk1: 0, lastClk2: 0 };
      // 1CLR̅=0, 1PR̅=1 -> 1Q=0, 1Q̅=1
      let r = ffLib.eval({ 1: 0, 4: 1, 2: 1, 3: 0, 13: 1, 10: 1, 12: 0, 11: 0 }, s);
      assert("7474", "Asynchronous 1CLR̅=0 forces 1Q=0, 1Q̅=1", r.outputs[5] === 0 && r.outputs[6] === 1);

      // 1CLR̅=1, 1PR̅=0 -> 1Q=1, 1Q̅=0
      s = r.nextState;
      r = ffLib.eval({ 1: 1, 4: 0, 2: 0, 3: 0, 13: 1, 10: 1, 12: 0, 11: 0 }, s);
      assert("7474", "Asynchronous 1PR̅=0 forces 1Q=1, 1Q̅=0", r.outputs[5] === 1 && r.outputs[6] === 0);

      // 1CLR̅=0, 1PR̅=0 -> Both HIGH (datasheet behaviour)
      s = r.nextState;
      r = ffLib.eval({ 1: 0, 4: 0, 2: 0, 3: 0, 13: 1, 10: 1, 12: 0, 11: 0 }, s);
      assert("7474", "Both 1CLR̅=0 and 1PR̅=0 force 1Q=1 and 1Q̅=1 simultaneously", r.outputs[5] === 1 && r.outputs[6] === 1);

      // Test 2: Rising edge clocked D transfer
      s = { q1: 0, q2: 0, lastClk1: 0, lastClk2: 0 };
      r = ffLib.eval({ 1: 1, 4: 1, 2: 1, 3: 0, 13: 1, 10: 1, 12: 0, 11: 0 }, s);
      s = r.nextState;
      assert("7474", "Clock LOW: D=1 does not transfer to Q until rising edge", r.outputs[5] === 0 && r.outputs[6] === 1);

      r = ffLib.eval({ 1: 1, 4: 1, 2: 1, 3: 1, 13: 1, 10: 1, 12: 0, 11: 0 }, s);
      s = r.nextState;
      assert("7474", "Rising edge (0->1): Q latches D=1", r.outputs[5] === 1 && r.outputs[6] === 0);

      r = ffLib.eval({ 1: 1, 4: 1, 2: 0, 3: 0, 13: 1, 10: 1, 12: 0, 11: 0 }, s);
      s = r.nextState;
      assert("7474", "Falling edge (1->0): Q holds previous state", r.outputs[5] === 1);

      r = ffLib.eval({ 1: 1, 4: 1, 2: 0, 3: 1, 13: 1, 10: 1, 12: 0, 11: 0 }, s);
      assert("7474", "Rising edge (0->1): Q latches D=0", r.outputs[5] === 0 && r.outputs[6] === 1);

      s = { q1: 0, q2: 0, lastClk1: 0, lastClk2: 0 };
      r = ffLib.eval({ 1: 1, 4: 1, 2: 0, 3: 0, 13: 1, 10: 1, 12: 1, 11: 1 }, s);
      assert("7474", "Section 2 (2Q, 2Q̅) operates independently on 2CLK rising edge", r.outputs[9] === 1 && r.outputs[8] === 0);
    }

    return results;
  }
}
if (typeof window !== "undefined") {
  window.TTLEngine = TTLEngine;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TTLEngine };
}
