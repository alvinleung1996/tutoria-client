import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/paper-button/paper-button.js';

import * as AnimationStyles from '../tutoria-styles/tutoria-animation-styles.js';
import '../tutoria-styles/tutoria-styles.js';
import TransitionManager from '../tutoria-transition-manager/tutoria-transition-manager.js';

export const baseTemplate = `
<style>
:host {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 4px;
  background-color: var(--tutoria-background--primary_color);
  @apply --tutoria-shadow--elevation-8;
  overflow: hidden;
  display: flex;
}
:host(:not([visible])) {
  display: none;
}
:host(:not([visible])),
:host([transiting]) {
  pointer-events: none;
}
#container {
  flex: 1 1 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
#header {
  flex: 0 0 auto;
}
#content {
  flex: 1 1 auto;
}
#footer {
  flex: 0 0 auto;
}
</style>
%%otherTemplate%%
%%headerStyles%%
%%contentStyles%%
%%footerStyles%%
<div id="container">
  <header id="header">%%headerTemplate%%</header>
  <section id="content">%%contentTemplate%%</section>
  <footer id="footer">%%footerTemplate%%</footer>
</div>
`;

export const otherTemplate = '';

export const headerStyles = `
<style>
#header {
  @apply --tutoria-text--title_font;
  color: var(--tutoria-text--primary_color);
}
</style>
`;
export const headerTemplate = `
[[header]]
`;

export const contentStyles = `
<style>
#content {
  margin-top: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}
:host([transiting]) #content,
:host(:not([visible])) #content {
  overflow-y: hidden;
}
</style>
`;
export const contentTemplate = `
[[content]]
`;

export const footerStyles = `
<style>
  #footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
  .button {
    @apply --tutoria-text--button_font;
  }
  .button[disabled] {
    --paper-button-disabled: {
      color: var(--tutoria-text--disabled_color);
      background: transparent;
    }
  }
</style>
`;
export const footerTemplate = `
<template is="dom-repeat" id="buttons-renderer" items="[[buttons]]" as="button">
  <paper-button class="button" style$="[[_computeButtonStyle(button.disabled, button.style, button.disabledStyle)]]" raised="[[button.raised]]" disabled="[[button.disabled]]" on-click="_onButtonClicked">[[button.text]]</paper-button>
</template>
`;

export default class TutoriaDialog extends TutoriaElement {

  static generateTemplate(options) {
    let computedOptions = {};
    ({
      otherTemplate: computedOptions.otherTemplate = otherTemplate,
      headerStyles: computedOptions.headerStyles = headerStyles,
      headerTemplate: computedOptions.headerTemplate = headerTemplate,
      contentStyles: computedOptions.contentStyles = contentStyles,
      contentTemplate: computedOptions.contentTemplate = contentTemplate,
      footerStyles: computedOptions.footerStyles = footerStyles,
      footerTemplate: computedOptions.footerTemplate = footerTemplate
    } = options);
    
    return baseTemplate
    .replace('%%otherTemplate%%', computedOptions.otherTemplate)
    .replace('%%headerStyles%%', computedOptions.headerStyles)
    .replace('%%headerTemplate%%', computedOptions.headerTemplate)
    .replace('%%contentStyles%%', computedOptions.contentStyles)
    .replace('%%contentTemplate%%', computedOptions.contentTemplate)
    .replace('%%footerStyles%%', computedOptions.footerStyles)
    .replace('%%footerTemplate%%', computedOptions.footerTemplate);
  }

  static get template() {
    return TutoriaDialog.generateTemplate({
      headerStyles: headerStyles,
      headerTemplate: headerTemplate,
      contentStyles: contentStyles,
      contentTemplate: contentTemplate,
      footerStyles: footerStyles,
      footerTemplate: footerTemplate
    });
  }

  static get properties() {
    return {
      visible: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
        notify: true
      },
      opened: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
        notify: true
      },
      transiting: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
        notify: true
      },
      width: {
        type: String,
        value: '500px'
      },
      height: {
        type: String,
        value: 'auto'
      },
      transitionDelay: {
        type: String,
        value: '100ms'
      }
    };
  }

  constructor() {
    super();
    this._transitionManager = new TransitionManager(this);
  }

  ready() {
    super.ready();
    this.style.setProperty('width', '0px');
    this.style.setProperty('height', '0px');
  }


  _computeButtonStyle(disabled, style, disabledStyle) {
    return disabled ? disabledStyle : style;
  }

  show(animated = true) {
    return new Promise((resolve, reject) => {
      window.dispatchEvent(new CustomEvent('tutoria-dialog-show', {
        detail: {
          dialog: this,
          animated: animated,
          resolvePromise: resolve,
          rejectPromise: reject
        }
      }));
    });
  }

  hide(animated = true, resolve = false) {
    return new Promise((resolve, reject) => {
      window.dispatchEvent(new CustomEvent('tutoria-dialog-hide', {
        detail: {
          dialog: this,
          animated: animated,
          resolvePromise: resolve,
          rejectPromise: reject
        }
      }));
    });
  }

  _show(animated = true) {
    this.setProperties({
      visible: true,
      opened: true,
      transiting: true
    }, true);

    let buttonsRenderer = this.$['buttons-renderer'];
    if (buttonsRenderer) buttonsRenderer.render();
    
    return this._transitionManager.transit({
      'width': {
        value: this.width,
        noAnimation: !animated,
        duration: AnimationStyles.duration,
        timingFunction: AnimationStyles.timingFunction
      },
      'height': {
        value: this.height,
        noAnimation: !animated,
        duration: AnimationStyles.duration,
        timingFunction: AnimationStyles.timingFunction,
        delay: this.transitionDelay
      }
    })
    .then(() => {
      this._setTransiting(false);
    });
  }

  _hide(animated = true) {
    this.setProperties({
      opened: false,
      transiting: true
    }, true);
    return this._transitionManager.transit({
      'width': {
        value: '0px',
        noAnimation: !animated,
        duration: AnimationStyles.duration,
        timingFunction: AnimationStyles.timingFunction,
        delay: this.transitionDelay
      },
      'height': {
        value: '0px',
        noAnimation: !animated,
        duration: AnimationStyles.duration,
        timingFunction: AnimationStyles.timingFunction
      }
    })
    .then(() => {
      this.setProperties({
        visible: false,
        transiting: false
      }, true);
    });
  }

  _getTransitionOptions(includeDelay) {
    return {
      duration: AnimationStyles.duration,
      timingFunction: AnimationStyles.timingFunction,
      delay: includeDelay ? '100ms' : '0ms'
    };
  }



  _onButtonClicked(evt) {
    const button = evt.model.button;
    if (button.callback) {
      button.callback(this, button);
    }
  }

}

window.customElements.define('tutoria-dialog', TutoriaDialog);
