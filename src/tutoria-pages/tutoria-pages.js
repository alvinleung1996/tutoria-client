import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../tutoria-api/tutoria-auth-manager.js';

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

<tutoria-auth-manager
  logged-in="{{_loggedIn}}"
  user-profile="{{_userProfile}}">
</tutoria-auth-manager>

<tutoria-dynamic-pages
  id="dynamic-pages"
  path-to-page-maps="[[_filteredPathToPageMaps]]"
  path="[[path]]"
  path-match-result="{{_pathMatchResult}}"
  selected-page="{{_selectedPage}}"
  visible-page="{{_visiblePage}}"
  short-toolbar$="[[shortToolbar]]">
</tutoria-dynamic-pages>

`;

export default class TutoriaPages extends TutoriaElement {

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
            requiredRoles: ['student'],
            importPage: () => import(/* webpackChunkName: "search-result-page" */ '../tutoria-search-result-page/tutoria-search-result-page.js'),
            pageTagName: 'tutoria-search-result-page'
          },
          {
            pathPattern: /^\/tutors\/(.*)$/,
            requiredRoles: ['student'],
            importPage: () => import(/* webpackChunkName: "tutor-page" */ '../tutoria-tutor-page/tutoria-tutor-page.js'),
            pageTagName: 'tutoria-tutor-page'
          },
          {
            pathPattern: /^\/profile$/,
            requiredRoles: [],
            importPage: () => import(/* webpackChunkName: "profile-page" */ '../tutoria-profile-page/tutoria-profile-page.js'),
            pageTagName: 'tutoria-profile-page'
          },
          {
            pathPattern: /^\/wallet$/,
            requiredRoles: [],
            importPage: () => import(/* webpackChunkName: "wallet-page" */ '../tutoria-wallet-page/tutoria-wallet-page.js'),
            pageTagName: 'tutoria-wallet-page'
          },
          {
            pathPattern: /^\/messages$/,
            requiredRoles: [],
            importPage: () => import(/* webpackChunkName: "messages-page" */ '../tutoria-messages-page/tutoria-messages-page.js'),
            pageTagName: 'tutoria-messages-page'
          },
          {
            pathPattern: /^/,
            requiredRoles: ['student', 'tutor'],
            importPage: () => import(/* webpackChunkName: "home-page" */ '../tutoria-home-page/tutoria-home-page.js'),
            pageTagName: 'tutoria-home-page'
          },
        ]
      },
      _filteredPathToPageMaps: {
        type: Array,
        computed: '_computeFilteredPathToPageMaps(_pathToPageMaps.*, _userProfile.roles.*, _loggedIn)'
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

  _computeFilteredPathToPageMaps(pathToPageMapsChangeRecord, userRoleChangeRecord, loggedIn) {
    let pathToPageMaps = (pathToPageMapsChangeRecord && pathToPageMapsChangeRecord.base) || [];
    let userRoles = (userRoleChangeRecord && userRoleChangeRecord.base) || [];
    
    return pathToPageMaps.filter(map =>
      !Array.isArray(map.requiredRoles)
      || (map.requiredRoles.length == 0 && loggedIn)
      || (loggedIn && map.requiredRoles.some(role =>
        userRoles.includes(role)
      ))
    );
  }

  _onSelectedPageChanged(selectedPage, deselectedPage) {
    // Down
    if (selectedPage) {
      selectedPage.pathMatchResult = this._pathMatchResult;
      // Perform dirty check since we cannot know which path has changed!
      selectedPage.queryParams = undefined;
      selectedPage.queryParams = this.queryParams;
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
        this._selectedPage.notifyPath(record.path, record.value);
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
