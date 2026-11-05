/* ===== DATA: ICs ===== */
const IC_LIBRARY = {
  "7400": {
    name: "7400",
    marking: "SN7400N",
    title: "Quad 2-Input NAND Gate",
    description: "Quadruple 2-input positive-NAND gates. Four independent gates performing logical NAND function with standard TTL push-pull outputs.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1A", 2: "1B", 3: "1Y",
      4: "2A", 5: "2B", 6: "2Y",
      7: "GND",
      8: "3Y", 9: "3A", 10: "3B",
      11: "4Y", 12: "4A", 13: "4B",
      14: "VCC"
    },
    inputs: [1, 2, 4, 5, 9, 10, 12, 13],
    outputs: [3, 6, 8, 11],
    pins: [
      { pin: 1, name: "1A", type: "in" },
      { pin: 2, name: "1B", type: "in" },
      { pin: 3, name: "1Y", type: "out" },
      { pin: 4, name: "2A", type: "in" },
      { pin: 5, name: "2B", type: "in" },
      { pin: 6, name: "2Y", type: "out" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "3Y", type: "out" },
      { pin: 9, name: "3A", type: "in" },
      { pin: 10, name: "3B", type: "in" },
      { pin: 11, name: "4Y", type: "out" },
      { pin: 12, name: "4A", type: "in" },
      { pin: 13, name: "4B", type: "in" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      return {
        outputs: {
          3: (get(1) === 1 && get(2) === 1) ? 0 : 1,
          6: (get(4) === 1 && get(5) === 1) ? 0 : 1,
          8: (get(9) === 1 && get(10) === 1) ? 0 : 1,
          11: (get(12) === 1 && get(13) === 1) ? 0 : 1
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Input A", "Input B", "Output Y"],
      rows: [
        [0, 0, 1],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
      ]
    }
  },

  "7402": {
    name: "7402",
    marking: "SN7402N",
    title: "Quad 2-Input NOR Gate",
    description: "Quadruple 2-input positive-NOR gates. Note reversed pinout: output on pin 1 with inputs on pins 2 & 3.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1Y", 2: "1A", 3: "1B",
      4: "2Y", 5: "2A", 6: "2B",
      7: "GND",
      8: "3A", 9: "3B", 10: "3Y",
      11: "4A", 12: "4B", 13: "4Y",
      14: "VCC"
    },
    inputs: [2, 3, 5, 6, 8, 9, 11, 12],
    outputs: [1, 4, 10, 13],
    pins: [
      { pin: 1, name: "1Y", type: "out" },
      { pin: 2, name: "1A", type: "in" },
      { pin: 3, name: "1B", type: "in" },
      { pin: 4, name: "2Y", type: "out" },
      { pin: 5, name: "2A", type: "in" },
      { pin: 6, name: "2B", type: "in" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "3A", type: "in" },
      { pin: 9, name: "3B", type: "in" },
      { pin: 10, name: "3Y", type: "out" },
      { pin: 11, name: "4A", type: "in" },
      { pin: 12, name: "4B", type: "in" },
      { pin: 13, name: "4Y", type: "out" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      return {
        outputs: {
          1: (get(2) === 0 && get(3) === 0) ? 1 : 0,
          4: (get(5) === 0 && get(6) === 0) ? 1 : 0,
          10: (get(8) === 0 && get(9) === 0) ? 1 : 0,
          13: (get(11) === 0 && get(12) === 0) ? 1 : 0
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Input A", "Input B", "Output Y"],
      rows: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 0]
      ]
    }
  },

  "7404": {
    name: "7404",
    marking: "SN7404N",
    title: "Hex Inverter",
    description: "Hex inverters with 6 independent NOT logic gates with standard TTL push-pull outputs.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1A", 2: "1Y",
      3: "2A", 4: "2Y",
      5: "3A", 6: "3Y",
      7: "GND",
      8: "4Y", 9: "4A",
      10: "5Y", 11: "5A",
      12: "6Y", 13: "6A",
      14: "VCC"
    },
    inputs: [1, 3, 5, 9, 11, 13],
    outputs: [2, 4, 6, 8, 10, 12],
    pins: [
      { pin: 1, name: "1A", type: "in" },
      { pin: 2, name: "1Y", type: "out" },
      { pin: 3, name: "2A", type: "in" },
      { pin: 4, name: "2Y", type: "out" },
      { pin: 5, name: "3A", type: "in" },
      { pin: 6, name: "3Y", type: "out" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "4Y", type: "out" },
      { pin: 9, name: "4A", type: "in" },
      { pin: 10, name: "5Y", type: "out" },
      { pin: 11, name: "5A", type: "in" },
      { pin: 12, name: "6Y", type: "out" },
      { pin: 13, name: "6A", type: "in" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      return {
        outputs: {
          2: get(1) === 1 ? 0 : 1,
          4: get(3) === 1 ? 0 : 1,
          6: get(5) === 1 ? 0 : 1,
          8: get(9) === 1 ? 0 : 1,
          10: get(11) === 1 ? 0 : 1,
          12: get(13) === 1 ? 0 : 1
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Input A", "Output Y"],
      rows: [
        [0, 1],
        [1, 0]
      ]
    }
  },

  "TEST_GATE": {
    name: "TEST_GATE",
    marking: "SN7404N",
    title: "Test Inverter Gate",
    description: "Single inverter test gate for simulator engine verification.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: { 1: "1A", 2: "1Y", 7: "GND", 14: "VCC" },
    inputs: [1],
    outputs: [2],
    pins: [
      { pin: 1, name: "1A", type: "in" },
      { pin: 2, name: "1Y", type: "out" },
      { pin: 3, name: "NC", type: "nc" },
      { pin: 4, name: "NC", type: "nc" },
      { pin: 5, name: "NC", type: "nc" },
      { pin: 6, name: "NC", type: "nc" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "NC", type: "nc" },
      { pin: 9, name: "NC", type: "nc" },
      { pin: 10, name: "NC", type: "nc" },
      { pin: 11, name: "NC", type: "nc" },
      { pin: 12, name: "NC", type: "nc" },
      { pin: 13, name: "NC", type: "nc" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (readPin, state) => {
      const get = typeof readPin === "function" ? readPin : (p => readPin[p]);
      const inVal = get(1);
      return {
        outputs: { 2: inVal === 1 ? 0 : 1 },
        nextState: state || {}
      };
    },
    truthTable: {
      headers: ["1A", "1Y"],
      rows: [
        [0, 1],
        [1, 0]
      ]
    }
  },

  "7408": {
    name: "7408",
    marking: "SN7408N",
    title: "Quad 2-Input AND Gate",
    description: "Quadruple 2-input positive-AND gates. Four independent gates performing logical AND function with standard TTL push-pull outputs.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1A", 2: "1B", 3: "1Y",
      4: "2A", 5: "2B", 6: "2Y",
      7: "GND",
      8: "3Y", 9: "3A", 10: "3B",
      11: "4Y", 12: "4A", 13: "4B",
      14: "VCC"
    },
    inputs: [1, 2, 4, 5, 9, 10, 12, 13],
    outputs: [3, 6, 8, 11],
    pins: [
      { pin: 1, name: "1A", type: "in" },
      { pin: 2, name: "1B", type: "in" },
      { pin: 3, name: "1Y", type: "out" },
      { pin: 4, name: "2A", type: "in" },
      { pin: 5, name: "2B", type: "in" },
      { pin: 6, name: "2Y", type: "out" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "3Y", type: "out" },
      { pin: 9, name: "3A", type: "in" },
      { pin: 10, name: "3B", type: "in" },
      { pin: 11, name: "4Y", type: "out" },
      { pin: 12, name: "4A", type: "in" },
      { pin: 13, name: "4B", type: "in" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      return {
        outputs: {
          3: (get(1) === 1 && get(2) === 1) ? 1 : 0,
          6: (get(4) === 1 && get(5) === 1) ? 1 : 0,
          8: (get(9) === 1 && get(10) === 1) ? 1 : 0,
          11: (get(12) === 1 && get(13) === 1) ? 1 : 0
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Input A", "Input B", "Output Y"],
      rows: [
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1]
      ]
    }
  },

  "7420": {
    name: "7420",
    marking: "SN7420N",
    title: "Dual 4-Input NAND Gate",
    description: "Dual 4-input positive-NAND gates. Two independent 4-input NAND gates with standard TTL push-pull outputs. Pins 3 and 11 are No-Connect (NC).",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1A", 2: "1B", 3: "NC", 4: "1C", 5: "1D", 6: "1Y",
      7: "GND",
      8: "2Y", 9: "2A", 10: "2B", 11: "NC", 12: "2C", 13: "2D",
      14: "VCC"
    },
    inputs: [1, 2, 4, 5, 9, 10, 12, 13],
    outputs: [6, 8],
    pins: [
      { pin: 1, name: "1A", type: "in" },
      { pin: 2, name: "1B", type: "in" },
      { pin: 3, name: "NC", type: "nc" },
      { pin: 4, name: "1C", type: "in" },
      { pin: 5, name: "1D", type: "in" },
      { pin: 6, name: "1Y", type: "out" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "2Y", type: "out" },
      { pin: 9, name: "2A", type: "in" },
      { pin: 10, name: "2B", type: "in" },
      { pin: 11, name: "NC", type: "nc" },
      { pin: 12, name: "2C", type: "in" },
      { pin: 13, name: "2D", type: "in" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      return {
        outputs: {
          6: (get(1) === 1 && get(2) === 1 && get(4) === 1 && get(5) === 1) ? 0 : 1,
          8: (get(9) === 1 && get(10) === 1 && get(12) === 1 && get(13) === 1) ? 0 : 1
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Input 1A", "Input 1B", "Input 1C", "Input 1D", "Output 1Y"],
      rows: [
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [1, 0, 1, 1, 1],
        [1, 1, 0, 1, 1],
        [1, 1, 1, 0, 1],
        [1, 1, 1, 1, 0]
      ]
    }
  },

  "7432": {
    name: "7432",
    marking: "SN7432N",
    title: "Quad 2-Input OR Gate",
    description: "Quadruple 2-input positive-OR gates. Four independent gates performing logical OR function with standard TTL push-pull outputs.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1A", 2: "1B", 3: "1Y",
      4: "2A", 5: "2B", 6: "2Y",
      7: "GND",
      8: "3Y", 9: "3A", 10: "3B",
      11: "4Y", 12: "4A", 13: "4B",
      14: "VCC"
    },
    inputs: [1, 2, 4, 5, 9, 10, 12, 13],
    outputs: [3, 6, 8, 11],
    pins: [
      { pin: 1, name: "1A", type: "in" },
      { pin: 2, name: "1B", type: "in" },
      { pin: 3, name: "1Y", type: "out" },
      { pin: 4, name: "2A", type: "in" },
      { pin: 5, name: "2B", type: "in" },
      { pin: 6, name: "2Y", type: "out" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "3Y", type: "out" },
      { pin: 9, name: "3A", type: "in" },
      { pin: 10, name: "3B", type: "in" },
      { pin: 11, name: "4Y", type: "out" },
      { pin: 12, name: "4A", type: "in" },
      { pin: 13, name: "4B", type: "in" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      return {
        outputs: {
          3: (get(1) === 1 || get(2) === 1) ? 1 : 0,
          6: (get(4) === 1 || get(5) === 1) ? 1 : 0,
          8: (get(9) === 1 || get(10) === 1) ? 1 : 0,
          11: (get(12) === 1 || get(13) === 1) ? 1 : 0
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Input A", "Input B", "Output Y"],
      rows: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ]
    }
  },

  "7474": {
    name: "7474",
    marking: "SN74LS74AN",
    title: "Dual D-Type Positive-Edge-Triggered Flip-Flops",
    description: "Contains two independent positive-edge-triggered D-type flip-flops with asynchronous active-low preset (1PR̅, 2PR̅) and clear (1CLR̅, 2CLR̅) inputs. When both PR̅ and CLR̅ are LOW, outputs Q and Q̅ are both forced HIGH.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1CLR̅", 2: "1D", 3: "1CLK", 4: "1PR̅", 5: "1Q", 6: "1Q̅", 7: "GND",
      8: "2Q̅", 9: "2Q", 10: "2PR̅", 11: "2CLK", 12: "2D", 13: "2CLR̅", 14: "VCC"
    },
    inputs: [1, 2, 3, 4, 10, 11, 12, 13],
    outputs: [5, 6, 8, 9],
    pins: [
      { pin: 1, name: "1CLR̅", type: "in" },
      { pin: 2, name: "1D", type: "in" },
      { pin: 3, name: "1CLK", type: "in" },
      { pin: 4, name: "1PR̅", type: "in" },
      { pin: 5, name: "1Q", type: "out" },
      { pin: 6, name: "1Q̅", type: "out" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "2Q̅", type: "out" },
      { pin: 9, name: "2Q", type: "out" },
      { pin: 10, name: "2PR̅", type: "in" },
      { pin: 11, name: "2CLK", type: "in" },
      { pin: 12, name: "2D", type: "in" },
      { pin: 13, name: "2CLR̅", type: "in" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const s = state || {
        q1: Math.random() < 0.5 ? 0 : 1,
        q2: Math.random() < 0.5 ? 0 : 1,
        lastClk1: 0,
        lastClk2: 0
      };

      // Section 1: 1CLR̅(1), 1D(2), 1CLK(3), 1PR̅(4) -> 1Q(5), 1Q̅(6)
      const clr1 = get(1);
      const d1 = get(2);
      const clk1 = get(3);
      const pr1 = get(4);

      let q1 = s.q1;
      let q1Bar = q1 === 1 ? 0 : 1;

      if (pr1 === 0 && clr1 === 0) {
        // Datasheet: both active-low overrides edge and forces both HIGH!
        q1 = 1;
        q1Bar = 1;
      } else if (pr1 === 0) {
        q1 = 1;
        q1Bar = 0;
      } else if (clr1 === 0) {
        q1 = 0;
        q1Bar = 1;
      } else {
        // Clocked operation on rising edge
        if (s.lastClk1 === 0 && clk1 === 1) {
          q1 = d1 === 1 ? 1 : 0;
        }
        q1Bar = q1 === 1 ? 0 : 1;
      }

      // Section 2: 2CLR̅(13), 2D(12), 2CLK(11), 2PR̅(10) -> 2Q(9), 2Q̅(8)
      const clr2 = get(13);
      const d2 = get(12);
      const clk2 = get(11);
      const pr2 = get(10);

      let q2 = s.q2;
      let q2Bar = q2 === 1 ? 0 : 1;

      if (pr2 === 0 && clr2 === 0) {
        q2 = 1;
        q2Bar = 1;
      } else if (pr2 === 0) {
        q2 = 1;
        q2Bar = 0;
      } else if (clr2 === 0) {
        q2 = 0;
        q2Bar = 1;
      } else {
        // Clocked operation on rising edge
        if (s.lastClk2 === 0 && clk2 === 1) {
          q2 = d2 === 1 ? 1 : 0;
        }
        q2Bar = q2 === 1 ? 0 : 1;
      }

      return {
        outputs: {
          5: q1,
          6: q1Bar,
          9: q2,
          8: q2Bar
        },
        nextState: {
          q1,
          q2,
          lastClk1: clk1,
          lastClk2: clk2
        }
      };
    },
    truthTable: {
      headers: ["PR̅", "CLR̅", "CLK", "D", "Q", "Q̅"],
      rows: [
        [0, 1, "X", "X", 1, 0],
        [1, 0, "X", "X", 0, 1],
        [0, 0, "X", "X", 1, 1],
        [1, 1, "↑", 1, 1, 0],
        [1, 1, "↑", 0, 0, 1],
        [1, 1, 0, "X", "Q0", "Q0̅"]
      ]
    }
  },

  "7486": {
    name: "7486",
    marking: "SN7486N",
    title: "Quad 2-Input Exclusive-OR (XOR) Gate",
    description: "Quadruple 2-input exclusive-OR (XOR) gates with standard TTL totem-pole outputs.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    pinNames: {
      1: "1A", 2: "1B", 3: "1Y",
      4: "2A", 5: "2B", 6: "2Y",
      7: "GND",
      8: "3Y", 9: "3A", 10: "3B",
      11: "4Y", 12: "4A", 13: "4B",
      14: "VCC"
    },
    inputs: [1, 2, 4, 5, 9, 10, 12, 13],
    outputs: [3, 6, 8, 11],
    pins: [
      { pin: 1, name: "1A", type: "in" },
      { pin: 2, name: "1B", type: "in" },
      { pin: 3, name: "1Y", type: "out" },
      { pin: 4, name: "2A", type: "in" },
      { pin: 5, name: "2B", type: "in" },
      { pin: 6, name: "2Y", type: "out" },
      { pin: 7, name: "GND", type: "gnd" },
      { pin: 8, name: "3Y", type: "out" },
      { pin: 9, name: "3A", type: "in" },
      { pin: 10, name: "3B", type: "in" },
      { pin: 11, name: "4Y", type: "out" },
      { pin: 12, name: "4A", type: "in" },
      { pin: 13, name: "4B", type: "in" },
      { pin: 14, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      return {
        outputs: {
          3: (get(1) ^ get(2)) ? 1 : 0,
          6: (get(4) ^ get(5)) ? 1 : 0,
          8: (get(9) ^ get(10)) ? 1 : 0,
          11: (get(12) ^ get(13)) ? 1 : 0
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Input A", "Input B", "Output Y"],
      rows: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
      ]
    }
  },

  "74153": {
    name: "74153",
    marking: "SN74LS153N",
    title: "Dual 4-to-1 Multiplexer",
    description: "Contains two independent 4-to-1 data selectors/multiplexers. Select inputs S1 (Pin 2) and S0 (Pin 14) are shared by both sections. Active-low strobe inputs 1G̅ (Pin 1) and 2G̅ (Pin 15). Output = selected input when G̅=0, else 0.",
    package: "DIP-16",
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    pinNames: {
      1: "1G̅", 2: "S1", 3: "1C3", 4: "1C2", 5: "1C1", 6: "1C0", 7: "1Y", 8: "GND",
      9: "2Y", 10: "2C0", 11: "2C1", 12: "2C2", 13: "2C3", 14: "S0", 15: "2G̅", 16: "VCC"
    },
    inputs: [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15],
    outputs: [7, 9],
    pins: [
      { pin: 1, name: "1G̅", type: "in" },
      { pin: 2, name: "S1", type: "in" },
      { pin: 3, name: "1C3", type: "in" },
      { pin: 4, name: "1C2", type: "in" },
      { pin: 5, name: "1C1", type: "in" },
      { pin: 6, name: "1C0", type: "in" },
      { pin: 7, name: "1Y", type: "out" },
      { pin: 8, name: "GND", type: "gnd" },
      { pin: 9, name: "2Y", type: "out" },
      { pin: 10, name: "2C0", type: "in" },
      { pin: 11, name: "2C1", type: "in" },
      { pin: 12, name: "2C2", type: "in" },
      { pin: 13, name: "2C3", type: "in" },
      { pin: 14, name: "S0", type: "in" },
      { pin: 15, name: "2G̅", type: "in" },
      { pin: 16, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const s1 = get(2);
      const s0 = get(14);
      const sel = (s1 << 1) | s0;

      let y1 = 0;
      if (get(1) === 0) { // Active low enable 1G̅
        if (sel === 0) y1 = get(6);
        else if (sel === 1) y1 = get(5);
        else if (sel === 2) y1 = get(4);
        else if (sel === 3) y1 = get(3);
      }

      let y2 = 0;
      if (get(15) === 0) { // Active low enable 2G̅
        if (sel === 0) y2 = get(10);
        else if (sel === 1) y2 = get(11);
        else if (sel === 2) y2 = get(12);
        else if (sel === 3) y2 = get(13);
      }

      return {
        outputs: { 7: y1, 9: y2 },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Select S1", "Select S0", "Strobe 1G̅", "Output 1Y"],
      rows: [
        ["X", "X", 1, 0],
        [0, 0, 0, "1C0"],
        [0, 1, 0, "1C1"],
        [1, 0, 0, "1C2"],
        [1, 1, 0, "1C3"]
      ]
    }
  },

  "74138": {
    name: "74138",
    marking: "SN74LS138N",
    title: "3-to-8 Line Decoder / Demultiplexer",
    description: "3-line to 8-line decoder/demultiplexer featuring three enable inputs (E1̅ on Pin 4, E2̅ on Pin 5, E3 on Pin 6) and 8 active-low outputs (Y0̅..Y7̅). All outputs HIGH unless E1̅=0, E2̅=0, E3=1.",
    package: "DIP-16",
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    pinNames: {
      1: "A0", 2: "A1", 3: "A2", 4: "E1̅", 5: "E2̅", 6: "E3", 7: "Y7̅", 8: "GND",
      9: "Y6̅", 10: "Y5̅", 11: "Y4̅", 12: "Y3̅", 13: "Y2̅", 14: "Y1̅", 15: "Y0̅", 16: "VCC"
    },
    inputs: [1, 2, 3, 4, 5, 6],
    outputs: [7, 9, 10, 11, 12, 13, 14, 15],
    pins: [
      { pin: 1, name: "A0", type: "in" },
      { pin: 2, name: "A1", type: "in" },
      { pin: 3, name: "A2", type: "in" },
      { pin: 4, name: "E1̅", type: "in" },
      { pin: 5, name: "E2̅", type: "in" },
      { pin: 6, name: "E3", type: "in" },
      { pin: 7, name: "Y7̅", type: "out" },
      { pin: 8, name: "GND", type: "gnd" },
      { pin: 9, name: "Y6̅", type: "out" },
      { pin: 10, name: "Y5̅", type: "out" },
      { pin: 11, name: "Y4̅", type: "out" },
      { pin: 12, name: "Y3̅", type: "out" },
      { pin: 13, name: "Y2̅", type: "out" },
      { pin: 14, name: "Y1̅", type: "out" },
      { pin: 15, name: "Y0̅", type: "out" },
      { pin: 16, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const e1 = get(4);
      const e2 = get(5);
      const e3 = get(6);
      const enabled = (e1 === 0 && e2 === 0 && e3 === 1);

      const outputs = { 15: 1, 14: 1, 13: 1, 12: 1, 11: 1, 10: 1, 9: 1, 7: 1 };
      if (enabled) {
        const a0 = get(1);
        const a1 = get(2);
        const a2 = get(3);
        const addr = (a2 << 2) | (a1 << 1) | a0;
        const pinMap = [15, 14, 13, 12, 11, 10, 9, 7];
        outputs[pinMap[addr]] = 0;
      }
      return { outputs, nextState: state };
    },
    truthTable: {
      headers: ["E3", "E2̅", "E1̅", "A2", "A1", "A0", "Active Output (LOW)"],
      rows: [
        [0, "X", "X", "X", "X", "X", "None (All HIGH)"],
        [1, 1, "X", "X", "X", "X", "None (All HIGH)"],
        [1, "X", 1, "X", "X", "X", "None (All HIGH)"],
        [1, 0, 0, 0, 0, 0, "Y0̅ = 0"],
        [1, 0, 0, 0, 0, 1, "Y1̅ = 0"],
        [1, 0, 0, 0, 1, 0, "Y2̅ = 0"],
        [1, 0, 0, 0, 1, 1, "Y3̅ = 0"],
        [1, 0, 0, 1, 0, 0, "Y4̅ = 0"],
        [1, 0, 0, 1, 0, 1, "Y5̅ = 0"],
        [1, 0, 0, 1, 1, 0, "Y6̅ = 0"],
        [1, 0, 0, 1, 1, 1, "Y7̅ = 0"]
      ]
    }
  },

  "7483": {
    name: "7483",
    marking: "SN74LS83N",
    title: "4-Bit Binary Full Adder",
    description: "4-bit binary full adder with fast internal lookahead carry. Adds two 4-bit words A[4:1] (A4 MSB) and B[4:1] (B4 MSB) with carry-in C0, generating sum S[4:1] (S4 MSB) and carry-out C4. Pinout: VCC=5, GND=12.",
    package: "DIP-16",
    pinCount: 16,
    vccPin: 5,
    gndPin: 12,
    pinNames: {
      1: "A4", 2: "S3", 3: "A3", 4: "B3", 5: "VCC", 6: "S2", 7: "B2", 8: "A2",
      9: "S1", 10: "A1", 11: "B1", 12: "GND", 13: "C0", 14: "C4", 15: "S4", 16: "B4"
    },
    inputs: [1, 3, 4, 7, 8, 10, 11, 13, 16],
    outputs: [2, 6, 9, 14, 15],
    pins: [
      { pin: 1, name: "A4", type: "in" },
      { pin: 2, name: "S3", type: "out" },
      { pin: 3, name: "A3", type: "in" },
      { pin: 4, name: "B3", type: "in" },
      { pin: 5, name: "VCC", type: "pwr" },
      { pin: 6, name: "S2", type: "out" },
      { pin: 7, name: "B2", type: "in" },
      { pin: 8, name: "A2", type: "in" },
      { pin: 9, name: "S1", type: "out" },
      { pin: 10, name: "A1", type: "in" },
      { pin: 11, name: "B1", type: "in" },
      { pin: 12, name: "GND", type: "gnd" },
      { pin: 13, name: "C0", type: "in" },
      { pin: 14, name: "C4", type: "out" },
      { pin: 15, name: "S4", type: "out" },
      { pin: 16, name: "B4", type: "in" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const a = (get(1) << 3) | (get(3) << 2) | (get(8) << 1) | get(10);
      const b = (get(16) << 3) | (get(4) << 2) | (get(7) << 1) | get(11);
      const c0 = get(13);
      const sum = a + b + c0;
      return {
        outputs: {
          9: sum & 1,          // S1 (LSB)
          6: (sum >> 1) & 1,   // S2
          2: (sum >> 2) & 1,   // S3
          15: (sum >> 3) & 1,  // S4 (MSB)
          14: (sum >> 4) & 1   // C4 (Cout)
        },
        nextState: state
      };
    },
    truthTable: {
      headers: ["A[4:1]", "B[4:1]", "Cin", "Sum S[4:1]", "Cout"],
      rows: [
        ["0011 (3)", "0101 (5)", 0, "1000 (8)", 0],
        ["0111 (7)", "1001 (9)", 0, "0000 (0)", 1],
        ["1111 (15)", "0001 (1)", 0, "0000 (0)", 1]
      ]
    }
  },

  "7485": {
    name: "7485",
    marking: "SN7485N",
    title: "4-Bit Magnitude Comparator",
    description: "4-bit magnitude comparator comparing two 4-bit binary words A and B. Includes expansion inputs for cascading multiple stages.",
    package: "DIP-16",
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    pinNames: {
      1: "B3", 2: "IA<B", 3: "IA=B", 4: "IA>B", 5: "OA>B", 6: "OA=B", 7: "OA<B", 8: "GND",
      9: "B0", 10: "A0", 11: "B1", 12: "A1", 13: "A2", 14: "B2", 15: "A3", 16: "VCC"
    },
    inputs: [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15],
    outputs: [5, 6, 7],
    pins: [
      { pin: 1, name: "B3", type: "in" },
      { pin: 2, name: "IA<B", type: "in" },
      { pin: 3, name: "IA=B", type: "in" },
      { pin: 4, name: "IA>B", type: "in" },
      { pin: 5, name: "OA>B", type: "out" },
      { pin: 6, name: "OA=B", type: "out" },
      { pin: 7, name: "OA<B", type: "out" },
      { pin: 8, name: "GND", type: "gnd" },
      { pin: 9, name: "B0", type: "in" },
      { pin: 10, name: "A0", type: "in" },
      { pin: 11, name: "B1", type: "in" },
      { pin: 12, name: "A1", type: "in" },
      { pin: 13, name: "A2", type: "in" },
      { pin: 14, name: "B2", type: "in" },
      { pin: 15, name: "A3", type: "in" },
      { pin: 16, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const a = (get(15) << 3) | (get(13) << 2) | (get(12) << 1) | get(10);
      const b = (get(1) << 3) | (get(14) << 2) | (get(11) << 1) | get(9);
      const iaGt = get(4);
      const iaEq = get(3);
      const iaLt = get(2);

      let oGt = 0, oEq = 0, oLt = 0;
      if (a > b) oGt = 1;
      else if (a < b) oLt = 1;
      else {
        oGt = iaGt;
        oEq = iaEq;
        oLt = iaLt;
      }

      return {
        outputs: { 5: oGt, 6: oEq, 7: oLt },
        nextState: state
      };
    },
    truthTable: {
      headers: ["Condition", "OA>B", "OA=B", "OA<B"],
      rows: [
        ["A > B", 1, 0, 0],
        ["A < B", 0, 0, 1],
        ["A = B (IA=B=1)", 0, 1, 0]
      ]
    }
  },

  "7490": {
    name: "7490",
    marking: "SN74LS90N",
    title: "Decade Counter (÷2 and ÷5)",
    description: "Decade counter containing four master-slave flip-flops configured as a divide-by-2 section (CLKA on Pin 14 -> QA on Pin 12) and a divide-by-5 section (CLKB on Pin 1 -> QB on Pin 9, QC on Pin 8, QD on Pin 11). Pins 4 and 13 are No-Connect (NC). Resets: R0(1)&R0(2) reset to 0000; R9(1)&R9(2) set to 1001 with priority. FALLING-edge triggered.",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 5,
    gndPin: 10,
    pinNames: {
      1: "CLKB", 2: "R0(1)", 3: "R0(2)", 4: "NC", 5: "VCC", 6: "R9(1)", 7: "R9(2)",
      8: "QC", 9: "QB", 10: "GND", 11: "QD", 12: "QA", 13: "NC", 14: "CLKA"
    },
    inputs: [1, 2, 3, 6, 7, 14],
    outputs: [8, 9, 11, 12],
    pins: [
      { pin: 1, name: "CLKB", type: "in" },
      { pin: 2, name: "R0(1)", type: "in" },
      { pin: 3, name: "R0(2)", type: "in" },
      { pin: 4, name: "NC", type: "nc" },
      { pin: 5, name: "VCC", type: "pwr" },
      { pin: 6, name: "R9(1)", type: "in" },
      { pin: 7, name: "R9(2)", type: "in" },
      { pin: 8, name: "QC", type: "out" },
      { pin: 9, name: "QB", type: "out" },
      { pin: 10, name: "GND", type: "gnd" },
      { pin: 11, name: "QD", type: "out" },
      { pin: 12, name: "QA", type: "out" },
      { pin: 13, name: "NC", type: "nc" },
      { pin: 14, name: "CLKA", type: "in" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const s = state || { qa: 0, bcd: 0, lastCkA: 1, lastCkB: 1, history: [] };
      const curCkA = get(14);
      const curCkB = get(1);

      let qa = s.qa;
      let bcd = s.bcd; // 0..4 for ÷5 sequence: 000, 001, 010, 011, 100

      // Falling-edge trigger on CLKA (÷2)
      if (s.lastCkA === 1 && curCkA === 0) {
        qa = qa === 0 ? 1 : 0;
      }

      // Falling-edge trigger on CLKB (÷5)
      if (s.lastCkB === 1 && curCkB === 0) {
        bcd = (bcd + 1) % 5;
      }

      // Asynchronous Resets: R9 has priority over R0!
      if (get(6) === 1 && get(7) === 1) {
        qa = 1;
        bcd = 4; // QD=1, QC=0, QB=0 -> 1001 (BCD 9)
      } else if (get(2) === 1 && get(3) === 1) {
        qa = 0;
        bcd = 0; // QD=0, QC=0, QB=0 -> 0000
      }

      // Output mapping for ÷5 sequence (000 -> 001 -> 010 -> 011 -> 100)
      const qb = bcd & 1;
      const qc = (bcd >> 1) & 1;
      const qd = (bcd >> 2) & 1;

      // Timing diagram capture: record last 32 transitions of CLKA, QA, QB, QC, QD
      const history = s.history ? [...s.history] : [];
      const lastEntry = history.length > 0 ? history[history.length - 1] : null;
      if (!lastEntry || lastEntry.clk !== curCkA || lastEntry.qa !== qa || lastEntry.qb !== qb || lastEntry.qc !== qc || lastEntry.qd !== qd) {
        history.push({ clk: curCkA, qa, qb, qc, qd, time: Date.now() });
        if (history.length > 32) history.shift();
      }

      return {
        outputs: { 12: qa, 9: qb, 8: qc, 11: qd },
        nextState: { qa, bcd, lastCkA: curCkA, lastCkB: curCkB, history }
      };
    },
    truthTable: {
      headers: ["Count", "QD", "QC", "QB", "QA"],
      rows: [
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [2, 0, 0, 1, 0],
        [3, 0, 0, 1, 1],
        [4, 0, 1, 0, 0],
        [5, 0, 1, 0, 1],
        [6, 0, 1, 1, 0],
        [7, 0, 1, 1, 1],
        [8, 1, 0, 0, 0],
        [9, 1, 0, 0, 1]
      ]
    }
  },

  "7493": {
    name: "7493",
    marking: "SN7493N",
    title: "4-Bit Binary Counter",
    description: "4-bit binary counter containing four master-slave flip-flops configured as a divide-by-2 section (CKA) and a divide-by-8 section (CKB).",
    package: "DIP-14",
    pinCount: 14,
    vccPin: 5,
    gndPin: 10,
    pinNames: {
      1: "CKB", 2: "R0(1)", 3: "R0(2)", 4: "NC", 5: "VCC", 6: "NC", 7: "NC",
      8: "QD", 9: "QB", 10: "GND", 11: "QC", 12: "QA", 13: "NC", 14: "CKA"
    },
    inputs: [1, 2, 3, 14],
    outputs: [8, 9, 11, 12],
    pins: [
      { pin: 1, name: "CKB", type: "in" },
      { pin: 2, name: "R0(1)", type: "in" },
      { pin: 3, name: "R0(2)", type: "in" },
      { pin: 4, name: "NC", type: "nc" },
      { pin: 5, name: "VCC", type: "pwr" },
      { pin: 6, name: "NC", type: "nc" },
      { pin: 7, name: "NC", type: "nc" },
      { pin: 8, name: "QD", type: "out" },
      { pin: 9, name: "QB", type: "out" },
      { pin: 10, name: "GND", type: "gnd" },
      { pin: 11, name: "QC", type: "out" },
      { pin: 12, name: "QA", type: "out" },
      { pin: 13, name: "NC", type: "nc" },
      { pin: 14, name: "CKA", type: "in" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const s = state || { qa: 0, qbcd: 0, lastCkA: 1, lastCkB: 1 };
      const curCkA = get(14);
      const curCkB = get(1);

      let qa = s.qa;
      let qbcd = s.qbcd;

      // CKA negative edge
      if (s.lastCkA === 1 && curCkA === 0) {
        qa = qa === 0 ? 1 : 0;
      }
      // CKB negative edge (modulo 8)
      if (s.lastCkB === 1 && curCkB === 0) {
        qbcd = (qbcd + 1) & 7;
      }

      // Reset
      if (get(2) === 1 && get(3) === 1) {
        qa = 0; qbcd = 0;
      }

      const qb = qbcd & 1;
      const qc = (qbcd >> 1) & 1;
      const qd = (qbcd >> 2) & 1;

      return {
        outputs: { 12: qa, 9: qb, 11: qc, 8: qd },
        nextState: { qa, qbcd, lastCkA: curCkA, lastCkB: curCkB }
      };
    },
    truthTable: {
      headers: ["Count (0..15)", "QD", "QC", "QB", "QA"],
      rows: [
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [2, 0, 0, 1, 0],
        [3, 0, 0, 1, 1],
        [7, 0, 1, 1, 1],
        [15, 1, 1, 1, 1]
      ]
    }
  },

  "74191": {
    name: "74191",
    marking: "SN74191N",
    title: "Synchronous 4-Bit Up/Down Binary Counter",
    description: "Synchronous reversible up/down 4-bit binary counter with preset capability and cascading ripple clock outputs.",
    package: "DIP-16",
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    pinNames: {
      1: "B", 2: "QB", 3: "QA", 4: "ENABLE'", 5: "D/U'", 6: "QC", 7: "QD", 8: "GND",
      9: "D", 10: "C", 11: "LOAD'", 12: "MAX/MIN", 13: "RCO'", 14: "CLOCK", 15: "A", 16: "VCC"
    },
    inputs: [1, 4, 5, 9, 10, 11, 14, 15],
    outputs: [2, 3, 6, 7, 12, 13],
    pins: [
      { pin: 1, name: "B", type: "in" },
      { pin: 2, name: "QB", type: "out" },
      { pin: 3, name: "QA", type: "out" },
      { pin: 4, name: "ENABLE'", type: "in" },
      { pin: 5, name: "D/U'", type: "in" },
      { pin: 6, name: "QC", type: "out" },
      { pin: 7, name: "QD", type: "out" },
      { pin: 8, name: "GND", type: "gnd" },
      { pin: 9, name: "D", type: "in" },
      { pin: 10, name: "C", type: "in" },
      { pin: 11, name: "LOAD'", type: "in" },
      { pin: 12, name: "MAX/MIN", type: "out" },
      { pin: 13, name: "RCO'", type: "out" },
      { pin: 14, name: "CLOCK", type: "in" },
      { pin: 15, name: "A", type: "in" },
      { pin: 16, name: "VCC", type: "pwr" }
    ],
    eval: (inMap, state) => {
      const get = (pin) => (inMap[pin] === undefined ? 1 : inMap[pin]);
      const s = state || { count: 0, lastClk: 0 };
      const curClk = get(14);
      let count = s.count;

      const load = get(11);
      const en = get(4);
      const downUp = get(5); // 0 = UP, 1 = DOWN

      if (load === 0) {
        // Asynchronous parallel load
        count = (get(9) << 3) | (get(10) << 2) | (get(1) << 1) | get(15);
      } else if (s.lastClk === 0 && curClk === 1) {
        // Rising edge clock
        if (en === 0) {
          if (downUp === 0) {
            count = (count + 1) & 0x0F;
          } else {
            count = (count - 1 + 16) & 0x0F;
          }
        }
      }

      const qa = count & 1;
      const qb = (count >> 1) & 1;
      const qc = (count >> 2) & 1;
      const qd = (count >> 3) & 1;

      const maxMin = ((downUp === 0 && count === 15) || (downUp === 1 && count === 0)) ? 1 : 0;
      const rco = (maxMin === 1 && curClk === 0 && en === 0) ? 0 : 1;

      return {
        outputs: { 3: qa, 2: qb, 6: qc, 7: qd, 12: maxMin, 13: rco },
        nextState: { count, lastClk: curClk }
      };
    },
    truthTable: {
      headers: ["D/U'", "ENABLE'", "CLOCK", "Function"],
      rows: [
        ["X", "X", "Load'=0", "Parallel Load A,B,C,D"],
        [0, 0, "Rise", "Count Up"],
        [1, 0, "Rise", "Count Down"],
        ["X", 1, "Rise", "Hold / Inhibit Count"]
      ]
    }
  }
};

// Aliases for standard part numbering
IC_LIBRARY["74LS153"] = IC_LIBRARY["74153"];
IC_LIBRARY["74LS138"] = IC_LIBRARY["74138"];
IC_LIBRARY["74LS83"] = IC_LIBRARY["7483"];
IC_LIBRARY["74LS90"] = IC_LIBRARY["7490"];
IC_LIBRARY["74LS74"] = IC_LIBRARY["7474"];

if (typeof window !== "undefined") {
  window.IC_LIBRARY = IC_LIBRARY;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { IC_LIBRARY };
}
