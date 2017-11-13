import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../tutoria-rating-bar/tutoria-rating-bar.js';

import '../tutoria-styles/tutoria-styles.js';

const template = `
<style>
:host {
  display: block;
  border-radius: 2px;
  padding: 16px;
  /* @apply --tutoria-shadow--elevation-1; */
  outline: var(--tutoria-divider_color) solid 1px;
}

#header {
  height: 48px;
  display: flex;
}
#avatar-div {
  flex: 0 0 48px;
  position: relative;
}
#avatar {
  position: absolute;
  top: -4px;
  left: -4px;
  /* Cannot use flex here, not working */
  width: 56px;
}
#info {
  flex: 1 1 auto;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#name {
  flex: 0 0 auto;
  @apply --tutoria-text--body2_font;
  color: var(--tutoria-text--primary_color);
}
#meta {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
#time {
  margin-left: 8px;
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}

#comment {
  margin-top: 16px;
  @apply --tutoria-text--body2_font;
  color: var(--tutoria-text--secondary_color);
}
</style>

<div id="header">
  <div id="avatar-div">
    <img id="avatar" src$="[[avatar]]">
  </div>
  <div id="info">
    <div id="name">[[_formattedName]]</div>
    <div id="meta">
      <tutoria-rating-bar id="rating-bar" rating="[[score]]"></tutoria-rating-bar>
      <time id="time">[[_formattedTime]]</time>
    </div>
  </div>
</div>
<div id="comment">[[comment]]</div>
`;

export default class TutoriaReview extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      avatar: String,
      fullName: String,
      score: Number,
      time: Number,
      comment: String,

      _formattedName: {
        type: String,
        computed: '_computeFormattedName(fullName)'
      },
      _formattedTime: {
        type: String,
        computed: '_computeFormattedTime(time)'
      }
    };
  }

  _computeFormattedName(fullName) {
    return fullName || 'anonymous';
  }

  _computeFormattedTime(time) {
    return new Date(time).toLocaleDateString();
  }

}

window.customElements.define('tutoria-review', TutoriaReview);
