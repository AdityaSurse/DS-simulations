/* ===== DATA: EXPERIMENTS ===== */
const EXPERIMENTS = [
  {
    id: "exp1",
    number: 1,
    title: "Study of Logic Gates",
    aim: "To study basic logic gates (NOT, AND, OR, NAND, NOR, XOR, 4-in NAND) and verify their truth tables on the trainer kit.",
    apparatus: "DIT 9005 Trainer Kit, IC 7408 (AND), IC 7432 (OR), IC 7404 (NOT), IC 7400 (NAND), IC 7402 (NOR), IC 7486 (XOR), IC 7420 (Dual 4-in NAND), Patch cords.",
    theory: "Logic gates are the fundamental building blocks of digital electronic circuits. Logic levels correspond to binary 1 (+5V TTL HIGH) and binary 0 (0V/GND TTL LOW). In standard TTL, an unconnected (floating) input naturally floats to Logic 1.",
    subGates: {
      "7408": {
        id: "7408",
        name: "7408",
        label: "7408 (AND)",
        title: "Quad 2-Input AND Gate",
        chip: "7408",
        stepByStep: [
          "1. Insert IC 7408 (AND) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Connect Switch IN.A0 to Gate 1 input 1A (pin 1 / J1).",
          "4. Connect Switch IN.A1 to Gate 1 input 1B (pin 2 / J2).",
          "5. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 3 / J3).",
          "6. Sweep switches A0 and A1 (00, 01, 10, 11) and verify LED Y0."
        ],
        recommendedSocketICs: { U1: "7408" },
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        tableHeaders: ["Switch A1 (1B)", "Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
        ]
      },
      "7432": {
        id: "7432",
        name: "7432",
        label: "7432 (OR)",
        title: "Quad 2-Input OR Gate",
        chip: "7432",
        stepByStep: [
          "1. Insert IC 7432 (OR) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Connect Switch IN.A0 to Gate 1 input 1A (pin 1 / J1).",
          "4. Connect Switch IN.A1 to Gate 1 input 1B (pin 2 / J2).",
          "5. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 3 / J3).",
          "6. Sweep switches A0 and A1 (00, 01, 10, 11) and verify LED Y0."
        ],
        recommendedSocketICs: { U1: "7432" },
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        tableHeaders: ["Switch A1 (1B)", "Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
        ]
      },
      "7404": {
        id: "7404",
        name: "7404",
        label: "7404 (NOT)",
        title: "Hex Inverter",
        chip: "7404",
        stepByStep: [
          "1. Insert IC 7404 (NOT) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Connect Switch IN.A0 to Inverter 1 input 1A (pin 1 / J1).",
          "4. Connect Output OUT.Y0 to Inverter 1 output 1Y (pin 2 / J2).",
          "5. Toggle switch A0 (0, 1) and verify LED Y0 inverted output."
        ],
        recommendedSocketICs: { U1: "7404" },
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "U1.J2", to: "OUT.Y0", color: "#10b981" }
        ],
        tableHeaders: ["Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
        ]
      },
      "7400": {
        id: "7400",
        name: "7400",
        label: "7400 (NAND)",
        title: "Quad 2-Input NAND Gate",
        chip: "7400",
        stepByStep: [
          "1. Insert IC 7400 (NAND) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Connect Switch IN.A0 to Gate 1 input 1A (pin 1 / J1).",
          "4. Connect Switch IN.A1 to Gate 1 input 1B (pin 2 / J2).",
          "5. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 3 / J3).",
          "6. Sweep switches A0 and A1 (00, 01, 10, 11) and verify LED Y0."
        ],
        recommendedSocketICs: { U1: "7400" },
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        tableHeaders: ["Switch A1 (1B)", "Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
        ]
      },
      "7402": {
        id: "7402",
        name: "7402",
        label: "7402 (NOR)",
        title: "Quad 2-Input NOR Gate",
        chip: "7402",
        stepByStep: [
          "1. Insert IC 7402 (NOR) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Note NOR pinout reversal: Output 1Y is pin 1 (J1), Inputs 1A and 1B are pins 2 (J2) and 3 (J3).",
          "4. Connect Switch IN.A0 to input 1A (pin 2 / J2).",
          "5. Connect Switch IN.A1 to input 1B (pin 3 / J3).",
          "6. Connect Output OUT.Y0 to output 1Y (pin 1 / J1).",
          "7. Sweep switches A0 and A1 (00, 01, 10, 11) and verify LED Y0."
        ],
        recommendedSocketICs: { U1: "7402" },
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J3", color: "#3b82f6" },
          { from: "U1.J1", to: "OUT.Y0", color: "#10b981" }
        ],
        tableHeaders: ["Switch A1 (1B)", "Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
        ]
      },
      "7486": {
        id: "7486",
        name: "7486",
        label: "7486 (XOR)",
        title: "Quad 2-Input Exclusive-OR (XOR) Gate",
        chip: "7486",
        stepByStep: [
          "1. Insert IC 7486 (XOR) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Connect Switch IN.A0 to Gate 1 input 1A (pin 1 / J1).",
          "4. Connect Switch IN.A1 to Gate 1 input 1B (pin 2 / J2).",
          "5. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 3 / J3).",
          "6. Sweep switches A0 and A1 (00, 01, 10, 11) and verify LED Y0."
        ],
        recommendedSocketICs: { U1: "7486" },
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        tableHeaders: ["Switch A1 (1B)", "Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
        ]
      },
      "7420": {
        id: "7420",
        name: "7420",
        label: "7420 (4-NAND)",
        title: "Dual 4-Input NAND Gate",
        chip: "7420",
        stepByStep: [
          "1. Insert IC 7420 (Dual 4-in NAND) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Connect switches to Gate 1 inputs: IN.A0 to 1A (pin 1 / J1), IN.A1 to 1B (pin 2 / J2), IN.A2 to 1C (pin 4 / J4), IN.A3 to 1D (pin 5 / J5). (Pin 3 is NC).",
          "4. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 6 / J6).",
          "5. Verify that output Y0 is LOW (0) only when all 4 inputs A0..A3 are HIGH (1)."
        ],
        recommendedSocketICs: { U1: "7420" },
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "IN.A2", to: "U1.J4", color: "#10b981" },
          { from: "IN.A3", to: "U1.J5", color: "#f8fafc" },
          { from: "U1.J6", to: "OUT.Y0", color: "#f59e0b" }
        ],
        tableHeaders: ["A3 (1D)", "A2 (1C)", "A1 (1B)", "A0 (1A)", "Expected Output (Y0)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
        ]
      }
    },
    recommendedSocketICs: { U1: "7408" },
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
      { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
      { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
    ],
    tableHeaders: ["Switch A1 (1B)", "Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
    tableRows: [
      { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
    ]
  },

{
    id: "exp3",
    number: 3,
    title: "Multiplexer using IC 74153",
    aim: "Study of IC 74LS153 as a 4:1 Multiplexer and implement logic functions.",
    apparatus: "DIT 9005 Trainer Kit, IC 74153 (Dual 4:1 Mux), Patch cords.",
    theory: "A Multiplexer (Data Selector) selects one of several input data lines and forwards it to a single output line based on select lines. For a 4:1 Mux, 2 select lines S1 (B) and S0 (A) select between data inputs C0, C1, C2, and C3 when active-low strobe 1G' is 0.",
    stepByStep: [
      "1. Insert IC 74153 into ZIF socket U1 and lock the lever.",
      "2. Connect +5V to U1 pin 16 (socket jack 20 for 16-pin IC) and GND to pin 8 (socket jack 8).",
      "3. Ground strobe 1G' (IC pin 1 -> socket jack 1) to enable Mux 1.",
      "4. Connect select switches: IN.A0 to IC pin 14 (A / socket jack 18) and IN.A1 to IC pin 2 (B / socket jack 2).",
      "5. Connect data inputs: IN.B0 to 1C0 (IC pin 6 / J6), IN.B1 to 1C1 (IC pin 5 / J5), IN.B2 to 1C2 (IC pin 4 / J4), IN.B3 to 1C3 (IC pin 3 / J3).",
      "6. Connect Mux 1 output 1Y (IC pin 7 / J7) to OUT.Y0.",
      "7. Change select lines A1,A0 and verify which data input is routed to Y0."
    ],
    recommendedSocketICs: { U1: "74153" },
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1f2937" },
      { from: "PWR.GND_2", to: "U1.J1", color: "#1f2937" },
      { from: "IN.A0", to: "U1.J18", color: "#facc15" },
      { from: "IN.A1", to: "U1.J2", color: "#facc15" },
      { from: "IN.B0", to: "U1.J6", color: "#22c55e" },
      { from: "IN.B1", to: "U1.J5", color: "#22c55e" },
      { from: "IN.B2", to: "U1.J4", color: "#22c55e" },
      { from: "IN.B3", to: "U1.J3", color: "#22c55e" },
      { from: "U1.J7", to: "OUT.Y0", color: "#38bdf8" }
    ],
    tableHeaders: ["Strobe 1G'", "Select B (A1)", "Select A (A0)", "Selected Input", "Output Y0"],
    tableRows: [
      { inputs: { "IN.A1": 0, "IN.A0": 0, "IN.B0": 1, "IN.B1": 0, "IN.B2": 0, "IN.B3": 0 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A1": 0, "IN.A0": 1, "IN.B0": 0, "IN.B1": 1, "IN.B2": 0, "IN.B3": 0 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A1": 1, "IN.A0": 0, "IN.B0": 0, "IN.B1": 0, "IN.B2": 1, "IN.B3": 0 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A1": 1, "IN.A0": 1, "IN.B0": 0, "IN.B1": 0, "IN.B2": 0, "IN.B3": 1 }, expected: { "OUT.Y0": 1 } }
    ]
  },

  {
    id: "exp4",
    number: 4,
    title: "Demultiplexer / Decoder using IC 74138",
    aim: "Study of IC 74LS138 as a 3-to-8 Line Decoder and Demultiplexer.",
    apparatus: "DIT 9005 Trainer Kit, IC 74138, Patch cords.",
    theory: "IC 74138 decodes a 3-bit binary address into one of 8 active-low outputs Y0'..Y7'. Enable conditions: G1 = 1, G2A' = 0, G2B' = 0. When enabled, exactly one selected output goes LOW (0), while all others stay HIGH (1).",
    stepByStep: [
      "1. Insert IC 74138 into socket U1.",
      "2. Connect +5V to U1 pin 16 (jack 20) and GND to pin 8 (jack 8).",
      "3. Enable inputs: connect G1 (IC pin 6 / J6) to +5V, G2A' (IC pin 4 / J4) and G2B' (IC pin 5 / J5) to GND.",
      "4. Connect select switches: IN.A0 to A (IC pin 1 / J1), IN.A1 to B (IC pin 2 / J2), IN.A2 to C (IC pin 3 / J3).",
      "5. Connect outputs: Y0' (IC pin 15 / J19) to OUT.Y0, Y1' (IC pin 14 / J18) to OUT.Y1, etc.",
      "6. Observe which output LED goes LOW (off) for each 3-bit input."
    ],
    recommendedSocketICs: { U1: "74138" },
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1f2937" },
      { from: "PWR.5V_2", to: "U1.J6", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J4", color: "#1f2937" },
      { from: "PWR.GND_3", to: "U1.J5", color: "#1f2937" },
      { from: "IN.A0", to: "U1.J1", color: "#facc15" },
      { from: "IN.A1", to: "U1.J2", color: "#facc15" },
      { from: "IN.A2", to: "U1.J3", color: "#facc15" },
      { from: "U1.J19", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J18", to: "OUT.Y1", color: "#38bdf8" }
    ],
    tableHeaders: ["C (A2)", "B (A1)", "A (A0)", "Active Output (LOW)", "Y0'", "Y1'"],
    tableRows: [
      { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
      { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } }
    ]
  },

  {
    id: "exp5",
    number: 5,
    title: "Binary Adder & Subtractor using IC 7483",
    aim: "Study of IC 74LS83 4-bit binary adder to perform addition and 2's complement subtraction.",
    apparatus: "DIT 9005 Trainer Kit, IC 7483, IC 7486 (XOR for 2's complement), Patch cords.",
    theory: "IC 7483 adds two 4-bit binary words A[4:1] and B[4:1] plus carry-in C0, generating sum S[4:1] and carry-out C4. Note: On 7483, VCC is pin 5 and GND is pin 12.",
    stepByStep: [
      "1. Insert IC 7483 into socket U1.",
      "2. Connect +5V to IC pin 5 (socket jack J5) and GND to pin 12 (socket jack J16).",
      "3. Connect carry in C0 (IC pin 13 / socket jack J17) to GND for addition.",
      "4. Connect A bits: IN.A0 to A1 (IC pin 10 / J14), IN.A1 to A2 (IC pin 8 / J8), IN.A2 to A3 (IC pin 3 / J3), IN.A3 to A4 (IC pin 1 / J1).",
      "5. Connect B bits: IN.B0 to B1 (IC pin 11 / J15), IN.B1 to B2 (IC pin 7 / J7), IN.B2 to B3 (IC pin 4 / J4), IN.B3 to B4 (IC pin 16 / J20).",
      "6. Connect sum bits: S1 (pin 9 / J13) to OUT.Y0, S2 (pin 6 / J6) to OUT.Y1, S3 (pin 2 / J2) to OUT.Y2, S4 (pin 15 / J19) to OUT.Y3, and C4 (pin 14 / J18) to OUT.Y4.",
      "7. Observe the sum on LEDs and on the right 7-segment display."
    ],
    recommendedSocketICs: { U1: "7483" },
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1f2937" },
      { from: "PWR.GND_2", to: "U1.J17", color: "#1f2937" },
      { from: "IN.A0", to: "U1.J14", color: "#facc15" },
      { from: "IN.B0", to: "U1.J15", color: "#22c55e" },
      { from: "U1.J13", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" }
    ],
    tableHeaders: ["A Word", "B Word", "Cin", "Expected Sum", "Cout"],
    tableRows: [
      { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A0": 1, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } }
    ]
  },

  {
    id: "exp6",
    number: 6,
    title: "Magnitude Comparator using IC 7485",
    aim: "Study of IC 74LS85 4-bit magnitude comparator.",
    apparatus: "DIT 9005 Trainer Kit, IC 7485, Patch cords.",
    theory: "IC 7485 compares two 4-bit numbers A and B and outputs active HIGH on one of three pins: OA>B (pin 5), OA=B (pin 6), or OA<B (pin 7). Cascading inputs are tied to IA=B = 1, IA>B = 0, IA<B = 0.",
    stepByStep: [
      "1. Insert IC 7485 into socket U1.",
      "2. Connect +5V to IC pin 16 (J20) and GND to pin 8 (J8).",
      "3. Tie IA=B (IC pin 3 / J3) to +5V, IA>B (pin 4 / J4) to GND, IA<B (pin 2 / J2) to GND.",
      "4. Connect A words to switches IN.A0..A3, B words to IN.B0..B3.",
      "5. Connect OA>B (J5) to OUT.Y0, OA=B (J6) to OUT.Y1, OA<B (J7) to OUT.Y2.",
      "6. Test cases: A > B, A < B, and A == B."
    ],
    recommendedSocketICs: { U1: "7485" },
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1f2937" },
      { from: "PWR.5V_2", to: "U1.J3", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J4", color: "#1f2937" },
      { from: "PWR.GND_3", to: "U1.J2", color: "#1f2937" },
      { from: "U1.J5", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J7", to: "OUT.Y2", color: "#38bdf8" }
    ],
    tableHeaders: ["Condition", "A3..A0", "B3..B0", "A > B (Y0)", "A = B (Y1)", "A < B (Y2)"],
    tableRows: [
      { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0, "OUT.Y2": 0 } },
      { inputs: { "IN.A0": 0, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0, "OUT.Y2": 1 } },
      { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1, "OUT.Y2": 0 } }
    ]
  },

  {
    id: "exp7",
    number: 7,
    title: "Asynchronous Counter using IC 7490",
    aim: "Study of IC 7490 decade counter for MOD-6 and MOD-10 counting.",
    apparatus: "DIT 9005 Trainer Kit, IC 7490, Clock generator, Patch cords.",
    theory: "IC 7490 is a decade counter consisting of a divide-by-2 section (CKA -> QA) and a divide-by-5 section (CKB -> QB, QC, QD). Connecting QA to CKB creates a BCD counter (MOD-10) cycling 0 to 9.",
    stepByStep: [
      "1. Insert IC 7490 into socket U1.",
      "2. Connect +5V to IC pin 5 (socket jack J5) and GND to pin 10 (socket jack J16).",
      "3. Connect reset pins R0(1) (J2) and R0(2) (J3) to GND.",
      "4. Connect QA (IC pin 12 / J18) to CKB (IC pin 1 / J1) to configure BCD decade counting.",
      "5. Connect Clock Out (CLK.POS) to CKA (IC pin 14 / J20).",
      "6. Connect QA (J18) to OUT.Y0, QB (J15) to OUT.Y1, QC (J14) to OUT.Y2, QD (J17) to OUT.Y3.",
      "7. Turn Clock knob to 1Hz or 5Hz and watch the 7-segment display count 0 to 9!"
    ],
    recommendedSocketICs: { U1: "7490" },
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1f2937" },
      { from: "PWR.GND_2", to: "U1.J2", color: "#1f2937" },
      { from: "PWR.GND_3", to: "U1.J3", color: "#1f2937" },
      { from: "U1.J18", to: "U1.J1", color: "#22c55e" },
      { from: "CLK.POS", to: "U1.J20", color: "#facc15" },
      { from: "U1.J18", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J14", to: "OUT.Y2", color: "#38bdf8" },
      { from: "U1.J17", to: "OUT.Y3", color: "#38bdf8" }
    ],
    tableHeaders: ["Clock Pulse", "QD", "QC", "QB", "QA", "Decimal Digit"],
    tableRows: [
      { inputs: {}, expected: {} }
    ]
  },

  {
    id: "exp8",
    number: 8,
    title: "Synchronous Up/Down Counter using IC 74191",
    aim: "Study of IC 74191 synchronous 4-bit up/down counter.",
    apparatus: "DIT 9005 Trainer Kit, IC 74191, Clock / Pulser, Patch cords.",
    theory: "IC 74191 is a synchronous 4-bit binary up/down counter. When ENABLE' = 0 and LOAD' = 1, a rising clock edge counts UP if D/U' = 0, or counts DOWN if D/U' = 1.",
    stepByStep: [
      "1. Insert IC 74191 into socket U1.",
      "2. Connect +5V to IC pin 16 (J20) and GND to pin 8 (J8).",
      "3. Connect LOAD' (IC pin 11 / J15) to +5V (disabled).",
      "4. Connect ENABLE' (IC pin 4 / J4) to GND (active).",
      "5. Connect D/U' (IC pin 5 / J5) to switch IN.A0 (0=UP, 1=DOWN).",
      "6. Connect CLOCK (IC pin 14 / J18) to Manual Pulser 1 Q (PULSE1.Q) or CLK.OUT.",
      "7. Connect outputs QA..QD to OUT.Y0..Y3 and observe count on 7-segment display."
    ],
    recommendedSocketICs: { U1: "74191" },
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1f2937" },
      { from: "PWR.5V_2", to: "U1.J15", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J4", color: "#1f2937" },
      { from: "IN.A0", to: "U1.J5", color: "#facc15" },
      { from: "PULSE1.Q", to: "U1.J18", color: "#facc15" },
      { from: "U1.J3", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J2", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y2", color: "#38bdf8" },
      { from: "U1.J7", to: "OUT.Y3", color: "#38bdf8" }
    ],
    tableHeaders: ["Direction D/U'", "Clock Trigger", "Counting Mode", "7-Seg Display"],
    tableRows: [
      { inputs: { "IN.A0": 0 }, expected: {} },
      { inputs: { "IN.A0": 1 }, expected: {} }
    ]
  }
];
if (typeof window !== "undefined") {
  window.EXPERIMENTS = EXPERIMENTS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { EXPERIMENTS };
}
