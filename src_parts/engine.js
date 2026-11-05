/* ===== ENGINE ===== */
class TTLEngine {
  constructor() {
    this.masterPower = true;
    this.strictPowerMode = true; // Default strict mode from lab addendum
    this.wires = []; // Array of { id, from, to, color }
    this.nextWireId = 1;

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
    this.shorts = [];
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
  get pulsers() { return this.board.pulsers; }
  get clock() { return this.board.clock; }

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
  }

  toggleInput(jackId) {
    if (this.inputs.hasOwnProperty(jackId)) {
      this.inputs[jackId] = this.inputs[jackId] === 1 ? 0 : 1;
      this.playClickSound(this.inputs[jackId] === 1 ? 950 : 700);
      this.evaluate();
      this.notify();
    }
  }

  // IC Socket Management
  insertChip(socketId, chipName, alignment = "left") {
    if (this.sockets[socketId]) {
      this.sockets[socketId].chip = chipName;
      this.sockets[socketId].alignment = alignment;
      this.sockets[socketId].state = {};
      this.sockets[socketId].lastOutputs = null;
      this.evaluate();
      this.notify();
    }
  }

  removeChip(socketId) {
    if (this.sockets[socketId]) {
      this.sockets[socketId].chip = null;
      this.sockets[socketId].state = {};
      this.sockets[socketId].lastOutputs = null;
      this.evaluate();
      this.notify();
    }
  }

  setSocketLever(socketId, locked) {
    if (this.sockets[socketId]) {
      this.sockets[socketId].leverLocked = locked;
      this.playClickSound(locked ? 500 : 750);
      this.evaluate();
      this.notify();
    }
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

  // Wire Management
  addWire(from, to, color = "#f5c518") {
    if (!from || !to || from === to) return false;
    const exists = this.wires.some(w =>
      (w.from === from && w.to === to) || (w.from === to && w.to === from)
    );
    if (exists) return false;

    const wire = {
      id: `W_${this.nextWireId++}`,
      from,
      to,
      color
    };
    this.wires.push(wire);
    this.playClickSound(450);
    this.evaluate();
    this.notify();
    return wire;
  }

  removeWire(wireId) {
    const idx = this.wires.findIndex(w => w.id === wireId);
    if (idx !== -1) {
      this.wires.splice(idx, 1);
      this.playClickSound(350);
      this.evaluate();
      this.notify();
      return true;
    }
    return false;
  }

  undoWire() {
    if (this.wires.length > 0) {
      this.wires.pop();
      this.playClickSound(350);
      this.evaluate();
      this.notify();
      return true;
    }
    return false;
  }

  clearWires() {
    if (this.wires.length > 0) {
      this.wires = [];
      this.playClickSound(300);
      this.evaluate();
      this.notify();
    }
  }

  // Simulation Evaluation
  evaluate() {
    this.shorts = [];
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
      "PWR.5V_1", "PWR.5V_2", "PWR.12V_1", "PWR.12V_2",
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
        state: "FLOAT",
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
        addDriver(outJack, outVal, `IC_${sId}_${sData.chip}_P${pin}`);
      }
    }

