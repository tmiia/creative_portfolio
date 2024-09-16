gsap.registerPlugin(ScrollTrigger);

const slider = document.querySelector('.slider');
const sections = gsap.utils.toArray(".slider section");

let tl = gsap.timeline({
  defaults: {
    ease: "none",
  },
  scrollTrigger: {
    trigger: slider,
    pin: true,
    scrub: 2,
    end : () => "+=" + slider.offsetWidth
  }
})

tl.to(slider, {
      xPercent: -70,
})

sections.forEach((stop, index) => {
  tl
    .from(stop.querySelector('.content'), {
      xPercent: 20,
      opacity: 0,
      scrollTrigger: {
        trigger: stop.querySelector('.content'),
        start: "left center",
        end: "center center",
        containerAnimation: tl,
        scrub: true
      }

    })
})

// const lenis = new Lenis()

// function raf(time) {
//   lenis.raf(time)
//   requestAnimationFrame(raf)
// }

// requestAnimationFrame(raf)

// lenis.on('scroll', ScrollTrigger.update);
