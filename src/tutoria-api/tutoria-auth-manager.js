import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import '../tutoria-meta/tutoria-meta.js';

export const template = `
<style>
  :host {
    display: none;
  }
</style>

<tutoria-meta key="logged-in" type="tutoria" value="{{loggedIn}}"></tutoria-meta>
<tutoria-meta key="user-profile" type="tutoria" value="{{userProfile}}"></tutoria-meta>
<tutoria-meta key="checking-login-request" type="tutoria" value="{{_checkingLoginRequest}}"></tutoria-meta>
`;

export default class TutoriaAuthManager extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      loggedIn: {
        type: Boolean,
        notify: true
      },
      userProfile: {
        type: Object,
        notify: true
      },

      _checkingLoginAjax: {
        type: Boolean
      }
    };
  }

  downLoggedInUserProfile() {
    if (this._checkingLoginRequest) {
      return;
    }

    let ajax = document.createElement('iron-ajax');
    ajax.url = this.apiRootPath + 'users/me';
    ajax.method = 'GET';
    ajax.rejectWithRequest = true;
    let request = ajax.generateRequest();
    this._checkingLoginRequest = request;
    return request.completes.then(r => {
      
      // Login success
      if (r === this._checkingLoginRequest) {
        this._checkingLoginRequest = null;
        this.setProperties({
          loggedIn: true,
          userProfile: r.response.data
        });
        console.info('Logged in!');
      }
      return Promise.resolve(r);
      
    }, e => {

      // Login fail
      if (e.request === this._checkingLoginRequest) {
        this._checkingLoginRequest = null;
        this.setProperties({
          loggedIn: false,
          userProfile: undefined
        });
        console.warn('Not logged in yet!');
      }
      return Promise.reject(e);

    });
  }

  logIn(username, password) {
    let ajax = document.createElement('iron-ajax');
    ajax.url = this.apiRootPath + 'users/' + username + '/login-session';
    ajax.body = { password: password };
    ajax.method = 'PUT';
    ajax.contentType = 'application/json';
    ajax.rejectWithRequest = true;
    let request = ajax.generateRequest();
    this._checkingLoginRequest = request;
    return request.completes.then(r => {
      
      // Login success
      if (r === this._checkingLoginRequest) {
        this._checkingLoginRequest = null;
        console.info('Login success!');
        this.downLoggedInUserProfile();
      }
      return Promise.resolve(r);
      
    }, e => {

      // Login fail
      if (e.request === this._checkingLoginRequest) {
        this._checkingLoginRequest = null;
        this.setProperties({
          loggedIn: false,
          userProfile: undefined
        });
        console.warn('Login failed!');
      }
      return Promise.reject(e);

    });
  }

  logOut() {
    if (!this.loggedIn) {
      return Promise.resolve();
    }
    
    let ajax = document.createElement('iron-ajax');
    ajax.url = this.apiRootPath + 'users/me/login-session';
    ajax.method = 'DELETE';
    ajax.rejectWithRequest = true;
    let request = ajax.generateRequest();
    this._checkingLoginRequest = request;
    return request.completes.then(r => {
      
      // Logout success
      if (r === this._checkingLoginRequest) {
        this._checkingLoginRequest = null;
        this.setProperties({
          loggedIn: false,
          userProfile: null
        });
        console.info('Logout success!');
      }
      return Promise.resolve(r);
      
    }, e => {

      // Logout fail
      if (e.request === this._checkingLoginRequest) {
        this._checkingLoginRequest = null;
        console.warn('Logout failed!');
      }
      return Promise.reject(e);

    });
  }

}

window.customElements.define('tutoria-auth-manager', TutoriaAuthManager);

const authManager = document.createElement('tutoria-auth-manager');
document.head.appendChild(authManager);

export { authManager };
authManager.downLoggedInUserProfile().catch(e => e && console.error(e));
