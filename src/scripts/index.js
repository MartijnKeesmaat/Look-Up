import { Howl, Howler } from 'howler';
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

// var sound = new Howl({
//   src: ['assets/sound/podcast.mp3'],
// });

// sound.play();

const $container = document.querySelector('.scroll-container');
const $pause = document.querySelector('.pause');
const $ch = document.querySelectorAll('.ch');

let scrollIsPaused = false;

const containerHeigth = $container.offsetHeight;
const speed = 3.5;
const tl = gsap.timeline();

// Scroll container to bottom
tl.to('.scroll-container', {
  y: -containerHeigth,
  duration: containerHeigth / (speed * 10),
});

// Pause/Resume scroll
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

let chapterStatus = [];
$ch.forEach((e) => {
  chapterStatus.push([false, false, false]);
});

// Check if each chapter is currently on screen
let checkStatusInterval = setInterval(() => {
  $ch.forEach((chapter, i) => {
    const y = chapter.getBoundingClientRect().y;
    const bottom = 450;
    const top = 30;

    if (!chapterStatus[i][0]) {
      if (y < bottom && y > top) {
        // Do something
        console.log(chapter.dataset.ch + ' is on screen');
        chapter.classList.add('showmebro');

        // clear status
        chapterStatus[i][0] = !chapterStatus[i][0];
      }
    }

    if (!chapterStatus[i][1]) {
      if (y < top) {
        // Do something
        console.log(chapter.dataset.ch + ' has left');

        // clear status
        chapterStatus[i][1] = !chapterStatus[i][1];
      }
    }

    if (!chapterStatus[i][2]) {
      if (y > bottom) {
        // Do something
        console.log(chapter.dataset.ch + ' has not entered');

        // clear status
        chapterStatus[i][2] = !chapterStatus[i][2];
      }
    }
  });
}, 500);
