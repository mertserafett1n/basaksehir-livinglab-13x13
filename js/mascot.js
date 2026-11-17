(() => {
  const namespace = window.LivingLab = window.LivingLab || {};
  const SCALE = .65;
  const STRIDE = 62; // SVG pixels travelled per complete left/right cycle.
  const CONTACT = .38; // Remaining cycle includes flight and recovery.
  const smooth = t => t * t * (3 - 2 * t);

  namespace.createMascot = function createMascot(svg) {
    const root = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    root.setAttribute('class', 'mascot');
    const limb = (name, color) => `<g class="${name}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"><path class="bones" stroke-width="6"/><circle class="joint" r="3.5" fill="#173a4d" stroke-width="1.5"/><path class="tip" stroke-width="5"/></g>`;
    root.innerHTML = `<ellipse class="mascot-shadow" rx="20" ry="4" cy="3" fill="#020b13" opacity=".3"/>
      <g class="mascot-facing">
        ${limb('leg-far', '#648696')}${limb('arm-far', '#648696')}
        <g class="mascot-body">
          <path d="M-12-72 Q2-77 13-68 L10-44 Q0-38-12-45Z" fill="#dce9ee" stroke="#91acb9" stroke-width="1.5"/>
          <path d="M-6-66L8-64 6-51-5-52Z" fill="#173a4d"/>
          <path d="M1-61h6" stroke="#62e3ff" stroke-width="2"/>
          <path d="M-14-69h-5v20h6" fill="#456777"/>
          <g class="mascot-head">
            <path d="M-5-77v-6h9v7" fill="#68899a"/>
            <path d="M-14-103 Q0-110 17-100 L21-88 14-80-12-84Z" fill="#e4eff3" stroke="#91acb9" stroke-width="1.5"/>
            <path d="M5-100L17-97 19-89 7-87Z" fill="#0b2232"/>
            <path d="M12-95l4 1" stroke="#80e5f5" stroke-width="3" stroke-linecap="round"/>
            <circle cx="-7" cy="-93" r="6" fill="#456777"/><circle cx="-7" cy="-93" r="2.5" fill="#91acb9"/>
          </g>
        </g>
        ${limb('leg-near', '#dce9ee')}${limb('arm-near', '#aec5cf')}
      </g>`;
    svg.append(root);
    const facing = root.querySelector('.mascot-facing');
    const body = root.querySelector('.mascot-body');
    const head = root.querySelector('.mascot-head');
    const shadow = root.querySelector('.mascot-shadow');
    const parts = ['leg-far', 'leg-near', 'arm-far', 'arm-near'].map(name => {
      const group = root.querySelector(`.${name}`);
      return { group, bones: group.querySelector('.bones'), joint: group.querySelector('.joint'), tip: group.querySelector('.tip') };
    });
    let facingValue = 1;
    let facingTarget = 1;

    // Two-bone inverse kinematics keeps the foot target independent of hip bob.
    function articulate(part, origin, target, upper, lower, bend, footAngle = 0) {
      const dx = target.x - origin.x;
      const dy = target.y - origin.y;
      const reach = Math.min(upper + lower - .01, Math.max(.01, Math.hypot(dx, dy)));
      const angle = Math.atan2(dy, dx);
      const offset = Math.acos(Math.max(-1, Math.min(1, (upper * upper + reach * reach - lower * lower) / (2 * upper * reach))));
      const joint = { x: origin.x + Math.cos(angle + bend * offset) * upper, y: origin.y + Math.sin(angle + bend * offset) * upper };
      const end = { x: origin.x + Math.cos(angle) * reach, y: origin.y + Math.sin(angle) * reach };
      part.bones.setAttribute('d', `M${origin.x} ${origin.y} L${joint.x} ${joint.y} L${end.x} ${end.y}`);
      part.joint.setAttribute('cx', joint.x);
      part.joint.setAttribute('cy', joint.y);
      part.tip.setAttribute('d', `M${end.x - 3} ${end.y} l${10 * Math.cos(footAngle)} ${10 * Math.sin(footAngle)}`);
    }

    return {
      render({ x, y, tangent = 0, movement = 0, distance = 0, travel = distance, sample, dt = .016 }) {
        if (Math.abs(tangent) > .12) facingTarget = Math.sign(tangent);
        facingValue += (facingTarget - facingValue) * (1 - Math.exp(-dt * 14));
        const phase = ((travel / STRIDE) % 1 + 1) % 1;
        const bounce = Math.cos(phase * Math.PI * 4) * 2 * movement;
        const hip = { x: 0, y: -43 + bounce };
        const lean = movement * Math.abs(tangent) * 3;
        root.setAttribute('transform', `translate(${x} ${y}) scale(${SCALE})`);
        facing.setAttribute('transform', `scale(${facingValue} 1)`);
        body.setAttribute('transform', `translate(0 ${bounce}) rotate(${lean} 0 -43)`);
        head.setAttribute('transform', `rotate(${movement * Math.abs(tangent) * 3} 0 -80)`);
        shadow.setAttribute('rx', 19 + bounce * .6);

        [0, .5].forEach((offset, index) => {
          const p = (phase + offset) % 1;
          const swing = Math.max(0, (p - CONTACT) / (1 - CONTACT));
          // During stance this absolute path coordinate stays fixed as the root advances.
          const anchorDistance = distance + (CONTACT / 2 - p + smooth(swing)) * STRIDE;
          const ground = sample ? sample(anchorDistance) : { x, y };
          const lift = Math.pow(Math.sin(Math.PI * swing), 1.5) * 22;
          const target = {
            x: ((ground.x - x) / SCALE * facingTarget) * movement + (index ? 5 : -5) * (1 - movement),
            y: ((ground.y - y) / SCALE - lift) * movement
          };
          const stage = p < .08 ? 'landing' : p < .28 ? 'stance' : p < CONTACT ? 'push-off' : 'swing';
          parts[index].group.setAttribute('data-phase', movement < .01 ? 'idle' : stage);
          articulate(parts[index], hip, target, 29, 29, -1, p > .28 && p < CONTACT ? -.35 * movement : 0);
          // Bent elbows travel opposite their corresponding foot, with a smaller excursion.
          const armPhase = Math.cos(p * Math.PI * 2);
          const shoulder = { x: 0, y: -67 + bounce };
          const hand = { x: -armPhase * 16 * movement + 3, y: -48 + bounce - (1 + armPhase) * 5 * movement };
          articulate(parts[index + 2], shoulder, hand, 17, 16, 1);
        });
      },
      destroy() { root.remove(); }
    };
  };
})();
