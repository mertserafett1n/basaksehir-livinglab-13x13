(() => {
  const namespace = window.LivingLab = window.LivingLab || {};
  const svgNS = 'http://www.w3.org/2000/svg';
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  namespace.initSchedule = function initSchedule(section) {
    if (!section || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    let savedProgress = 0;
    const journeySeconds = 18; // Full journey duration while visible.
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = section.querySelector('.schedule-grid');
      const intro = section.querySelector('.schedule-intro');
      const items = [...section.querySelectorAll('.timeline > li')];
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'schedule-route');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.innerHTML = '<path class="route-base"/><path class="route-progress"/>';
      const path = svg.querySelector('.route-base');
      const progressPath = svg.querySelector('.route-progress');
      const nodes = items.map(() => {
        const node = document.createElementNS(svgNS, 'circle');
        node.setAttribute('class', 'route-node');
        node.setAttribute('r', '6');
        svg.append(node);
        return node;
      });
      const mascot = namespace.createMascot(svg);
      stage.prepend(svg);
      section.classList.add('has-route');
      let points = [];
      let visible = false;
      let totalLength = 0;
      let startY = 0;
      let lastDistance = null;
      let movement = 0;
      let travel = 0;
      let frame = 0;
      let disposed = false;
      const state = { progress: savedProgress };

      function measure() {
        const bounds = stage.getBoundingClientRect();
        const width = stage.clientWidth;
        const padding = parseFloat(getComputedStyle(stage).paddingLeft);
        const usable = width - padding * 2;
        startY = intro.getBoundingClientRect().bottom - bounds.top + 45;
        points = items.map((item, index) => {
          const rect = item.getBoundingClientRect();
          return {
            x: padding + usable * (index % 2 === 0 ? .46 : .54),
            y: rect.top - bounds.top + rect.height / 2
          };
        });
        svg.setAttribute('viewBox', `0 0 ${width} ${stage.offsetHeight}`);
        let previous = { x: padding + usable * .54, y: startY };
        let data = `M ${previous.x} ${previous.y}`;
        points.forEach((point, index) => {
          const middle = (previous.y + point.y) / 2 + 0;
          data += ` C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
          nodes[index].setAttribute('cx', point.x);
          nodes[index].setAttribute('cy', point.y);
          previous = point;
        });
        path.setAttribute('d', data);
        progressPath.setAttribute('d', data);
        totalLength = path.getTotalLength();
        progressPath.style.strokeDasharray = `${totalLength} ${totalLength}`;
        lastDistance = null;
      }

      function render(time, deltaTime = 16.67) {
        if (visible && !document.hidden) {
          state.progress = Math.min(1, state.progress + Math.min(deltaTime, 64) / 1000 / journeySeconds);
          savedProgress = state.progress;
        }
        const distance = totalLength * state.progress;
        if (distance === lastDistance && movement < .001) return;
        const point = path.getPointAtLength(distance);
        const dt = Math.max(deltaTime / 1000, .001);
        const velocity = lastDistance === null ? 0 : (distance - lastDistance) / dt;
        const step = lastDistance === null ? 0 : Math.max(0, distance - lastDistance);
        travel += step;
        const before = path.getPointAtLength(Math.max(0, distance - 1));
        const after = path.getPointAtLength(Math.min(totalLength, distance + 1));
        const tangent = (after.x - before.x) / Math.max(.001, Math.hypot(after.x - before.x, after.y - before.y));
        const blend = 1 - Math.exp(-dt * 18);
        movement += (Math.min(Math.abs(velocity) / (totalLength / journeySeconds), 1) - movement) * blend;
        points.forEach((milestone, index) => {
          const proximity = Math.max(0, 1 - Math.abs(point.y - milestone.y) / 100);
          nodes[index].setAttribute('r', 6 + proximity * 3);
          nodes[index].classList.toggle('is-reached', point.y >= milestone.y - 1);
          items[index].style.setProperty('--stage-focus', proximity.toFixed(3));
        });
        progressPath.style.strokeDashoffset = totalLength - distance;
        mascot.render({
          x: point.x, y: point.y, tangent, movement, distance, travel, dt,
          sample: value => path.getPointAtLength(clamp(value, 0, totalLength))
        });
        lastDistance = distance;
      }

      measure();
      const visibility = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        lastDistance = null;
      });
      visibility.observe(section);
      gsap.ticker.add(render);
      render();

      function requestRefresh() {
        if (frame || disposed) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          measure();
          render(0, 0);
        });
      }
      const observer = new ResizeObserver(requestRefresh);
      observer.observe(document.body);
      observer.observe(stage);
      document.fonts.ready.then(requestRefresh);
      document.addEventListener('toggle', requestRefresh, true);

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        document.removeEventListener('toggle', requestRefresh, true);
        gsap.ticker.remove(render);
        visibility.disconnect();
        mascot.destroy();
        svg.remove();
        section.classList.remove('has-route');
        items.forEach(item => item.style.removeProperty('--stage-focus'));
      };
    });
    return () => media.revert();
  };
})();
