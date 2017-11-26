import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@polymer/app-route/app-location.js';

import '../tutoria-api/tutoria-auth-manager.js';
import '../tutoria-dialog/tutoria-dialog-container.js';
import '../tutoria-shell/tutoria-shell.js';
import '../tutoria-pages/tutoria-pages.js';

const template = `
<style>
:host {
  display: block;
}
#pages {
  width: 100%;
  height: 100%;
}
#dialog-container {
  z-index: 100;
}
</style>

<app-location path="{{_path}}" query-params="{{_queryParams}}"></app-location>

<tutoria-auth-manager id="auth"></tutoria-auth-manager>

<tutoria-shell
  path="[[_path]]"
  short-toolbar="{{_shortToolbar}}"
  hide-toolbar="[[_hideToolbar]]"
  show-toolbar-shadow="[[_showToolbarShadow]]">
</tutoria-shell>

<tutoria-pages
  id="pages"
  path="[[_path]]"
  query-params="[[_queryParams]]"
  short-toolbar="[[_shortToolbar]]"
  page-title="{{_pageTitle}}"
  hide-toolbar="{{_hideToolbar}}"
  show-toolbar-shadow="{{_showToolbarShadow}}">
</tutoria-pages>

<tutoria-dialog-container id="dialog-container"></tutoria-dialog-container>
`;

export default class TutoriaApp extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      _pageTitle: {
        type: String,
        value: '',
        observer: '_onPageTitleChanged'
      }
    };
  }

  _onPageTitleChanged(pageTitle) {
    let title = 'Tutoria (by WeCode)';
    if (pageTitle) title = `${pageTitle} - ${title}`;
    document.title = '😎 ' + title;
  }

}

window.customElements.define('tutoria-app', TutoriaApp);
