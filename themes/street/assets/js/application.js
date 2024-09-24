gsap.registerPlugin(ScrollTrigger);

window.onload = () => {

  toggleFocus();

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  const slider = document.querySelector('.slider');
  const sections = gsap.utils.toArray('.slider section');

  gsap.to(sections, {
    xPercent: -130 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: '.portfolio',
      start: "top top",
      pin: true,
      scrub: 2,
      snap: 1 / (sections.length - 1),
      end: () => "+=" + slider.offsetWidth,
      onEnter: toggleFocus,
    }
  });

  ScrollTrigger.create({
    trigger: '.home',
    start: "bottom center",
    onLeaveBack: toggleFocus
  });

  lenis.on('scroll', ScrollTrigger.update);


  // Canvas Anim

  const canvasWidth = 375;
  const canvasHeight = (canvasWidth / 16) * 9;
  const targets = document.querySelectorAll('.canvas-container');

  targets.forEach(async target => {

    let app = new PIXI.Application({
        width: canvasWidth,
        height: canvasHeight
    });

    target.appendChild(app.view);

    const sprite = createSprite(target);

    sprite.width = canvasWidth;
    sprite.height = canvasHeight;

    const {oldFilmFilter, shockWaveFilter} = createFilters();
    sprite.filters = [oldFilmFilter, shockWaveFilter];
    app.stage.addChild(sprite);

    const minSeed = 0.2;
    const maxSeed = 1;
    let seedChangeInterval = 10;
    let frameCounter = 0;
    let isHovered = false;

    target.addEventListener('mouseenter', () => {
      shockWaveFilter.amplitude = 10;
      shockWaveFilter.wavelength = 450;
      shockWaveFilter.brightness = 1.0
      shockWaveFilter.radius = -1;
      shockWaveFilter.speed = 500;
      isHovered = true;
    });

    target.addEventListener('mouseleave', () => {
      resetShockwaveFilter(shockWaveFilter)
      isHovered = false;
      oldFilmFilter.sepia = 0.4;
    });

    app.ticker.add((delta) => {
        frameCounter++;

        if (frameCounter % seedChangeInterval === 0) {
            oldFilmFilter.seed = minSeed + Math.random() * (maxSeed - minSeed);
        }

        if (isHovered) {
            shockWaveFilter.time += delta * 0.02;
            oldFilmFilter.sepia = 0;
            oldFilmFilter.noiseSize = 0;
            if (shockWaveFilter.time > 5) {
              shockWaveFilter.time = 0;
            }
        }
    });

});

};

// Focus

function toggleFocus() {
  const focus = document.querySelector(".focus__area");

  focus.classList.toggle('active');
}


// Canvas Anim

function createSprite(target) {
  let imagePath = target.dataset.image;
  return PIXI.Sprite.from(imagePath);
}

function resetShockwaveFilter(shockWaveFilter) {
  shockWaveFilter.amplitude = 0;
  shockWaveFilter.wavelength = 0;
  shockWaveFilter.brightness = 0;
  shockWaveFilter.radius = 0;
  shockWaveFilter.speed = 0;
  shockWaveFilter.time = 0;
}


function createFilters() {
  const oldFilmFilter = new PIXI.filters.OldFilmFilter();
  oldFilmFilter.noiseSize = 2;
  oldFilmFilter.noise = 0;
  oldFilmFilter.sepia = 0.4;

  const shockWaveFilter = new PIXI.filters.ShockwaveFilter();
  resetShockwaveFilter(shockWaveFilter)
  return { oldFilmFilter, shockWaveFilter };
}

function setupHoverEffect(target, shockWaveFilter, oldFilmFilter) {
  target.addEventListener('mouseenter', () => {
      shockWaveFilter.amplitude = 10;
      shockWaveFilter.wavelength = 450;
      shockWaveFilter.brightness = 1.0;
      shockWaveFilter.radius = -1;
      shockWaveFilter.speed = 500;
  });

  target.addEventListener('mouseleave', () => {
      resetShockwaveFilter(shockWaveFilter);
      oldFilmFilter.sepia = 0.4;
  });
}
