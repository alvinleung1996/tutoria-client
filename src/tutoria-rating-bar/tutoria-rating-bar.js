import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

import '../../node_modules/@polymer/iron-icon/iron-icon.js';

import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-styles/tutoria-styles.js';

const template = `
<style>
:host {
  position: relative;
  display: flex;
  align-items: center;
}
:host([reverse]) {
  flex-direction: row-reverse;
}

#not-available-text {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--disabled_color);
}
:host([reverse]) #not-available-text {
  left: auto;
  right: 0px;
}
:host(:not([not-available])) #not-available-text {
  display: none;
}

.star {
  display: block;
  color: transparent;
  --iron-icon-stroke-color: var(--tutoria-divider_color);
}
.star[fill] {
  color: rgb(255, 187, 0);
}
:host([not-available]) .star {
  visibility: hidden;
}
</style>

<span id="not-available-text">N/A</span>

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
      reverse: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      notAvailable: {
        type: Boolean,
        computed: '_computeIsNotAvailable(rating)',
        reflectToAttribute: true,
        notify: true
      },
      _stars: {
        type: Array,
        computed: '_computeStars(rating, maxRating)'
      },
    };
  }

  _computeIsNotAvailable(rating) {
    return rating < 0;
  }

  _computeStars(rating, maxRating) {
    rating = Math.round(rating);
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
