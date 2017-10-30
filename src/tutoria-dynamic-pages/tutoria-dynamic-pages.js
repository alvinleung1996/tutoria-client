import {Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '../../node_modules/@polymer/polymer/lib/legacy/class.js';

import {IronResizableBehavior} from '../../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

import '../../node_modules/web-animations-js/web-animations-next-lite.min.js';

const template = `

<style>
:host {
  display: block;
  position: relative;
}
:host > ::slotted(*) {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 0; /* force create new stacking context */
}
:host > ::slotted([page-state="invisible"]) {
  display: none;
}
:host > ::slotted(:not([page-state="visible"])) {
  pointer-events: none;
}
</style>

<slot></slot>

`;

export default class TutoriaDynamicPages extends mixinBehaviors(IronResizableBehavior, PolymerElement) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      pathToPageMaps: {
        type: Array,
      },
      path: {
        type: String
      },

      pathMatchResult: {
        type: Object,
        readOnly: true,
        notify: true
      },
      selectedPage: {
        readOnly: true,
        notify: true,
        observer: '_onSelectedPageChanged'
      },
      visiblePage: {
        readOnly: true,
        notify: true
      }
    };
  }

  static get observers() { return [
    '_onPathToPageMapsOrPathChanged(pathToPageMaps.*, path)'
  ];}

  constructor() {
    super();
    this._loadingPathSet = new Set();
    this._pageStateManagerMap = new WeakMap();
  }

  connectedCallback() {
    super.connectedCallback();
    Array.prototype.forEach.call(this.children, e => {
      this._newPageStateManager(e);
    });
  }



  _onPathToPageMapsOrPathChanged(pathToPageMapsRecord, path) {
    let pathToPageMaps = pathToPageMapsRecord && pathToPageMapsRecord.base;

    let selectedPage, result;

    if (pathToPageMaps && path) {
      let map;

      ({map, result} = this._getMatchingPathToPageMap(pathToPageMaps, path));

      if (map) {
        let pendingSelectedPage = this.querySelector(map.pageTagName) || undefined;

        if (pendingSelectedPage) {
          selectedPage = pendingSelectedPage;

        } else {
          selectedPage = this.querySelector('[page-type="loading"]') || undefined;
          let pathPatternString = map.pathPattern.toString(); // ensure changes to the property field won't interfere, the string setted is guaranteed to be deteled

          if (!this._loadingPathSet.has(pathPatternString)) {
            this._loadingPathSet.add(pathPatternString);

            map.importPage().then(() => {
              this._loadingPathSet.delete(pathPatternString);
              let page = document.createElement(map.pageTagName);
              this._newPageStateManager(page);
              this.appendChild(page);
              if (map.pathPattern.test(path)) {
                this._setSelectedPage(page);
              }

            }, e => {
              console.warn(e);
              this._loadingPathSet.delete(pathPatternString);
              if (map.pathPattern.test(path)) {
                this._setSelectedPage(this.querySelector('[page-type="error"]') || undefined);
              }
            });
          }
        }
      } else { // !map
        selectedPage = this.querySelector('[page-type="404"]') || undefined;
      }

    } else { // !(pathToPageMaps && path)
      selectedPage = this.querySelector('[page-type="empty"]') || undefined;
    }

    this.setProperties({
      pathMatchResult: result,
      selectedPage: selectedPage
    }, true);
  }

  _getMatchingPathToPageMap(pathToPageMaps, path) {
    if (pathToPageMaps && typeof path === 'string') {
      for (let map of pathToPageMaps) {
        let result = map.pathPattern.exec(path);
        if (result !== null) {
          return {
            map: map,
            result: result
          };
        }
      }
    }
    return {};
  }

  _getPageStateManager(page) {
    if (!this._pageStateManagerMap.has(page)) {
      this._newPageStateManager(page);
    }
    return this._pageStateManagerMap.get(page);
  }

  _newPageStateManager(page) {
    if (!this._pageStateManagerMap.has(page)) {
      this._pageStateManagerMap.set(page, new PageStateManager(page));
    }
  }



  _onSelectedPageChanged(selectedPage) {
    this._makePageVisible(selectedPage).catch(e => {
      if (e !== undefined) throw e;
    });
  }

  _makePageInvisible() {
    if (this.visiblePage) {
      return this._getPageStateManager(this.visiblePage).toInvisible().then(() => {
        this._setVisiblePage(undefined);
      });
    } else {
      return Promise.resolve();
    }
  }

  _makePageVisible(selectedPage) {
    let makePageInvisiblePromise;
    if (this.visiblePage === selectedPage) {
      makePageInvisiblePromise = Promise.resolve();
    } else {
      makePageInvisiblePromise = this._makePageInvisible();
    }
    return makePageInvisiblePromise
    .then(() => {
      if (selectedPage) {
        this._setVisiblePage(selectedPage);
        this.resizerShouldNotify = e => e === selectedPage;
        return this._getPageStateManager(selectedPage).toVisible();
      } else {
        this._setVisiblePage(undefined);
        this.resizerShouldNotify = e => false;
        return Promise.resolve();
      }
    }).then(() => {
      this.notifyResize();
    });
  }

}
window.customElements.define('tutoria-dynamic-pages', TutoriaDynamicPages);

