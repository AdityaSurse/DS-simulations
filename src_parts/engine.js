/* ===== ENGINE ===== */
class TTLEngine {
  constructor() {
    this.masterPower = true;
    this.strictPowerMode = true; // Default strict mode from lab addendum
    this.wires = []; // Array of { id, from, to, color }
    this.nextWireId = 1;

    // 12 data input switches: C3..C0, B3..B0, A3..A0 (0 or 1)
    this.inputs = {
      "IN.C3": 0, "IN.C2": 0, "IN.C1": 0, "IN.C0": 0,
      "IN.B3": 0, "IN.B2": 0, "IN.B1": 0, "IN.B0": 0,
      "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0
    };

    // Manual pulser buttons (pressed = true)
    this.pulsers = {
      1: { pressed: false },
      2: { pressed: false }
    };

    // Clock generator
    this.clock = {
      freq: 1, // Hz (1, 5, 10, 50, 100, 500)
      state: 0,
      divState: 0,
      divCounter: 0,
      timer: null
    };

    // ZIF Sockets U1..U4 (20-pin) and U5 (40-pin)
    this.sockets = {
      U1: { chip: null, alignment: "left", leverLocked: true, state: {} },
      U2: { chip: null, alignment: "left", leverLocked: true, state: {} },
      U3: { chip: null, alignment: "left", leverLocked: true, state: {} },
      U4: { chip: null, alignment: "left", leverLocked: true, state: {} },
      U5: { chip: null, alignment: "left", leverLocked: true, state: {} }
    };

    // Outputs
    this.outputs = {
      "OUT.Y7": 0, "OUT.Y6": 0, "OUT.Y5": 0, "OUT.Y4": 0,
      "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 0, "OUT.Y0": 0
    };

    this.segDigits = [0, 0]; // High nibble (Y7..Y4), Low nibble (Y3..Y0)
    this.shorts = []; // List of active short circuits
    this.netMap = new Map(); // jackId -> Net info
    this.nets = []; // Array of Net objects
    this.changeCallbacks = [];

    // Audio setup (synthesizer for realistic switch & buzzer sounds)
    this.audioCtx = null;
    this.initClock();
  }

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

  // Clock generator
  initClock() {
    if (this.clock.timer) clearInterval(this.clock.timer);
    const intervalMs = Math.max(10, Math.floor(1000 / (this.clock.freq * 2)));
    this.clock.timer = setInterval(() => {
      if (!this.masterPower) return;
      this.clock.state = this.clock.state === 0 ? 1 : 0;
      if (this.clock.state === 1) {
        this.clock.divCounter = (this.clock.divCounter + 1) % 2;
        if (this.clock.divCounter === 0) {
          this.clock.divState = this.clock.divState === 0 ? 1 : 0;
        }
      }
      this.evaluate();
      this.notify();
    }, intervalMs);
  }

