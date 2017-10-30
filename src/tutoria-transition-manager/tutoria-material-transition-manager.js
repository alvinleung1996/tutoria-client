import TransitionManager from './tutoria-transition-manager.js';

export default class TutoriaMaterialTransitionManager extends TransitionManager {

  constructor(element, minWidth, minHeight, maxWidth, maxHeight) {
    super(element);

    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    
    this.duration = '200ms';
    this.timingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.delay = '66ms';
  }

  collapse(animated = true) {
    return Promise.all([
      this.transit('width', this.minWidth, animated && this._getOptions(true)),
      this.transit('height', this.minHeight, animated && this._getOptions(false)),
    ]);
  }

  expand(animated = true) {
    return Promise.all([
      this.transit('width', this.maxWidth, animated && this._getOptions(false)),
      this.transit('height', this.maxHeight, animated && this._getOptions(true)),
    ]);
  }

  _getOptions(includeDelay) {
    return {
      duration: this.duration,
      timingFunction: this.timingFunction,
      delay: includeDelay ? this.delay : '0s'
    };
  }

}
