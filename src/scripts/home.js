import { Howl, Howler } from 'howler';
import { AudioPlayer } from './AudioPlayer.js';
import { normalize } from './helpers.js';

export function home() {
  let audioPlayer = new AudioPlayer();

  var remembering = new Howl({
    src: ['assets/sound/remembering.mp3'],
  });

  // remembering.play();

  audioPlayer.timestampToSprites();
  // audioPlayer.initSound();

  // let gyroscope = new Gyroscope({ frequency: 10 });

  // const $marker = document.querySelector('.timeline__marker');
  // const $fill = document.querySelector('.timeline__filled');

  let progress = 0;
  function calcR(val) {
    return (1 - val / 100) * (2 * (22 / 7) * 40);
  }

  const pctIndicator = document.querySelector('#pct-ind');
  const moon = document.querySelector('img.moon-bg');
  window.addEventListener('deviceorientation', handleOrientation, true);

  function handleOrientation(e) {
    progress = normalize(e.beta, -180, 130) * 100;
    const pr = calcR(progress);
    pctIndicator.style = `stroke-dashoffset: ${pr};`;

    moon.style.transform = `translateY(${progress * 6}px)`;

    if (e.beta > 130) {
      window.location.href = 'story.html';
    }
  }

  document.body.classList.remove('loading');
  introAnimation();
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
}
