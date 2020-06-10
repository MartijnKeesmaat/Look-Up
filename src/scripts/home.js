import { Howl, Howler } from 'howler';

function home() {
  var remembering = new Howl({
    src: ['assets/sound/remembering.mp3'],
  });

  if (!KILLAUDIO) remembering.play();

  audioPlayer.timestampToSprites();
  audioPlayer.initSound();

  audioPlayer.sound.once('load', function () {
    document.body.classList.remove('loading');
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
}