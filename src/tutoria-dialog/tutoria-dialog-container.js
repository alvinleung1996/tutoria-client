import TutoriaElement from '../tutoria-element/tutoria-element.js';

import './tutoria-dialog.js';
import '../tutoria-styles/tutoria-animation-styles.js';

const template = `
<style>
:host {
  display: block;
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  pointer-events: none;
  transition: background-color var(--tutoria-animation_duration) var(--tutoria-animation_timing-function);
}
:host([showing-dialog]) {
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}
:host > ::slotted(*) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* TODO: Add transition for filter */
}
:host > ::slotted(:not(:last-child)) {
  pointer-events: none;
  filter: brightness(0.5);
}
</style>
<slot></slot>
`;
// TODO: display: none while no dialog?
export default class TutoriaDialogContainer extends TutoriaElement {
  
  static get template() {
    return template;
  }

  static get properties() {
    return {
      showingDialog: {
        type: Boolean,
        computed: '_computeShowingDialog(_dialogCount)',
        reflectToAttribute: true,
        notify: true,
        observer: '_onShowingDialogChanged'
      },
      _dialogCount: {
        type: Number,
        value: 0
      }
    };
  }

  constructor() {
    super();
    this.__boundOnDialogShow = this._onDialogShow.bind(this);
    this.__boundOnDialogHide = this._onDialogHide.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('tutoria-dialog-show', this.__boundOnDialogShow);
    window.addEventListener('tutoria-dialog-hide', this.__boundOnDialogHide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('tutoria-dialog-show', this.__boundOnDialogShow);
    window.removeEventListener('tutoria-dialog-hide', this.__boundOnDialogHide);
  }

  _computeShowingDialog(dialogCount) {
    return dialogCount > 0;
  }

  _onShowingDialogChanged(showing) {
    let style = '/**tutoria-dialog-container*/overflow: hidden;/*tutoria-dialog-container**/';
    let bodyStyle = document.body.hasAttribute('style') ? document.body.getAttribute('style') : '';
    let containStyle = bodyStyle.includes(style);
    let styleChanged = false;
    if (showing && !containStyle) {
      bodyStyle = style + bodyStyle;
      styleChanged = true;
    } else if (!showing && containStyle) {
      bodyStyle = bodyStyle.replace(style, '');
      styleChanged = true;
    }
    if (styleChanged) {
      document.body.setAttribute('style', bodyStyle);
    }
  }

  showDialog(dialog, animated = true) {
    if (dialog.parentNode && dialog.parentNode !== this) {
      return Promise.reject();
    }
    // Place the dialog inside or move the dialog to the last place (the top most dialog)
    this.appendChild(dialog);
    this._dialogCount = this.children.length;
    return dialog._show(animated);
  }

  hideDialog(dialog, animated = true) {
    if (dialog.parentNode !== this) {
      return Promise.reject();
    }
    return dialog._hide(animated)
    .then(() => {
      this.removeChild(dialog);
      this._dialogCount = this.children.length;
      return Promise.resolve();
    });
  }

  _onDialogShow(evt) {
    this.showDialog(evt.detail.dialog, evt.detail.animated)
    .then(evt.detail.resolvePromise, evt.detail.rejectPromise);
  }

  _onDialogHide(evt) {
    this.hideDialog(evt.detail.dialog, evt.detail.animated)
    .then(evt.detail.resolvePromise, evt.detail.rejectPromise);
  }

}

window.customElements.define('tutoria-dialog-container', TutoriaDialogContainer);
