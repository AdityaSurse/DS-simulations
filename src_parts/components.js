/* ===== COMPONENTS ===== */
const SVG_COMPONENTS = {
  // Generate SVG Definitions (Gradients, Filters, Shadows)
  renderDefs() {
    return `
      <defs>
        <!-- Wood frame gradients -->
        <linearGradient id="woodBevelTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5a3418" />
          <stop offset="50%" stop-color="#3d210d" />
          <stop offset="100%" stop-color="#221106" />
        </linearGradient>
        <linearGradient id="woodBevelLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#523016" />
          <stop offset="100%" stop-color="#2c1709" />
        </linearGradient>

        <!-- Brass jack gradients -->
        <radialGradient id="brassJack" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffe699" />
          <stop offset="45%" stop-color="#d4af37" />
          <stop offset="85%" stop-color="#997a15" />
          <stop offset="100%" stop-color="#594406" />
        </radialGradient>
        <radialGradient id="jackHole" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0a0a0a" />
          <stop offset="70%" stop-color="#141414" />
          <stop offset="100%" stop-color="#2a2510" />
        </radialGradient>

        <!-- Screw head metallic gradient -->
        <radialGradient id="screwHead" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#f0f0f0" />
          <stop offset="50%" stop-color="#a0a0a0" />
          <stop offset="90%" stop-color="#505050" />
          <stop offset="100%" stop-color="#202020" />
        </radialGradient>

        <!-- Chrome bat handle gradient -->
        <linearGradient id="chromeBat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#b0b5be" />
          <stop offset="30%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#9aa0ac" />
          <stop offset="100%" stop-color="#5d6370" />
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

        <!-- Red LED glows -->
        <radialGradient id="ledOff" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#7f1d1d" />
          <stop offset="60%" stop-color="#450a0a" />
          <stop offset="100%" stop-color="#1c0404" />
        </radialGradient>
        <radialGradient id="ledOn" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="25%" stop-color="#ff9999" />
          <stop offset="60%" stop-color="#ff2222" />
          <stop offset="100%" stop-color="#cc0000" />
        </radialGradient>

        <!-- Knob gradient -->
        <radialGradient id="knobBody" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#3a3f4a" />
          <stop offset="60%" stop-color="#1f232b" />
          <stop offset="100%" stop-color="#0d0f12" />
        </radialGradient>

        <!-- Blue ZIF socket body gradient -->
        <linearGradient id="zifBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e5ba0" />
          <stop offset="10%" stop-color="#194c87" />
          <stop offset="90%" stop-color="#103663" />
          <stop offset="100%" stop-color="#092242" />
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
          <feGaussianBlur stdDeviation="3" result="blur" />
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

  // Screw head
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

  // Brass Jack (Banana socket)
  renderBrassJack(id, label, cx, cy, labelSide = "top") {
    let lx = cx, ly = cy - 14;
    if (labelSide === "bottom") ly = cy + 18;
    else if (labelSide === "left") { lx = cx - 18; ly = cy + 4; }
    else if (labelSide === "right") { lx = cx + 18; ly = cy + 4; }

    return `
      <g class="jack-group" data-jack="${id}" transform="translate(${cx}, ${cy})">
        <!-- Hit target circle for easier wire connecting -->
        <circle r="18" fill="transparent" class="jack-hitbox" />
        <!-- Outer brass bevel ring -->
        <circle r="11" fill="url(#brassJack)" filter="url(#shadowJack)" />
        <circle r="11" fill="none" stroke="#3d2c02" stroke-width="0.75" />
        <!-- Inner rim highlight -->
        <circle r="8.5" fill="none" stroke="#fff4a3" stroke-width="0.6" opacity="0.6" />
        <!-- Dark socket hole -->
        <circle r="6" fill="url(#jackHole)" />
        <circle r="4.5" fill="#050505" />
        <!-- Internal metallic spring contact ring -->
        <circle r="4.2" fill="none" stroke="#c99700" stroke-width="0.8" opacity="0.75" />
        <!-- Selection pulse ring -->
        <circle r="13" fill="none" stroke="#38bdf8" stroke-width="2" class="jack-selection-ring" opacity="0" />
      </g>
      ${label ? `<text x="${lx}" y="${ly}" class="silkscreen-text" text-anchor="middle">${label}</text>` : ""}
    `;
  },

  // 3D SPST Toggle Switch
  renderToggleSwitch(id, label, cx, cy, isHigh) {
    const batY = isHigh ? -14 : 14;
    const batAngle = isHigh ? -18 : 18;
    return `
      <g class="switch-group" data-switch="${id}" transform="translate(${cx}, ${cy})">
        <!-- Switch faceplate -->
        <rect x="-14" y="-22" width="28" height="44" rx="4" fill="#2a2e36" stroke="#4a5260" stroke-width="1" filter="url(#shadowBevel)" />
        <!-- Mounting screws -->
        <circle cx="0" cy="-16" r="1.5" fill="#888" />
        <circle cx="0" cy="16" r="1.5" fill="#888" />
        <!-- Bushing ring -->
        <circle cx="0" cy="0" r="9" fill="url(#screwHead)" stroke="#333" stroke-width="0.7" />
        <circle cx="0" cy="0" r="6" fill="#111" />
        <!-- Bat handle -->
        <g transform="rotate(${batAngle}, 0, 0)">
          <!-- Bat shadow -->
          <ellipse cx="2" cy="${batY + 2}" rx="4.5" ry="7" fill="rgba(0,0,0,0.5)" />
          <!-- Bat stalk -->
          <path d="M -3 0 L -4 ${batY * 0.7} L -5 ${batY} C -5 ${batY + (isHigh ? -5 : 5)} 5 ${batY + (isHigh ? -5 : 5)} 5 ${batY} L 4 ${batY * 0.7} L 3 0 Z"
                fill="url(#chromeBat)" stroke="#444" stroke-width="0.5" filter="url(#shadowBevel)" />
          <!-- Bat tip specular highlight -->
          <ellipse cx="0" cy="${batY}" rx="3.5" ry="2.5" fill="#ffffff" opacity="0.8" />
        </g>
        <!-- Click hitbox -->
        <rect x="-16" y="-24" width="32" height="48" fill="transparent" class="switch-hitbox" />
      </g>
      <text x="${cx}" y="${cy - 28}" class="silkscreen-text bold" text-anchor="middle">${label}</text>
    `;
  },

  // 3D Red Push Button (Manual Pulser)
  renderPushButton(id, label, cx, cy, isPressed) {
    const btnFill = isPressed ? "url(#redBtnPressed)" : "url(#redBtn)";
    const rOffset = isPressed ? 1 : 0;
    return `
      <g class="pushbutton-group" data-pulser="${id}" transform="translate(${cx}, ${cy})">
        <!-- Chrome retaining ring -->
        <circle cx="0" cy="0" r="19" fill="url(#screwHead)" filter="url(#shadowBevel)" />
        <circle cx="0" cy="0" r="15" fill="#181818" />
        <!-- Red plunger button -->
        <circle cx="0" cy="${rOffset}" r="14" fill="${btnFill}" filter="url(#shadowBevel)" />
        <!-- Specular gloss highlight -->
        <ellipse cx="-4" cy="${-5 + rOffset}" rx="6" ry="3.5" fill="#ffffff" opacity="${isPressed ? 0.3 : 0.65}" transform="rotate(-20, -4, ${-5 + rOffset})" />
        <!-- Invisible hit target -->
        <circle cx="0" cy="0" r="22" fill="transparent" class="btn-hitbox" />
      </g>
      <text x="${cx}" y="${cy + 34}" class="silkscreen-text" text-anchor="middle">${label}</text>
    `;
  },

  // 5mm Diffused Red LED
  renderLed(id, label, cx, cy, isOn, labelPos = "top") {
    let lx = cx, ly = cy - 12;
    if (labelPos === "bottom") ly = cy + 16;
    const fill = isOn ? "url(#ledOn)" : "url(#ledOff)";
    const glow = isOn ? `
      <circle cx="${cx}" cy="${cy}" r="12" fill="#ff1a1a" opacity="0.45" filter="url(#ledGlowFilter)" />
      <circle cx="${cx}" cy="${cy}" r="7" fill="#ff5555" opacity="0.7" />
    ` : "";

    return `
      <g class="led-group" data-led="${id}">
        <!-- Base washer -->
        <circle cx="${cx}" cy="${cy}" r="7" fill="#1e2229" stroke="#333" stroke-width="0.5" />
        ${glow}
        <!-- LED epoxy dome -->
        <circle cx="${cx}" cy="${cy}" r="5.5" fill="${fill}" />
        <!-- Specular reflection dot -->
        <circle cx="${cx - 1.8}" cy="${cy - 1.8}" r="1.5" fill="#ffffff" opacity="${isOn ? 0.9 : 0.35}" />
      </g>
      ${label ? `<text x="${lx}" y="${ly}" class="silkscreen-text" text-anchor="middle">${label}</text>` : ""}
    `;
  },

  // Rotary Knob (Clock frequency)
  renderKnob(id, label, cx, cy, freq) {
    // Map frequency (1, 5, 10, 50, 100, 500) to rotation angle (-120 to +120 deg)
    const freqMap = { 1: -120, 5: -72, 10: -24, 50: 24, 100: 72, 500: 120 };
    const angle = freqMap[freq] || -120;

    return `
      <g class="knob-group" data-knob="${id}" transform="translate(${cx}, ${cy})">
        <!-- Scale graduation ticks -->
        <circle cx="0" cy="0" r="32" fill="none" stroke="#445064" stroke-width="1.5" stroke-dasharray="2, 6" />
        <!-- Graduation text markings -->
        <text x="-28" y="24" class="silkscreen-text mini" text-anchor="middle">1Hz</text>
        <text x="-34" y="-8" class="silkscreen-text mini" text-anchor="middle">5Hz</text>
        <text x="-16" y="-34" class="silkscreen-text mini" text-anchor="middle">10Hz</text>
        <text x="16" y="-34" class="silkscreen-text mini" text-anchor="middle">50Hz</text>
        <text x="34" y="-8" class="silkscreen-text mini" text-anchor="middle">100Hz</text>
        <text x="28" y="24" class="silkscreen-text mini" text-anchor="middle">500Hz</text>

        <!-- Knob base skirt -->
        <circle cx="0" cy="0" r="26" fill="#111317" stroke="#222" stroke-width="1" filter="url(#shadowBevel)" />
        <!-- Knurled body -->
        <circle cx="0" cy="0" r="22" fill="url(#knobBody)" filter="url(#shadowBevel)" />
        <!-- Grip notches -->
        <circle cx="0" cy="0" r="18" fill="none" stroke="#15171c" stroke-width="3" stroke-dasharray="4, 4" />
        <!-- Pointer line -->
        <g transform="rotate(${angle}, 0, 0)">
          <line x1="0" y1="-8" x2="0" y2="-21" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
        </g>
        <!-- Center cap -->
        <circle cx="0" cy="0" r="8" fill="#1b1e24" stroke="#333" stroke-width="0.5" />
        <!-- Interactive hitbox -->
        <circle cx="0" cy="0" r="30" fill="transparent" class="knob-hitbox" />
      </g>
      <text x="${cx}" y="${cy + 46}" class="silkscreen-text bold" text-anchor="middle">${label}</text>
    `;
  },

  // Dual Seven-Segment Display
  renderSevenSegmentDisplay(id, x, y, digits = [0, 0]) {
    // Segments: a, b, c, d, e, f, g
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
      const sColor = (idx) => segs[idx] ? "#ff2a2a" : "#300808";
      const sGlow = (idx) => segs[idx] ? "filter='url(#ledGlowFilter)'" : "";

      return `
        <g transform="translate(${dx}, ${dy})">
          <!-- Dark background bezel -->
          <rect x="-1" y="-1" width="38" height="58" rx="3" fill="#120202" stroke="#250505" stroke-width="1" />
          <!-- Segment A -->
          <polygon points="6,4 30,4 27,8 9,8" fill="${sColor(0)}" ${sGlow(0)} />
          <!-- Segment B -->
          <polygon points="31,5 35,9 33,26 29,24" fill="${sColor(1)}" ${sGlow(1)} />
          <!-- Segment C -->
          <polygon points="33,30 35,47 31,51 29,32" fill="${sColor(2)}" ${sGlow(2)} />
          <!-- Segment D -->
          <polygon points="9,48 27,48 30,52 6,52" fill="${sColor(3)}" ${sGlow(3)} />
          <!-- Segment E -->
          <polygon points="7,32 5,51 1,47 3,30" fill="${sColor(4)}" ${sGlow(4)} />
          <!-- Segment F -->
          <polygon points="7,24 3,26 1,9 5,5" fill="${sColor(5)}" ${sGlow(5)} />
          <!-- Segment G -->
          <polygon points="9,26 27,26 29,28 27,30 9,30 7,28" fill="${sColor(6)}" ${sGlow(6)} />
          <!-- Decimal Point (DP) -->
          <circle cx="34" cy="52" r="1.5" fill="#300808" />
        </g>
      `;
    };

    return `
      <g id="${id}" transform="translate(${x}, ${y})">
        <!-- Display module housing -->
        <rect x="0" y="0" width="102" height="74" rx="4" fill="#0d0d12" stroke="#2a2e38" stroke-width="1.5" filter="url(#shadowBevel)" />
        <!-- Red contrast glass window -->
        <rect x="6" y="6" width="90" height="62" rx="2" fill="#1c0505" stroke="#3d0a0a" stroke-width="1" />
        <!-- Left Digit (High Nibble) -->
        ${renderDigit(11, 8, digits[0])}
        <!-- Right Digit (Low Nibble) -->
        ${renderDigit(53, 8, digits[1])}
      </g>
    `;
  },

  // 20-Pin or 40-Pin ZIF Socket
  renderZIFSocket(socketId, x, y, width, height, pinCount = 20, leverLocked = true) {
    const is40 = (pinCount === 40);
    const pinsPerRow = pinCount / 2;
    const pinPitch = (width - 40) / (pinsPerRow - 1);

    // ZIF locking lever
    // Unlocked: lever sticks straight up/out. Locked: lever pushed down flat.
    const leverX = is40 ? x + width / 2 : x - 12;
    const leverY = is40 ? y + height + 6 : y + height / 2;
    const leverTransform = is40
      ? (leverLocked ? "rotate(0)" : "rotate(-35)")
      : (leverLocked ? "rotate(0)" : "rotate(-45)");

    let pinHoles = "";
    if (!is40) {
      // 20-Pin ZIF (Horizontal orientation: top row 20..11, bottom row 1..10)
      for (let i = 0; i < pinsPerRow; i++) {
        const px = x + 20 + i * pinPitch;
        // Top slot (jack 20-i)
        pinHoles += `
          <rect x="${px - 3.5}" y="${y + 12}" width="7" height="12" rx="1" fill="#0c1d33" stroke="#081424" stroke-width="0.5" />
          <line x1="${px}" y1="${y + 14}" x2="${px}" y2="${y + 22}" stroke="#9bb7d4" stroke-width="1" opacity="0.4" />
        `;
        // Bottom slot (jack 1+i)
        pinHoles += `
          <rect x="${px - 3.5}" y="${y + height - 24}" width="7" height="12" rx="1" fill="#0c1d33" stroke="#081424" stroke-width="0.5" />
          <line x1="${px}" y1="${y + height - 22}" x2="${px}" y2="${y + height - 14}" stroke="#9bb7d4" stroke-width="1" opacity="0.4" />
        `;
      }
    } else {
      // 40-Pin ZIF (Vertical orientation: left column 1..20, right column 21..40)
      const vertPitch = (height - 50) / 19;
      for (let i = 0; i < 20; i++) {
        const py = y + 25 + i * vertPitch;
        // Left slot
        pinHoles += `
          <rect x="${x + 12}" y="${py - 3}" width="12" height="6" rx="1" fill="#0c1d33" stroke="#081424" stroke-width="0.5" />
          <line x1="${x + 14}" y1="${py}" x2="${x + 22}" y2="${py}" stroke="#9bb7d4" stroke-width="1" opacity="0.4" />
        `;
        // Right slot
        pinHoles += `
          <rect x="${x + width - 24}" y="${py - 3}" width="12" height="6" rx="1" fill="#0c1d33" stroke="#081424" stroke-width="0.5" />
          <line x1="${x + width - 22}" y1="${py}" x2="${x + width - 14}" stroke="#9bb7d4" stroke-width="1" opacity="0.4" />
        `;
      }
    }

    return `
      <g class="zif-socket-group" data-socket="${socketId}">
        <!-- Main Blue Socket Body -->
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="url(#zifBody)" filter="url(#shadowZif)" stroke="#2563eb" stroke-width="1" />
        <!-- Inner socket recess -->
        <rect x="${x + 8}" y="${y + 8}" width="${width - 16}" height="${height - 16}" rx="3" fill="#123a66" stroke="#0d2948" stroke-width="1" />
        <!-- Pin Slot Receptacles -->
        ${pinHoles}
        <!-- Pin 1 marking triangle -->
        <polygon points="${x + 14},${is40 ? y + 16 : y + height - 12} ${x + 20},${is40 ? y + 22 : y + height - 6} ${x + 8},${is40 ? y + 22 : y + height - 6}" fill="#93c5fd" opacity="0.6" />

        <!-- Metal ZIF Lever -->
        <g class="zif-lever" transform="translate(${leverX}, ${leverY}) ${leverTransform}">
          <!-- Lever arm -->
          <rect x="${is40 ? -3 : -24}" y="${is40 ? 0 : -3}" width="${is40 ? 6 : 28}" height="${is40 ? 28 : 6}" rx="2" fill="url(#screwHead)" stroke="#333" stroke-width="0.5" />
          <!-- Knob end -->
          <circle cx="${is40 ? 0 : -24}" cy="${is40 ? 28 : 0}" r="7" fill="#1e40af" stroke="#60a5fa" stroke-width="1" />
        </g>
      </g>
    `;
  },

  // Inserted IC Chip representation
  renderInsertedIC(socketId, chipName, socketX, socketY, socketW, socketH, icPinCount = 14, alignment = "left") {
    if (!chipName) return "";
    const is40 = (socketId === "U5");
    if (is40) {
      // 40-pin chip in U5
      return `
        <g class="inserted-ic-group" transform="translate(${socketX + 16}, ${socketY + 12})">
          <rect x="0" y="0" width="${socketW - 32}" height="${socketH - 24}" rx="3" fill="url(#icBody)" stroke="#333" stroke-width="1" filter="url(#shadowBevel)" />
          <!-- Pin 1 notch -->
          <path d="M ${(socketW - 32)/2 - 8} 0 A 8 8 0 0 0 ${(socketW - 32)/2 + 8} 0 Z" fill="#111" />
          <circle cx="10" cy="14" r="2.5" fill="#000" />
          <text x="${(socketW - 32)/2}" y="${(socketH - 24)/2}" fill="#e2e8f0" font-family="var(--font-mono)" font-size="12" font-weight="700" letter-spacing="1" text-anchor="middle" transform="rotate(-90, ${(socketW - 32)/2}, ${(socketH - 24)/2})">${chipName}</text>
        </g>
      `;
    }

    // 14-pin or 16-pin chip in 20-pin horizontal socket
    const totalSlots = 10;
    const slotPitch = (socketW - 40) / (totalSlots - 1);
    const chipSlots = icPinCount / 2; // 7 for 14-pin, 8 for 16-pin

    let startSlot = 0;
    if (alignment === "right") startSlot = totalSlots - chipSlots;
    else if (alignment === "center") startSlot = Math.floor((totalSlots - chipSlots) / 2);

    const icWidth = (chipSlots - 1) * slotPitch + 28;
    const icX = socketX + 20 + startSlot * slotPitch - 14;
    const icY = socketY + 18;
    const icHeight = socketH - 36;

    // Pin leads entering socket
    let pinsSvg = "";
    for (let i = 0; i < chipSlots; i++) {
      const px = icX + 14 + i * slotPitch;
      // Top pin
      pinsSvg += `<rect x="${px - 2}" y="${icY - 6}" width="4" height="6" fill="url(#screwHead)" stroke="#222" stroke-width="0.3" />`;
      // Bottom pin
      pinsSvg += `<rect x="${px - 2}" y="${icY + icHeight}" width="4" height="6" fill="url(#screwHead)" stroke="#222" stroke-width="0.3" />`;
    }

    return `
      <g class="inserted-ic-group">
        <!-- Lead pins -->
        ${pinsSvg}
        <!-- Plastic DIP body -->
        <rect x="${icX}" y="${icY}" width="${icWidth}" height="${icHeight}" rx="3" fill="url(#icBody)" stroke="#3f4553" stroke-width="1" filter="url(#shadowBevel)" />
        <!-- Orientation notch (left end) -->
        <path d="M ${icX} ${icY + icHeight/2 - 7} A 7 7 0 0 0 ${icX} ${icY + icHeight/2 + 7} Z" fill="#111317" />
        <!-- Pin 1 indentation dot (bottom-left) -->
        <circle cx="${icX + 10}" cy="${icY + icHeight - 10}" r="2.2" fill="#0a0c0e" stroke="#252930" stroke-width="0.5" />
        <!-- Chip label -->
        <text x="${icX + icWidth / 2}" y="${icY + icHeight / 2 + 4}" fill="#e2e8f0" font-family="var(--font-mono)" font-size="11" font-weight="700" letter-spacing="1" text-anchor="middle">${chipName}</text>
        <text x="${icX + icWidth / 2}" y="${icY + icHeight / 2 + 14}" fill="#94a3b8" font-family="var(--font-mono)" font-size="8" text-anchor="middle">SN${chipName}N</text>
      </g>
    `;
  },

  // Sagging Patch Cord with Banana Plugs and Shadow
  renderPatchCord(wire, p1, p2) {
    if (!p1 || !p2) return "";
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);

    // Realistic catenary sagging droop
    const droop = Math.max(30, 25 + dist * 0.16);
    const midX = (p1.x + p2.x) / 2;
    const midY = Math.max(p1.y, p2.y) + droop;

    const pathData = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
    const shadowPath = `M ${p1.x} ${p1.y + 6} Q ${midX} ${midY + 12} ${p2.x} ${p2.y + 6}`;

    const color = wire.color || "#facc15";

    const renderBananaPlug = (pt) => `
      <g transform="translate(${pt.x}, ${pt.y})">
        <!-- Plug base boot -->
        <circle r="7.5" fill="${color}" stroke="#1e293b" stroke-width="1.2" filter="url(#shadowBevel)" />
        <!-- Brass pin entering socket -->
        <circle r="4.5" fill="url(#brassJack)" stroke="#3a2e0a" stroke-width="0.8" />
        <!-- Specular highlight ring -->
        <circle r="6" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.5" />
      </g>
    `;

    return `
      <g class="patch-cord-group" data-wire-id="${wire.id}">
        <!-- Drooping ground shadow -->
        <path d="${shadowPath}" fill="none" stroke="rgba(0, 0, 0, 0.45)" stroke-width="8" stroke-linecap="round" filter="url(#cordShadowFilter)" />
        <!-- Outer colored cable jacket -->
        <path d="${pathData}" fill="none" stroke="#111827" stroke-width="7" stroke-linecap="round" />
        <path d="${pathData}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" />
        <!-- Specular glossy top highlight -->
        <path d="${pathData}" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
        <!-- End Banana Plugs -->
        ${renderBananaPlug(p1)}
        ${renderBananaPlug(p2)}
      </g>
    `;
  }
};

