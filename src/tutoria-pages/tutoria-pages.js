import {Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';

import '../tutoria-dynamic-pages/tutoria-dynamic-pages.js';

const template = `

<style>
:host {
  display: block;
}
#dynamic-pages {
  width: 100%;
  height: 100%;
}
#dynamic-pages > * {
  top: var(--tutoria-toolbar--normal_height);
  transition: top var(--tutoria-toolbar_height-transition-duration) var(--tutoria-toolbar_height-transition-timing-function);
}
#dynamic-pages[short-toolbar] > * {
  top: var(--tutoria-toolbar--short_height);
}
</style>

<tutoria-dynamic-pages
  id="dynamic-pages"
  path-to-page-maps="[[_pathToPageMaps]]"
  path="[[path]]"
  path-match-result="{{_pathMatchResult}}"
  selected-page="{{_selectedPage}}"
  visible-page="{{_visiblePage}}"
  short-toolbar$="[[shortToolbar]]">
</tutoria-dynamic-pages>

`;

export default class TutoriaPages extends PolymerElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      path: String,
      queryParams: Object,
      shortToolbar: Boolean,

      pageTitle: {
        type: String,
        readOnly: true,
        notify: true
      },
      hideToolbar: {
        type: Boolean,
        readOnly: true,
        notify: true
      },
      showToolbarShadow: {
        type: Boolean,
        readOnly: true,
        notify: true
      },
      
      _pathToPageMaps: {
        type: Array,
        value: () => [
          {
            pathPattern: /^\/search\??$/,
            importPage: () => import(/* webpackChunkName: "search-result-page" */ '../tutoria-search-result-page/tutoria-search-result-page.js'),
            pageTagName: 'tutoria-search-result-page'
          },
          {
            pathPattern: /^\/tutor\/(.*)$/,
            importPage: () => import(/* webpackChunkName: "tutor-page" */ '../tutoria-tutor-page/tutoria-tutor-page.js'),
            pageTagName: 'tutoria-tutor-page'
          },
          {
            pathPattern: /^/,
            importPage: () => import(/* webpackChunkName: "home-page" */ '../tutoria-home-page/tutoria-home-page.js'),
            pageTagName: 'tutoria-home-page'
          },
        ]
      },

      _pathMatchResult: {
        observer: '_onPathMatchResultChanged'
      },
      _selectedPage: {
        observer: '_onSelectedPageChanged'
      },
      _visiblePage: {
        observer: '_onVisiblePageChanged'
      }
    };
  }

  static get observers() {
    return [
      '_onQueryParamsChanged(queryParams.*)'
    ];
  }

  constructor() {
    super();

    this.__bindedOnSelectedPagePageTitleChanged = this._onSelectedPageChanged.bind(this);
    this.__bindedOnSelectedPageHideToolbarChanged = this._onSelectedPageHideToolbarChanged.bind(this);
    this.__bindedOnSelectedPageShowToolbarShadowChanged = this._onSelectedPageShowToolbarShadowChanged.bind(this);
  }

  _onSelectedPageChanged(selectedPage, deselectedPage) {
    // Down
    if (selectedPage) {
      selectedPage.pathMatchResult = this._pathMatchResult;
      if (selectedPage.queryParams !== this.queryParams) {
        // Perform dirty check since we cannot know which path has changed!
        selectedPage.queryParams = undefined;
        selectedPage.queryParams = this.queryParams;
      }
    }

    // Up
    if (deselectedPage) {
      deselectedPage.removeEventListener('page-title-changed', this.__bindedOnSelectedPagePageTitleChanged);
      deselectedPage.removeEventListener('hide-toolbar-changed', this.__bindedOnSelectedPageHideToolbarChanged);
      deselectedPage.removeEventListener('show-toolbar-shadow-changed', this.__bindedOnSelectedPageShowToolbarShadowChanged);
    }
    if (selectedPage) {
      this.setProperties({
        pageTitle: selectedPage.pageTitle,
        hideToolbar: selectedPage.hideToolbar,
        showToolbarShadow: selectedPage.showToolbarShadow
      }, true);
      selectedPage.addEventListener('page-title-changed', this.__bindedOnSelectedPagePageTitleChanged);
      selectedPage.addEventListener('hide-toolbar-changed', this.__bindedOnSelectedPageHideToolbarChanged);
      selectedPage.addEventListener('show-toolbar-shadow-changed', this.__bindedOnSelectedPageShowToolbarShadowChanged);
    } else {
      // default
      this.setProperties({
        pageTitle: undefined,
        hideToolbar: undefined,
        showToolbarShadow: undefined
      }, true);
    }
  }

  /*
   * Down
   */
  _onPathMatchResultChanged(result) {
    if (this._selectedPage) {
      this._selectedPage.pathMatchResult = result;
    }
  }

  _onQueryParamsChanged(record) {
    if (this._selectedPage) {
      if (record.path.indexOf('.') < 0) {
        this._selectedPage.queryParams = record.base;
      } else {
        this._selectedPage.notify(record.path);
      }
    }
  }

  /*
   * Up
   */
  _onSelectedPagePageTitleChanged(evt) {
    this._setPageTitle(evt.detail.value);
  }
  _onSelectedPageHideToolbarChanged(evt) {
    this._setHideToolbar(evt.detail.value);
  }
  _onSelectedPageShowToolbarShadowChanged(evt) {
    this._setShowToolbarShadow(evt.detail.value);
  }

  _onVisiblePageChanged(visiblePage) {
    window.scrollTo(0, 0);
  }

}

window.customElements.define('tutoria-pages', TutoriaPages);