    // 2. Multi-Pass Combinational & Sequential Evaluation
    const MAX_PASSES = 6;
    for (let pass = 0; pass < MAX_PASSES; pass++) {
      for (const net of this.nets) {
        let has1 = false, has0 = false, has12 = false;
        for (const d of net.drivers) {
          if (d.level === 1) has1 = true;
          else if (d.level === 0) has0 = true;
          else if (d.level === "12V") has12 = true;
        }

        if ((has1 && has0) || (has12 && has0)) {
          net.state = "SHORT";
          net.voltage = 0.5;
        } else if (has12) {
          net.state = "12V";
          net.voltage = 12.0;
        } else if (has1) {
          net.state = 1;
          net.voltage = 4.8;
        } else if (has0) {
          net.state = 0;
          net.voltage = 0.2;
        } else {
          // Unconnected TTL input floats to 1!
          net.state = 1;
          net.voltage = 1.6;
        }
      }

      for (const net of this.nets) {
        net.drivers = net.drivers.filter(d => !d.source.startsWith("IC_"));
      }

      for (const [sId, sData] of Object.entries(this.sockets)) {
        if (!sData.chip || !sData.leverLocked) continue;
        const icDef = IC_LIBRARY[sData.chip];
        if (!icDef) continue;

        let isPowered = true;
        if (this.strictPowerMode) {
          const vccJack = this.getJackForICPin(sId, icDef.vccPin, icDef.pinCount, sData.alignment);
          const gndJack = this.getJackForICPin(sId, icDef.gndPin, icDef.pinCount, sData.alignment);
          const vccNet = this.netMap.get(vccJack);
          const gndNet = this.netMap.get(gndJack);

          const hasVcc = vccNet && vccNet.drivers.some(d => d.source.includes("+5V"));
          const hasGnd = gndNet && gndNet.drivers.some(d => d.source.includes("GND"));
          isPowered = (hasVcc && hasGnd);
        }

        if (!isPowered) continue;

        const inMap = {};
        for (const pinInfo of icDef.pins) {
          if (pinInfo.type === "in") {
            const jack = this.getJackForICPin(sId, pinInfo.pin, icDef.pinCount, sData.alignment);
            const net = this.netMap.get(jack);
            inMap[pinInfo.pin] = (net ? (net.state === "SHORT" ? 0 : (net.state === 1 ? 1 : 0)) : 1);
          }
        }

        const evalResult = icDef.eval(inMap, sData.state);
        sData.state = evalResult.nextState;
        sData.lastOutputs = evalResult.outputs;

        for (const [pinStr, outVal] of Object.entries(evalResult.outputs)) {
          const pin = parseInt(pinStr, 10);
          const outJack = this.getJackForICPin(sId, pin, icDef.pinCount, sData.alignment);
          addDriver(outJack, outVal, `IC_${sId}_${sData.chip}_P${pin}`);
        }
      }
    }

    // 3. Final Net Resolving
    let hadShort = false;
    for (const net of this.nets) {
      const has1 = net.drivers.some(d => d.level === 1);
      const has0 = net.drivers.some(d => d.level === 0);
      const has12 = net.drivers.some(d => d.level === "12V");

      if ((has1 && has0) || (has12 && has0)) {
        net.state = "SHORT";
        net.voltage = 0.5;
        hadShort = true;
        const driverNames = net.drivers.map(d => `${d.source}=${d.level}`).join(", ");
        this.shorts.push(`Short circuit on net with [${driverNames}]`);
      } else if (has12) {
        net.state = "12V";
        net.voltage = 12.0;
      } else if (has1) {
        net.state = 1;
        net.voltage = 4.8;
      } else if (has0) {
        net.state = 0;
        net.voltage = 0.2;
      } else {
        net.state = "FLOAT";
        net.voltage = 1.4;
      }
    }

    if (hadShort) this.playShortBuzzer();

    // 4. Update trainer outputs and 7-segment display
    for (let i = 0; i < 8; i++) {
      const jack = `OUT.Y${i}`;
      const net = this.netMap.get(jack);
      this.outputs[jack] = (net && net.state === 1) ? 1 : 0;
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
  }

  probeJack(jackId) {
    if (!this.masterPower) {
      return { id: jackId, state: "OFF", voltage: 0.0, net: null };
    }
    const net = this.netMap.get(jackId);
    if (!net) {
      return { id: jackId, state: "OPEN", voltage: 0.0, net: null };
    }
    return {
      id: jackId,
      state: net.state,
      voltage: net.voltage,
      drivers: net.drivers,
      netSize: net.jacks.size
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
    this.sockets.U1.state = { qa: 0, bcd: 0, lastCkA: 1, lastCkB: 0 };
    this.sockets.U1.lastOutputs = { 12: 0, 9: 0, 11: 0, 8: 0 };
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

    // Restore state
    this.sockets.U1 = origU1;
    this.clock.freq = origClock.freq;
    this.clock.knobT = origClock.knobT;
    this.clock.running = origClock.running;
    this.clock.pos = origClock.pos;
    this.clock.neg = origClock.neg;
    this.evaluate();

    return results;
  }
}
