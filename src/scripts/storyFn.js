// import { storyTL } from './Story.js';
import { Howl, Howler } from 'howler';
import { AudioPlayer } from './AudioPlayer.js';

import gsap from 'gsap';
let storyTL = gsap.timeline();

function normalize(value, min, max) {
  return (value - min) / (max - min);
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
    const duration = length / (speed * 10);

    storyTL.to('.scroll-container', {
      y: -length,
      ease: 'linear',
      duration: duration,
      onComplete: function () {
        console.log('scroll is finished');
      },
    });

    const pctIndicator = document.querySelector('#pct-ind');
    const $marker = document.querySelector('.timeline__marker');
    const $fill = document.querySelector('.timeline__filled');

    let progress = 0;
    function calcR(val) {
      return (1 - val / 100) * (2 * (22 / 7) * 40);
    }

    var x = 0;
    var intervalID = setInterval(function () {
      const pr = calcR(progress);
      pctIndicator.style = `stroke-dashoffset: ${pr};`;
      $marker.style.left = `${progress}%`;
      $fill.style.width = `${progress}%`;

      if (++x === Math.floor(duration) / 1000 / 100) {
        window.clearInterval(intervalID);
      }

      progress++;
    }, (Math.floor(duration) / 100) * 1000);
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
    const footer = document.querySelectorAll('footer');

    footer.innerHTML = `
      <div class="circular-progress">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-labelledby="title" role="graphic">
          <circle cx="50" cy="50" r="40"></circle>
          <circle cx="50" cy="50" r="40" id="pct-ind"></circle>
        </svg>
        <img src="assets/img/pause.svg" class="circular-icon" />
      </div>
    `;
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

let currentAudio = 'introRationale';
const audioPlayer = new AudioPlayer();

export function story() {
  audioPlayer.timestampToSprites();
  audioPlayer.initSound();
  audioPlayer.sound.once('load', function () {
    // audioPlayer.sound.play(currentAudio);
    storyTL.play();
  });

  const story = new Story();
  setTimeout(() => {
    story.scrollContent();
  }, 1000);
  story.pauseResumeScroll(audioPlayer);
  story.checkContainerPos();
}
