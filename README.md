# DIT 9005 Digital IC Trainer Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS_ES6+-f7df1e?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Single File Delivery](https://img.shields.io/badge/Delivery-Single_HTML-22c55e?logo=html5&logoColor=white)](index.html)
[![Zero Build Step](https://img.shields.io/badge/Build-None_(Browser_Native)-38bdf8)](index.html)
[![Lab Tested](https://img.shields.io/badge/Target-DIT_9005_Hardware-e11d48)](docs/references/Kit_Layout_Addendum.md)
[![Automated QA](https://img.shields.io/badge/QA_Suite-88%2F88_Passed-10b981)](index.html)

> A zero-install, pixel-accurate virtual clone of the Hi-Tech DIT 9005 Digital IC Trainer kit.
> Designed specifically for engineering students preparing for Digital Systems practical laboratory examinations.
> Patch wires, seat physical ICs into zero-insertion-force (ZIF) sockets, probe voltages, and verify truth tables in real time.

---

## System Architecture

```mermaid
flowchart TD
    classDef ui fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef state fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#ffffff;
    classDef engine fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ffffff;
    classDef data fill:#3b0764,stroke:#a855f7,stroke-width:2px,color:#ffffff;
    classDef console fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#ffffff;

    subgraph UI_Layer["Presentation and User Interface"]
        SVG["Interactive Board SVG Canvas (1600x1160)"]:::ui
        PatchView["Catenary Patch Cords and Terminal Snapping"]:::ui
        Controls["Switches, Pulsers, Knobs, and LEDs"]:::ui
        ProbeHUD["Floating Logic Probe and DMM HUD"]:::ui
    end

    subgraph State_Layer["Trainer State Management"]
        WireStore["Wire Graph Store (from, to, color)"]:::state
        InputStore["12-Bit Switch Register (IN.C3..A0)"]:::state
        SocketStore["Socket State (U1..U5 Chips, Alignment, Levers)"]:::state
        ClockStore["Oscillator and Debounced Pulser Generator"]:::state
    end

    subgraph Engine_Layer["TTL Netlist Simulation Engine"]
        DSU["Union-Find Equipotential Net Partitioning"]:::engine
        PowerCheck["Strict Power Verification (+5V / GND Rails)"]:::engine
        TTLResolver["TTL Logic Evaluator (Floating Pins Pull HIGH)"]:::engine
        ShortDetector["Active Driver Contention and Short Detection"]:::engine
        OutputDecoder["7-Segment BCD/Hex Nibble Decoder"]:::engine
    end

    subgraph Console_Layer["Lab Console Sidebar"]
        AimTab["Aim and Step-by-Step Lab Manual"]:::console
        DrawerTab["IC Drawer Catalog and ZIF Seating"]:::console
        RefTab["Datasheet Pinouts and Function Tables"]:::console
        DiagTab["Live Diagnostics and Observation Sheet"]:::console
    end

    subgraph Data_Layer["Component and Lab Schemas"]
        ICLib["IC Definitions (7400, 7404, 74151, 74153...)"]:::data
        ExpLib["Experiment Syllabus Catalog (Exp 1 to 8)"]:::data
    end

    Controls --> InputStore
    SVG --> PatchView
    PatchView --> WireStore
    WireStore --> DSU
    InputStore --> DSU
    ClockStore --> DSU

    DSU --> PowerCheck
    PowerCheck --> TTLResolver
    TTLResolver --> ShortDetector
    ShortDetector --> OutputDecoder
    ICLib --> TTLResolver

    OutputDecoder --> Controls
    OutputDecoder --> ProbeHUD
    ExpLib --> AimTab
    DrawerTab --> SocketStore
```

---

## Student Lab Workflow

```mermaid
flowchart TD
    classDef start fill:#0369a1,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef step fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#ffffff;
    classDef check fill:#b45309,stroke:#f59e0b,stroke-width:2px,color:#ffffff;
    classDef success fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#ffffff;

    Start(["Launch Simulator in Browser"]):::start
    PickExp["1. Select Practical Experiment from Lab Manual"]:::step
    ReadAim["2. Review Aim, Pinout Diagram, and Function Table"]:::step
    InsertIC["3. Seat Required IC into ZIF Socket and Lock Lever"]:::step
    PowerWire["4. Patch Power Rails: +5V to VCC and 0V to GND"]:::step
    LogicWire["5. Patch Input Switches to Gate Inputs and Outputs to LEDs"]:::step
    TestInputs["6. Toggle Switches and Observe LEDs / 7-Segment Readouts"]:::step
    VerifyClick{"7. Run Auto-Check Circuit"}:::check
    AutoPassed["8. Verification Passed: Review Waveforms and Truth Table"]:::success
    DebugLoop["Inspect Live Diagnostics: Fix Power, Floating Inputs, or Miswiring"]:::step

    Start --> PickExp --> ReadAim --> InsertIC --> PowerWire --> LogicWire --> TestInputs --> VerifyClick
    VerifyClick -- "Passed (100%)" --> AutoPassed
    VerifyClick -- "Mismatch / Contention" --> DebugLoop --> LogicWire
```

---

## Real-Time Simulation Engine & Settle Loop

```mermaid
flowchart TD
    classDef trigger fill:#1d4ed8,stroke:#60a5fa,stroke-width:2px,color:#ffffff;
    classDef process fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#ffffff;
    classDef loop fill:#065f46,stroke:#34d399,stroke-width:2px,color:#ffffff;
    classDef decision fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#ffffff;
    classDef out fill:#581c87,stroke:#c084fc,stroke-width:2px,color:#ffffff;

    Trigger["Input Event: Switch Toggle, Wire Dropped, Clock Edge"]:::trigger
    BuildDSU["Rebuild Equipotential Nets using Disjoint Set Union"]:::process
    ApplyFixed["Inject Fixed Supply Drivers (+5V, GND, Toggle Switches, Pulser)"]:::process
    IterStart["Initialize Multi-Pass Iteration (Max 50 Passes)"]:::loop
    CheckStrict{"Strict Power Mode Active?"}:::decision
    CheckRails["Verify +5V and GND Connectivity on IC Power Pins"]:::process
    FloatOutputs["Suppress IC Drivers: Outputs Float (High-Z)"]:::process
    EvalLogic["Evaluate IC Logic: Unconnected Pins Float to Logic 1"]:::process
    AddDrivers["Register Output Drivers on Socket Terminal Nets"]:::process
    ResolveNets["Resolve Voltage and State across All Nets"]:::process
    CheckConv{"Nets Changed Since Last Pass?"}:::decision
    CheckOsc{"Iteration Count >= 50?"}:::decision
    FlagOsc["Flag Unstable Feedback / Oscillation Warning"]:::process
    CheckShorts{"Multiple Active Conflicting Drivers on Same Net?"}:::decision
    FlagShort["Flag Short Circuit Warning and Identify Shorted Jacks"]:::process
    UpdateDOM["Update Dynamic SVG DOM: LEDs, 7-Segment Displays, HUD"]:::out

    Trigger --> BuildDSU --> ApplyFixed --> IterStart
    IterStart --> CheckStrict
    CheckStrict -- "Yes" --> CheckRails
    CheckRails -- "Missing VCC / GND" --> FloatOutputs --> ResolveNets
    CheckRails -- "Power OK" --> EvalLogic
    CheckStrict -- "No (Practice Mode)" --> EvalLogic
    EvalLogic --> AddDrivers --> ResolveNets
    ResolveNets --> CheckConv
    CheckConv -- "Yes" --> CheckOsc
    CheckOsc -- "Count < 50" --> IterStart
    CheckOsc -- "Count >= 50" --> FlagOsc --> CheckShorts
    CheckConv -- "No (Converged)" --> CheckShorts
    CheckShorts -- "Contention (+5V to GND or 1 vs 0)" --> FlagShort --> UpdateDOM
    CheckShorts -- "Clean Netlist" --> UpdateDOM
```

---

## ZIF Socket Pin Mapping & Package Alignment

```mermaid
flowchart LR
    classDef socket fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef align fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#ffffff;
    classDef map fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ffffff;

    subgraph Socket_Selection["Socket Model"]
        U20["Sockets U1-U4: 20-Pin ZIF"]:::socket
        U40["Socket U5: 40-Pin Expansion ZIF"]:::socket
    end

    subgraph Alignment_Modes["Physical Seating Alignment"]
        LeftAlign["Left Aligned (Default): Pin 1 at Jack 1"]:::align
        CenterAlign["Center Aligned: Symmetrically Offset"]:::align
        RightAlign["Right Aligned: Pin N at Jack 20/40"]:::align
        Flipped["Backwards / Reversed Orientation"]:::align
    end

    subgraph Jack_Mapping["Jack Resolution Formula"]
        Map14["14-Pin DIP: Pins 1-7 -> J1-J7, Pins 8-14 -> J14-J20"]:::map
        Map16["16-Pin DIP: Pins 1-8 -> J1-J8, Pins 9-16 -> J13-J20"]:::map
        Map40["40-Pin DIP: Pins 1-20 -> J1-J20, Pins 21-40 -> J21-J40"]:::map
        DiagRev["Reversal Diagnostic: Inverted Pinout Prevents Operation"]:::map
    end

    U20 --> LeftAlign --> Map14
    U20 --> LeftAlign --> Map16
    U20 --> CenterAlign
    U20 --> RightAlign
    U20 --> Flipped --> DiagRev
    U40 --> Map40
```

---

## Patch Cord Physics & Wire Management

```mermaid
flowchart TD
    classDef pointer fill:#1d4ed8,stroke:#60a5fa,stroke-width:2px,color:#ffffff;
    classDef physics fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#ffffff;
    classDef cord fill:#065f46,stroke:#34d399,stroke-width:2px,color:#ffffff;

    PointerDown["Pointer Down on Source Terminal Jack"]:::pointer
    CheckJack["Resolve Terminal Coordinates (X1, Y1) and ID"]:::physics
    DragStart["Pointer Move: Compute Drag Vector (dx, dy) and Span Distance"]:::physics
    CalcSag["Compute Catenary Sag: droop = min(140, 15 + span * 0.12)"]:::physics
    CalcBezier["Generate Cubic Bezier Control Points (CX1, CY1) and (CX2, CY2)"]:::physics
    RenderGhost["Render Ghost Patch Cord with Stacking Shadow"]:::cord
    PointerUp["Pointer Up: Hit Test Destination Terminal Jack"]:::pointer
    Validate{"Valid Target Jack and Different from Source?"}:::physics
    CommitWire["Add Wire to Graph: Multi-Wire Terminal Stacking Supported"]:::cord
    TriggerSolve["Dispatch cordsChanged and Trigger Settle Loop"]:::cord

    PointerDown --> CheckJack --> DragStart --> CalcSag --> CalcBezier --> RenderGhost --> PointerUp --> Validate
    Validate -- "Yes" --> CommitWire --> TriggerSolve
    Validate -- "No (Cancelled / Same Jack)" --> TriggerSolve
```

---

## Automated Verification & Testbench Architecture

```mermaid
flowchart TD
    classDef suite fill:#0369a1,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef test fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#ffffff;
    classDef check fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#ffffff;

    RunSuite["Execute Verification Suite (Ctrl+Shift+Q or engine.runAllTests)"]:::suite

    subgraph Suite_Self["46 Core Engine Self-Tests"]
        ST1["Clock Generator and Manual Pulser Debounce Tests"]:::test
        ST2["Disjoint-Set Union Equipotential Partition Tests"]:::test
        ST3["Contention Detection (+5V to GND, Active 1 vs Active 0)"]:::test
        ST4["TTL Floating Input Pull-Up Rule (Open Pins = Logic 1)"]:::test
        ST5["Strict Power Mode Missing VCC / Missing GND Diagnostics"]:::test
    end

    subgraph Suite_IC["22 Complex IC Behavioral Tests"]
        IC1["74151: Strobe Inhibit, 8:1 Multiplexing, 20 Random Patterns, Strict Power"]:::test
        IC2["74153: Strobe 1G/2G Inhibit, Dual 4:1 Sweeps"]:::test
        IC3["74138: Enable Gating, Active-Low 3:8 Line Decoding"]:::test
        IC4["7483: 4-Bit Parallel Addition and Carry Propagation"]:::test
        IC5["7490: Decade BCD Counting, R0 Clear, R9 Preset"]:::test
        IC6["7474: Asynchronous Clear/Preset, Rising-Edge D Latches"]:::test
    end

    subgraph Suite_Exp["20 Lab Experiment Auto-Checks"]
        EX1["Exp 1: Fundamental Logic Gates (AND, OR, NOT, NAND, NOR, XOR)"]:::test
        EX2["Exp 2: 8:1 MUX (74151 3-Var, 74151+7404 4-Var, 74153 Cascaded)"]:::test
        EX3["Exp 3: DEMUX 74138 (Full Adder, Subtractor, Binary-to-Gray)"]:::test
        EX4["Exp 4: Full Adder / Subtractor 7483 (2s Complement Arithmetic)"]:::test
        EX5["Exp 5: Asynchronous Decade Counter 7490 (MOD-6, MOD-10, MOD-42)"]:::test
        EX6["Exp 6: Shift Registers 7474 (SISO, SIPO, Ring, Johnson)"]:::test
        EX7["Exp 7: 4-Bit Magnitude Comparator 7485"]:::test
        EX8["Exp 8: Synchronous Up/Down Counter 74191"]:::test
    end

    Bench["Engine Settle Benchmark: 50 Multi-Pass Convergences (< 16 ms/settle)"]:::test
    Summary["Aggregate Results: 88 of 88 Tests Passed (100% Pass Rate)"]:::check

    RunSuite --> Suite_Self
    RunSuite --> Suite_IC
    RunSuite --> Suite_Exp
    Suite_Self --> Bench
    Suite_IC --> Bench
    Suite_Exp --> Bench
    Bench --> Summary
```

---

## Experiment Syllabus Progression

```mermaid
flowchart LR
    classDef exp fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef adv fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#ffffff;

    E1["Exp 1: Fundamental Gates\n(7400, 7402, 7404, 7408, 7432, 7486)"]:::exp
    E2["Exp 2: Multiplexers\n(74151 Direct 8:1, 74153 Cascaded 4:1)"]:::exp
    E3["Exp 3: Decoders & Demux\n(74138 3:8 Decoder + 7420 NAND)"]:::exp
    E4["Exp 4: Binary Arithmetic\n(7483 4-Bit Adder & 2s Complement)"]:::exp
    E5["Exp 5: Decade Counters\n(7490 Asynchronous BCD & MOD-42)"]:::adv
    E6["Exp 6: Shift Registers\n(7474 Dual D-Type Flip-Flops)"]:::adv
    E7["Exp 7: Magnitude Comparator\n(7485 4-Bit Word Comparison)"]:::adv
    E8["Exp 8: Up/Down Counters\n(74191 Synchronous Directional)"]:::adv

    E1 --> E2 --> E3 --> E4 --> E5 --> E6 --> E7 --> E8
```

---

## Supported IC Catalog

| IC Part | Marking | Package | Description | VCC Pin | GND Pin | Logic Function |
|:---:|:---:|:---:|---|:---:|:---:|---|
| **7400** | SN7400N | DIP-14 | Quad 2-Input NAND Gate | 14 | 7 | 4 independent NAND gates: $Y = \overline{A \cdot B}$ |
| **7402** | SN7402N | DIP-14 | Quad 2-Input NOR Gate | 14 | 7 | 4 independent NOR gates: $Y = \overline{A + B}$ |
| **7404** | SN7404N | DIP-14 | Hex Inverter | 14 | 7 | 6 independent inverters: $Y = \overline{A}$ |
| **7408** | SN7408N | DIP-14 | Quad 2-Input AND Gate | 14 | 7 | 4 independent AND gates: $Y = A \cdot B$ |
| **7420** | SN7420N | DIP-14 | Dual 4-Input NAND Gate | 14 | 7 | 2 independent 4-input NAND gates |
| **7432** | SN7432N | DIP-14 | Quad 2-Input OR Gate | 14 | 7 | 4 independent OR gates: $Y = A + B$ |
| **7474** | SN74LS74AN | DIP-14 | Dual D Positive-Edge Flip-Flop | 14 | 7 | 2 independent D flip-flops with Preset and Clear |
| **7483** | SN74LS83N | DIP-16 | 4-Bit Binary Full Adder | 5 | 12 | 4-bit parallel adder with fast internal lookahead carry |
| **7485** | SN7485N | DIP-16 | 4-Bit Magnitude Comparator | 16 | 8 | Compares two 4-bit words ($A > B, A = B, A < B$) |
| **7486** | SN7486N | DIP-14 | Quad 2-Input XOR Gate | 14 | 7 | 4 independent XOR gates: $Y = A \oplus B$ |
| **7490** | SN74LS90N | DIP-14 | Decade BCD Counter | 5 | 10 | Divide-by-2 and divide-by-5 asynchronous counters |
| **7493** | SN7493N | DIP-14 | 4-Bit Binary Ripple Counter | 5 | 10 | 4-stage binary ripple counter (0 to 15) |
| **74138** | SN74LS138N | DIP-16 | 3-to-8 Line Decoder / Demux | 16 | 8 | Active-low 8-line output with 3 enable pins (E1, E2, E3) |
| **74151** | SN74LS151N | DIP-16 | 1-of-8 Data Selector / Multiplexer | 16 | 8 | 8 data inputs, 3 select lines, active-low strobe, complementary outputs Y and W |
| **74153** | SN74LS153N | DIP-16 | Dual 4-to-1 Multiplexer | 16 | 8 | Two 4:1 multiplexers with common select lines S1, S0 |
| **74191** | SN74191N | DIP-16 | Synchronous 4-Bit Up/Down Counter | 16 | 8 | Presettable binary counter with direction control |
| **74283** | SN74LS283N | DIP-16 | 4-Bit Binary Full Adder | 16 | 8 | Standard corner-pin power layout full adder |
| **7447** | SN74LS47N | DIP-16 | BCD-to-7-Segment Decoder / Driver | 16 | 8 | Open-collector active-low outputs for common anode displays |
| **8085** | P8085AH | DIP-40 | 8-Bit Microprocessor (U5 Expansion) | 40 | 20 | 40-pin CPU expansion socket verification model |

---

## Laboratory Experiments Catalog

| Exp | Title | Core ICs | Approaches and Syllabus Scope |
|:---:|---|---|---|
| **1** | **Study of Basic Logic Gates** | `7404`, `7408`, `7432`, `7400`, `7402`, `7486` | Verify truth tables for all 6 fundamental gates; observe TTL floating input pull-up behavior. |
| **2** | **Multiplexer (8:1 MUX & Function Generator)** | `74151`, `74153`, `7404`, `7432` | Approach 1: 74151 monolithic 8:1 MUX for $f(C,B,A)=\Sigma(0,2,3,5)$ and $f(I,J,K,L)=\Sigma(0,2,3,7,11,14,15)$ with 7404. Approach 2: 74153 cascaded 4:1 MUX with 7404 inverter and 7432 OR gate. |
| **3** | **Demultiplexer / Decoder 74138** | `74138`, `7420` | Study 3:8 decoding, Full Adder and Full Subtractor implementation, and cascaded 4:16 decoding. |
| **4** | **Binary Full Adder & Subtractor 7483** | `7483`, `7486` | 4-bit parallel binary adder and 2s complement adder/subtractor with sign overflow. |
| **5** | **Asynchronous Decade Counter 7490** | `7490` | MOD-6, MOD-10 (BCD), and MOD-42 counters with 7-segment decoded readouts. |
| **6** | **Shift Registers using Flip-Flops 7474** | `7474` | SISO, SIPO, PISO, PIPO 4-bit registers and Ring/Johnson counters. |
| **7** | **4-Bit Magnitude Comparator 7485** | `7485` | Compares two 4-bit words ($A > B, A = B, A < B$) with cascading expansion. |
| **8** | **Synchronous Up/Down Counter 74191** | `74191` | Synchronous 4-bit up/down counting, preloading, and ripple clock carry flags. |

---

## Keyboard Shortcuts

| Shortcut | Context | Action |
|---|---|---|
| **`Space + Drag`** | Board Canvas | Pan the view across the green trainer PCB |
| **`Scroll Wheel`** | Board Canvas | Zoom in / Zoom out centered on cursor position |
| **`Enter` / `Space`** | Focused Jack | Start patch cord connection / Complete patch cord connection |
| **`Enter` / `Space`** | Focused Switch | Toggle switch position between Logic 0 (Down) and Logic 1 (Up) |
| **`Enter` / `Space`** | Focused ZIF Lever | Lock / unlock socket ZIF lever |
| **`Escape`** | Global | Cancel in-progress wire, deselect cord, or close open dialogs |
| **`Delete` / `Backspace`** | Selected Cord | Remove the currently selected patch cord |
| **`Ctrl + Z`** (or `Cmd + Z`) | Global | Undo last patch cord connection or disconnection |
| **`Ctrl + Y`** (or `Cmd + Shift + Z`) | Global | Redo previously undone patch cord action |
| **`Ctrl + Shift + Q`** (or `Cmd + Shift + Q`) | Global | Open Automated QA & Benchmark Suite dialog |

---

## Frequently Asked Questions

### Why does my output LED not light up?
1. **Check Power Mode**: By default, **Strict Power Mode** is active. Connect a patch cord from `+5V` to the IC's $V_{CC}$ pin and `GND` to the IC's ground pin.
2. **Check ZIF Socket Lever**: Ensure the socket lever is locked (horizontal/down position). An open lever disconnects all pins.
3. **Check IC Placement**: Open the **IC Drawer** tab to verify an IC is inserted into the correct socket (`U1`–`U5`) with matching alignment (Pin 1 at top-left).
4. **Use Diagnostics**: Click the **Diagnostics** tab in the sidebar to review the live Netlist and verify the socket voltages.

### Why does an unconnected / open IC pin read HIGH (Logic 1)?
This reflects genuine **TTL bipolar logic behavior**. In standard 74-series TTL circuits (such as 7408, 7400, or 74151), input transistor emitters left unconnected float to approximately $+1.8\text{V}\text{--}+2.4\text{V}$, which the internal transistor interprets as a valid **Logic HIGH**. Connecting the pin to `GND` pulls it to $0\text{V}$ (Logic LOW).

### How do I remove a patch cord?
- **Method 1**: Right-click on any patch cord or its terminal banana plug.
- **Method 2**: Click the cord once to select it (highlighted), then press `Delete` or `Backspace`.
- **Method 3**: Click **"Delete Wire"** in the header to enter Delete Mode, then click any cord.

### How do I practice under realistic exam conditions?
Click the **"Exam Mode"** button in the header toolbar. This disables the "Auto-Wire Circuit", "Hint", and "Show Solution" assistance, requiring you to consult only the schematic and pinout diagrams.

---

## Local Offline Execution & Deployment

### Local Offline Execution (Zero Dependencies)
No build tools, node daemons, or internet connections are required:
```bash
# Clone the repository
git clone https://github.com/AdityaSurse/DS-simulations.git
cd DS-simulations

# Open index.html directly in any browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Static Deployment
- **GitHub Pages**: Go to **Settings** -> **Pages**, set **Source** to `Deploy from a branch`, choose branch `main` and folder `/ (root)`.
- **Vercel**: Pre-configured via `vercel.json` for static clean URLs. Deploy with `vercel --prod`.

---

## Project Structure

```text
DS-simulations/
├── index.html                 # Single deliverable application (HTML + CSS + Vanilla JS + SVG)
├── build_index.py             # Concatenates modular source parts into index.html
├── vercel.json                # Vercel static deployment configuration
├── README.md                  # Technical architecture and flowchart documentation
├── docs/
│   └── references/
│       ├── DIT9005_upright.png # Reference photo of physical DIT 9005 hardware
│       ├── Kit_Layout_Addendum.md # Physical coordinates, zone % layout, and socket pinouts
│       └── DC Lab Manual 2022-23 (AutoRecovered)-2.pdf # University lab syllabus reference
└── src_parts/                 # Modular source components
    ├── tokens.css             # Color tokens, typography, shadows, and layout variables
    ├── data_ics.js            # IC definitions, pinouts, truth tables, and behavioral eval
    ├── data_experiments.js    # Lab manual experiments, procedures, and solution wiring
    ├── engine.js              # TTL netlist solver, multi-pass settle loop, and testbench
    ├── components.js          # Parametric SVG component renderers (ZIF, DIP, Cords, HUD)
    ├── board.js               # Interactive canvas, coordinate system, and event handling
    ├── console.js             # Sidebar tabs (Aim, Drawer, Reference, Diagnostics)
    └── init.js                # Application bootstrap and state initialization
```

---

## License

Distributed under the **MIT License**. Built for engineering students mastering digital logic systems.
