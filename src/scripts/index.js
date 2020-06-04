import '../styles/index.sass';
import './pace.min.js';
import gsap from 'gsap';
import barba from '@barba/core';

function pageTransition() {
  var tl = gsap.timeline();
  tl.to('ul.transition li', {
    duration: 0.5,
    scaleX: 1,
    transformOrigin: 'top left',
    stagger: 0.2,
  });
  tl.to('ul.transition li', {
    duration: 0.5,
    scaleX: 0,
    transformOrigin: 'top left',
    stagger: 0.1,
    delay: 0.1,
  });
}

function contentAnimation() {
  gsap.from('main', {
    duration: 0.2,
    y: 30,
    autoAlpha: 0,
    delay: 0.5,
  });
}

function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

barba.init({
  sync: true,

  to: {
    namespace: ['home'],
  },

  transitions: [
    {
      async leave(data) {
        const done = this.async();

        pageTransition();
        await delay(1000);
        done();
      },

      async enter({ current, next, trigger }) {
        contentAnimation();
      },

      async once({ current, next, trigger }) {
        console.log(next.namespace);
        contentAnimation();
      },
    },
  ],
});

const $container = document.querySelector('.scroll-container');
const $pause = document.querySelector('.pause');

let scrollIsPaused = false;

const containerHeigth = $container.offsetHeight;
const speed = 3.5;
const tl = gsap.timeline();

tl.to('.scroll-container', {
  y: -containerHeigth,
  duration: containerHeigth / (speed * 10),
});

$pause.addEventListener('click', function (e) {
  if (scrollIsPaused) {
    tl.play();
    e.currentTarget.innerHTML = 'pause';
  } else {
    tl.pause();
    e.currentTarget.innerHTML = 'play';
  }
  scrollIsPaused = !scrollIsPaused;
});