  setClockFreq(freq) {
    this.clock.freq = freq;
    this.initClock();
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

  setPulser(num, pressed) {
    if (this.pulsers[num]) {
      this.pulsers[num].pressed = pressed;
      this.playClickSound(pressed ? 1100 : 600);
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
      this.evaluate();
      this.notify();
    }
  }

  removeChip(socketId) {
    if (this.sockets[socketId]) {
      this.sockets[socketId].chip = null;
      this.sockets[socketId].state = {};
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
      // 40-pin ZIF
      return `U5.J${icPin}`;
    }
    // 20-pin ZIF (U1..U4)
    // Left-aligned formula from addendum:
    // IC pin n <= N/2 -> socket pin n
    // IC pin n > N/2 -> socket pin n + (20 - N)
    const half = pinCount / 2;
    const diff = 20 - pinCount;

    let socketJackNum;
    if (alignment === "left") {
      if (icPin <= half) {
        socketJackNum = icPin;
      } else {
        socketJackNum = icPin + diff;
      }
    } else if (alignment === "right") {
      const offset = diff / 2;
      if (icPin <= half) {
        socketJackNum = icPin + offset;
      } else {
        socketJackNum = icPin + offset;
      }
    } else { // center
      const offset = Math.floor(diff / 4);
      if (icPin <= half) {
        socketJackNum = icPin + offset;
      } else {
        socketJackNum = icPin + diff - offset;
      }
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
  addWire(from, to, color = "#facc15") {
    if (!from || !to || from === to) return false;
    // Check if duplicate wire exists
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
      // Everything unpowered
      for (const k of Object.keys(this.outputs)) this.outputs[k] = 0;
      this.segDigits = [0, 0];
      return;
    }

    // 1. Build Disjoint Set Union (DSU) for all nets
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

    // Permanent internal ties on the trainer kit
    union("PWR.5V_1", "PWR.5V_2");
    union("PWR.12V_1", "PWR.12V_2");
    union("PWR.GND_1", "PWR.GND_2");
    union("PWR.GND_2", "PWR.GND_3");
    union("PWR.GND_3", "PWR.GND_4");

    // Connect user patch wires
    for (const w of this.wires) {
      union(w.from, w.to);
    }

    // Group jacks by net root
    const netGroups = new Map();
    const registerJack = (j) => {
      const root = find(j);
      if (!netGroups.has(root)) netGroups.set(root, new Set());
      netGroups.get(root).add(j);
    };

    // Collect all jacks in use
    const allJacks = new Set([
      "PWR.5V_1", "PWR.5V_2", "PWR.12V_1", "PWR.12V_2",
      "PWR.GND_1", "PWR.GND_2", "PWR.GND_3", "PWR.GND_4",
      "CLK.OUT", "CLK.DIV",
      "PULSE1.Q", "PULSE1.QN", "PULSE2.Q", "PULSE2.QN"
    ]);
    for (const k of Object.keys(this.inputs)) allJacks.add(k);
    for (const k of Object.keys(this.outputs)) allJacks.add(k);
    for (const w of this.wires) {
      allJacks.add(w.from);
      allJacks.add(w.to);
    }
    // Also include socket jacks
    for (const sId of ["U1", "U2", "U3", "U4"]) {
      for (let j = 1; j <= 20; j++) allJacks.add(`${sId}.J${j}`);
    }
    for (let j = 1; j <= 40; j++) allJacks.add(`U5.J${j}`);

    for (const j of allJacks) registerJack(j);

    // Initialise net state structures
    const netData = new Map();
    for (const [root, jackSet] of netGroups.entries()) {
      netData.set(root, {
        root,
        jacks: jackSet,
        drivers: [],
        state: "FLOAT", // 0, 1, "FLOAT", "SHORT", "12V"
        voltage: 1.4
      });
      for (const j of jackSet) {
        this.netMap.set(j, netData.get(root));
      }
    }
    this.nets = Array.from(netData.values());

    // 2. Identify fixed hardware drivers
    const addDriver = (jackId, level, source) => {
      const net = this.netMap.get(jackId);
      if (net) net.drivers.push({ level, source });
    };

    // Power terminals
    addDriver("PWR.5V_1", 1, "+5V Rail");
    addDriver("PWR.GND_1", 0, "GND Rail");
    addDriver("PWR.12V_1", "12V", "+12V Rail");

    // 12 Data Input switches
    for (const [swId, val] of Object.entries(this.inputs)) {
      addDriver(swId, val, `Switch ${swId}`);
    }

    // Manual Pulsers
    addDriver("PULSE1.Q", this.pulsers[1].pressed ? 1 : 0, "Pulser 1 Q");
    addDriver("PULSE1.QN", this.pulsers[1].pressed ? 0 : 1, "Pulser 1 Q'");
    addDriver("PULSE2.Q", this.pulsers[2].pressed ? 1 : 0, "Pulser 2 Q");
    addDriver("PULSE2.QN", this.pulsers[2].pressed ? 0 : 1, "Pulser 2 Q'");

    // Clock generator
    addDriver("CLK.OUT", this.clock.state, "Clock Out");
    addDriver("CLK.DIV", this.clock.divState, "Clock Div");

    // 3. Iterative IC evaluation loop (for combinational propagation)
    const MAX_PASSES = 6;
    for (let pass = 0; pass < MAX_PASSES; pass++) {
      // Resolve net logic levels from existing drivers
      for (const net of this.nets) {
        let has1 = false;
        let has0 = false;
        let has12 = false;

        for (const d of net.drivers) {
          if (d.level === 1) has1 = true;
          else if (d.level === 0) has0 = true;
          else if (d.level === "12V") has12 = true;
        }

        if (has1 && has0) {
          net.state = "SHORT";
          net.voltage = 0.5;
        } else if (has12 && has0) {
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
          // Unconnected floating net: TTL inputs float to Logic 1!
          net.state = 1; // Floating TTL reads as HIGH
          net.voltage = 1.6; // Typical floating TTL input threshold
        }
      }

      // Clear dynamic IC drivers before re-evaluating
      for (const net of this.nets) {
        net.drivers = net.drivers.filter(d => !d.source.startsWith("IC_"));
      }

      // Evaluate active ICs in sockets
      for (const [sId, sData] of Object.entries(this.sockets)) {
        if (!sData.chip || !sData.leverLocked) continue;
        const icDef = IC_LIBRARY[sData.chip];
        if (!icDef) continue;

        // Check power
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

        // Read inputs for IC
        const inMap = {};
        for (const pinInfo of icDef.pins) {
          if (pinInfo.type === "in") {
            const jack = this.getJackForICPin(sId, pinInfo.pin, icDef.pinCount, sData.alignment);
            const net = this.netMap.get(jack);
            // Floating TTL pin reads as 1
            inMap[pinInfo.pin] = (net ? (net.state === "SHORT" ? 0 : (net.state === 1 ? 1 : 0)) : 1);
          }
        }

        // Run IC logic
        const evalResult = icDef.eval(inMap, sData.state);
        sData.state = evalResult.nextState;

        // Drive outputs onto corresponding nets
        for (const [pinStr, outVal] of Object.entries(evalResult.outputs)) {
          const pin = parseInt(pinStr, 10);
          const outJack = this.getJackForICPin(sId, pin, icDef.pinCount, sData.alignment);
          addDriver(outJack, outVal, `IC_${sId}_${sData.chip}_P${pin}`);
        }
      }
    }

    // 4. Final resolve and short circuit detection
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

    // 5. Update trainer outputs and 7-segment display
    for (let i = 0; i < 8; i++) {
      const jack = `OUT.Y${i}`;
      const net = this.netMap.get(jack);
      this.outputs[jack] = (net && net.state === 1) ? 1 : 0;
    }

    // High nibble Y7..Y4, Low nibble Y3..Y0
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

  // Probe helper
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
}

