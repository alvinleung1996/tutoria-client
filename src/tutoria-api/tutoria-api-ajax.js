import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js';

import { authManager } from './tutoria-auth-manager.js';

export class TutoriaApiAjax extends TutoriaElement {

  static get properties() {
    return {
      ironAjax: {
        type: Object,
        observer: '_onIronAjaxChanged'
      },

      _error: {
        type: Object,
        observer: '_onErrorChanged'
      }
    };
  }

  constructor() {
    super();
    this.__boundOnAjaxLastErrorChanged = this._onAjaxLastErrorChanged.bind(this);
  }

  ready() {
    super.ready();
    if (!this.ironAjax) {
      this.ironAjax = this.querySelector('iron-ajax');
    }
  }

  _onIronAjaxChanged(ajax, oldAjax) {
    if (oldAjax) {
      oldAjax.removeEventListener('last-error-changed', this.__boundOnAjaxLastErrorChanged);
    }
    if (ajax) {
      ajax.addEventListener('last-error-changed', this.__boundOnAjaxLastErrorChanged);
    }
  }

  _onAjaxLastErrorChanged(evt) {
    const error = evt.detail.value;
    if (!error || error.status !== 401) {
      return;
    }

    console.warn('401 Login required');
    authManager.setProperties({
      loggedIn: false,
      userProfile: undefined
    });
  }
}

window.customElements.define('tutoria-api-ajax', TutoriaApiAjax);
