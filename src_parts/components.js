/* ===== COMPONENTS ===== */
const SVG_COMPONENTS = {
  renderDefs() {
    return `
      <defs>
        <!-- Copper/Wood outer frame gradient -->
        <linearGradient id="copperFrameTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#b87333" />
          <stop offset="25%" stop-color="#8a4f20" />
          <stop offset="70%" stop-color="#542e11" />
          <stop offset="100%" stop-color="#2c1708" />
        </linearGradient>
        <linearGradient id="copperFrameSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#9a5522" />
          <stop offset="100%" stop-color="#3b1d09" />
        </linearGradient>

        <!-- Dark Green PCB Gradient (#0f6b3e -> #0a4f2e) -->
        <linearGradient id="pcbGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f6b3e" />
          <stop offset="100%" stop-color="#0a4f2e" />
        </linearGradient>

        <!-- Subtle PCB Copper Trace Texture -->
        <pattern id="pcbTracePattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 0 60 L 60 0 M 0 0 L 60 60" stroke="#137d49" stroke-width="0.75" opacity="0.35" />
          <circle cx="15" cy="15" r="1.5" fill="#137d49" opacity="0.5" />
          <circle cx="45" cy="45" r="1.5" fill="#137d49" opacity="0.5" />
          <path d="M 15 15 L 30 15 L 45 30 L 45 45" stroke="#137d49" stroke-width="0.6" fill="none" opacity="0.35" />
        </pattern>

        <!-- Brass jack gradients -->
        <radialGradient id="brassJack" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#fff1a8" />
          <stop offset="40%" stop-color="#d4af37" />
          <stop offset="85%" stop-color="#8c6f14" />
          <stop offset="100%" stop-color="#4d3a05" />
        </radialGradient>
        <radialGradient id="jackHole" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#050505" />
          <stop offset="75%" stop-color="#141414" />
          <stop offset="100%" stop-color="#2a2510" />
        </radialGradient>

        <!-- Metallic terminal gradients -->
        <radialGradient id="termRed" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#f87171" />
          <stop offset="50%" stop-color="#dc2626" />
          <stop offset="100%" stop-color="#7f1d1d" />
        </radialGradient>
        <radialGradient id="termBlack" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#475569" />
          <stop offset="60%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#020617" />
        </radialGradient>
        <radialGradient id="termAmber" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#fde68a" />
          <stop offset="50%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#78350f" />
        </radialGradient>

        <!-- Screw head metallic gradient -->
        <radialGradient id="screwHead" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#f5f5f5" />
          <stop offset="50%" stop-color="#a8a8a8" />
          <stop offset="90%" stop-color="#4d4d4d" />
          <stop offset="100%" stop-color="#1c1c1c" />
        </radialGradient>

        <!-- Chrome bat handle gradient -->
        <linearGradient id="chromeBat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#b8c0cc" />
          <stop offset="35%" stop-color="#ffffff" />
          <stop offset="65%" stop-color="#8f96a3" />
          <stop offset="100%" stop-color="#4e5461" />
        </linearGradient>

        <!-- Red push button gradient -->
        <radialGradient id="redBtn" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ff7b72" />
          <stop offset="40%" stop-color="#ef4444" />
          <stop offset="85%" stop-color="#991b1b" />
          <stop offset="100%" stop-color="#450a0a" />
        </radialGradient>
        <radialGradient id="redBtnPressed" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#b91c1c" />
          <stop offset="70%" stop-color="#7f1d1d" />
          <stop offset="100%" stop-color="#450a0a" />
        </radialGradient>

        <!-- LED dome gradients (Red, Green, Yellow, Blue) -->
        <radialGradient id="ledOff" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#6b1d1d" />
          <stop offset="60%" stop-color="#3d0a0a" />
          <stop offset="100%" stop-color="#180404" />
        </radialGradient>
        <radialGradient id="ledOnRed" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="#ff9999" />
          <stop offset="60%" stop-color="#ff2222" />
          <stop offset="100%" stop-color="#cc0000" />
        </radialGradient>
        <radialGradient id="ledOnGreen" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="#a7f3d0" />
          <stop offset="60%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#047857" />
        </radialGradient>
        <radialGradient id="ledOnAmber" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="#fef08a" />
          <stop offset="60%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#a16207" />
        </radialGradient>
        <radialGradient id="ledOnBlue" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="#bae6fd" />
          <stop offset="60%" stop-color="#0ea5e9" />
          <stop offset="100%" stop-color="#0369a1" />
        </radialGradient>

        <!-- Knob gradient -->
        <radialGradient id="knobBody" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#3a3f4a" />
          <stop offset="60%" stop-color="#1f232b" />
          <stop offset="100%" stop-color="#0d0f12" />
        </radialGradient>

        <!-- Blue ZIF socket body gradient -->
        <linearGradient id="zifBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#216ac2" />
          <stop offset="15%" stop-color="#1b549b" />
          <stop offset="85%" stop-color="#113e73" />
          <stop offset="100%" stop-color="#0b284d" />
        </linearGradient>

        <!-- IC Chip body gradient -->
        <linearGradient id="icBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a2e36" />
          <stop offset="50%" stop-color="#1a1c21" />
          <stop offset="100%" stop-color="#101216" />
        </linearGradient>

        <!-- Drop shadow filters -->
        <filter id="shadowBevel" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.6"/>
        </filter>
        <filter id="shadowJack" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.7"/>
        </filter>
        <filter id="shadowZif" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#000" flood-opacity="0.8"/>
        </filter>
        <filter id="ledGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cordShadowFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
    `;
  },

  renderScrew(cx, cy, r = 7) {
    return `
      <g transform="translate(${cx}, ${cy})">
        <circle r="${r}" fill="url(#screwHead)" filter="url(#shadowBevel)" />
        <circle r="${r - 1}" fill="none" stroke="#222" stroke-width="0.5" />
        <line x1="${-r + 2}" y1="0" x2="${r - 2}" y2="0" stroke="#111" stroke-width="1.2" stroke-linecap="round" />
        <line x1="0" y1="${-r + 2}" x2="0" y2="${r - 2}" stroke="#111" stroke-width="1.2" stroke-linecap="round" />
      </g>
    `;
  },

  // 1. drawJack: metallic ring, dark hole, hover glow, label under it, drop target highlight
  drawJack(opts) {
    const { id, label, cx, cy, labelSide = "top", isTarget = false, isSelected = false } = opts;
    let lx = cx, ly = cy - 14;
    if (labelSide === "bottom") ly = cy + 18;
    else if (labelSide === "left") { lx = cx - 18; ly = cy + 4; }
    else if (labelSide === "right") { lx = cx + 18; ly = cy + 4; }

    const targetRing = (isTarget || isSelected) ? `
      <circle r="14" fill="none" stroke="var(--accent-teal)" stroke-width="2.5" class="jack-selection-ring" opacity="1" />
    ` : `
      <circle r="13" fill="none" stroke="var(--accent-teal)" stroke-width="2" class="jack-selection-ring" opacity="0" />
    `;

    return `
      <g class="jack-group" data-jack="${id}" id="jack-${id.replace(/[^a-zA-Z0-9_]/g, '_')}" transform="translate(${cx}, ${cy})">
        <circle r="18" fill="transparent" class="jack-hitbox" />
        <circle r="11" fill="url(#brassJack)" filter="url(#shadowJack)" />
        <circle r="11" fill="none" stroke="#3d2c02" stroke-width="0.75" />
        <circle r="8.5" fill="none" stroke="#fff4a3" stroke-width="0.6" opacity="0.6" />
        <circle r="6" fill="url(#jackHole)" />
        <circle r="4.5" fill="#050505" />
        <circle r="4.2" fill="none" stroke="#c99700" stroke-width="0.8" opacity="0.75" />
        ${targetRing}
      </g>
      ${label ? `<text x="${lx}" y="${ly}" class="silkscreen-text" text-anchor="middle">${label}</text>` : ""}
    `;
  },
  renderBrassJack(id, label, cx, cy, labelSide = "top") {
    return this.drawJack({ id, label, cx, cy, labelSide });
  },

  // 2. drawToggleSwitch: 3D bat lever that animates between UP (1) and DOWN (0)
  drawToggleSwitch(opts) {
    const { id, label, cx, cy, isHigh = false } = opts;
    const batY = isHigh ? -14 : 14;
    const batAngle = isHigh ? -18 : 18;

    return `
      <g class="switch-group" data-switch="${id}" transform="translate(${cx}, ${cy})">
        <rect x="-14" y="-22" width="28" height="44" rx="4" fill="#242830" stroke="#4a5260" stroke-width="1" filter="url(#shadowBevel)" />
        <circle cx="0" cy="-16" r="1.5" fill="#888" />
        <circle cx="0" cy="16" r="1.5" fill="#888" />
        <circle cx="0" cy="0" r="9" fill="url(#screwHead)" stroke="#333" stroke-width="0.7" />
        <circle cx="0" cy="0" r="6" fill="#111" />
        <g transform="rotate(${batAngle}, 0, 0)">
          <ellipse cx="2" cy="${batY + 2}" rx="4.5" ry="7" fill="rgba(0,0,0,0.5)" />
          <path d="M -3 0 L -4 ${batY * 0.7} L -5 ${batY} C -5 ${batY + (isHigh ? -5 : 5)} 5 ${batY + (isHigh ? -5 : 5)} 5 ${batY} L 4 ${batY * 0.7} L 3 0 Z"
                fill="url(#chromeBat)" stroke="#444" stroke-width="0.5" filter="url(#shadowBevel)" />
          <ellipse cx="0" cy="${batY}" rx="3.5" ry="2.5" fill="#ffffff" opacity="0.8" />
        </g>
        <rect x="-16" y="-24" width="32" height="48" fill="transparent" class="switch-hitbox" />
      </g>
      ${label ? `<text x="${cx}" y="${cy - 28}" class="silkscreen-text bold" text-anchor="middle">${label}</text>` : ""}
    `;
  },
  renderToggleSwitch(id, label, cx, cy, isHigh) {
    return this.drawToggleSwitch({ id, label, cx, cy, isHigh });
  },

  // 3. drawLED: glass dome with radial gradient, supports configurable colors & continuous brightness
  drawLED(opts) {
    const { id, label, cx, cy, isOn = false, brightness = null, color = "red", labelPos = "top" } = opts;
    let lx = cx, ly = cy - 12;
    if (labelPos === "bottom") ly = cy + 16;

    const b = brightness !== null ? brightness : (isOn ? 1.0 : 0.0);
    const gradMap = {
      red: "url(#ledOnRed)",
      green: "url(#ledOnGreen)",
      amber: "url(#ledOnAmber)",
      blue: "url(#ledOnBlue)"
    };
    const fill = b > 0.05 ? (gradMap[color] || "url(#ledOnRed)") : "url(#ledOff)";
    const glowColor = color === "green" ? "#10b981" : (color === "amber" ? "#f59e0b" : "#ff1a1a");

    const glowSvg = b > 0.05 ? `
      <circle cx="${cx}" cy="${cy}" r="${10 + b * 4}" fill="${glowColor}" opacity="${0.45 * b}" filter="url(#ledGlowFilter)" />
      <circle cx="${cx}" cy="${cy}" r="7" fill="${glowColor}" opacity="${0.7 * b}" />
    ` : "";

    return `
      <g class="led-group" data-led="${id}">
        <circle cx="${cx}" cy="${cy}" r="7" fill="#1a1e24" stroke="#333" stroke-width="0.5" />
        ${glowSvg}
        <circle cx="${cx}" cy="${cy}" r="5.5" fill="${fill}" />
        <circle cx="${cx - 1.8}" cy="${cy - 1.8}" r="1.5" fill="#ffffff" opacity="${Math.max(0.2, b * 0.9)}" />
      </g>
      ${label ? `<text x="${lx}" y="${ly}" class="silkscreen-text" text-anchor="middle">${label}</text>` : ""}
    `;
  },
  renderLed(id, label, cx, cy, isOn, labelPos = "top") {
    return this.drawLED({ id, label, cx, cy, isOn, labelPos });
  },

  // 4. drawSevenSeg: red segments with ghost segments when off, BCD/hex decoding
  drawSevenSeg(opts) {
    const { id, x, y, digits = [0, 0] } = opts;
    const SEG_MAP = {
      0: [1,1,1,1,1,1,0],
      1: [0,1,1,0,0,0,0],
      2: [1,1,0,1,1,0,1],
      3: [1,1,1,1,0,0,1],
      4: [0,1,1,0,0,1,1],
      5: [1,0,1,1,0,1,1],
      6: [1,0,1,1,1,1,1],
      7: [1,1,1,0,0,0,0],
      8: [1,1,1,1,1,1,1],
      9: [1,1,1,1,0,1,1],
      10: [1,1,1,0,1,1,1], // A
      11: [0,0,1,1,1,1,1], // b
      12: [1,0,0,1,1,1,0], // C
      13: [0,1,1,1,1,0,1], // d
      14: [1,0,0,1,1,1,1], // E
      15: [1,0,0,0,1,1,1]  // F
    };

    const renderDigit = (dx, dy, val) => {
      const segs = SEG_MAP[val] || SEG_MAP[0];
      const sColor = (idx) => segs[idx] ? "#ff2a2a" : "#220404";
      const sGlow = (idx) => segs[idx] ? "filter='url(#ledGlowFilter)'" : "";

      return `
        <g transform="translate(${dx}, ${dy})">
          <rect x="-1" y="-1" width="38" height="58" rx="3" fill="#100202" stroke="#220404" stroke-width="1" />
          <polygon points="6,4 30,4 27,8 9,8" fill="${sColor(0)}" ${sGlow(0)} />
          <polygon points="31,5 35,9 33,26 29,24" fill="${sColor(1)}" ${sGlow(1)} />
          <polygon points="33,30 35,47 31,51 29,32" fill="${sColor(2)}" ${sGlow(2)} />
          <polygon points="9,48 27,48 30,52 6,52" fill="${sColor(3)}" ${sGlow(3)} />
          <polygon points="7,32 5,51 1,47 3,30" fill="${sColor(4)}" ${sGlow(4)} />
          <polygon points="7,24 3,26 1,9 5,5" fill="${sColor(5)}" ${sGlow(5)} />
          <polygon points="9,26 27,26 29,28 27,30 9,30 7,28" fill="${sColor(6)}" ${sGlow(6)} />
          <circle cx="34" cy="52" r="1.5" fill="#220404" />
        </g>
      `;
    };

    return `
      <g id="${id}" transform="translate(${x}, ${y})">
        <rect x="0" y="0" width="102" height="74" rx="4" fill="#0b0b0f" stroke="#262a33" stroke-width="1.5" filter="url(#shadowBevel)" />
        <rect x="6" y="6" width="90" height="62" rx="2" fill="#180404" stroke="#360808" stroke-width="1" />
        ${renderDigit(11, 8, digits[0])}
        ${renderDigit(53, 8, digits[1])}
      </g>
    `;
  },
  renderSevenSegmentDisplay(id, x, y, digits) {
    return this.drawSevenSeg({ id, x, y, digits });
  },

  // 5. drawPushButton: press animation + latching indicator LED (Manual Pulser)
  drawPushButton(opts) {
    const { id, label, cx, cy, isPressed = false } = opts;
    const btnFill = isPressed ? "url(#redBtnPressed)" : "url(#redBtn)";
    const rOffset = isPressed ? 1.5 : 0;
    const shadowOpacity = isPressed ? "0.3" : "0.7";

    return `
      <g class="pushbutton-group" data-pulser="${id}" transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="19" fill="url(#screwHead)" filter="url(#shadowBevel)" />
        <circle cx="0" cy="0" r="15" fill="#181818" />
        <circle cx="0" cy="${rOffset}" r="14" fill="${btnFill}" opacity="${shadowOpacity}" filter="url(#shadowBevel)" />
        <circle cx="0" cy="${rOffset}" r="14" fill="${btnFill}" />
        <ellipse cx="-4" cy="${-5 + rOffset}" rx="6" ry="3.5" fill="#ffffff" opacity="${isPressed ? 0.3 : 0.65}" transform="rotate(-20, -4, ${-5 + rOffset})" />
        <!-- Small debounced latching pilot LED ring -->
        <circle cx="0" cy="0" r="16.5" fill="none" stroke="${isPressed ? '#ff3333' : '#334155'}" stroke-width="1.2" opacity="${isPressed ? '1' : '0.4'}" />
        <circle cx="0" cy="0" r="22" fill="transparent" class="btn-hitbox" />
      </g>
      ${label ? `<text x="${cx}" y="${cy + 34}" class="silkscreen-text" text-anchor="middle">${label}</text>` : ""}
    `;
  },
  renderPushButton(id, label, cx, cy, isPressed) {
    return this.drawPushButton({ id, label, cx, cy, isPressed });
  },

  // 6. drawClockKnob: knurled black 3D knob with white pointer line and tick marks (0.5 Hz .. 10 kHz)
  drawClockKnob(opts) {
    const { id, label, cx, cy, freq = 1.0, knobT = 0.0768, running = true } = opts;
    // Map knobT in [0, 1] to angle: 0 deg to 270 deg (offset by -135 deg to point from bottom-left to bottom-right)
    const angle = -135 + knobT * 270;

    return `
      <g class="knob-group" data-knob="${id}" transform="translate(${cx}, ${cy})">
        <!-- Radial scale graduation ticks and labels -->
        <circle cx="0" cy="0" r="34" fill="none" stroke="#3e4a5c" stroke-width="1.5" stroke-dasharray="2, 6" />
        <text x="-32" y="22" class="silkscreen-text mini" text-anchor="middle">0.5Hz</text>
        <text x="-38" y="-4" class="silkscreen-text mini" text-anchor="middle">1Hz</text>
        <text x="-26" y="-28" class="silkscreen-text mini" text-anchor="middle">10Hz</text>
        <text x="0" y="-38" class="silkscreen-text mini" text-anchor="middle">100Hz</text>
        <text x="26" y="-28" class="silkscreen-text mini" text-anchor="middle">1kHz</text>
        <text x="38" y="-4" class="silkscreen-text mini" text-anchor="middle">5kHz</text>
        <text x="32" y="22" class="silkscreen-text mini" text-anchor="middle">10kHz</text>

        <!-- Base skirt -->
        <circle cx="0" cy="0" r="26" fill="#0f1115" stroke="#222" stroke-width="1" filter="url(#shadowBevel)" />
        <!-- Knurled body -->
        <circle cx="0" cy="0" r="22" fill="url(#knobBody)" filter="url(#shadowBevel)" />
        <!-- Grip notches -->
        <circle cx="0" cy="0" r="18" fill="none" stroke="#121418" stroke-width="3" stroke-dasharray="4, 4" />
        <!-- Pointer line -->
        <g transform="rotate(${angle}, 0, 0)">
          <line x1="0" y1="-8" x2="0" y2="-21" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
        </g>
        <circle cx="0" cy="0" r="8" fill="#181b21" stroke="#333" stroke-width="0.5" />
        <circle cx="0" cy="0" r="32" fill="transparent" class="knob-hitbox" />
      </g>
      ${label ? `<text x="${cx}" y="${cy + 46}" class="silkscreen-text bold" text-anchor="middle">${label}</text>` : ""}
    `;
  },
  renderKnob(id, label, cx, cy, freq) {
    return this.drawClockKnob({ id, label, cx, cy, freq });
  },

  // 7. drawTerminal: Binding post terminals for power (+5V red, GND black, +12V amber)
  drawTerminal(opts) {
    const { id, type = "5V", cx, cy, label = null } = opts;
    const gradMap = {
      "5V": "url(#termRed)",
      "GND": "url(#termBlack)",
      "12V": "url(#termAmber)"
    };
    const fill = gradMap[type] || "url(#termRed)";

    return `
      <g class="jack-group terminal-group" data-jack="${id}" id="term-${id.replace(/[^a-zA-Z0-9_]/g, '_')}" transform="translate(${cx}, ${cy})">
        <!-- Colored insulator washer -->
        <circle r="14" fill="${fill}" filter="url(#shadowJack)" stroke="#111" stroke-width="1" />
        <!-- Brass hexagonal binding nut -->
        <polygon points="10,0 5,8.6 -5,8.6 -10,0 -5,-8.6 5,-8.6" fill="url(#brassJack)" stroke="#3a2e0a" stroke-width="0.6" />
        <!-- Center banana jack hole -->
        <circle r="5.5" fill="url(#jackHole)" />
        <circle r="4.2" fill="#0a0a0a" />
        <circle r="3.8" fill="none" stroke="#c99700" stroke-width="0.7" opacity="0.8" />
        <circle r="16" fill="none" stroke="var(--accent-teal)" stroke-width="2" class="jack-selection-ring" opacity="0" />
        <circle r="18" fill="transparent" class="jack-hitbox" />
      </g>
      ${label ? `<text x="${cx}" y="${cy + 22}" class="silkscreen-text" text-anchor="middle">${label}</text>` : ""}
    `;
  },

  // 8. drawZIFSocket: cyan body with bevel, lever on side that animates open/closed (20-pin & 40-pin)
  drawZIFSocket(opts) {
    const { socketId, x, y, width, height, pinCount = 20, leverLocked = true } = opts;
    const is40 = (pinCount === 40);
    const pinsPerRow = pinCount / 2;
    const pinPitch = (width - 40) / (pinsPerRow - 1);

    const leverX = is40 ? x + width / 2 : x - 12;
    const leverY = is40 ? y + height + 6 : y + height / 2;
    const leverTransform = is40
      ? (leverLocked ? "rotate(0)" : "rotate(-35)")
      : (leverLocked ? "rotate(0)" : "rotate(-45)");

    let pinHoles = "";
    if (!is40) {
      for (let i = 0; i < pinsPerRow; i++) {
        const px = x + 20 + i * pinPitch;
        pinHoles += `
          <rect x="${px - 3.5}" y="${y + 12}" width="7" height="12" rx="1" fill="#091728" stroke="#06101c" stroke-width="0.5" />
          <line x1="${px}" y1="${y + 14}" x2="${px}" y2="${y + 22}" stroke="#8cb0d4" stroke-width="1" opacity="0.4" />
        `;
        pinHoles += `
          <rect x="${px - 3.5}" y="${y + height - 24}" width="7" height="12" rx="1" fill="#091728" stroke="#06101c" stroke-width="0.5" />
          <line x1="${px}" y1="${y + height - 22}" x2="${px}" y2="${y + height - 14}" stroke="#8cb0d4" stroke-width="1" opacity="0.4" />
        `;
      }
    } else {
      const vertPitch = (height - 50) / 19;
      for (let i = 0; i < 20; i++) {
        const py = y + 25 + i * vertPitch;
        pinHoles += `
          <rect x="${x + 12}" y="${py - 3}" width="12" height="6" rx="1" fill="#091728" stroke="#06101c" stroke-width="0.5" />
          <line x1="${x + 14}" y1="${py}" x2="${x + 22}" y2="${py}" stroke="#8cb0d4" stroke-width="1" opacity="0.4" />
        `;
        pinHoles += `
          <rect x="${x + width - 24}" y="${py - 3}" width="12" height="6" rx="1" fill="#091728" stroke="#06101c" stroke-width="0.5" />
          <line x1="${x + width - 22}" y1="${py}" x2="${x + width - 14}" stroke="#8cb0d4" stroke-width="1" opacity="0.4" />
        `;
      }
    }

    return `
      <g class="zif-socket-group" data-socket="${socketId}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="url(#zifBody)" filter="url(#shadowZif)" stroke="#2563eb" stroke-width="1" />
        <rect x="${x + 8}" y="${y + 8}" width="${width - 16}" height="${height - 16}" rx="3" fill="#10345c" stroke="#0b2440" stroke-width="1" />
        ${pinHoles}
        <polygon points="${x + 14},${is40 ? y + 16 : y + height - 12} ${x + 20},${is40 ? y + 22 : y + height - 6} ${x + 8},${is40 ? y + 22 : y + height - 6}" fill="#93c5fd" opacity="0.6" />
        <g class="zif-lever" data-socket="${socketId}" transform="translate(${leverX}, ${leverY}) ${leverTransform}" style="cursor: pointer;">
          <rect x="${is40 ? -3 : -24}" y="${is40 ? 0 : -3}" width="${is40 ? 6 : 28}" height="${is40 ? 28 : 6}" rx="2" fill="url(#screwHead)" stroke="#333" stroke-width="0.5" />
          <circle cx="${is40 ? 0 : -24}" cy="${is40 ? 28 : 0}" r="7" fill="#1d4ed8" stroke="#93c5fd" stroke-width="1" />
        </g>
      </g>
    `;
  },
  renderZIFSocket(socketId, x, y, width, height, pinCount, leverLocked) {
    return this.drawZIFSocket({ socketId, x, y, width, height, pinCount, leverLocked });
  },

  // 9. drawICChip: black epoxy body with highlights, silver gold-ish pins, notch + pin-1 dot, printed part # & date code
  drawICChip(opts) {
    const { socketId, chipName, marking, socketX, socketY, socketW, socketH, icPinCount = 14, alignment = "left" } = opts;
    if (!chipName) return "";
    const chipText = marking || `SN${chipName}N`;
    const is40 = (socketId === "U5");

    if (is40) {
      return `
        <g class="inserted-ic-group" data-socket="${socketId}" style="cursor: pointer;">
          <rect x="${socketX + 16}" y="${socketY + 12}" width="${socketW - 32}" height="${socketH - 24}" rx="3" fill="url(#icBody)" stroke="#333" stroke-width="1" filter="url(#shadowBevel)" />
          <path d="M ${socketX + 16 + (socketW - 32)/2 - 8} ${socketY + 12} A 8 8 0 0 0 ${socketX + 16 + (socketW - 32)/2 + 8} ${socketY + 12} Z" fill="#111" />
          <circle cx="${socketX + 26}" cy="${socketY + 26}" r="2.5" fill="#000" />
          <text x="${socketX + 16 + (socketW - 32)/2}" y="${socketY + 12 + (socketH - 24)/2}" fill="#e2e8f0" font-family="var(--font-mono)" font-size="12" font-weight="700" letter-spacing="1" text-anchor="middle" transform="rotate(-90, ${socketX + 16 + (socketW - 32)/2}, ${socketY + 12 + (socketH - 24)/2})">${chipText}</text>
          <text x="${socketX + 16 + (socketW - 32)/2 + 12}" y="${socketY + 12 + (socketH - 24)/2}" fill="#94a3b8" font-family="var(--font-mono)" font-size="8" text-anchor="middle" transform="rotate(-90, ${socketX + 16 + (socketW - 32)/2 + 12}, ${socketY + 12 + (socketH - 24)/2})">2418</text>
        </g>
      `;
    }

    const totalSlots = 10;
    const slotPitch = (socketW - 40) / (totalSlots - 1);
    const chipSlots = icPinCount / 2;

    let startSlot = 0;
    if (alignment === "right") startSlot = totalSlots - chipSlots;
    else if (alignment === "center") startSlot = Math.floor((totalSlots - chipSlots) / 2);

    const icWidth = (chipSlots - 1) * slotPitch + 28;
    const icX = socketX + 20 + startSlot * slotPitch - 14;
    const icY = socketY + 18;
    const icHeight = socketH - 36;

    let pinsSvg = "";
    for (let i = 0; i < chipSlots; i++) {
      const px = icX + 14 + i * slotPitch;
      pinsSvg += `<rect x="${px - 2}" y="${icY - 6}" width="4" height="6" fill="url(#screwHead)" stroke="#222" stroke-width="0.3" />`;
      pinsSvg += `<rect x="${px - 2}" y="${icY + icHeight}" width="4" height="6" fill="url(#screwHead)" stroke="#222" stroke-width="0.3" />`;
    }

    return `
      <g class="inserted-ic-group" data-socket="${socketId}" style="cursor: pointer;">
        ${pinsSvg}
        <rect x="${icX}" y="${icY}" width="${icWidth}" height="${icHeight}" rx="3" fill="url(#icBody)" stroke="#3f4553" stroke-width="1" filter="url(#shadowBevel)" />
        <path d="M ${icX} ${icY + icHeight/2 - 7} A 7 7 0 0 0 ${icX} ${icY + icHeight/2 + 7} Z" fill="#111317" />
        <circle cx="${icX + 10}" cy="${icY + icHeight - 10}" r="2.2" fill="#0a0c0e" stroke="#252930" stroke-width="0.5" />
        <text x="${icX + icWidth / 2}" y="${icY + icHeight / 2 + 3}" fill="#e2e8f0" font-family="var(--font-mono)" font-size="11" font-weight="700" letter-spacing="1" text-anchor="middle">${chipText}</text>
        <text x="${icX + icWidth / 2}" y="${icY + icHeight / 2 + 13}" fill="#94a3b8" font-family="var(--font-mono)" font-size="7.5" text-anchor="middle">MALAYSIA 2418</text>
      </g>
    `;
  },
  renderInsertedIC(socketId, chipName, socketX, socketY, socketW, socketH, icPinCount, alignment) {
    return this.drawICChip({ socketId, chipName, socketX, socketY, socketW, socketH, icPinCount, alignment });
  },

  renderPatchCord(wire, p1, p2, isSelected = false) {
    if (!p1 || !p2) return "";
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);

    // Natural gravity sag proportional to cord length
    const droop = Math.max(35, 25 + dist * 0.22);
    const cx1 = p1.x + dx * 0.25;
    const cy1 = p1.y + droop + Math.max(0, dy * 0.25);
    const cx2 = p2.x - dx * 0.25;
    const cy2 = p2.y + droop - Math.max(0, -dy * 0.25);

    // Cubic Bezier curve paths
    const pathData = `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
    const shadowPath = `M ${p1.x} ${p1.y + 8} C ${cx1} ${cy1 + 16}, ${cx2} ${cy2 + 16}, ${p2.x} ${p2.y + 8}`;
    const color = wire.color || "#f5c518";

    // Midpoint on Cubic Bezier at t = 0.5
    const mx = 0.125 * p1.x + 0.375 * cx1 + 0.375 * cx2 + 0.125 * p2.x;
    const my = 0.125 * p1.y + 0.375 * cy1 + 0.375 * cy2 + 0.125 * p2.y;

    const renderBananaPlug = (pt) => `
      <g transform="translate(${pt.x}, ${pt.y})" pointer-events="none">
        <circle r="8" fill="${color}" stroke="#0f172a" stroke-width="1.4" filter="url(#shadowBevel)" />
        <circle r="4.8" fill="url(#brassJack)" stroke="#3a2e0a" stroke-width="0.8" />
        <circle r="6.2" fill="none" stroke="#ffffff" stroke-width="0.9" opacity="0.5" />
      </g>
    `;

    return `
      <g class="patch-cord-group ${isSelected ? 'selected' : ''}" data-wire-id="${wire.id}">
        <title>Patch Cord ${wire.id}: ${wire.from} ↔ ${wire.to}</title>
        <!-- Soft Ground Shadow -->
        <path d="${shadowPath}" fill="none" stroke="rgba(0, 0, 0, 0.45)" stroke-width="8" stroke-linecap="round" filter="url(#cordShadowFilter)" pointer-events="none" />
        
        <!-- Selection Highlight Halo if Selected -->
        ${isSelected ? `
          <path d="${pathData}" fill="none" stroke="#38bdf8" stroke-width="11" stroke-linecap="round" opacity="0.9" filter="url(#glowTeal)" pointer-events="none" />
          <path d="${pathData}" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="8 6" stroke-linecap="round" opacity="0.9" pointer-events="none" />
        ` : ''}

        <!-- Dark Outer Border for 3D Depth -->
        <path d="${pathData}" fill="none" stroke="#090d14" stroke-width="7" stroke-linecap="round" pointer-events="none" />
        
        <!-- Main Colored Cord Body -->
        <path d="${pathData}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" pointer-events="none" />
        
        <!-- Specular Highlight Ridge -->
        <path d="${pathData}" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.55" pointer-events="none" />
        
        <!-- Invisible Wide Hit-testing Stroke -->
        <path class="cord-hit-stroke" d="${pathData}" fill="none" stroke="transparent" stroke-width="20" stroke-linecap="round" pointer-events="stroke" cursor="pointer" />
        
        <!-- 3D Banana Plugs at both ends -->
        ${renderBananaPlug(p1)}
        ${renderBananaPlug(p2)}

        <!-- Midpoint Delete Handle (Visible on hover or when selected) -->
        <g class="cord-delete-handle ${isSelected ? 'visible' : ''}" data-wire-id="${wire.id}" transform="translate(${mx}, ${my})" cursor="pointer" pointer-events="all">
          <circle r="10" fill="#ef4444" stroke="#ffffff" stroke-width="1.8" filter="url(#shadowBevel)" />
          <path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>
    `;
  }
};
