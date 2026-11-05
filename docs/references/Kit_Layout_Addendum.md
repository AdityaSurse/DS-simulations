# Addendum — real DIT 9005 layout (from your lab photo)

Use this to **replace Phase 2** of the prompt pack and to patch Phases 3, 5, 6, 9. The photo is rotated; upload `DIT9005_upright.png` (rotated copy) to Antigravity so text reads correctly.

## What the real kit has (upright view)

| Area | Real hardware |
|---|---|
| Frame | Wooden frame, dark green PCB, white silkscreen lines dividing zones |
| Bottom label strip | "Hi-Tech" logo, "DIT 9005", "DIGITAL IC TRAINER", "HI-TECH ELECTRONICS, PUNE - 30" |
| Left strip | **One 40-pin ZIF** (blue, lever at bottom) with 40 jacks: pins 1–20 down the left column, 21–40 up the right column (21 at bottom, 40 at top) |
| Bottom-right 2×2 grid | **Four 20-pin ZIF sockets**. Each has a jack row on top labelled 20…11 (left→right) and a jack row below labelled 1…10 (left→right). Pin 1 = bottom-left |
| Middle row, left | **Power block**: 12 V (2 jacks), 5 V (2 jacks), GND (4 jacks) — separate boxed groups |
| Middle row, centre | **Manual pulser**: 2 red push buttons, 4 jacks, a small debounce IC between them, pulse-shape symbols |
| Middle row, right | **Clock**: 2 jacks + a black rotary knob (frequency) |
| Top-middle | **12-bit data input**: 12 toggle switches along the top edge in 3 groups of 4, 12 red LEDs, 12 jacks, labelled C3–C0, B3–B0, A3–A0, three small buffer ICs |
| Top-right | **8-bit data output**: 8 jacks, 8 red LEDs, 2 decoder ICs, **2 seven-segment displays** at the top edge |

Approximate regions as % of the PCB (x from left, y from top): 40-pin strip x0–24% full height · label strip y93–100% · 12-bit input x26–67%, y0–28% · 8-bit output x67–97%, y0–28% · power x24–59%, y28–48% · pulser x59–78% · clock x78–98% · socket grid x26–98%, y48–93% in 2×2 cells.

## Corrections to the earlier pack
1. Sockets are **4 × 20-pin + 1 × 40-pin**, not 14/16-pin. 14- and 16-pin ICs sit inside a 20-pin socket.
2. Power jacks are separate, so the default power mode = **strict**: the student must patch 5 V to the IC's VCC jack and GND to its GND jack. Keep "auto" as an optional practice toggle.
3. IC pin → socket jack mapping (default, pin 1 at socket pin 1): for an N-pin IC in a 20-pin socket, IC pin n ≤ N/2 → socket pin n; IC pin n > N/2 → socket pin n + (20 − N). So a 14-pin IC uses socket pins 1–7 and 14–20 (VCC = jack 20, GND = jack 7); a 16-pin IC uses 1–8 and 13–20 (VCC = jack 20, GND = jack 8). Make the alignment a setting once you confirm how your lab seats the ICs.
4. Every IC pin is reached through the socket's jacks (e.g. U1.J5), not through the IC itself.
5. Inventory cards are U1–U4 (20-pin) and U5 (40-pin).

## REPLACEMENT — PHASE 2 prompt

