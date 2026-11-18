(() => {
  const namespace = window.LivingLab = window.LivingLab || {};
  let runtimeReady;
  function loadRuntime() {
    if (!runtimeReady) runtimeReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './assets/vendor/rive.js';
      script.onload = () => {
        rive.RuntimeLoader.setWasmUrl('./assets/vendor/rive.wasm');
        resolve();
      };
      script.onerror = reject;
      document.head.append(script);
    });
    return runtimeReady;
  }

  namespace.initHeroGreeting = function initHeroGreeting(hero) {
    const image = hero?.querySelector('.hero-x');
    if (!image) return;
    const media = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    let started = false;
    let generation = 0;
    let dispose = () => {};
    async function update() {
      const current = ++generation;
      if (!media.matches) { dispose(); return; }
      if (started) return;
      try {
        await Promise.all([image.decode(), document.fonts.ready, loadRuntime()]);
        if (current !== generation || !media.matches) return;
        started = true;
        const canvas = document.createElement('canvas');
        canvas.className = 'hero-greeting';
        canvas.setAttribute('aria-hidden', 'true');
        hero.append(canvas);
        let player;
        let size = '';
        const align = () => {
          const bounds = image.getBoundingClientRect();
          const host = hero.getBoundingClientRect();
          const scale = bounds.width / 183;
          Object.assign(canvas.style, {
            left: `${bounds.left - host.left}px`,
            top: `${bounds.top - host.top - 60 * scale}px`,
            width: `${bounds.width}px`, height: `${224 * scale}px`
          });
          const nextSize = `${bounds.width}/${devicePixelRatio}`;
          if (nextSize !== size && player?.loaded) {
            size = nextSize;
            player.resizeDrawingSurfaceToCanvas();
          }
        };
        const observer = new ResizeObserver(align);
        const onVisibility = () => {
          if (document.hidden) player?.stopRendering();
          else player?.startRendering();
        };
        dispose = () => {
          observer.disconnect();
          window.removeEventListener('resize', align);
          document.removeEventListener('visibilitychange', onVisibility);
          player?.cleanup();
          canvas.remove();
        };
        align();
        player = new rive.Rive({
          src: './assets/rive/hero-climb.riv', canvas, artboard: 'Hero',
          stateMachine: 'Greeting', autoplay: true,
          layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
          onLoad: () => { align(); canvas.dataset.ready = 'true'; },
          onLoadError: event => { console.warn('Hero Rive scene could not load', event); dispose(); }
        });
        observer.observe(image);
        observer.observe(hero);
        window.addEventListener('resize', align);
        document.addEventListener('visibilitychange', onVisibility);
      } catch (error) {
        console.warn('Hero Rive scene could not initialize', error);
        dispose();
      }
    }
    media.addEventListener('change', update);
    if (document.readyState === 'complete') update();
    else window.addEventListener('load', update, { once: true });
    return () => {
      generation++;
      dispose();
      media.removeEventListener('change', update);
      window.removeEventListener('load', update);
    };
  };
})();
