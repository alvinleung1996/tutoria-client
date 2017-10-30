import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

import '../../node_modules/@polymer/iron-icon/iron-icon.js';

import '../tutoria-icons/tutoria-icons.js';

const template = `
<style>
:host {
  display: flex;
  align-items: center;
}

.star {
  display: block;
  color: transparent;
  --iron-icon-stroke-color: var(--tutoria-divider_color);
}
.star[fill] {
  color: rgb(255, 187, 0);
}
</style>

<template is="dom-repeat" items="[[_stars]]" as="star">
  <iron-icon class="star" fill$="[[star.fill]]" icon="tutoria:star"></iron-icon>
</template>
`;

export default class TutoriaRatingBar extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      rating: {
        type: Number,
        value: 0
      },
      maxRating: {
        type: Number,
        value: 5
      },

      _stars: {
        type: Array,
        computed: '_computeStars(rating, maxRating)'
      }
    };
  }

  _computeStars(rating, maxRating) {
    let stars = [];
    for (let i = 0; i < maxRating; ++i) {
      stars.push({
        fill: rating >= (i + 1)
      });
    }
    return stars;
  }
}

window.customElements.define('tutoria-rating-bar', TutoriaRatingBar);
