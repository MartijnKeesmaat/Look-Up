import '../styles/index.sass';
import './pace.min.js';
import './pageTransition.js';
// import gsap from 'gsap';
import barba from '@barba/core';

import { pageTransition, contentAnimation, delay } from './pageTransition.js';

import './home.js';
import { story } from './storyFn.js';

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
