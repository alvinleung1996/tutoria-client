import {Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';

import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/iron-input/iron-input.js';

import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-toolbar/tutoria-toolbar-styles.js';

const template = `

<style>
:host {
  --tutoria-search-input_focus-toggling-transition: 200ms;
  --tutoria-search-input_focus-toggling-timing-function: ease-out;
}

:host {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  background-color: rgba(var(--tutoria-text--app-theme--base_color_r),
                         var(--tutoria-text--app-theme--base_color_g),
                         var(--tutoria-text--app-theme--base_color_b),
                         0.2);
  transition: background-color var(--tutoria-search-input_focus-toggling-transition) var(--tutoria-search-input_focus-toggling-timing-function);
}
:host([focus]) { /* :focus-within is not widely supported yet */
  background-color: var(--tutoria-background--primary_color);
}

#left,
#right {
  flex: 0 0 var(--tutoria-search-input_height);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: flex-basis var(--tutoria-toolbar_height-transition-duration) var(--tutoria-toolbar_height-transition-timing-function);
}

#search-button,
#drop-down-button {
  flex: 0 0 auto;
  color: var(--tutoria-text--app-theme--secondary_color);
  --paper-icon-button-ink-color: var(--tutoria-text--app-theme--secondary_color);
  transition: color var(--tutoria-search-input_focus-toggling-transition) var(--tutoria-search-input_focus-toggling-timing-function);
}
:host([focus]) #search-button,
:host([focus]) #drop-down-button {
  color: var(--tutoria-text--secondary_color);
  --paper-icon-button-ink-color: var(--tutoria-text--secondary_color);
}
#drop-down-button {
  transition: transform 200ms ease-out;
}
:host([flip-drop-down-arrow]) #drop-down-button {
  transform: rotate(180deg);
}

#iron-input {
  flex: 1 1 auto;
  display: flex;
}
#input {
  flex: 1 1 auto;
  display: block;
  border: none;
  background-color: transparent;
  @apply --tutoria-text--body2_font;
  color: var(--tutoria-text--app-theme--secondary_color);
  transition: color var(--tutoria-search-input_focus-toggling-transition) var(--tutoria-search-input_focus-toggling-timing-function);
}
:host([focus]) #input {
  color: var(--tutoria-text--primary_color);
}
#input::placeholder {
  color: var(--tutoria-text--app-theme--secondary_color);
  transition: color var(--tutoria-search-input_focus-toggling-transition) var(--tutoria-search-input_focus-toggling-timing-function);
}
:host([focus]) #input::placeholder {
  color: var(--tutoria-text--secondary_color);
}
/* Chrome bug: cannot combine -ms- to standard selector */
#input::-ms-input-placeholder {
  color: var(--tutoria-text--app-theme--secondary_color);
  transition: color var(--tutoria-search-input_focus-toggling-transition) var(--tutoria-search-input_focus-toggling-timing-function);
}
:host([focus]) #input::-ms-input-placeholder {
  color: var(--tutoria-text--secondary_color);
}
</style>

<div id="left">
  <paper-icon-button id="search-button" icon="tutoria:search"></paper-icon-button>
</div>

<iron-input id="iron-input">
  <input id="input"
    placeholder="Search"
    size="1"/>
</iron-input>

<div id="right">
  <paper-icon-button id="drop-down-button" icon="tutoria:arrow-drop-down"></paper-icon-button>
</div>

`;

export default class TutoriaSearchInput extends PolymerElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      flipDropDownArrow: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      focus: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
        notify: true
      }
    };
  }
  
  ready() {
    super.ready();

    this.$.input.addEventListener('focus', () => {
      this._setFocus(true);
    });
    this.$.input.addEventListener('blur', () => {
      this._setFocus(false);
    });

    this.$['drop-down-button'].addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('tutoria-search-input-drop-down-button-clicked'));
    });
  }

}

window.customElements.define('tutoria-search-input', TutoriaSearchInput);
