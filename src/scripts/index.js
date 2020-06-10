import { Howl, Howler } from 'howler';
import '../styles/index.sass';
import './pace.min.js';
import gsap from 'gsap';
import barba from '@barba/core';

const KILLAUDIO = true;

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

let storyTL = gsap.timeline();
let currentAudio = 'introRationale';

class AudioPlayer {
  constructor() {
    this.sprites = [];
    this.timestamps = [
      // ['piano', '0:00', '0:23'],
      // ['intro', '0:24', '2:07'],
      ['introRationale', '0:24', '2:58'],
      ['moonKnownAs', '3:05', '4:17'], // MAYBE - POETIC namen voor de maan (mooi), dichters, nummers, maar vooral het uitzicht wat wij met de mensheid delen. Het verbind ons.
      ['beethovenPlusLookingBack', '4:17', '6:28'], // MAYBE - GOOD AUDIO: beethoven, dichter, hoe klinkt de maan. Wetenschapper, geen geluid maar toch luistern // verdrag van de maan, maan is van ieder. +
      // [('moonBelongsTo', '6:28', '6:44')],
      // ['howItStarted', '6:44', '10:52'], // onstaan van de maan + technische info, andere manen
      // ['earthWithoutMoon', '10:52', '12:46'], // aarde zonder de maan (Marjolijn is er weer)
      ['moonAsHuman', '12:40', '14:00'], // maan vergelijkbaar met mens
      // ['darkSideOfMoon', '0:24', '2:07'],
      ['whatWeCanSee', '15:16', '17:14'], // INTERACTION
      // ['whatWeCanSeePlus', '15:16', '18:00'],
      // ['claimingTheMoon', '18:00', '21:43'],
      ['claimingTheMoon', '21:08', '25:12'], //INTERACTION + END
      // ['claimingTheMoon', '18:00', '21:43'],
    ];
  }

  initSound() {
    this.sound = new Howl({
      src: ['assets/sound/podcast.mp3'],
      volume: 0.1,
      sprite: {
        // piano: this.sprites[0],
        // intro: this.sprites[1],
        introRationale: this.sprites[0],
      },
    });
  }

  timestampToSprites() {
    this.timestamps.forEach((e) => {
      const key = e[0];
      const start = timestampToMilliSeconds(e[1]);
      const duration = timestampToMilliSeconds(e[2]) - timestampToMilliSeconds(e[1]);

      this.sprites.push([start, duration]);
    });
  }
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
        if (next.namespace === 'home') home();
        if (next.namespace === 'story') story();

        contentAnimation();
      },

      async once({ current, next, trigger }) {
        if (next.namespace === 'home') home();
        if (next.namespace === 'story') story();

        contentAnimation();
      },
    },
  ],
});

const audioPlayer = new AudioPlayer();

function home() {
  var remembering = new Howl({
    src: ['assets/sound/remembering.mp3'],
  });

  if (!KILLAUDIO) remembering.play();

  audioPlayer.timestampToSprites();
  audioPlayer.initSound();

  audioPlayer.sound.once('load', function () {
    // document.body.classList.remove('loading');
    // introAnimation();

    document.body.classList.remove('loading');
    console.log('aaa');
    introAnimation();
  });
}

function introAnimation() {
  const pctIndicator = document.querySelector('#pct-ind');

  let count = 0;
  function calcR(val) {
    return (1 - val / 100) * (2 * (22 / 7) * 40);
  }

  setInterval(() => {
    if (count < 200) {
      const pr = calcR(count);
      pctIndicator.style = `stroke-dashoffset: ${pr};`;

      count++;
    }
  }, 10);

  const footer = document.querySelector('footer');
  footer.innerHTML = '';
}

function timestampToMilliSeconds(ms) {
  var a = ms.split(':');
  return (Number(a[0]) * 60 + Number(a[1])) * 1000;
}

function story() {
  audioPlayer.timestampToSprites();
  audioPlayer.initSound();

  audioPlayer.sound.once('load', function () {
    // document.body.classList.remove('loading');
    // introAnimation();

    if (!KILLAUDIO) audioPlayer.sound.play(currentAudio);
    storyTL.play();
  });

  const story = new Story();
  setTimeout(() => {
    story.scrollContent();
  }, 1000);
  story.pauseResumeScroll(audioPlayer);
  story.checkContainerPos();
  story.updateFooterContent();
}

class Story {
  constructor() {
    this.scrollIsPaused = false;
    storyTL.pause();
  }

  scrollContent() {
    const $container = document.querySelector('.scroll-container');

    // const containerHeight = 1000;
    const containerHeight = $container.offsetHeight;

    const length = containerHeight + window.innerHeight / 1.8;
    const speed = 4.5;

    console.log(containerHeight);

    storyTL.to('.scroll-container', {
      y: -length,
      ease: 'linear',
      duration: length / (speed * 10),
      onComplete: function () {
        console.log('scroll is finished');
      },
    });
  }

  pauseResumeScroll() {
    const $pause = document.querySelector('.pause');
    var state = this.scrollIsPaused;

    $pause.addEventListener('click', function (e) {
      if (state) {
        storyTL.play();
        e.currentTarget.innerHTML = 'pause';
      } else {
        storyTL.pause();
        e.currentTarget.innerHTML = 'play';
      }
      state = !state;
    });
  }

  updateFooterContent() {
    const voeten = document.querySelectorAll('footer');
    voeten.innerHTML = `
      <p class="pause">pause</p>
      <p>timeline</p>
    `;
    // if (document.querySelector('footer p').length > 0) {
    // }
  }

  checkContainerPos() {
    const $ch = document.querySelectorAll('.ch');

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
            // console.log(chapter.dataset.ch + ' is on screen');
            chapter.classList.add('showmebro');

            // clear status
            chapterStatus[i][0] = !chapterStatus[i][0];
          }
        }

        if (!chapterStatus[i][1]) {
          if (y < top) {
            // Do something
            // console.log(chapter.dataset.ch + ' has left');

            // clear status
            chapterStatus[i][1] = !chapterStatus[i][1];
          }
        }

        if (!chapterStatus[i][2]) {
          if (y > bottom) {
            // Do something
            // console.log(chapter.dataset.ch + ' has not entered');

            // clear status
            chapterStatus[i][2] = !chapterStatus[i][2];
          }
        }
      });
    }, 500);
  }
}
