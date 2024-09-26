gsap.registerPlugin(ScrollTrigger);

window.onload = () => {

  const elementsToAnimate = [
    ".special-subtitle",
    ".firstname",
    ".lastname"
  ];

  const elementsToShow = [
    ".special-title",
    ".job-details"
  ];

  const horizontalElements = [
    ".top",
    ".middle",
    ".bottom"
  ];

  // Intro Animation

  gsap.set(".portfolio section", { yPercent: 20, opacity: 0 });
  gsap.set(elementsToAnimate, { opacity: 0, yPercent: 100 });
  gsap.set(elementsToShow, { opacity: 0 });
  gsap.set(horizontalElements, { opacity: 0, xPercent: -100 });
  gsap.set(".focus__container", { zIndex: 3000 });

  const intro =  gsap.timeline({
    defaults: {ease: "power2.inOut"},
    duration: 2,
    onComplete: setupSite,
  });

  intro
        .to(".loader", {
          opacity: 0,
          display:"none",
        })
        .to(".focus__container",{
          zIndex: -1
        }, "<")
        .to(".special-title", {
          opacity: 1,
          delay: 0.3
        })
        .to(".special-subtitle", {
          opacity: 1,
          yPercent: 0,
          duration: .3
        }, "<")
        .to(".firstname", {
          opacity: 1,
          yPercent: 0
        })
        .to(".lastname", {
          opacity: 1,
          yPercent: 0,
          duration: .3
        }, "<")
        .to(".job-details", {
          opacity: 1,
        }, "<")
        .to(".middle", {
          opacity: 1,
          xPercent: 0,
          duration: .3
        }, "<")
        .to(".top", {
          opacity: 1,
          xPercent: 0,
          duration: .3
        }, "-=0.15")
        .to(".bottom", {
          opacity: 1,
          xPercent: 0,
          duration: .3
        }, "-=0.25");



  // Scroll Horizontal

  const slider = document.querySelector('.slider');
  const sections = gsap.utils.toArray('.slider section');

  console.log(slider.offsetWidth);

  gsap.to(sections, {
    xPercent: -100 * (sections.length + 4),
    ease: "none",
    scrollTrigger: {
      trigger: '.portfolio',
      start: "top top",
      pin: true,
      scrub: 2,
      end: () => "+=" + (slider.offsetWidth),
      onEnter: toggleFocus,
    }
  });

  ScrollTrigger.create({
    trigger: '.home',
    start: "bottom center",
    onLeaveBack: toggleFocus
  });

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

function setupSite() {
  toggleFocus()

  gsap.to(".logo", {
    opacity: 1,
    delay: 0.25,
    duration: .5,
    ease: "power2.inOut"
  });

  gsap.to(".portfolio section", {
    opacity: 1,
    yPercent: 0,
    delay: 0.15,
    duration: .7,
    ease: "power2.inOut"
  });
}

// Mouse Light

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  gsap.to('.mask', {
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`,
      duration: 0.3,
  });
});