```
[Paste MASTER CONTEXT — but replace its board description with the one below]

PHASE 2 — Design tokens + exact static layout of MY lab's trainer (DIT 9005, Hi-Tech Electronics, Pune-30).
Attached: DIT9005_upright.png (photo, upright). Reproduce this layout faithfully, in this orientation (landscape).

A) TOKENS and APP SHELL: as in the earlier Phase 2 (dark lab-software shell, top bar, "PATCH FIELD" sub-bar with view tabs Full / ZIF Sockets / Inputs / Outputs, right-hand 380px Laboratory Console with tabs Aim / IC Drawer / Reference / Diagnostics).

B) BOARD SVG (viewBox 1600x1160, aspect of the PCB) inside a wooden frame (wood-grain gradient, bevel, screws), dark green PCB with white silkscreen lines separating zones. Regions (% of PCB, x from left, y from top):
 1. LEFT STRIP (x0–24%, y0–93%): one 40-pin ZIF (blue body, long lever at the bottom, pin-1 marking) with two vertical jack columns. Left column jacks 1→20 top-to-bottom; right column jacks 21→40 from BOTTOM to TOP (so 21 is bottom, 40 is top). Numbers silkscreened next to each jack.
 2. 12-BIT DATA INPUT (x26–67%, y0–28%): 12 toggle switches along the top edge in 3 groups of 4 (labels C3 C2 C1 C0 | B3 B2 B1 B0 | A3 A2 A1 A0), under each a red LED, a resistor and a jack (jack labels along the bottom of the block, block title "12 BIT DATA INPUT" under them). Three small DIP buffer ICs (decorative, non-interactive) between switch and LED rows. The switch drives both its LED and its jack.
 3. 8-BIT DATA OUTPUT (x67–97%, y0–28%): 8 jacks on the bottom edge, 8 red LEDs above them (LED shows the level on its jack), two decorative decoder ICs, and TWO seven-segment red displays at the top edge with small resistor arrays. Title "8 BIT DATA OUTPUT".
 4. POWER (x24–59%, y28–48%): two white-outlined boxes: top box "12 V" (2 jacks) and "5 V" (2 jacks); bottom box "GND" (4 jacks). All 5 V jacks are one net, all GND jacks one net, all 12 V jacks one net.
 5. MANUAL PULSER (x59–78%, y28–48%): two red push buttons with 4 jacks (each button has a Q output jack and a Q-bar output jack), decorative debounce IC (CD4093) in the centre, pulse-symbol silkscreen, title below.
 6. CLOCK (x78–98%, y28–48%): 2 jacks (clock out, and a second tap) plus a black knurled rotary knob; title "CLOCK".
 7. 2×2 SOCKET GRID (x26–98%, y48–93%): four cells each containing a 20-pin ZIF (blue, lever with round blue knob on the left end), a TOP jack row labelled 20 19 18 … 11 (left→right) and a BOTTOM jack row labelled 1 2 3 … 10 (left→right). Cell labels U1 (top-left), U2 (top-right), U3 (bottom-left), U4 (bottom-right). The 40-pin socket is U5.
 8. LABEL STRIP (y93–100%): "Hi-Tech" logo box, "DIT 9005", "DIGITAL IC TRAINER", "HI-TECH ELECTRONICS, PUNE - 30".
C) Jacks: brass-ring look with dark hole, each with data-jack ID: PWR5.1 … , GND.1 …, V12.1…, SW.A0…, IN.A0 (input jack), LED.Y0 etc., OUT.Y0, PULSER.1.Q, PULSER.1.QN, CLK.OUT, U1.J1…U1.J20, U5.J1…U5.J40.
D) Views: Full / ZIF Sockets (zoom to grid) / Inputs (top-middle) / Outputs (top-right).
Use placeholders for components not built yet, but positions, sizes, labels and IDs must be final. Responsive to 1280px.
```

## PATCHES for other phases (add to the end of each prompt)

**Phase 3:** "ZIF sockets are 20-pin (U1–U4) and 40-pin (U5). Draw DIP-14/DIP-16/DIP-20/DIP-40 chips. When a DIP-14/16 chip is inserted in a 20-pin socket it must visually cover only the pins it uses (default left-aligned, pin 1 at socket pin 1). Toggle switches are SPST bat-handle type; push buttons are red round."

**Phase 5:** "Default power mode = strict. A pin jack on a socket belongs to the inserted IC via the mapping IC pin n ≤ N/2 → socket pin n; n > N/2 → socket pin n + (20 − N). Alignment is a setting (left / right / centre)."

**Phase 6:** "Replace the sockets list with U1–U4 (20-pin) and U5 (40-pin). Gates are 14-pin ICs; 74153/74138/7483/74190-series are 16-pin."

**Phase 9:** "IC Inventory cards: U1, U2, U3, U4 (20-pin) and U5 (40-pin)."

## Assumptions to confirm in your lab
- How a 14/16-pin IC is seated in the 20-pin socket (left-aligned with pin 1 at socket pin 1, or shifted).
- The 7-segment displays are driven by the two decoder ICs from the 8 output lines (Y7–Y4 → left digit, Y3–Y0 → right digit, BCD in). Check on the real kit.
- Whether the "second" clock jack is a divided output or just a tap.
