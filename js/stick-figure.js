(() => {
  const namespace = window.LivingLab = window.LivingLab || {};

  // All joints use scene coordinates. A scene can supply running or pointing poses too.
  namespace.createStickFigure = function createStickFigure(parent) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'stick-figure');
    group.setAttribute('fill', 'none');
    group.setAttribute('stroke', '#eeeae0');
    group.setAttribute('stroke-width', '2.5');
    group.setAttribute('stroke-linecap', 'round');
    group.setAttribute('stroke-linejoin', 'round');
    group.innerHTML = `<g class="stick-legs"><path class="stick-leg-left"/><path class="stick-leg-right"/></g>
      <g class="stick-body"><path class="stick-spine"/><path class="stick-shoulders"/></g>
      <g class="stick-head"><circle r="7"/></g>
      <g class="stick-grip-arm"><path/><circle class="stick-grip-hand" r="2"/></g>
      <g class="stick-wave-arm"><path class="stick-upper-arm"/><path class="stick-forearm"/><path class="stick-wave-hand"/></g>`;
    parent.append(group);
    const find = selector => group.querySelector(selector);
    const spine = find('.stick-spine');
    const shoulders = find('.stick-shoulders');
    const head = find('.stick-head');
    const gripArm = find('.stick-grip-arm path');
    const gripHand = find('.stick-grip-hand');
    const upperArm = find('.stick-upper-arm');
    const forearm = find('.stick-forearm');
    const waveHand = find('.stick-wave-hand');
    const leftLeg = find('.stick-leg-left');
    const rightLeg = find('.stick-leg-right');
    const point = p => `${p.x} ${p.y}`;

    function elbowFor(shoulder, hand) {
      const dx = hand.x - shoulder.x;
      const dy = hand.y - shoulder.y;
      const distance = Math.max(.001, Math.hypot(dx, dy));
      const bend = Math.sqrt(Math.max(0, 17 * 17 - distance * distance / 4));
      return {
        x: (shoulder.x + hand.x) / 2 - dy / distance * bend,
        y: (shoulder.y + hand.y) / 2 + dx / distance * bend
      };
    }

    return {
      render(pose) {
        const elbow = elbowFor(pose.leftShoulder, pose.grip);
        leftLeg.setAttribute('d', pose.leftKnee ? `M${point(pose.waist)} L${point(pose.leftKnee)} L${point(pose.leftFoot)} l5 0` : '');
        rightLeg.setAttribute('d', pose.rightKnee ? `M${point(pose.waist)} L${point(pose.rightKnee)} L${point(pose.rightFoot)} l5 0` : '');
        spine.setAttribute('d', `M${point(pose.neck)} Q${point(pose.chest)} ${point(pose.waist)}`);
        shoulders.setAttribute('d', `M${point(pose.leftShoulder)} Q${point(pose.neck)} ${point(pose.rightShoulder)}`);
        head.setAttribute('transform', `translate(${point(pose.head)}) rotate(${pose.headTilt})`);
        gripArm.setAttribute('d', `M${point(pose.leftShoulder)} L${point(elbow)} L${point(pose.grip)}`);
        gripHand.setAttribute('cx', pose.grip.x);
        gripHand.setAttribute('cy', pose.grip.y);
        upperArm.setAttribute('d', `M${point(pose.rightShoulder)} L${point(pose.waveElbow)}`);
        forearm.setAttribute('d', `M${point(pose.waveElbow)} L${point(pose.waveWrist)}`);
        waveHand.setAttribute('d', 'M0 0 L0 -5 M0 -3 L3 -5');
        waveHand.setAttribute('transform', `translate(${point(pose.waveWrist)}) rotate(${pose.wristTilt})`);
      },
      destroy() { group.remove(); }
    };
  };
})();
