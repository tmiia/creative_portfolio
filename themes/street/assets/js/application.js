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

      const {oldFilmFilter, shockWaveFilter, bnwFilter} = createFilters();
      sprite.filters = [oldFilmFilter, shockWaveFilter, bnwFilter];
      app.stage.addChild(sprite);

      const minSeed = 0.2;
      const maxSeed = 1;
      let seedChangeInterval = 10;
      let frameCounter = 0;
      let isHovered = false;

      target.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      target.addEventListener('mouseleave', () => {
        isHovered = false;
      });

      app.ticker.add(() => {
          frameCounter++;

          if (frameCounter % seedChangeInterval === 0) {
              oldFilmFilter.seed = minSeed + Math.random() * (maxSeed - minSeed);
          }

          if (isHovered) {
            gsap.to(shockWaveFilter, {
                amplitude: 10,
                wavelength: 450,
                brightness: 1.0,
                speed: 300,
                time: 2,
                duration: 2,
            });

            gsap.to(bnwFilter, {
                saturation: 0,
                duration: 0.7,
                ease: "power4.out"
            });

          } else {
              gsap.to(shockWaveFilter, {
                speed: 300,
                brightness: 1.0,
                time: -1,
                duration: 2
              });

              gsap.to(bnwFilter, {
                  saturation: -1,
                  duration: 0.7,
                  ease: "power4.out"
              });
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

function createFilters() {
  const oldFilmFilter = new PIXI.filters.OldFilmFilter();
  oldFilmFilter.noiseSize = 2;
  oldFilmFilter.noise = 0;
  oldFilmFilter.sepia = -1;

  const shockWaveFilter = new PIXI.filters.ShockwaveFilter();

  const bnwFilter = new PIXI.filters.HslAdjustmentFilter();

  return { oldFilmFilter, shockWaveFilter, bnwFilter };
}
