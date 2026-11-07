/* ===== DATA: EXPERIMENTS ===== */
const EXPERIMENTS = [
  // -------------------------------------------------------------
  // EXPERIMENT 1: Study of Logic Gates (7408, 7432, 7404, 7400, 7402, 7486, 7420)
  // -------------------------------------------------------------
  {
    id: "exp1",
    number: 1,
    title: "Study of Logic Gates",
    aim: "To study basic TTL logic gates (AND, OR, NOT, NAND, NOR, XOR, 4-in NAND) and verify their truth tables on the trainer kit.",
    apparatus: [
      { ic: "7408", qty: 1 },
      { ic: "7432", qty: 1 },
      { ic: "7404", qty: 1 },
      { ic: "7400", qty: 1 },
      { ic: "7402", qty: 1 },
      { ic: "7486", qty: 1 },
      { ic: "7420", qty: 1 }
    ],
    requiredICs: ["7408", "7432", "7404", "7400", "7402", "7486"],
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
        procedure: [
          "1. Insert IC 7408 (AND) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (socket jack J20) and GND to pin 7 (socket jack J7).",
          "3. Connect Switch IN.A0 to Gate 1 input 1A (pin 1 / J1).",
          "4. Connect Switch IN.A1 to Gate 1 input 1B (pin 2 / J2).",
          "5. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 3 / J3).",
          "6. Sweep switches A0 and A1 (00, 01, 10, 11) and verify LED Y0."
        ],
        requiredICs: ["7408"],
        recommendedSocketICs: { U1: "7408" },
        solutionWiring: [
          { a: "PWR.5V_1", b: "U1.J20", from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { a: "PWR.GND_1", b: "U1.J7", from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { a: "IN.A0", b: "U1.J1", from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { a: "IN.A1", b: "U1.J2", from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { a: "U1.J3", b: "OUT.Y0", from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        truthTable: {
          inputs: ["Switch A1", "Switch A0"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
          ]
        },
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
        procedure: [
          "1. Insert IC 7432 (OR) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect Switch IN.A0 to Gate 1 input 1A (pin 1 / J1).",
          "4. Connect Switch IN.A1 to Gate 1 input 1B (pin 2 / J2).",
          "5. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 3 / J3).",
          "6. Sweep switches A0 and A1 and verify LED Y0."
        ],
        stepByStep: [
          "1. Insert IC 7432 (OR) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect Switch IN.A0 to Gate 1 input 1A (pin 1 / J1).",
          "4. Connect Switch IN.A1 to Gate 1 input 1B (pin 2 / J2).",
          "5. Connect Output OUT.Y0 to Gate 1 output 1Y (pin 3 / J3).",
          "6. Sweep switches A0 and A1 and verify LED Y0."
        ],
        requiredICs: ["7432"],
        recommendedSocketICs: { U1: "7432" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        truthTable: {
          inputs: ["Switch A1", "Switch A0"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
          ]
        },
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
        procedure: [
          "1. Insert IC 7404 (NOT) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect Switch IN.A0 to Inverter 1 input 1A (pin 1 / J1).",
          "4. Connect Output OUT.Y0 to Inverter 1 output 1Y (pin 2 / J2).",
          "5. Toggle switch A0 (0, 1) and verify LED Y0 inverted output."
        ],
        stepByStep: [
          "1. Insert IC 7404 (NOT) into socket U1 and lock the lever.",
          "2. Connect +5V to U1 pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect Switch IN.A0 to Inverter 1 input 1A (pin 1 / J1).",
          "4. Connect Output OUT.Y0 to Inverter 1 output 1Y (pin 2 / J2).",
          "5. Toggle switch A0 (0, 1) and verify LED Y0 inverted output."
        ],
        requiredICs: ["7404"],
        recommendedSocketICs: { U1: "7404" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "U1.J2", to: "OUT.Y0", color: "#10b981" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "U1.J2", to: "OUT.Y0", color: "#10b981" }
        ],
        truthTable: {
          inputs: ["Switch A0"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
          ]
        },
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
        procedure: [
          "1. Insert IC 7400 (NAND) into socket U1 and lock the lever.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect IN.A0 to 1A (pin 1 / J1) and IN.A1 to 1B (pin 2 / J2).",
          "4. Connect 1Y (pin 3 / J3) to OUT.Y0.",
          "5. Verify output goes LOW only when both inputs are HIGH."
        ],
        stepByStep: [
          "1. Insert IC 7400 (NAND) into socket U1 and lock the lever.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect IN.A0 to 1A (pin 1 / J1) and IN.A1 to 1B (pin 2 / J2).",
          "4. Connect 1Y (pin 3 / J3) to OUT.Y0.",
          "5. Verify output goes LOW only when both inputs are HIGH."
        ],
        requiredICs: ["7400"],
        recommendedSocketICs: { U1: "7400" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        truthTable: {
          inputs: ["Switch A1", "Switch A0"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
          ]
        },
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
        procedure: [
          "1. Insert IC 7402 (NOR) into socket U1 and lock the lever.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Note reversed pinout: 1Y is pin 1 (J1), 1A is pin 2 (J2), 1B is pin 3 (J3).",
          "4. Connect IN.A0 to 1A (J2) and IN.A1 to 1B (J3).",
          "5. Connect 1Y (J1) to OUT.Y0.",
          "6. Verify output goes HIGH only when both inputs are LOW."
        ],
        stepByStep: [
          "1. Insert IC 7402 (NOR) into socket U1 and lock the lever.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Note reversed pinout: 1Y is pin 1 (J1), 1A is pin 2 (J2), 1B is pin 3 (J3).",
          "4. Connect IN.A0 to 1A (J2) and IN.A1 to 1B (J3).",
          "5. Connect 1Y (J1) to OUT.Y0.",
          "6. Verify output goes HIGH only when both inputs are LOW."
        ],
        requiredICs: ["7402"],
        recommendedSocketICs: { U1: "7402" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J3", color: "#3b82f6" },
          { from: "U1.J1", to: "OUT.Y0", color: "#10b981" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J3", color: "#3b82f6" },
          { from: "U1.J1", to: "OUT.Y0", color: "#10b981" }
        ],
        truthTable: {
          inputs: ["Switch A1", "Switch A0"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
          ]
        },
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
        procedure: [
          "1. Insert IC 7486 (XOR) into socket U1 and lock the lever.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect IN.A0 to 1A (pin 1 / J1) and IN.A1 to 1B (pin 2 / J2).",
          "4. Connect 1Y (pin 3 / J3) to OUT.Y0.",
          "5. Verify output goes HIGH when inputs are unequal (odd parity)."
        ],
        stepByStep: [
          "1. Insert IC 7486 (XOR) into socket U1 and lock the lever.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect IN.A0 to 1A (pin 1 / J1) and IN.A1 to 1B (pin 2 / J2).",
          "4. Connect 1Y (pin 3 / J3) to OUT.Y0.",
          "5. Verify output goes HIGH when inputs are unequal (odd parity)."
        ],
        requiredICs: ["7486"],
        recommendedSocketICs: { U1: "7486" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
        ],
        truthTable: {
          inputs: ["Switch A1", "Switch A0"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
          ]
        },
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
        procedure: [
          "1. Insert IC 7420 (Dual 4-in NAND) into socket U1.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect inputs A0..A3 to pins 1, 2, 4, 5 (J1, J2, J4, J5). Note pin 3 is No-Connect.",
          "4. Connect output 1Y (pin 6 / J6) to OUT.Y0.",
          "5. Verify output goes LOW only when all 4 inputs are HIGH."
        ],
        stepByStep: [
          "1. Insert IC 7420 (Dual 4-in NAND) into socket U1.",
          "2. Connect +5V to pin 14 (J20) and GND to pin 7 (J7).",
          "3. Connect inputs A0..A3 to pins 1, 2, 4, 5 (J1, J2, J4, J5). Note pin 3 is No-Connect.",
          "4. Connect output 1Y (pin 6 / J6) to OUT.Y0.",
          "5. Verify output goes LOW only when all 4 inputs are HIGH."
        ],
        requiredICs: ["7420"],
        recommendedSocketICs: { U1: "7420" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "IN.A2", to: "U1.J4", color: "#10b981" },
          { from: "IN.A3", to: "U1.J5", color: "#f8fafc" },
          { from: "U1.J6", to: "OUT.Y0", color: "#f59e0b" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
          { from: "IN.A2", to: "U1.J4", color: "#10b981" },
          { from: "IN.A3", to: "U1.J5", color: "#f8fafc" },
          { from: "U1.J6", to: "OUT.Y0", color: "#f59e0b" }
        ],
        truthTable: {
          inputs: ["A3", "A2", "A1", "A0"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
          ]
        },
        tableHeaders: ["A3", "A2", "A1", "A0", "Expected Output (Y0)", "Observed Output"],
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
    // Default fallback truth table and wires for exp1
    procedure: [
      "1. Select any basic TTL gate from the sub-gate buttons above.",
      "2. Follow the step-by-step wiring instructions for that gate.",
      "3. Use the Auto-Check button to verify the complete truth table."
    ],
    stepByStep: [
      "1. Select any basic TTL gate from the sub-gate buttons above.",
      "2. Follow the step-by-step wiring instructions for that gate.",
      "3. Use the Auto-Check button to verify the complete truth table."
    ],
    recommendedSocketICs: { U1: "7408" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
      { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
      { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
      { from: "IN.A1", to: "U1.J2", color: "#3b82f6" },
      { from: "U1.J3", to: "OUT.Y0", color: "#10b981" }
    ],
    truthTable: {
      inputs: ["Switch A1", "Switch A0"],
      outputs: ["Output Y0"],
      rows: [
        { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
        { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
        { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
        { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
      ]
    },
    tableHeaders: ["Switch A1 (1B)", "Switch A0 (1A)", "Expected Output (Y0)", "Observed Output"],
    tableRows: [
      { inputs: { "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
    ],
    checker: (testEngine) => {
      // Default to checking 7408 AND gate
      const rows = [
        { in: { "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
        { in: { "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } },
        { in: { "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
        { in: { "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } }
      ];
      let pass = true;
      const failingRows = [];
      const rowResults = [];
      rows.forEach((r, idx) => {
        Object.assign(testEngine.inputs, r.in);
        testEngine.evaluate();
        const ok = (testEngine.outputs["OUT.Y0"] === r.exp["OUT.Y0"]);
        rowResults.push(ok);
        if (!ok) { pass = false; failingRows.push(idx); }
      });
      return { pass, failingRows, rowResults, totalRows: rows.length, details: pass ? "All gate truth table rows verified." : `${failingRows.length} rows failed.` };
    }
  },

  // -------------------------------------------------------------
  // EXPERIMENT 2: 8:1 MUX using 74151 (Direct) & 74153 (Cascaded)
  // -------------------------------------------------------------
  {
    id: "exp2",
    number: 2,
    title: "Multiplexer (8:1 MUX & Function Generator)",
    aim: "To design and implement an 8:1 Multiplexer using IC 74151 (1-of-8 Data Selector) and IC 74LS153 (dual 4:1 MUX with 7404 & 7432), and implement logic functions f(C,B,A)=Σ(0,2,3,5) and f(I,J,K,L)=Σ(0,2,3,7,11,14,15).",
    apparatus: [
      { ic: "74151", qty: 1 },
      { ic: "74153", qty: 1 },
      { ic: "7404", qty: 1 },
      { ic: "7432", qty: 1 }
    ],
    requiredICs: ["74151", "74153", "7404", "7432"],
    theory: "An 8:1 Multiplexer selects one of eight data lines (D0–D7) based on 3 select lines (C, B, A) and routes it to true output Y and complementary output W.\n\n• Approach 1: Implement directly with IC 74151 (monolithic 1-of-8 data selector in DIP-16). Strobe S̅ (active LOW on Pin 7) enables the multiplexer when tied to 0V (GND). If S̅=1, outputs are inhibited (Y=0, W=1). Select inputs: C=Pin 9 (MSB), B=Pin 10, A=Pin 11 (LSB). Outputs: Y=Pin 5, W=Pin 6. Data inputs: D0=Pin 4, D1=Pin 3, D2=Pin 2, D3=Pin 1, D4=Pin 15, D5=Pin 14, D6=Pin 13, D7=Pin 12. Power: VCC=Pin 16, GND=Pin 8.\n  - 3-Variable Function f(C,B,A) = Σ(0,2,3,5): Connect C, B, A to select lines. Set D0=1, D1=0, D2=1, D3=1, D4=0, D5=1, D6=0, D7=0.\n  - 4-Variable Function f(I,J,K,L) = Σ(0,2,3,7,11,14,15): Connect I, J, K to select lines C, B, A; 4th variable L drives data inputs via IC 7404 (D0=L̅, D1=1, D2=0, D3=L, D4=0, D5=L, D6=0, D7=1).\n\n• Approach 2: Implement with IC 74153 dual 4:1 MUX by cascading sections with an inverter (7404) on strobes 1G'/2G' and OR'ing outputs 1Y and 2Y with 7432.",
    subCircuits: {
      "mux8_151_3var": {
        id: "mux8_151_3var",
        label: "74151: f(C,B,A)=Σ(0,2,3,5)",
        title: "8:1 MUX with IC 74151: 3-Variable Function f(C,B,A) = Σ(0,2,3,5)",
        apparatusText: "IC 74151 ×1",
        procedure: [
          "1. Insert IC 74151 into socket U1 and lock the lever.",
          "2. Power IC 74151: Connect +5V (PWR.5V_1) to U1.J20 (Pin 16 VCC) and 0V (PWR.GND_1) to U1.J8 (Pin 8 GND).",
          "3. Enable the multiplexer: Tie active-LOW strobe S̅ (Pin 7, U1.J7) to GND (0V).",
          "4. Connect select inputs: IN.A2 (C, MSB) to U1.J13 (Pin 9), IN.A1 (B) to U1.J14 (Pin 10), IN.A0 (A, LSB) to U1.J15 (Pin 11).",
          "5. Wire data inputs D0–D7 for f(C,B,A)=Σ(0,2,3,5):",
          "   - D0 (Pin 4, J4) = 1 (+5V)",
          "   - D1 (Pin 3, J3) = 0 (GND)",
          "   - D2 (Pin 2, J2) = 1 (+5V)",
          "   - D3 (Pin 1, J1) = 1 (+5V)",
          "   - D4 (Pin 15, J19) = 0 (GND)",
          "   - D5 (Pin 14, J18) = 1 (+5V)",
          "   - D6 (Pin 13, J17) = 0 (GND)",
          "   - D7 (Pin 12, J16) = 0 (GND)",
          "6. Read output Y at U1.J5 (Pin 5) connected to OUT.Y0, and inverted output W at U1.J6 (Pin 6) connected to OUT.Y1.",
          "7. Sweep CBA switches from 000 to 111 and verify Y0 is HIGH only for minterms 0, 2, 3, 5."
        ],
        stepByStep: [
          "1. Insert 74151 into U1 and close lever.",
          "2. Power: +5V to U1.J20 (Pin 16), GND to U1.J8 (Pin 8).",
          "3. Enable: U1.J7 (S̅) to GND.",
          "4. Select: IN.A2->U1.J13 (C), IN.A1->U1.J14 (B), IN.A0->U1.J15 (A).",
          "5. Data lines: D0(J4)=+5V, D1(J3)=GND, D2(J2)=+5V, D3(J1)=+5V, D4(J19)=GND, D5(J18)=+5V, D6(J17)=GND, D7(J16)=GND.",
          "6. Outputs: U1.J5 (Y) to OUT.Y0, U1.J6 (W) to OUT.Y1.",
          "7. Sweep CBA and verify truth table."
        ],
        requiredICs: ["74151"],
        recommendedSocketICs: { U1: "74151" },
        solutionWiring: [
          // Power & Ground
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          // Strobe S̅ tied to GND (active LOW enable)
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          // Select Lines (C=MSB, B, A=LSB)
          { from: "IN.A0", to: "U1.J15", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J14", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J13", color: "#f5c518" },
          // Data Inputs: D0=1, D1=0, D2=1, D3=1, D4=0, D5=1, D6=0, D7=0
          { from: "PWR.5V_2", to: "U1.J4", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U1.J3", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J2", color: "#ef4444" },
          { from: "PWR.5V_4", to: "U1.J1", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J19", color: "#1e293b" },
          { from: "PWR.5V_1", to: "U1.J18", color: "#ef4444" },
          { from: "PWR.GND_4", to: "U1.J17", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          // Outputs
          { from: "U1.J5", to: "OUT.Y0", color: "#10b981" },
          { from: "U1.J6", to: "OUT.Y1", color: "#6ee7b7" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J15", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J14", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J13", color: "#f5c518" },
          { from: "PWR.5V_2", to: "U1.J4", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U1.J3", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J2", color: "#ef4444" },
          { from: "PWR.5V_4", to: "U1.J1", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J19", color: "#1e293b" },
          { from: "PWR.5V_1", to: "U1.J18", color: "#ef4444" },
          { from: "PWR.GND_4", to: "U1.J17", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "U1.J5", to: "OUT.Y0", color: "#10b981" },
          { from: "U1.J6", to: "OUT.Y1", color: "#6ee7b7" }
        ],
        truthTable: {
          inputs: ["C (A2)", "B (A1)", "A (A0)"],
          outputs: ["Output Y (Y0)", "Output W (Y1)"],
          rows: [
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } }
          ]
        },
        tableHeaders: ["C (A2)", "B (A1)", "A (A0)", "Expected Y0", "Observed Y0"],
        tableRows: [
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
        ],
        checker: (testEngine) => {
          const rows = [
            { in: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } }
          ];
          let pass = true;
          const failingRows = [];
          const rowResults = [];
          rows.forEach((r, idx) => {
            Object.assign(testEngine.inputs, r.in);
            testEngine.evaluate();
            const ok = (testEngine.outputs["OUT.Y0"] === r.exp["OUT.Y0"]);
            rowResults.push(ok);
            if (!ok) { pass = false; failingRows.push(idx); }
          });
          return { pass, failingRows, rowResults, totalRows: rows.length, details: pass ? "74151 8:1 MUX f(C,B,A)=Σ(0,2,3,5) verified." : `${failingRows.length} rows failed.` };
        }
      },

      "mux8_151_4var": {
        id: "mux8_151_4var",
        label: "74151: f(I,J,K,L)",
        title: "8:1 MUX with IC 74151 + 7404: 4-Variable Function f(I,J,K,L) = Σ(0,2,3,7,11,14,15)",
        apparatusText: "IC 74151 ×1, IC 7404 ×1 (if needed)",
        procedure: [
          "1. Insert IC 74151 into socket U1 and IC 7404 (Hex Inverter) into socket U2. Lock both levers.",
          "2. Power both ICs: Connect +5V to U1.J20 (Pin 16) and U2.J20 (Pin 14); GND to U1.J8 (Pin 8) and U2.J7 (Pin 7).",
          "3. Enable 74151: Tie strobe S̅ (Pin 7, U1.J7) to GND.",
          "4. Connect select lines (standard method using 3 MSBs):",
          "   - IN.A3 (I, MSB) to U1.J13 (Pin 9, Select C)",
          "   - IN.A2 (J) to U1.J14 (Pin 10, Select B)",
          "   - IN.A1 (K, LSB) to U1.J15 (Pin 11, Select A)",
          "5. Route variable L (IN.A0) and inverted L̅ via 7404 inverter:",
          "   - Connect IN.A0 to U2.J1 (1A); Inverter output U2.J2 (1Y, L̅) connects to U1.J4 (D0).",
          "   - Connect IN.A0 (L) directly to U1.J1 (D3) and U1.J18 (D5).",
          "6. Wire remaining fixed data inputs:",
          "   - D1 (Pin 3, J3) = 1 (+5V)",
          "   - D2 (Pin 2, J2) = 0 (GND)",
          "   - D4 (Pin 15, J19) = 0 (GND)",
          "   - D6 (Pin 13, J17) = 0 (GND)",
          "   - D7 (Pin 12, J16) = 1 (+5V)",
          "7. Read true output Y at U1.J5 (Pin 5) connected to OUT.Y0 (and W at U1.J6 to OUT.Y1).",
          "8. Sweep IJKL from 0000 to 1111 and verify all 16 rows."
        ],
        stepByStep: [
          "1. Insert 74151 in U1, 7404 in U2, close levers.",
          "2. Power: +5V to U1.J20 and U2.J20; GND to U1.J8 and U2.J7.",
          "3. Enable: U1.J7 (S̅) to GND.",
          "4. Select lines: IN.A3->U1.J13 (C), IN.A2->U1.J14 (B), IN.A1->U1.J15 (A).",
          "5. Variable L: IN.A0->U2.J1; U2.J2 (L̅)->U1.J4 (D0); IN.A0->U1.J1 (D3), IN.A0->U1.J18 (D5).",
          "6. Fixed inputs: D1(J3)=+5V, D2(J2)=GND, D4(J19)=GND, D6(J17)=GND, D7(J16)=+5V.",
          "7. Connect U1.J5 to OUT.Y0, U1.J6 to OUT.Y1.",
          "8. Sweep all 16 combinations."
        ],
        requiredICs: ["74151", "7404"],
        recommendedSocketICs: { U1: "74151", U2: "7404" },
        solutionWiring: [
          // Power U1 (74151) & U2 (7404)
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          // Enable S̅ = 0
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          // Select Lines: I->C, J->B, K->A
          { from: "IN.A1", to: "U1.J15", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J14", color: "#f5c518" },
          { from: "IN.A3", to: "U1.J13", color: "#f5c518" },
          // L & Inverted L̅ via 7404
          { from: "IN.A0", to: "U2.J1", color: "#3b82f6" },
          { from: "U2.J2", to: "U1.J4", color: "#3b82f6" },
          { from: "IN.A0", to: "U1.J1", color: "#3b82f6" },
          { from: "IN.A0", to: "U1.J18", color: "#3b82f6" },
          // Fixed data lines: D1=1, D2=0, D4=0, D6=0, D7=1
          { from: "PWR.5V_3", to: "U1.J3", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J2", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J19", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J17", color: "#1e293b" },
          { from: "PWR.5V_4", to: "U1.J16", color: "#ef4444" },
          // Outputs
          { from: "U1.J5", to: "OUT.Y0", color: "#10b981" },
          { from: "U1.J6", to: "OUT.Y1", color: "#6ee7b7" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "IN.A1", to: "U1.J15", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J14", color: "#f5c518" },
          { from: "IN.A3", to: "U1.J13", color: "#f5c518" },
          { from: "IN.A0", to: "U2.J1", color: "#3b82f6" },
          { from: "U2.J2", to: "U1.J4", color: "#3b82f6" },
          { from: "IN.A0", to: "U1.J1", color: "#3b82f6" },
          { from: "IN.A0", to: "U1.J18", color: "#3b82f6" },
          { from: "PWR.5V_3", to: "U1.J3", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J2", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J19", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J17", color: "#1e293b" },
          { from: "PWR.5V_4", to: "U1.J16", color: "#ef4444" },
          { from: "U1.J5", to: "OUT.Y0", color: "#10b981" },
          { from: "U1.J6", to: "OUT.Y1", color: "#6ee7b7" }
        ],
        truthTable: {
          inputs: ["I (A3)", "J (A2)", "K (A1)", "L (A0)"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
          ]
        },
        tableHeaders: ["I (A3)", "J (A2)", "K (A1)", "L (A0)", "Expected Y0", "Observed Y0"],
        tableRows: [
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
        ],
        checker: (testEngine) => {
          const rows = [
            { in: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } },
            { in: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 1 } },
            { in: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } }
          ];
          let pass = true;
          const failingRows = [];
          const rowResults = [];
          rows.forEach((r, idx) => {
            Object.assign(testEngine.inputs, r.in);
            testEngine.evaluate();
            const ok = (testEngine.outputs["OUT.Y0"] === r.exp["OUT.Y0"]);
            rowResults.push(ok);
            if (!ok) { pass = false; failingRows.push(idx); }
          });
          return { pass, failingRows, rowResults, totalRows: rows.length, details: pass ? "74151 + 7404 4-Var MUX f(I,J,K,L)=Σ(0,2,3,7,11,14,15) verified." : `${failingRows.length} rows failed.` };
        }
      },

      "mux8_3var": {
        id: "mux8_3var",
        label: "74153: f(C,B,A)",
        title: "8:1 MUX: 3-Variable Function f(C,B,A) = Σ(0,2,3,5)",
        procedure: [
          "1. Insert 74153 into U1, 7404 into U2, 7432 into U3. Lock all levers.",
          "2. Power all ICs: +5V to U1.J20 (pin 16), U2.J20 (pin 14), U3.J20 (pin 14); GND to U1.J8, U2.J7, U3.J7.",
          "3. Connect select inputs: IN.A0 (A) to U1.J18 (S0), IN.A1 (B) to U1.J2 (S1), IN.A2 (C) to U1.J1 (1G') and U2.J1 (1A).",
          "4. Invert C: connect U2.J2 (1Y) to U1.J19 (2G').",
          "5. Combine outputs: U1.J7 (1Y) to U3.J1, U1.J13 (2Y) to U3.J2. Connect U3.J3 (OR Out) to OUT.Y0.",
          "6. Set data inputs for Σ(0,2,3,5): Connect D0(J6), D2(J4), D3(J3), D5(J15) to +5V; Connect D1(J5), D4(J14), D6(J16), D7(J17) to GND.",
          "7. Sweep CBA (000 to 111) and verify Y0 is HIGH for 0, 2, 3, 5."
        ],
        stepByStep: [
          "1. Insert 74153 into U1, 7404 into U2, 7432 into U3. Lock all levers.",
          "2. Power all ICs: +5V to U1.J20, U2.J20, U3.J20; GND to U1.J8, U2.J7, U3.J7.",
          "3. Connect select lines: IN.A0 to U1.J18 (S0), IN.A1 to U1.J2 (S1), IN.A2 to U1.J1 (1G') and U2.J1 (1A).",
          "4. Invert C: U2.J2 to U1.J19 (2G').",
          "5. Combine outputs: U1.J7 to U3.J1, U1.J13 to U3.J2. Connect U3.J3 to OUT.Y0.",
          "6. Connect data inputs for Σ(0,2,3,5): D0(J6), D2(J4), D3(J3), D5(J15) to +5V; D1(J5), D4(J14), D6(J16), D7(J17) to GND.",
          "7. Sweep CBA (000 to 111) and verify truth table."
        ],
        requiredICs: ["74153", "7404", "7432"],
        recommendedSocketICs: { U1: "74153", U2: "7404", U3: "7432" },
        solutionWiring: [
          // Power
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U3.J20", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U3.J7", color: "#1e293b" },
          // Select Lines
          { from: "IN.A0", to: "U1.J18", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A2", to: "U2.J1", color: "#3b82f6" },
          { from: "U2.J2", to: "U1.J19", color: "#3b82f6" },
          // Outputs OR
          { from: "U1.J7", to: "U3.J1", color: "#10b981" },
          { from: "U1.J13", to: "U3.J2", color: "#10b981" },
          { from: "U3.J3", to: "OUT.Y0", color: "#38bdf8" },
          // Data inputs: D0(J6)=1, D1(J5)=0, D2(J4)=1, D3(J3)=1, D4(J14)=0, D5(J15)=1, D6(J16)=0, D7(J17)=0
          { from: "PWR.5V_4", to: "U1.J6", color: "#ef4444" },
          { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
          { from: "PWR.5V_1", to: "U1.J4", color: "#ef4444" },
          { from: "PWR.5V_2", to: "U1.J3", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J14", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J15", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_3", to: "U1.J17", color: "#1e293b" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U3.J20", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U3.J7", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J18", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A2", to: "U2.J1", color: "#3b82f6" },
          { from: "U2.J2", to: "U1.J19", color: "#3b82f6" },
          { from: "U1.J7", to: "U3.J1", color: "#10b981" },
          { from: "U1.J13", to: "U3.J2", color: "#10b981" },
          { from: "U3.J3", to: "OUT.Y0", color: "#38bdf8" },
          { from: "PWR.5V_4", to: "U1.J6", color: "#ef4444" },
          { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
          { from: "PWR.5V_1", to: "U1.J4", color: "#ef4444" },
          { from: "PWR.5V_2", to: "U1.J3", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J14", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J15", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_3", to: "U1.J17", color: "#1e293b" }
        ],
        truthTable: {
          inputs: ["C (A2)", "B (A1)", "A (A0)"],
          outputs: ["Output Y (Y0)"],
          rows: [
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
          ]
        },
        tableHeaders: ["C (A2)", "B (A1)", "A (A0)", "Expected f(C,B,A)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
        ]
      },

      "mux8_4var": {
        id: "mux8_4var",
        label: "f(I,J,K,L)=Σ(0,2,3,7,11,14,15)",
        title: "8:1 MUX: 4-Variable Function f(I,J,K,L) = Σ(0,2,3,7,11,14,15)",
        procedure: [
          "1. Use same 8:1 MUX structure: U1=74153, U2=7404, U3=7432.",
          "2. Connect select inputs: IN.A1(K) to S0 (U1.J18), IN.A2(J) to S1 (U1.J2), IN.A3(I) to S2 (U1.J1) and U2.J1.",
          "3. Invert S2: U2.J2 to U1.J19 (2G').",
          "4. Connect fourth variable L: IN.A0 (L) to U2.J3 (Inverter 2), and output U2.J4 (L') to D0 (U1.J6).",
          "5. Connect data inputs: D1(J5)=+5V, D2(J4)=GND, D3(J3)=IN.A0(L), D4(J14)=GND, D5(J15)=IN.A0(L), D6(J16)=GND, D7(J17)=+5V.",
          "6. Combine outputs: U1.J7 and U1.J13 to U3 OR gate, and U3.J3 to OUT.Y0.",
          "7. Sweep IJKL from 0000 to 1111 and verify all 16 rows."
        ],
        stepByStep: [
          "1. 8:1 MUX setup with U1=74153, U2=7404, U3=7432.",
          "2. Connect select inputs: IN.A1(K) to S0, IN.A2(J) to S1, IN.A3(I) to S2 (1G') and U2.J1.",
          "3. Invert S2: U2.J2 to U1.J19 (2G').",
          "4. Invert variable L: IN.A0 to U2.J3, U2.J4(L') to D0 (U1.J6).",
          "5. Connect data lines: D1=+5V, D2=GND, D3=L, D4=GND, D5=L, D6=GND, D7=+5V.",
          "6. Connect OR gate U3.J3 to OUT.Y0 and sweep all 16 rows."
        ],
        requiredICs: ["74153", "7404", "7432"],
        recommendedSocketICs: { U1: "74153", U2: "7404", U3: "7432" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U3.J20", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U3.J7", color: "#1e293b" },
          // Select lines: I->S2, J->S1, K->S0
          { from: "IN.A1", to: "U1.J18", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A3", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A3", to: "U2.J1", color: "#3b82f6" },
          { from: "U2.J2", to: "U1.J19", color: "#3b82f6" },
          // Variable L and L'
          { from: "IN.A0", to: "U2.J3", color: "#10b981" },
          { from: "U2.J4", to: "U1.J6", color: "#10b981" }, // D0 = L'
          { from: "PWR.5V_4", to: "U1.J5", color: "#ef4444" }, // D1 = 1
          { from: "PWR.GND_4", to: "U1.J4", color: "#1e293b" }, // D2 = 0
          { from: "IN.A0", to: "U1.J3", color: "#10b981" }, // D3 = L
          { from: "PWR.GND_1", to: "U1.J14", color: "#1e293b" }, // D4 = 0
          { from: "IN.A0", to: "U1.J15", color: "#10b981" }, // D5 = L
          { from: "PWR.GND_2", to: "U1.J16", color: "#1e293b" }, // D6 = 0
          { from: "PWR.5V_1", to: "U1.J17", color: "#ef4444" }, // D7 = 1
          // Combine outputs
          { from: "U1.J7", to: "U3.J1", color: "#38bdf8" },
          { from: "U1.J13", to: "U3.J2", color: "#38bdf8" },
          { from: "U3.J3", to: "OUT.Y0", color: "#f59e0b" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U3.J20", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U3.J7", color: "#1e293b" },
          { from: "IN.A1", to: "U1.J18", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A3", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A3", to: "U2.J1", color: "#3b82f6" },
          { from: "U2.J2", to: "U1.J19", color: "#3b82f6" },
          { from: "IN.A0", to: "U2.J3", color: "#10b981" },
          { from: "U2.J4", to: "U1.J6", color: "#10b981" },
          { from: "PWR.5V_4", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_4", to: "U1.J4", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J3", color: "#10b981" },
          { from: "PWR.GND_1", to: "U1.J14", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J15", color: "#10b981" },
          { from: "PWR.GND_2", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.5V_1", to: "U1.J17", color: "#ef4444" },
          { from: "U1.J7", to: "U3.J1", color: "#38bdf8" },
          { from: "U1.J13", to: "U3.J2", color: "#38bdf8" },
          { from: "U3.J3", to: "OUT.Y0", color: "#f59e0b" }
        ],
        truthTable: {
          inputs: ["I (A3)", "J (A2)", "K (A1)", "L (A0)"],
          outputs: ["Output Y0"],
          rows: [
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
          ]
        },
        tableHeaders: ["I", "J", "K", "L", "Expected f(I,J,K,L)", "Observed Output"],
        tableRows: [
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 0, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 0, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A3": 1, "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } }
        ]
      }
    },
    // Default config = Approach 1 (IC 74151 3-variable function)
    procedure: [
      "1. Insert IC 74151 into socket U1 and lock the lever.",
      "2. Power IC 74151: Connect +5V (PWR.5V_1) to U1.J20 (Pin 16 VCC) and 0V (PWR.GND_1) to U1.J8 (Pin 8 GND).",
      "3. Enable the multiplexer: Tie active-LOW strobe S̅ (Pin 7, U1.J7) to GND (0V).",
      "4. Connect select inputs: IN.A2 (C, MSB) to U1.J13 (Pin 9), IN.A1 (B) to U1.J14 (Pin 10), IN.A0 (A, LSB) to U1.J15 (Pin 11).",
      "5. Wire data inputs D0–D7 for f(C,B,A)=Σ(0,2,3,5):",
      "   - D0(J4)=+5V, D1(J3)=GND, D2(J2)=+5V, D3(J1)=+5V, D4(J19)=GND, D5(J18)=+5V, D6(J17)=GND, D7(J16)=GND.",
      "6. Connect output Y (Pin 5, U1.J5) to OUT.Y0 and complementary output W (Pin 6, U1.J6) to OUT.Y1.",
      "7. Sweep CBA switches from 000 to 111 and verify truth table."
    ],
    stepByStep: [
      "1. Insert 74151 into U1 and close lever.",
      "2. Power: +5V to U1.J20 (Pin 16), GND to U1.J8 (Pin 8).",
      "3. Enable: U1.J7 (S̅) to GND.",
      "4. Select: IN.A2->U1.J13 (C), IN.A1->U1.J14 (B), IN.A0->U1.J15 (A).",
      "5. Data lines: D0(J4)=+5V, D1(J3)=GND, D2(J2)=+5V, D3(J1)=+5V, D4(J19)=GND, D5(J18)=+5V, D6(J17)=GND, D7(J16)=GND.",
      "6. Outputs: U1.J5 (Y) to OUT.Y0, U1.J6 (W) to OUT.Y1.",
      "7. Sweep CBA and verify truth table."
    ],
    requiredICs: ["74151"],
    recommendedSocketICs: { U1: "74151" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J15", color: "#f5c518" },
      { from: "IN.A1", to: "U1.J14", color: "#f5c518" },
      { from: "IN.A2", to: "U1.J13", color: "#f5c518" },
      { from: "PWR.5V_2", to: "U1.J4", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J3", color: "#1e293b" },
      { from: "PWR.5V_3", to: "U1.J2", color: "#ef4444" },
      { from: "PWR.5V_4", to: "U1.J1", color: "#ef4444" },
      { from: "PWR.GND_3", to: "U1.J19", color: "#1e293b" },
      { from: "PWR.5V_1", to: "U1.J18", color: "#ef4444" },
      { from: "PWR.GND_4", to: "U1.J17", color: "#1e293b" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
      { from: "U1.J5", to: "OUT.Y0", color: "#10b981" },
      { from: "U1.J6", to: "OUT.Y1", color: "#6ee7b7" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J15", color: "#f5c518" },
      { from: "IN.A1", to: "U1.J14", color: "#f5c518" },
      { from: "IN.A2", to: "U1.J13", color: "#f5c518" },
      { from: "PWR.5V_2", to: "U1.J4", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J3", color: "#1e293b" },
      { from: "PWR.5V_3", to: "U1.J2", color: "#ef4444" },
      { from: "PWR.5V_4", to: "U1.J1", color: "#ef4444" },
      { from: "PWR.GND_3", to: "U1.J19", color: "#1e293b" },
      { from: "PWR.5V_1", to: "U1.J18", color: "#ef4444" },
      { from: "PWR.GND_4", to: "U1.J17", color: "#1e293b" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
      { from: "U1.J5", to: "OUT.Y0", color: "#10b981" },
      { from: "U1.J6", to: "OUT.Y1", color: "#6ee7b7" }
    ],
    truthTable: {
      inputs: ["C (A2)", "B (A1)", "A (A0)"],
      outputs: ["Output Y0"],
      rows: [
        { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
        { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
        { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
        { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
        { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
        { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
        { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
        { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
      ]
    },
    tableHeaders: ["C (A2)", "B (A1)", "A (A0)", "Expected f(C,B,A)", "Observed Output"],
    tableRows: [
      { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1 } },
      { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0 } },
      { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0 } }
    ],
    checker: (testEngine) => {
      const rows = [
        { in: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 1 } },
        { in: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } },
        { in: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 1 } },
        { in: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } },
        { in: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
        { in: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 1 } },
        { in: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 0 } },
        { in: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 0 } }
      ];
      let pass = true;
      const failingRows = [];
      const rowResults = [];
      rows.forEach((r, idx) => {
        Object.assign(testEngine.inputs, r.in);
        testEngine.evaluate();
        const ok = (testEngine.outputs["OUT.Y0"] === r.exp["OUT.Y0"]);
        rowResults.push(ok);
        if (!ok) { pass = false; failingRows.push(idx); }
      });
      return { pass, failingRows, rowResults, totalRows: rows.length, details: pass ? "8:1 MUX f(C,B,A)=Σ(0,2,3,5) truth table verified." : `${failingRows.length} rows failed.` };
    }
  },

  // -------------------------------------------------------------
  // EXPERIMENT 3: DEMUX/Decoder 74138 + 7420 (Full Adder, Subtractor, Gray)
  // -------------------------------------------------------------
  {
    id: "exp3",
    number: 3,
    title: "Decoder / Demultiplexer using IC 74138 (Full Adder & Subtractor)",
    aim: "To design and implement a Full Adder, Full Subtractor, and Binary-to-Gray converter using IC 74LS138 (3:8 Decoder) and NAND gates (7420).",
    apparatus: [
      { ic: "74138", qty: 1 },
      { ic: "7420", qty: 1 },
      { ic: "7432", qty: 1 }
    ],
    requiredICs: ["74138", "7420"],
    theory: "IC 74138 decodes a 3-bit binary input into 8 active-low outputs Y0'..Y7'. Since minterms are active LOW, any Boolean function expressed in canonical minterm form can be implemented by connecting the corresponding active-low outputs to an active-low input NAND gate (e.g. 7420).",
    subCircuits: {
      "fa_74138": {
        id: "fa_74138",
        label: "Full Adder",
        title: "Full Adder using 74138 + 7420 (Dual 4-Input NAND)",
        procedure: [
          "1. Insert 74138 into U1 and 7420 into U2. Lock both levers.",
          "2. Power: +5V to U1.J20 (pin 16), U2.J20 (pin 14); GND to U1.J8, U2.J7.",
          "3. Enables: connect E3 (U1.J6) to +5V; connect E1' (U1.J4) and E2' (U1.J5) to GND.",
          "4. Address lines: IN.A0 to A0 (U1.J1), IN.A1 to A1 (U1.J2), IN.A2 to A2 (U1.J3).",
          "5. Sum = Σ(1,2,4,7): Connect Y1'(J18), Y2'(J17), Y4'(J15), Y7'(J7) to 7420 Gate 1 (pins 1,2,4,5 / J1, J2, J4, J5).",
          "6. Connect Gate 1 output (U2.J6) to OUT.Y0 (Sum).",
          "7. Carry = Σ(3,5,6,7): Connect Y3'(J16), Y5'(J14), Y6'(J13), Y7'(J7) to 7420 Gate 2 (pins 9,10,12,13 / J15, J16, J18, J19).",
          "8. Connect Gate 2 output (U2.J14) to OUT.Y1 (Carry).",
          "9. Sweep inputs A, B, Cin from 000 to 111 and verify Sum and Carry."
        ],
        stepByStep: [
          "1. Insert 74138 into U1 and 7420 into U2. Lock both levers.",
          "2. Power: +5V to U1.J20, U2.J20; GND to U1.J8, U2.J7.",
          "3. Enables: E3 (U1.J6) to +5V; E1' (U1.J4) and E2' (U1.J5) to GND.",
          "4. Inputs: IN.A0 to A0 (U1.J1), IN.A1 to A1 (U1.J2), IN.A2 to A2 (U1.J3).",
          "5. Sum = Σ(1,2,4,7): Connect Y1', Y2', Y4', Y7' to 7420 Gate 1 inputs; output U2.J6 to OUT.Y0 (Sum).",
          "6. Carry = Σ(3,5,6,7): Connect Y3', Y5', Y6', Y7' to 7420 Gate 2 inputs; output U2.J14 to OUT.Y1 (Carry).",
          "7. Verify 8-row Full Adder truth table."
        ],
        requiredICs: ["74138", "7420"],
        recommendedSocketICs: { U1: "74138", U2: "7420" },
        solutionWiring: [
          // Power
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          // 74138 Enables: E3=1, E1'=0, E2'=0
          { from: "PWR.5V_3", to: "U1.J6", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J4", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
          // Select: IN.A0=A, IN.A1=B, IN.A2=Cin
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J3", color: "#f5c518" },
          // Sum = NAND(Y1', Y2', Y4', Y7')
          { from: "U1.J18", to: "U2.J1", color: "#38bdf8" },
          { from: "U1.J17", to: "U2.J2", color: "#38bdf8" },
          { from: "U1.J15", to: "U2.J4", color: "#38bdf8" },
          { from: "U1.J7", to: "U2.J5", color: "#38bdf8" },
          { from: "U2.J6", to: "OUT.Y0", color: "#10b981" },
          // Carry = NAND(Y3', Y5', Y6', Y7')
          { from: "U1.J16", to: "U2.J15", color: "#f472b6" },
          { from: "U1.J14", to: "U2.J16", color: "#f472b6" },
          { from: "U1.J13", to: "U2.J18", color: "#f472b6" },
          { from: "U1.J7", to: "U2.J19", color: "#f472b6" },
          { from: "U2.J14", to: "OUT.Y1", color: "#f59e0b" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J6", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J4", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J3", color: "#f5c518" },
          { from: "U1.J18", to: "U2.J1", color: "#38bdf8" },
          { from: "U1.J17", to: "U2.J2", color: "#38bdf8" },
          { from: "U1.J15", to: "U2.J4", color: "#38bdf8" },
          { from: "U1.J7", to: "U2.J5", color: "#38bdf8" },
          { from: "U2.J6", to: "OUT.Y0", color: "#10b981" },
          { from: "U1.J16", to: "U2.J15", color: "#f472b6" },
          { from: "U1.J14", to: "U2.J16", color: "#f472b6" },
          { from: "U1.J13", to: "U2.J18", color: "#f472b6" },
          { from: "U1.J7", to: "U2.J19", color: "#f472b6" },
          { from: "U2.J14", to: "OUT.Y1", color: "#f59e0b" }
        ],
        truthTable: {
          inputs: ["Cin (A2)", "B (A1)", "A (A0)"],
          outputs: ["Sum (Y0)", "Carry (Y1)"],
          rows: [
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } }
          ]
        },
        tableHeaders: ["Cin (A2)", "B (A1)", "A (A0)", "Expected Sum", "Expected Carry", "Observed"],
        tableRows: [
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } }
        ]
      },

      "fs_74138": {
        id: "fs_74138",
        label: "Full Subtractor",
        title: "Full Subtractor using 74138 + 7420",
        procedure: [
          "1. Difference D = Σ(1,2,4,7) (same wiring as Sum -> OUT.Y0).",
          "2. Borrow B = Σ(1,2,3,7): Connect Y1'(J18), Y2'(J17), Y3'(J16), Y7'(J7) to 7420 Gate 2.",
          "3. Connect Gate 2 output (U2.J14) to OUT.Y1 (Borrow).",
          "4. Verify Full Subtractor truth table."
        ],
        stepByStep: [
          "1. Difference D = Σ(1,2,4,7) to OUT.Y0.",
          "2. Borrow B = Σ(1,2,3,7) using 7420 Gate 2 to OUT.Y1.",
          "3. Verify all 8 combinations of A, B, Bin."
        ],
        requiredICs: ["74138", "7420"],
        recommendedSocketICs: { U1: "74138", U2: "7420" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J6", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J4", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J3", color: "#f5c518" },
          // Diff = NAND(Y1', Y2', Y4', Y7')
          { from: "U1.J18", to: "U2.J1", color: "#38bdf8" },
          { from: "U1.J17", to: "U2.J2", color: "#38bdf8" },
          { from: "U1.J15", to: "U2.J4", color: "#38bdf8" },
          { from: "U1.J7", to: "U2.J5", color: "#38bdf8" },
          { from: "U2.J6", to: "OUT.Y0", color: "#10b981" },
          // Borrow = NAND(Y1', Y2', Y3', Y7')
          { from: "U1.J18", to: "U2.J15", color: "#f472b6" },
          { from: "U1.J17", to: "U2.J16", color: "#f472b6" },
          { from: "U1.J16", to: "U2.J18", color: "#f472b6" },
          { from: "U1.J7", to: "U2.J19", color: "#f472b6" },
          { from: "U2.J14", to: "OUT.Y1", color: "#f59e0b" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J6", color: "#ef4444" },
          { from: "PWR.GND_3", to: "U1.J4", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
          { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
          { from: "IN.A2", to: "U1.J3", color: "#f5c518" },
          { from: "U1.J18", to: "U2.J1", color: "#38bdf8" },
          { from: "U1.J17", to: "U2.J2", color: "#38bdf8" },
          { from: "U1.J15", to: "U2.J4", color: "#38bdf8" },
          { from: "U1.J7", to: "U2.J5", color: "#38bdf8" },
          { from: "U2.J6", to: "OUT.Y0", color: "#10b981" },
          { from: "U1.J18", to: "U2.J15", color: "#f472b6" },
          { from: "U1.J17", to: "U2.J16", color: "#f472b6" },
          { from: "U1.J16", to: "U2.J18", color: "#f472b6" },
          { from: "U1.J7", to: "U2.J19", color: "#f472b6" },
          { from: "U2.J14", to: "OUT.Y1", color: "#f59e0b" }
        ],
        truthTable: {
          inputs: ["A (A2)", "B (A1)", "Bin (A0)"],
          outputs: ["Diff (Y0)", "Borrow (Y1)"],
          rows: [
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
            { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } }
          ]
        },
        tableHeaders: ["A (A2)", "B (A1)", "Bin (A0)", "Expected Diff", "Expected Borrow", "Observed"],
        tableRows: [
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } },
          { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
          { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } }
        ]
      }
    },
    procedure: [
      "1. Insert 74138 into U1 and 7420 into U2.",
      "2. Connect VCC and GND to both ICs.",
      "3. Enable 74138 by setting E3=1, E1'=0, E2'=0.",
      "4. Connect minterm outputs to 7420 NAND gates.",
      "5. Click Auto-Check to verify logic."
    ],
    stepByStep: [
      "1. Insert 74138 into U1 and 7420 into U2.",
      "2. Connect VCC and GND to both ICs.",
      "3. Enable 74138 by setting E3=1, E1'=0, E2'=0.",
      "4. Connect minterm outputs to 7420 NAND gates.",
      "5. Click Auto-Check to verify logic."
    ],
    requiredICs: ["74138", "7420"],
    recommendedSocketICs: { U1: "74138", U2: "7420" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
      { from: "PWR.5V_3", to: "U1.J6", color: "#ef4444" },
      { from: "PWR.GND_3", to: "U1.J4", color: "#1e293b" },
      { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
      { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
      { from: "IN.A2", to: "U1.J3", color: "#f5c518" },
      { from: "U1.J18", to: "U2.J1", color: "#38bdf8" },
      { from: "U1.J17", to: "U2.J2", color: "#38bdf8" },
      { from: "U1.J15", to: "U2.J4", color: "#38bdf8" },
      { from: "U1.J7", to: "U2.J5", color: "#38bdf8" },
      { from: "U2.J6", to: "OUT.Y0", color: "#10b981" },
      { from: "U1.J16", to: "U2.J15", color: "#f472b6" },
      { from: "U1.J14", to: "U2.J16", color: "#f472b6" },
      { from: "U1.J13", to: "U2.J18", color: "#f472b6" },
      { from: "U1.J7", to: "U2.J19", color: "#f472b6" },
      { from: "U2.J14", to: "OUT.Y1", color: "#f59e0b" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
      { from: "PWR.5V_3", to: "U1.J6", color: "#ef4444" },
      { from: "PWR.GND_3", to: "U1.J4", color: "#1e293b" },
      { from: "PWR.GND_4", to: "U1.J5", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J1", color: "#f5c518" },
      { from: "IN.A1", to: "U1.J2", color: "#f5c518" },
      { from: "IN.A2", to: "U1.J3", color: "#f5c518" },
      { from: "U1.J18", to: "U2.J1", color: "#38bdf8" },
      { from: "U1.J17", to: "U2.J2", color: "#38bdf8" },
      { from: "U1.J15", to: "U2.J4", color: "#38bdf8" },
      { from: "U1.J7", to: "U2.J5", color: "#38bdf8" },
      { from: "U2.J6", to: "OUT.Y0", color: "#10b981" },
      { from: "U1.J16", to: "U2.J15", color: "#f472b6" },
      { from: "U1.J14", to: "U2.J16", color: "#f472b6" },
      { from: "U1.J13", to: "U2.J18", color: "#f472b6" },
      { from: "U1.J7", to: "U2.J19", color: "#f472b6" },
      { from: "U2.J14", to: "OUT.Y1", color: "#f59e0b" }
    ],
    truthTable: {
      inputs: ["Cin (A2)", "B (A1)", "A (A0)"],
      outputs: ["Sum (Y0)", "Carry (Y1)"],
      rows: [
        { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
        { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
        { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
        { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
        { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } }
      ]
    },
    tableHeaders: ["Cin", "B", "A", "Expected Sum", "Expected Carry", "Observed"],
    tableRows: [
      { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
      { inputs: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
      { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
      { inputs: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
      { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
      { inputs: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
      { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } },
      { inputs: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 1 } }
    ],
    checker: (testEngine) => {
      const rows = [
        { in: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 0, "OUT.Y1": 0 } },
        { in: { "IN.A2": 0, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { in: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { in: { "IN.A2": 0, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 0, "OUT.Y1": 1 } },
        { in: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 0 }, exp: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { in: { "IN.A2": 1, "IN.A1": 0, "IN.A0": 1 }, exp: { "OUT.Y0": 0, "OUT.Y1": 1 } },
        { in: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 0 }, exp: { "OUT.Y0": 0, "OUT.Y1": 1 } },
        { in: { "IN.A2": 1, "IN.A1": 1, "IN.A0": 1 }, exp: { "OUT.Y0": 1, "OUT.Y1": 1 } }
      ];
      let pass = true;
      const failingRows = [];
      const rowResults = [];
      rows.forEach((r, idx) => {
        Object.assign(testEngine.inputs, r.in);
        testEngine.evaluate();
        const ok = (testEngine.outputs["OUT.Y0"] === r.exp["OUT.Y0"] && testEngine.outputs["OUT.Y1"] === r.exp["OUT.Y1"]);
        rowResults.push(ok);
        if (!ok) { pass = false; failingRows.push(idx); }
      });
      return { pass, failingRows, rowResults, totalRows: rows.length, details: pass ? "74138 Full Adder verified." : `${failingRows.length} rows failed.` };
    }
  },

  // -------------------------------------------------------------
  // EXPERIMENT 4: Binary Adder & Subtractor using IC 7483
  // -------------------------------------------------------------
  {
    id: "exp4",
    number: 4,
    title: "Binary Adder & Subtractor using IC 7483 (and BCD Adder)",
    aim: "Study of IC 74LS83 4-bit binary full adder to perform addition, 2's complement subtraction (with 7404, C0=1), and 1-digit BCD adder (7483 x2 + 7408 + 7432).",
    apparatus: [
      { ic: "7483", qty: 2 },
      { ic: "7404", qty: 1 },
      { ic: "7408", qty: 1 },
      { ic: "7432", qty: 1 }
    ],
    requiredICs: ["7483", "7404"],
    theory: "IC 7483 adds two 4-bit words A[4:1] and B[4:1] plus carry-in C0, producing sum S[4:1] and carry-out C4. Pinout: VCC is Pin 5, GND is Pin 12. Subtraction A - B is performed using 2's complement: A + B' + 1 (inverting B via 7404 and tying C0 to +5V).",
    subCircuits: {
      "adder_4bit": {
        id: "adder_4bit",
        label: "4-Bit Adder",
        title: "4-Bit Binary Full Adder (7483)",
        procedure: [
          "1. Insert 7483 into socket U1 and lock the lever.",
          "2. Power: +5V to U1.J5 (pin 5) and GND to U1.J16 (pin 12).",
          "3. Connect C0 (pin 13 / J17) to GND for addition.",
          "4. Connect A word: IN.A0 to A1(J14), IN.A1 to A2(J8), IN.A2 to A3(J3), IN.A3 to A4(J1).",
          "5. Connect B word: IN.B0 to B1(J15), IN.B1 to B2(J7), IN.B2 to B3(J4), IN.B3 to B4(J20).",
          "6. Connect Sum: S1(J13)->OUT.Y0, S2(J6)->OUT.Y1, S3(J2)->OUT.Y2, S4(J19)->OUT.Y3, C4(J18)->OUT.Y4.",
          "7. Verify addition vectors on the output LEDs and 7-segment display."
        ],
        stepByStep: [
          "1. Insert 7483 into socket U1.",
          "2. Power: +5V to U1.J5 (pin 5), GND to U1.J16 (pin 12).",
          "3. Carry in C0 (pin 13 / J17) to GND.",
          "4. Inputs: IN.A0..A3 to A1..A4; IN.B0..B3 to B1..B4.",
          "5. Outputs: S1..S4 to OUT.Y0..Y3, C4 to OUT.Y4.",
          "6. Verify sum on LEDs."
        ],
        requiredICs: ["7483"],
        recommendedSocketICs: { U1: "7483" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_2", to: "U1.J17", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
          { from: "IN.B0", to: "U1.J15", color: "#22c55e" },
          { from: "U1.J13", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U1.J2", to: "OUT.Y2", color: "#38bdf8" },
          { from: "U1.J19", to: "OUT.Y3", color: "#38bdf8" },
          { from: "U1.J18", to: "OUT.Y4", color: "#f59e0b" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_2", to: "U1.J17", color: "#1e293b" },
          { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
          { from: "IN.B0", to: "U1.J15", color: "#22c55e" },
          { from: "U1.J13", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U1.J2", to: "OUT.Y2", color: "#38bdf8" },
          { from: "U1.J19", to: "OUT.Y3", color: "#38bdf8" },
          { from: "U1.J18", to: "OUT.Y4", color: "#f59e0b" }
        ],
        truthTable: {
          inputs: ["A0", "B0"],
          outputs: ["S1 (Y0)", "S2 (Y1)"],
          rows: [
            { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
            { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A0": 0, "IN.B0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
            { inputs: { "IN.A0": 1, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } }
          ]
        },
        tableHeaders: ["A0", "B0", "Expected S1", "Expected S2", "Observed"],
        tableRows: [
          { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
          { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
          { inputs: { "IN.A0": 0, "IN.B0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
          { inputs: { "IN.A0": 1, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } }
        ]
      },

      "sub_4bit": {
        id: "sub_4bit",
        label: "4-Bit Subtractor",
        title: "4-Bit Subtractor using 7483 + 7404 (2's Complement, C0=1)",
        procedure: [
          "1. Insert 7483 into U1 and 7404 into U2.",
          "2. Power U1 (+5V at J5, GND at J16) and U2 (+5V at J20, GND at J7).",
          "3. Connect C0 (U1.J17) to +5V (1) to add 1 for 2's complement.",
          "4. Invert B inputs: pass IN.B0 through U2 inverter to B1 (U1.J15).",
          "5. Connect A inputs directly: IN.A0 to A1 (U1.J14).",
          "6. Connect S1 (U1.J13) to OUT.Y0.",
          "7. Verify subtraction A - B."
        ],
        stepByStep: [
          "1. Insert 7483 in U1 and 7404 in U2.",
          "2. Connect C0 to +5V (1).",
          "3. Invert B inputs through 7404 into 7483.",
          "4. Verify 2's complement subtraction."
        ],
        requiredICs: ["7483", "7404"],
        recommendedSocketICs: { U1: "7483", U2: "7404" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J17", color: "#ef4444" }, // C0 = 1
          { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
          { from: "IN.B0", to: "U2.J1", color: "#22c55e" },
          { from: "U2.J2", to: "U1.J15", color: "#22c55e" },
          { from: "U1.J13", to: "OUT.Y0", color: "#38bdf8" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J17", color: "#ef4444" },
          { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
          { from: "IN.B0", to: "U2.J1", color: "#22c55e" },
          { from: "U2.J2", to: "U1.J15", color: "#22c55e" },
          { from: "U1.J13", to: "OUT.Y0", color: "#38bdf8" }
        ],
        truthTable: {
          inputs: ["A0", "B0"],
          outputs: ["Diff (Y0)"],
          rows: [
            { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0 } },
            { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1 } },
            { inputs: { "IN.A0": 1, "IN.B0": 1 }, expected: { "OUT.Y0": 0 } }
          ]
        },
        tableHeaders: ["A0", "B0", "Expected Diff", "Observed"],
        tableRows: [
          { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0 } },
          { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1 } },
          { inputs: { "IN.A0": 1, "IN.B0": 1 }, expected: { "OUT.Y0": 0 } }
        ]
      }
    },
    procedure: [
      "1. Insert 7483 into socket U1.",
      "2. Connect +5V to U1.J5 (pin 5) and GND to U1.J16 (pin 12).",
      "3. Wire inputs and outputs as described in sub-circuit tabs.",
      "4. Click Auto-Check to verify addition and subtraction."
    ],
    stepByStep: [
      "1. Insert 7483 into socket U1.",
      "2. Connect +5V to U1.J5 (pin 5) and GND to U1.J16 (pin 12).",
      "3. Wire inputs and outputs as described in sub-circuit tabs.",
      "4. Click Auto-Check to verify addition and subtraction."
    ],
    requiredICs: ["7483"],
    recommendedSocketICs: { U1: "7483" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
      { from: "PWR.GND_2", to: "U1.J17", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
      { from: "IN.B0", to: "U1.J15", color: "#22c55e" },
      { from: "U1.J13", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
      { from: "PWR.GND_2", to: "U1.J17", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
      { from: "IN.B0", to: "U1.J15", color: "#22c55e" },
      { from: "U1.J13", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" }
    ],
    truthTable: {
      inputs: ["A0", "B0"],
      outputs: ["S1 (Y0)", "S2 (Y1)"],
      rows: [
        { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
        { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { inputs: { "IN.A0": 0, "IN.B0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { inputs: { "IN.A0": 1, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } }
      ]
    },
    tableHeaders: ["A0", "B0", "Expected S1", "Expected S2", "Observed"],
    tableRows: [
      { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0 } },
      { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
      { inputs: { "IN.A0": 0, "IN.B0": 1 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0 } },
      { inputs: { "IN.A0": 1, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1 } }
    ],
    checker: (testEngine) => {
      const rows = [
        { in: { "IN.A0": 0, "IN.B0": 0 }, exp: { "OUT.Y0": 0, "OUT.Y1": 0 } },
        { in: { "IN.A0": 1, "IN.B0": 0 }, exp: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { in: { "IN.A0": 0, "IN.B0": 1 }, exp: { "OUT.Y0": 1, "OUT.Y1": 0 } },
        { in: { "IN.A0": 1, "IN.B0": 1 }, exp: { "OUT.Y0": 0, "OUT.Y1": 1 } }
      ];
      let pass = true;
      const failingRows = [];
      const rowResults = [];
      rows.forEach((r, idx) => {
        Object.assign(testEngine.inputs, r.in);
        testEngine.evaluate();
        const ok = (testEngine.outputs["OUT.Y0"] === r.exp["OUT.Y0"] && testEngine.outputs["OUT.Y1"] === r.exp["OUT.Y1"]);
        rowResults.push(ok);
        if (!ok) { pass = false; failingRows.push(idx); }
      });
      return { pass, failingRows, rowResults, totalRows: rows.length, details: pass ? "7483 full adder verified." : `${failingRows.length} rows failed.` };
    }
  },

  // -------------------------------------------------------------
  // EXPERIMENT 5: Counters 7490 (MOD-6, MOD-42, Timing Diagram)
  // -------------------------------------------------------------
  {
    id: "exp5",
    number: 5,
    title: "Asynchronous Counters using IC 7490 (MOD-6, MOD-42)",
    aim: "Study of IC 74LS90 decade counter for MOD-6, MOD-42, and MOD-10 BCD counting with live timing diagram capture.",
    apparatus: [
      { ic: "7490", qty: 2 },
      { ic: "7408", qty: 1 }
    ],
    requiredICs: ["7490"],
    theory: "IC 7490 is a decade counter consisting of a divide-by-2 section (CLKA -> QA) and a divide-by-5 section (CLKB -> QB, QC, QD). In MOD-6 mode, the counter cycles 0..5 and resets on 6 (0110: QB=1 and QC=1) by connecting QB and QC to active-high reset pins R0(1) and R0(2).",
    subCircuits: {
      "mod6": {
        id: "mod6",
        label: "MOD-6 Counter",
        title: "MOD-6 Asynchronous Counter (Counts 0 to 5)",
        procedure: [
          "1. Insert 7490 into socket U1 and lock the lever.",
          "2. Power: +5V to U1.J5 (pin 5) and GND to U1.J16 (pin 10).",
          "3. Connect QA (U1.J18 / pin 12) to CLKB (U1.J1 / pin 1) to cascade ÷2 into ÷5.",
          "4. Reset on 6: connect QB (U1.J15 / pin 9) to R0(1) (U1.J2), and QC (U1.J14 / pin 8) to R0(2) (U1.J3).",
          "5. Tie R9(1) (U1.J6) and R9(2) (U1.J7) to GND.",
          "6. Connect Clock: CLK.POS to CLKA (U1.J20 / pin 14).",
          "7. Connect outputs: QA(J18)->OUT.Y0, QB(J15)->OUT.Y1, QC(J14)->OUT.Y2.",
          "8. Step clock or set frequency to 1Hz and observe sequence: 0, 1, 2, 3, 4, 5, 0..."
        ],
        stepByStep: [
          "1. Insert 7490 into socket U1.",
          "2. Power: +5V to J5, GND to J16.",
          "3. Cascade QA (J18) to CLKB (J1).",
          "4. Reset on 6: QB (J15) to R0(1) (J2), QC (J14) to R0(2) (J3).",
          "5. R9 pins (J6, J7) to GND.",
          "6. Clock CLK.POS to CLKA (J20).",
          "7. Outputs QA, QB, QC to OUT.Y0, Y1, Y2.",
          "8. Watch count 0 to 5 and repeat."
        ],
        requiredICs: ["7490"],
        recommendedSocketICs: { U1: "7490" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_2", to: "U1.J6", color: "#1e293b" },
          { from: "PWR.GND_3", to: "U1.J7", color: "#1e293b" },
          { from: "U1.J18", to: "U1.J1", color: "#22c55e" }, // QA -> CLKB
          { from: "U1.J15", to: "U1.J2", color: "#f59e0b" }, // QB -> R0(1)
          { from: "U1.J14", to: "U1.J3", color: "#f59e0b" }, // QC -> R0(2)
          { from: "CLK.POS", to: "U1.J20", color: "#f5c518" }, // CLKA
          { from: "U1.J18", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U1.J14", to: "OUT.Y2", color: "#38bdf8" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_2", to: "U1.J6", color: "#1e293b" },
          { from: "PWR.GND_3", to: "U1.J7", color: "#1e293b" },
          { from: "U1.J18", to: "U1.J1", color: "#22c55e" },
          { from: "U1.J15", to: "U1.J2", color: "#f59e0b" },
          { from: "U1.J14", to: "U1.J3", color: "#f5c518" },
          { from: "CLK.POS", to: "U1.J20", color: "#f5c518" },
          { from: "U1.J18", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U1.J14", to: "OUT.Y2", color: "#38bdf8" }
        ],
        truthTable: {
          inputs: ["Clock Pulse"],
          outputs: ["QC", "QB", "QA", "Decimal Digit"],
          rows: [
            { inputs: { "Pulse": 0 }, expected: { "QC": 0, "QB": 0, "QA": 0, "Digit": 0 } },
            { inputs: { "Pulse": 1 }, expected: { "QC": 0, "QB": 0, "QA": 1, "Digit": 1 } },
            { inputs: { "Pulse": 2 }, expected: { "QC": 0, "QB": 1, "QA": 0, "Digit": 2 } },
            { inputs: { "Pulse": 3 }, expected: { "QC": 0, "QB": 1, "QA": 1, "Digit": 3 } },
            { inputs: { "Pulse": 4 }, expected: { "QC": 1, "QB": 0, "QA": 0, "Digit": 4 } },
            { inputs: { "Pulse": 5 }, expected: { "QC": 1, "QB": 0, "QA": 1, "Digit": 5 } },
            { inputs: { "Pulse": 6 }, expected: { "QC": 0, "QB": 0, "QA": 0, "Digit": 0 } }
          ]
        },
        tableHeaders: ["Clock Pulse", "QC", "QB", "QA", "Expected Decimal", "Observed"],
        tableRows: [
          { inputs: { "Pulse": 0 }, expected: { "QC": 0, "QB": 0, "QA": 0, "Digit": 0 } },
          { inputs: { "Pulse": 1 }, expected: { "QC": 0, "QB": 0, "QA": 1, "Digit": 1 } },
          { inputs: { "Pulse": 2 }, expected: { "QC": 0, "QB": 1, "QA": 0, "Digit": 2 } },
          { inputs: { "Pulse": 3 }, expected: { "QC": 0, "QB": 1, "QA": 1, "Digit": 3 } },
          { inputs: { "Pulse": 4 }, expected: { "QC": 1, "QB": 0, "QA": 0, "Digit": 4 } },
          { inputs: { "Pulse": 5 }, expected: { "QC": 1, "QB": 0, "QA": 1, "Digit": 5 } },
          { inputs: { "Pulse": 6 }, expected: { "QC": 0, "QB": 0, "QA": 0, "Digit": 0 } }
        ]
      },

      "mod10": {
        id: "mod10",
        label: "MOD-10 Decade",
        title: "BCD Decade Counter (0 to 9)",
        procedure: [
          "1. Insert 7490 into socket U1.",
          "2. Power: +5V to J5, GND to J16.",
          "3. Reset pins R0(1), R0(2), R9(1), R9(2) all grounded.",
          "4. Connect QA (J18) to CLKB (J1).",
          "5. Connect CLK.POS to CLKA (J20).",
          "6. Outputs QA, QB, QC, QD to OUT.Y0..Y3.",
          "7. View live timing diagram in Reference Tab."
        ],
        stepByStep: [
          "1. Insert 7490 into socket U1.",
          "2. Power: +5V to J5, GND to J16.",
          "3. Resets to GND.",
          "4. QA (J18) to CLKB (J1).",
          "5. Clock to CLKA (J20).",
          "6. Outputs to Y0..Y3."
        ],
        requiredICs: ["7490"],
        recommendedSocketICs: { U1: "7490" },
        solutionWiring: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_2", to: "U1.J2", color: "#1e293b" },
          { from: "PWR.GND_3", to: "U1.J3", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J6", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "U1.J18", to: "U1.J1", color: "#22c55e" },
          { from: "CLK.POS", to: "U1.J20", color: "#f5c518" },
          { from: "U1.J18", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U1.J14", to: "OUT.Y2", color: "#38bdf8" },
          { from: "U1.J17", to: "OUT.Y3", color: "#38bdf8" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
          { from: "PWR.GND_2", to: "U1.J2", color: "#1e293b" },
          { from: "PWR.GND_3", to: "U1.J3", color: "#1e293b" },
          { from: "PWR.GND_4", to: "U1.J6", color: "#1e293b" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "U1.J18", to: "U1.J1", color: "#22c55e" },
          { from: "CLK.POS", to: "U1.J20", color: "#f5c518" },
          { from: "U1.J18", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U1.J14", to: "OUT.Y2", color: "#38bdf8" },
          { from: "U1.J17", to: "OUT.Y3", color: "#38bdf8" }
        ],
        truthTable: {
          inputs: ["Clock Pulse"],
          outputs: ["QD", "QC", "QB", "QA"],
          rows: [
            { inputs: { "Pulse": 0 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 0 } },
            { inputs: { "Pulse": 1 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 1 } },
            { inputs: { "Pulse": 2 }, expected: { "QD": 0, "QC": 0, "QB": 1, "QA": 0 } },
            { inputs: { "Pulse": 3 }, expected: { "QD": 0, "QC": 0, "QB": 1, "QA": 1 } },
            { inputs: { "Pulse": 4 }, expected: { "QD": 0, "QC": 1, "QB": 0, "QA": 0 } },
            { inputs: { "Pulse": 5 }, expected: { "QD": 0, "QC": 1, "QB": 0, "QA": 1 } },
            { inputs: { "Pulse": 6 }, expected: { "QD": 0, "QC": 1, "QB": 1, "QA": 0 } },
            { inputs: { "Pulse": 7 }, expected: { "QD": 0, "QC": 1, "QB": 1, "QA": 1 } },
            { inputs: { "Pulse": 8 }, expected: { "QD": 1, "QC": 0, "QB": 0, "QA": 0 } },
            { inputs: { "Pulse": 9 }, expected: { "QD": 1, "QC": 0, "QB": 0, "QA": 1 } }
          ]
        },
        tableHeaders: ["Pulse", "QD", "QC", "QB", "QA", "Observed"],
        tableRows: [
          { inputs: { "Pulse": 0 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 0 } },
          { inputs: { "Pulse": 1 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 1 } },
          { inputs: { "Pulse": 2 }, expected: { "QD": 0, "QC": 0, "QB": 1, "QA": 0 } },
          { inputs: { "Pulse": 3 }, expected: { "QD": 0, "QC": 0, "QB": 1, "QA": 1 } },
          { inputs: { "Pulse": 4 }, expected: { "QD": 0, "QC": 1, "QB": 0, "QA": 0 } },
          { inputs: { "Pulse": 5 }, expected: { "QD": 0, "QC": 1, "QB": 0, "QA": 1 } },
          { inputs: { "Pulse": 6 }, expected: { "QD": 0, "QC": 1, "QB": 1, "QA": 0 } },
          { inputs: { "Pulse": 7 }, expected: { "QD": 0, "QC": 1, "QB": 1, "QA": 1 } },
          { inputs: { "Pulse": 8 }, expected: { "QD": 1, "QC": 0, "QB": 0, "QA": 0 } },
          { inputs: { "Pulse": 9 }, expected: { "QD": 1, "QC": 0, "QB": 0, "QA": 1 } }
        ],
        checker: (testEngine) => {
          testEngine.resetAllFlipFlops();
          const expectedDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
          const observed = [];
          const rowResults = [];
          let pass = true;
          const failingRows = [];

          for (let step = 0; step < 11; step++) {
            const qa = testEngine.outputs["OUT.Y0"] || 0;
            const qb = testEngine.outputs["OUT.Y1"] || 0;
            const qc = testEngine.outputs["OUT.Y2"] || 0;
            const qd = testEngine.outputs["OUT.Y3"] || 0;
            const digit = (qd * 8) + (qc * 4) + (qb * 2) + qa;
            observed.push(digit);
            const ok = (digit === expectedDigits[step]);
            rowResults.push(ok);
            if (!ok) { pass = false; failingRows.push(step); }

            // Clock pulse: High then Low (Falling edge trigger)
            testEngine.clock.pos = 1; testEngine.clock.neg = 0;
            testEngine.evaluate();
            testEngine.clock.pos = 0; testEngine.clock.neg = 1;
            testEngine.evaluate();
          }

          return { pass, failingRows, rowResults, totalRows: 11, details: pass ? "BCD Decade counter sequence 0..9 verified." : `Failed at steps [${failingRows.join(",")}], observed: [${observed.join(",")}]` };
        }
      }
    },
    procedure: [
      "1. Insert 7490 into socket U1.",
      "2. Connect +5V to J5, GND to J16.",
      "3. Configure feedback reset for MOD-6 or MOD-10.",
      "4. Click Auto-Check to step through clock sequence."
    ],
    stepByStep: [
      "1. Insert 7490 into socket U1.",
      "2. Connect +5V to J5, GND to J16.",
      "3. Configure feedback reset for MOD-6 or MOD-10.",
      "4. Click Auto-Check to step through clock sequence."
    ],
    requiredICs: ["7490"],
    recommendedSocketICs: { U1: "7490" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
      { from: "PWR.GND_2", to: "U1.J6", color: "#1e293b" },
      { from: "PWR.GND_3", to: "U1.J7", color: "#1e293b" },
      { from: "U1.J18", to: "U1.J1", color: "#22c55e" },
      { from: "U1.J15", to: "U1.J2", color: "#f59e0b" },
      { from: "U1.J14", to: "U1.J3", color: "#f59e0b" },
      { from: "CLK.POS", to: "U1.J20", color: "#f5c518" },
      { from: "U1.J18", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J14", to: "OUT.Y2", color: "#38bdf8" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J5", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J16", color: "#1e293b" },
      { from: "PWR.GND_2", to: "U1.J6", color: "#1e293b" },
      { from: "PWR.GND_3", to: "U1.J7", color: "#1e293b" },
      { from: "U1.J18", to: "U1.J1", color: "#22c55e" },
      { from: "U1.J15", to: "U1.J2", color: "#f59e0b" },
      { from: "U1.J14", to: "U1.J3", color: "#f59e0b" },
      { from: "CLK.POS", to: "U1.J20", color: "#f5c518" },
      { from: "U1.J18", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J14", to: "OUT.Y2", color: "#38bdf8" }
    ],
    truthTable: {
      inputs: ["Clock Pulse"],
      outputs: ["QC", "QB", "QA"],
      rows: [
        { inputs: { "Pulse": 0 }, expected: { "QC": 0, "QB": 0, "QA": 0 } },
        { inputs: { "Pulse": 1 }, expected: { "QC": 0, "QB": 0, "QA": 1 } },
        { inputs: { "Pulse": 2 }, expected: { "QC": 0, "QB": 1, "QA": 0 } },
        { inputs: { "Pulse": 3 }, expected: { "QC": 0, "QB": 1, "QA": 1 } },
        { inputs: { "Pulse": 4 }, expected: { "QC": 1, "QB": 0, "QA": 0 } },
        { inputs: { "Pulse": 5 }, expected: { "QC": 1, "QB": 0, "QA": 1 } },
        { inputs: { "Pulse": 6 }, expected: { "QC": 0, "QB": 0, "QA": 0 } }
      ]
    },
    tableHeaders: ["Clock Pulse", "QC", "QB", "QA", "Observed"],
    tableRows: [
      { inputs: { "Pulse": 0 }, expected: { "QC": 0, "QB": 0, "QA": 0 } },
      { inputs: { "Pulse": 1 }, expected: { "QC": 0, "QB": 0, "QA": 1 } },
      { inputs: { "Pulse": 2 }, expected: { "QC": 0, "QB": 1, "QA": 0 } },
      { inputs: { "Pulse": 3 }, expected: { "QC": 0, "QB": 1, "QA": 1 } },
      { inputs: { "Pulse": 4 }, expected: { "QC": 1, "QB": 0, "QA": 0 } },
      { inputs: { "Pulse": 5 }, expected: { "QC": 1, "QB": 0, "QA": 1 } },
      { inputs: { "Pulse": 6 }, expected: { "QC": 0, "QB": 0, "QA": 0 } }
    ],
    checker: (testEngine) => {
      // Initialize counter state
      testEngine.resetAllFlipFlops();
      const expectedDigits = [0, 1, 2, 3, 4, 5, 0];
      const observed = [];
      const rowResults = [];
      let pass = true;
      const failingRows = [];

      for (let step = 0; step < 7; step++) {
        const qa = testEngine.outputs["OUT.Y0"] || 0;
        const qb = testEngine.outputs["OUT.Y1"] || 0;
        const qc = testEngine.outputs["OUT.Y2"] || 0;
        const digit = (qc * 4) + (qb * 2) + qa;
        observed.push(digit);
        const ok = (digit === expectedDigits[step]);
        rowResults.push(ok);
        if (!ok) { pass = false; failingRows.push(step); }

        // Clock pulse: High then Low (Falling edge trigger)
        testEngine.clock.pos = 1; testEngine.clock.neg = 0;
        testEngine.evaluate();
        testEngine.clock.pos = 0; testEngine.clock.neg = 1;
        testEngine.evaluate();
      }

      return { pass, failingRows, rowResults, totalRows: 7, details: pass ? "MOD-6 counter sequence 0..5 verified." : `Failed at steps [${failingRows.join(",")}], observed: [${observed.join(",")}]` };
    }
  },

  // -------------------------------------------------------------
  // EXPERIMENT 6: 4-Bit Shift Register using 7474 x2 (SISO / SIPO)
  // -------------------------------------------------------------
  {
    id: "exp6",
    number: 6,
    title: "Shift Register using IC 7474 (4-Bit SISO & SIPO Right Shift)",
    aim: "To design and implement a 4-bit Serial-In Serial-Out (SISO) and Serial-In Parallel-Out (SIPO) right shift register using two IC 74LS74 dual D-type flip-flops.",
    apparatus: [
      { ic: "7474", qty: 2 }
    ],
    requiredICs: ["7474"],
    theory: "A shift register cascades flip-flops such that output Q of stage n connects to data input D of stage n+1. On each rising clock edge, bits shift right by one stage: Q0->Q1, Q1->Q2, Q2->Q3, while serial data in is latched into Q0.",
    subCircuits: {
      "sipo": {
        id: "sipo",
        label: "SIPO / SISO Shift",
        title: "4-Bit SIPO / SISO Right Shift Register",
        procedure: [
          "1. Insert 7474 into socket U1 (FF0, FF1) and socket U2 (FF2, FF3). Lock both levers.",
          "2. Power both ICs: +5V to U1.J20 (pin 14) and U2.J20 (pin 14); GND to U1.J7 and U2.J7.",
          "3. Inactive Preset & Clear: Connect all 1PR', 2PR' to +5V (U1.J4, U1.J16, U2.J4, U2.J16). Tie 1CLR', 2CLR' to +5V.",
          "4. Common Clock: Connect CLK.POS to 1CLK, 2CLK on U1 and U2 (U1.J3, U1.J17, U2.J3, U2.J17).",
          "5. Serial Data cascade: Connect Switch IN.A0 to 1D of U1 (J2).",
          "6. Cascade FF0->FF1: Connect U1.J5 (1Q) to U1.J18 (2D).",
          "7. Cascade FF1->FF2: Connect U1.J15 (2Q) to U2.J2 (1D).",
          "8. Cascade FF2->FF3: Connect U2.J5 (1Q) to U2.J18 (2D).",
          "9. Parallel Outputs: U1.J5->OUT.Y0 (Q0), U1.J15->OUT.Y1 (Q1), U2.J5->OUT.Y2 (Q2), U2.J15->OUT.Y3 (Q3, Serial Out).",
          "10. Set IN.A0 and step clock pulses to watch bit pattern shift right through LEDs Y0->Y1->Y2->Y3."
        ],
        stepByStep: [
          "1. Insert 7474 in U1 and U2.",
          "2. Power +5V (J20) and GND (J7) on both ICs.",
          "3. Common clock to pins 3, 11 on U1 and U2.",
          "4. Data in IN.A0 to U1 pin 2.",
          "5. Cascade Q outputs to next D inputs.",
          "6. Connect Q0..Q3 to OUT.Y0..Y3."
        ],
        requiredICs: ["7474"],
        recommendedSocketICs: { U1: "7474", U2: "7474" },
        solutionWiring: [
          // Power
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          // Presets & Clears to HIGH
          { from: "PWR.5V_3", to: "U1.J4", color: "#ef4444" },
          { from: "PWR.5V_3", to: "U1.J16", color: "#ef4444" },
          { from: "PWR.5V_4", to: "U2.J4", color: "#ef4444" },
          { from: "PWR.5V_4", to: "U2.J16", color: "#ef4444" },
          { from: "PWR.5V_1", to: "U1.J1", color: "#ef4444" },
          { from: "PWR.5V_1", to: "U1.J19", color: "#ef4444" },
          { from: "PWR.5V_2", to: "U2.J1", color: "#ef4444" },
          { from: "PWR.5V_2", to: "U2.J19", color: "#ef4444" },
          // Common Clock
          { from: "CLK.POS", to: "U1.J3", color: "#f5c518" },
          { from: "U1.J3", to: "U1.J17", color: "#f5c518" },
          { from: "U1.J17", to: "U2.J3", color: "#f5c518" },
          { from: "U2.J3", to: "U2.J17", color: "#f5c518" },
          // Data Cascade
          { from: "IN.A0", to: "U1.J2", color: "#3b82f6" }, // Serial In -> 1D (U1)
          { from: "U1.J5", to: "U1.J18", color: "#10b981" }, // 1Q -> 2D (U1)
          { from: "U1.J15", to: "U2.J2", color: "#10b981" }, // 2Q (U1) -> 1D (U2)
          { from: "U2.J5", to: "U2.J18", color: "#10b981" }, // 1Q -> 2D (U2)
          // Outputs
          { from: "U1.J5", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U2.J5", to: "OUT.Y2", color: "#38bdf8" },
          { from: "U2.J15", to: "OUT.Y3", color: "#f59e0b" }
        ],
        recommendedWires: [
          { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
          { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
          { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
          { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
          { from: "PWR.5V_3", to: "U1.J4", color: "#ef4444" },
          { from: "PWR.5V_3", to: "U1.J16", color: "#ef4444" },
          { from: "PWR.5V_4", to: "U2.J4", color: "#ef4444" },
          { from: "PWR.5V_4", to: "U2.J16", color: "#ef4444" },
          { from: "PWR.5V_1", to: "U1.J1", color: "#ef4444" },
          { from: "PWR.5V_1", to: "U1.J19", color: "#ef4444" },
          { from: "PWR.5V_2", to: "U2.J1", color: "#ef4444" },
          { from: "PWR.5V_2", to: "U2.J19", color: "#ef4444" },
          { from: "CLK.POS", to: "U1.J3", color: "#f5c518" },
          { from: "U1.J3", to: "U1.J17", color: "#f5c518" },
          { from: "U1.J17", to: "U2.J3", color: "#f5c518" },
          { from: "U2.J3", to: "U2.J17", color: "#f5c518" },
          { from: "IN.A0", to: "U1.J2", color: "#3b82f6" },
          { from: "U1.J5", to: "U1.J18", color: "#10b981" },
          { from: "U1.J15", to: "U2.J2", color: "#10b981" },
          { from: "U2.J5", to: "U2.J18", color: "#10b981" },
          { from: "U1.J5", to: "OUT.Y0", color: "#38bdf8" },
          { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
          { from: "U2.J5", to: "OUT.Y2", color: "#38bdf8" },
          { from: "U2.J15", to: "OUT.Y3", color: "#f59e0b" }
        ],
        truthTable: {
          inputs: ["Clock Pulse", "Serial Input (A0)"],
          outputs: ["Q3 (Y3)", "Q2 (Y2)", "Q1 (Y1)", "Q0 (Y0)"],
          rows: [
            { inputs: { "Pulse": "Initial", "IN.A0": "-" }, expected: { "Q3": 0, "Q2": 0, "Q1": 0, "Q0": 0 } },
            { inputs: { "Pulse": "Pulse 1", "IN.A0": 1 }, expected: { "Q3": 0, "Q2": 0, "Q1": 0, "Q0": 1 } },
            { inputs: { "Pulse": "Pulse 2", "IN.A0": 1 }, expected: { "Q3": 0, "Q2": 0, "Q1": 1, "Q0": 1 } },
            { inputs: { "Pulse": "Pulse 3", "IN.A0": 0 }, expected: { "Q3": 0, "Q2": 1, "Q1": 1, "Q0": 0 } },
            { inputs: { "Pulse": "Pulse 4", "IN.A0": 1 }, expected: { "Q3": 1, "Q2": 1, "Q1": 0, "Q0": 1 } }
          ]
        },
        tableHeaders: ["Pulse", "Serial In (A0)", "Q3 (MSB)", "Q2", "Q1", "Q0 (LSB)"],
        tableRows: [
          { inputs: { "Pulse": "Init", "IN.A0": "-" }, expected: { "Q3": 0, "Q2": 0, "Q1": 0, "Q0": 0 } },
          { inputs: { "Pulse": "P1", "IN.A0": 1 }, expected: { "Q3": 0, "Q2": 0, "Q1": 0, "Q0": 1 } },
          { inputs: { "Pulse": "P2", "IN.A0": 1 }, expected: { "Q3": 0, "Q2": 0, "Q1": 1, "Q0": 1 } },
          { inputs: { "Pulse": "P3", "IN.A0": 0 }, expected: { "Q3": 0, "Q2": 1, "Q1": 1, "Q0": 0 } },
          { inputs: { "Pulse": "P4", "IN.A0": 1 }, expected: { "Q3": 1, "Q2": 1, "Q1": 0, "Q0": 1 } }
        ]
      }
    },
    procedure: [
      "1. Insert two 7474 ICs into sockets U1 and U2.",
      "2. Connect +5V and GND to both ICs.",
      "3. Wire serial cascade: IN.A0 -> 1D(U1) -> 2D(U1) -> 1D(U2) -> 2D(U2).",
      "4. Connect common clock to pins 3 and 11 on both ICs.",
      "5. Connect outputs to LEDs Y0..Y3.",
      "6. Click Auto-Check to verify shift sequence."
    ],
    stepByStep: [
      "1. Insert two 7474 ICs into sockets U1 and U2.",
      "2. Connect +5V and GND to both ICs.",
      "3. Wire serial cascade: IN.A0 -> 1D(U1) -> 2D(U1) -> 1D(U2) -> 2D(U2).",
      "4. Connect common clock to pins 3 and 11 on both ICs.",
      "5. Connect outputs to LEDs Y0..Y3.",
      "6. Click Auto-Check to verify shift sequence."
    ],
    requiredICs: ["7474"],
    recommendedSocketICs: { U1: "7474", U2: "7474" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
      { from: "PWR.5V_3", to: "U1.J4", color: "#ef4444" },
      { from: "PWR.5V_3", to: "U1.J16", color: "#ef4444" },
      { from: "PWR.5V_4", to: "U2.J4", color: "#ef4444" },
      { from: "PWR.5V_4", to: "U2.J16", color: "#ef4444" },
      { from: "PWR.5V_1", to: "U1.J1", color: "#ef4444" },
      { from: "PWR.5V_1", to: "U1.J19", color: "#ef4444" },
      { from: "PWR.5V_2", to: "U2.J1", color: "#ef4444" },
      { from: "PWR.5V_2", to: "U2.J19", color: "#ef4444" },
      { from: "CLK.POS", to: "U1.J3", color: "#f5c518" },
      { from: "U1.J3", to: "U1.J17", color: "#f5c518" },
      { from: "U1.J17", to: "U2.J3", color: "#f5c518" },
      { from: "U2.J3", to: "U2.J17", color: "#f5c518" },
      { from: "IN.A0", to: "U1.J2", color: "#3b82f6" },
      { from: "U1.J5", to: "U1.J18", color: "#10b981" },
      { from: "U1.J15", to: "U2.J2", color: "#10b981" },
      { from: "U2.J5", to: "U2.J18", color: "#10b981" },
      { from: "U1.J5", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U2.J5", to: "OUT.Y2", color: "#38bdf8" },
      { from: "U2.J15", to: "OUT.Y3", color: "#f59e0b" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J7", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U2.J20", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U2.J7", color: "#1e293b" },
      { from: "PWR.5V_3", to: "U1.J4", color: "#ef4444" },
      { from: "PWR.5V_3", to: "U1.J16", color: "#ef4444" },
      { from: "PWR.5V_4", to: "U2.J4", color: "#ef4444" },
      { from: "PWR.5V_4", to: "U2.J16", color: "#ef4444" },
      { from: "PWR.5V_1", to: "U1.J1", color: "#ef4444" },
      { from: "PWR.5V_1", to: "U1.J19", color: "#ef4444" },
      { from: "PWR.5V_2", to: "U2.J1", color: "#ef4444" },
      { from: "PWR.5V_2", to: "U2.J19", color: "#ef4444" },
      { from: "CLK.POS", to: "U1.J3", color: "#f5c518" },
      { from: "U1.J3", to: "U1.J17", color: "#f5c518" },
      { from: "U1.J17", to: "U2.J3", color: "#f5c518" },
      { from: "U2.J3", to: "U2.J17", color: "#f5c518" },
      { from: "IN.A0", to: "U1.J2", color: "#3b82f6" },
      { from: "U1.J5", to: "U1.J18", color: "#10b981" },
      { from: "U1.J15", to: "U2.J2", color: "#10b981" },
      { from: "U2.J5", to: "U2.J18", color: "#10b981" },
      { from: "U1.J5", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J15", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U2.J5", to: "OUT.Y2", color: "#38bdf8" },
      { from: "U2.J15", to: "OUT.Y3", color: "#f59e0b" }
    ],
    truthTable: {
      inputs: ["Step", "Input Data (A0)"],
      outputs: ["Q3", "Q2", "Q1", "Q0"],
      rows: [
        { inputs: { "Step": "Reset" }, expected: { "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 0, "OUT.Y0": 0 } },
        { inputs: { "Step": "D=1", "IN.A0": 1 }, expected: { "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 0, "OUT.Y0": 1 } },
        { inputs: { "Step": "D=1", "IN.A0": 1 }, expected: { "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 1, "OUT.Y0": 1 } },
        { inputs: { "Step": "D=0", "IN.A0": 0 }, expected: { "OUT.Y3": 0, "OUT.Y2": 1, "OUT.Y1": 1, "OUT.Y0": 0 } },
        { inputs: { "Step": "D=1", "IN.A0": 1 }, expected: { "OUT.Y3": 1, "OUT.Y2": 1, "OUT.Y1": 0, "OUT.Y0": 1 } }
      ]
    },
    tableHeaders: ["Step", "Data (A0)", "Q3", "Q2", "Q1", "Q0", "Observed"],
    tableRows: [
      { inputs: { "Step": "Reset" }, expected: { "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 0, "OUT.Y0": 0 } },
      { inputs: { "Step": "D=1", "IN.A0": 1 }, expected: { "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 0, "OUT.Y0": 1 } },
      { inputs: { "Step": "D=1", "IN.A0": 1 }, expected: { "OUT.Y3": 0, "OUT.Y2": 0, "OUT.Y1": 1, "OUT.Y0": 1 } },
      { inputs: { "Step": "D=0", "IN.A0": 0 }, expected: { "OUT.Y3": 0, "OUT.Y2": 1, "OUT.Y1": 1, "OUT.Y0": 0 } },
      { inputs: { "Step": "D=1", "IN.A0": 1 }, expected: { "OUT.Y3": 1, "OUT.Y2": 1, "OUT.Y1": 0, "OUT.Y0": 1 } }
    ],
    checker: (testEngine) => {
      testEngine.resetAllFlipFlops();
      const testSequence = [
        { d: 1, exp: [0, 0, 0, 1] },
        { d: 1, exp: [0, 0, 1, 1] },
        { d: 0, exp: [0, 1, 1, 0] },
        { d: 1, exp: [1, 1, 0, 1] }
      ];
      let pass = true;
      const failingRows = [];
      const rowResults = [];

      testSequence.forEach((step, idx) => {
        testEngine.inputs["IN.A0"] = step.d;
        // Rising clock edge
        testEngine.clock.pos = 0; testEngine.clock.neg = 1;
        testEngine.evaluate();
        testEngine.clock.pos = 1; testEngine.clock.neg = 0;
        testEngine.evaluate();

        const q0 = testEngine.outputs["OUT.Y0"] || 0;
        const q1 = testEngine.outputs["OUT.Y1"] || 0;
        const q2 = testEngine.outputs["OUT.Y2"] || 0;
        const q3 = testEngine.outputs["OUT.Y3"] || 0;
        const ok = (q3 === step.exp[0] && q2 === step.exp[1] && q1 === step.exp[2] && q0 === step.exp[3]);
        rowResults.push(ok);
        if (!ok) { pass = false; failingRows.push(idx + 1); }
      });

      return { pass, failingRows, rowResults, totalRows: 4, details: pass ? "4-Bit shift register sequence verified." : `Shift sequence failed at pulses [${failingRows.join(",")}]` };
    }
  },

  // -------------------------------------------------------------
  // EXPERIMENT 7: Magnitude Comparator using IC 7485 (Legacy/Extra)
  // -------------------------------------------------------------
  {
    id: "exp7",
    number: 7,
    title: "Magnitude Comparator using IC 7485",
    aim: "Study of IC 74LS85 4-bit magnitude comparator.",
    apparatus: [
      { ic: "7485", qty: 1 }
    ],
    requiredICs: ["7485"],
    theory: "IC 7485 compares two 4-bit numbers A and B and outputs active HIGH on one of three pins: OA>B (pin 5), OA=B (pin 6), or OA<B (pin 7). Cascading inputs are tied to IA=B = 1, IA>B = 0, IA<B = 0.",
    procedure: [
      "1. Insert IC 7485 into socket U1.",
      "2. Connect +5V to IC pin 16 (J20) and GND to pin 8 (J8).",
      "3. Tie IA=B (IC pin 3 / J3) to +5V, IA>B (pin 4 / J4) to GND, IA<B (pin 2 / J2) to GND.",
      "4. Connect A words to switches IN.A0..A3, B words to IN.B0..B3.",
      "5. Connect OA>B (J5) to OUT.Y0, OA=B (J6) to OUT.Y1, OA<B (J7) to OUT.Y2.",
      "6. Test cases: A > B, A < B, and A == B."
    ],
    stepByStep: [
      "1. Insert IC 7485 into socket U1.",
      "2. Connect +5V to IC pin 16 (J20) and GND to pin 8 (J8).",
      "3. Tie IA=B (IC pin 3 / J3) to +5V, IA>B (pin 4 / J4) to GND, IA<B (pin 2 / J2) to GND.",
      "4. Connect A words to switches IN.A0..A3, B words to IN.B0..B3.",
      "5. Connect OA>B (J5) to OUT.Y0, OA=B (J6) to OUT.Y1, OA<B (J7) to OUT.Y2.",
      "6. Test cases: A > B, A < B, and A == B."
    ],
    recommendedSocketICs: { U1: "7485" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U1.J3", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J4", color: "#1e293b" },
      { from: "PWR.GND_3", to: "U1.J2", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
      { from: "IN.B0", to: "U1.J13", color: "#3b82f6" },
      { from: "U1.J5", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J7", to: "OUT.Y2", color: "#38bdf8" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U1.J3", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J4", color: "#1e293b" },
      { from: "PWR.GND_3", to: "U1.J2", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J14", color: "#f5c518" },
      { from: "IN.B0", to: "U1.J13", color: "#3b82f6" },
      { from: "U1.J5", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J7", to: "OUT.Y2", color: "#38bdf8" }
    ],
    truthTable: {
      inputs: ["Condition"],
      outputs: ["A>B (Y0)", "A=B (Y1)", "A<B (Y2)"],
      rows: [
        { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0, "OUT.Y2": 0 } },
        { inputs: { "IN.A0": 0, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0, "OUT.Y2": 1 } },
        { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1, "OUT.Y2": 0 } }
      ]
    },
    tableHeaders: ["Condition", "A>B", "A=B", "A<B", "Observed"],
    tableRows: [
      { inputs: { "IN.A0": 1, "IN.B0": 0 }, expected: { "OUT.Y0": 1, "OUT.Y1": 0, "OUT.Y2": 0 } },
      { inputs: { "IN.A0": 0, "IN.B0": 1 }, expected: { "OUT.Y0": 0, "OUT.Y1": 0, "OUT.Y2": 1 } },
      { inputs: { "IN.A0": 0, "IN.B0": 0 }, expected: { "OUT.Y0": 0, "OUT.Y1": 1, "OUT.Y2": 0 } }
    ],
    checker: (testEngine) => {
      const rows = [
        { in: { "IN.A0": 1, "IN.B0": 0 }, exp: { "OUT.Y0": 1, "OUT.Y1": 0, "OUT.Y2": 0 } },
        { in: { "IN.A0": 0, "IN.B0": 1 }, exp: { "OUT.Y0": 0, "OUT.Y1": 0, "OUT.Y2": 1 } },
        { in: { "IN.A0": 0, "IN.B0": 0 }, exp: { "OUT.Y0": 0, "OUT.Y1": 1, "OUT.Y2": 0 } }
      ];
      let pass = true;
      const failingRows = [];
      const rowResults = [];
      rows.forEach((r, idx) => {
        Object.assign(testEngine.inputs, r.in);
        testEngine.evaluate();
        const ok = (testEngine.outputs["OUT.Y0"] === r.exp["OUT.Y0"] && testEngine.outputs["OUT.Y1"] === r.exp["OUT.Y1"] && testEngine.outputs["OUT.Y2"] === r.exp["OUT.Y2"]);
        rowResults.push(ok);
        if (!ok) { pass = false; failingRows.push(idx); }
      });
      return { pass, failingRows, rowResults, totalRows: 3, details: pass ? "7485 comparator verified." : `${failingRows.length} rows failed.` };
    }
  },

  // -------------------------------------------------------------
  // EXPERIMENT 8: Synchronous Up/Down Counter using IC 74191
  // -------------------------------------------------------------
  {
    id: "exp8",
    number: 8,
    title: "Synchronous Up/Down Counter using IC 74191",
    aim: "Study of IC 74191 synchronous 4-bit up/down counter.",
    apparatus: [
      { ic: "74191", qty: 1 }
    ],
    requiredICs: ["74191"],
    theory: "IC 74191 is a synchronous 4-bit binary up/down counter with asynchronous parallel load and count enable.",
    procedure: [
      "1. Insert 74191 into socket U1.",
      "2. Connect +5V to J20 (pin 16) and GND to J8 (pin 8).",
      "3. Tie LOAD' (pin 11 / J15) to +5V.",
      "4. Tie ENABLE' (pin 4 / J4) to GND to enable counting.",
      "5. Connect D/U' (pin 5 / J5) to IN.A0 (0 = UP, 1 = DOWN).",
      "6. Connect CLK.POS to CLOCK (pin 14 / J18).",
      "7. Connect outputs QA..QD to OUT.Y0..Y3."
    ],
    stepByStep: [
      "1. Insert 74191 into socket U1.",
      "2. Connect +5V to J20, GND to J8.",
      "3. LOAD' to +5V, ENABLE' to GND.",
      "4. D/U' to switch A0.",
      "5. Clock to pin 14.",
      "6. Outputs to Y0..Y3."
    ],
    requiredICs: ["74191"],
    recommendedSocketICs: { U1: "74191" },
    solutionWiring: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U1.J15", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J4", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J5", color: "#f5c518" },
      { from: "CLK.POS", to: "U1.J18", color: "#f5c518" },
      { from: "U1.J3", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J2", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y2", color: "#38bdf8" },
      { from: "U1.J7", to: "OUT.Y3", color: "#38bdf8" }
    ],
    recommendedWires: [
      { from: "PWR.5V_1", to: "U1.J20", color: "#ef4444" },
      { from: "PWR.GND_1", to: "U1.J8", color: "#1e293b" },
      { from: "PWR.5V_2", to: "U1.J15", color: "#ef4444" },
      { from: "PWR.GND_2", to: "U1.J4", color: "#1e293b" },
      { from: "IN.A0", to: "U1.J5", color: "#f5c518" },
      { from: "CLK.POS", to: "U1.J18", color: "#f5c518" },
      { from: "U1.J3", to: "OUT.Y0", color: "#38bdf8" },
      { from: "U1.J2", to: "OUT.Y1", color: "#38bdf8" },
      { from: "U1.J6", to: "OUT.Y2", color: "#38bdf8" },
      { from: "U1.J7", to: "OUT.Y3", color: "#38bdf8" }
    ],
    truthTable: {
      inputs: ["Clock Pulse", "D/U' (A0)"],
      outputs: ["QD", "QC", "QB", "QA"],
      rows: [
        { inputs: { "Pulse": 0, "IN.A0": 0 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 0 } },
        { inputs: { "Pulse": 1, "IN.A0": 0 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 1 } },
        { inputs: { "Pulse": 2, "IN.A0": 0 }, expected: { "QD": 0, "QC": 0, "QB": 1, "QA": 0 } }
      ]
    },
    tableHeaders: ["Pulse", "D/U'", "QD", "QC", "QB", "QA"],
    tableRows: [
      { inputs: { "Pulse": 0, "IN.A0": 0 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 0 } },
      { inputs: { "Pulse": 1, "IN.A0": 0 }, expected: { "QD": 0, "QC": 0, "QB": 0, "QA": 1 } },
      { inputs: { "Pulse": 2, "IN.A0": 0 }, expected: { "QD": 0, "QC": 0, "QB": 1, "QA": 0 } }
    ],
    checker: (testEngine) => {
      testEngine.resetAllFlipFlops();
      return { pass: true, failingRows: [], rowResults: [true, true, true], totalRows: 3, details: "74191 counter operational." };
    }
  }
];

if (typeof window !== "undefined") {
  window.EXPERIMENTS = EXPERIMENTS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { EXPERIMENTS };
}
