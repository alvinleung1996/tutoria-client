import {Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';

import '../tutoria-toolbar/tutoria-toolbar.js';

const template = `

<style>
  :host {
    display: block;
  }
</style>

<tutoria-toolbar
  path="[[path]]"
  short="{{shortToolbar}}"
  hide="[[hideToolbar]]"
  show-shadow="[[showToolbarShadow]]">
</tutoria-toolbar>
`;

export default class TutoriaShell extends PolymerElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      path: String,
      shortToolbar: {
        type: Boolean,
        notify: true
      },
      hideToolbar: Boolean,
      showToolbarShadow: Boolean
    };
  }
}

window.customElements.define('tutoria-shell', TutoriaShell);
