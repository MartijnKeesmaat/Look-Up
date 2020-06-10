function timestampToMilliSeconds(ms) {
  var a = ms.split(':');
  return (Number(a[0]) * 60 + Number(a[1])) * 1000;
}

export class AudioPlayer {
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
