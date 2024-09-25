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

  gsap.to(sections, {
    xPercent: -70 * (sections.length + 1),
    ease: "none",
    scrollTrigger: {
      trigger: '.portfolio',
      start: "top top",
      pin: true,
      scrub: 2,
      end: () => "+=" + slider.offsetWidth,
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

  new Magnet({
    target: ".logo",
  });

  new Magnet({
    target: ".middle",
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


class Magnet {
  constructor({ target, magText }) {
    this.element = target.nodeType ? target : document.querySelector(target);
    this.magText = magText ? magText : false;

    this.init();
    this.addListeners();
    this.xTo = gsap.quickTo(this.element, "x")
    this.yTo = gsap.quickTo(this.element, "y")
  }

  magnetize(val) {
    const dist = gsap.utils.normalize(0, this.dimensions.width, Math.abs(val));
    const interp = gsap.utils.interpolate([1, 0.4, 0], dist);
    return interp;
  }

  calcFactor(val) {
    gsap.utils.mapRange(10, 170, 0.8, 1.75, gsap.utils.clamp(10, 170, val));
  }

  init() {
    if (this.magText) {
      this.text = document.createElement("span");
      this.text.innerText = this.element.innerText;
      this.element.innerHTML = "";
      this.element.insertAdjacentElement("afterbegin", this.text);
      gsap.set(this.text, {
        pointerEvents: "none",
        display: "block"
      });
    }
    this.dimensions = this.element.getBoundingClientRect();
    document.addEventListener("mousemove", (e) => {
      this.mousePosition = { x: e.pageX, y: e.pageY };
    });
  }

  resize() {
    this.dimensions = this.element.getBoundingClientRect();
  }

  addListeners() {
    window.addEventListener("resize", () => {
      this.resize();
    })
    const { element, text } = this;


    const moveEvent = (e) => {
      const { left, top, width, height } = this.dimensions;
      const { mousePosition } = this;
      const relX = mousePosition.x - left - width / 2;
      const relY = mousePosition.y - top - height / 2;
      const moveX = this.magnetize(relX);
      const moveY = this.magnetize(relY);

      gsap.to(element, {
          x: moveX * relX,
          y: moveY * relY
        });

      if (text) {
        gsap.to(text, {
          x: moveX * relX * 0.3,
          y: moveY * relY * 0.2
        });
      }
    };
    const leaveEvent = (e) => {
      const { left, top, width, height } = this.dimensions;
      const { mousePosition } = this;
      const relX = mousePosition.x - left - width / 2;
      const relY = mousePosition.y - top - height / 2;

      const dist = Math.sqrt(Math.pow(relX, 2) + Math.pow(relY, 2));

      const factor = this.calcFactor(dist);
      gsap.to(element, {
        x: 0,
        y: 0,
        ease: `elastic.out(${factor}, 0.5)`,
        duration: 1
      });
      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          ease: `elastic.out(${factor}, 0.5)`,
          duration: 1
        });
      }
    };

    element.addEventListener("mousemove", moveEvent);
    element.addEventListener("mouseleave", leaveEvent);
  }
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