export const PageState = {
  INVISIBLE: 'invisible',
  HIDING: 'hiding',
  SHOWING: 'showing',
  VISIBLE: 'visible'
};

class PageStateManager {

  constructor(element) {
    this.element = element;
    this.state = PageState.INVISIBLE;
    this._animation = element.hasAttribute('page-type') ? new PageFadeAnimation(element) : new PageSlideAnimation(element);
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
    this.element.setAttribute('page-state', state);
  }

  toVisible() {
    let element = this.element;
    let state = this._state;
    let animation = this._animation;

    if (state === PageState.VISIBLE) {
      return Promise.resolve();
    } else {
      this.state = PageState.SHOWING;
      return animation.playToEnd().then(() => {
        this.state = PageState.VISIBLE;
      })
    }
  }

  toInvisible() {
    let element = this.element;
    let state = this.state;
    let animation = this._animation;

    if (state === PageState.INVISIBLE) {
      return Promise.resolve();
    } else {
      this.state = PageState.HIDING;
      return animation.playToStart().then(() => {
        this.state = PageState.INVISIBLE;
      })
    }
  }

}

class PageAnimation {

  constructor(element, keyframeSet, keyframeOptions) {
    this._animation = new Animation(new KeyframeEffect(element, keyframeSet, keyframeOptions), document.timeline);
    this._duration = keyframeOptions.duration || 0;
    for (let prop in keyframeSet[0]) {
      element.style[prop] = keyframeSet[0][prop];
    }
  }

  playToEnd() {
    return this._play(true);
  }

  playToStart() {
    return this._play(false);
  }

  _play(forward) {
    return new Promise((resolve, reject) => {

      if (this.__prevPromise) {
        this.__prevPromise.reject();
      }
      
      let promise = this.__prevPromise = {
        resolve: resolve,
        reject: reject
      };

      let animation = this._animation;
      let duration = this._duration;

      let currentTime = animation.currentTime || 0;
      let playState = animation.playState;
      let playbackRate = animation.playbackRate;

      if (playState === 'idle') {
        if (forward) {
          animation.playbackRate = 1;
          animation.play();
          animation.onfinish = e => promise.resolve();
        } else {
          animation.onfinish = null;
          promise.resolve();
        }

      } else if (playState === 'pending') {
        if (forward) {
          if (currentTime === duration) {
            animation.pause();
            animation.onfinish = null;
            promise.resolve();
          } else {
            animation.playbackRate = 1;
            animation.play();
            animation.onfinish = e => promise.resolve();
          }
        } else {
          if (currentTime === 0) {
            animation.pause();
            animation.onfinish = null;
            promise.resolve();
          } else {
            animation.playbackRate = -1;
            animation.play();
            animation.onfinish = e => promise.resolve();
          }
        }

      } else if (playState === 'running') {
        if (forward) {
          animation.playbackRate = 1;
          animation.onfinish = e => promise.resolve();
        } else {
          animation.playbackRate = -1;
          animation.onfinish = e => promise.resolve();
        }
        
      } else if (playState === 'paused') {
        if (forward && currentTime !== duration) {
          animation.playbackRate = 1;
          animation.play();
          animation.onfinish = e => promise.resolve();
        } else if (!forward && currentTime !== 0) {
          animation.playbackRate = -1;
          animation.play();
          animation.onfinish = e => promise.resolve();
        } else {
          animation.onfinish = null;
          promise.resolve();
        }

      } else if (playState === 'finished') {
        if (forward && currentTime !== duration) {
          animation.playbackRate = 1;
          animation.play();
          animation.onfinish = e => promise.resolve();
        } else if (!forward && currentTime !== 0) {
          animation.playbackRate = -1;
          animation.play();
          animation.onfinish = e => promise.resolve();
        } else {
          animation.onfinish = null;
          promise.resolve();
        }

      } else {
        animation.onfinish = null;
        promise.reject();
      }
    });
  }

}

class PageSlideAnimation extends PageAnimation {

  constructor(element) {
    super(element, [
      { transform: 'translateY(30vh)', opacity: 0 },
      { transform: 'none', opacity: 1 }
    ], {
      duration: 500,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', // ease-out-cubic
      fill: 'both'
    });
  }
}

class PageFadeAnimation extends PageAnimation {

  constructor(element) {
    super(element, [
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 200,
      easing: 'linear',
      fill: 'both'
    });
  }
}
