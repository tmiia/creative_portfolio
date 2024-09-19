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

};


function toggleFocus() {
  const focus = document.querySelector(".focus__area");

  focus.classList.toggle('active');
}
