export default class TutoriaTransitionManager {

  constructor(element) {
    this.element = element;
    element.addEventListener('transitionend', this.__bindedOnTransitionEnd = this._onTransitionEnd.bind(this));
    this._transitingProperties = {};
  }

  transit(propertyName, value, options) {
    return new Promise((resolve, reject) => {

      // If property is transiting
      if (propertyName in this._transitingProperties) {
        let data = this._transitingProperties[propertyName];

        // Always reject previous promise
        data.rejectPromise();

        // If the target value is the same as the one requesting,
        // just replace the promise
        if (data.targetValue === value) {
          data.resolvePromise = resolve;
          data.rejectPromise = reject;
          return;

        } else {
          let computedCurrentValue = window.getComputedStyle(this.element).getPropertyValue(propertyName);
          delete this._transitingProperties[propertyName];
          this._updateTransitingProperties();
          this.element.style.setProperty(propertyName, computedCurrentValue);
          this._forceLayout();
        }
        
      }

      let currentValue = this.element.style.getPropertyValue(propertyName);
      let computedCurrentValue = window.getComputedStyle(this.element).getPropertyValue(propertyName);

      let targetValue = value;
      let computedTargetValue = value;
      if (targetValue === '' || targetValue === 'auto') {
        this.element.style.setProperty(propertyName, targetValue);
        this._forceLayout();
        computedTargetValue = window.getComputedStyle(this.element).getPropertyValue(propertyName);
        this.element.style.setProperty(propertyName, currentValue);
      }
      
      if (computedCurrentValue === computedTargetValue) {
        resolve();
        return;
      }

      if (!options) {
        this.element.style.setProperty(propertyName, targetValue);
        resolve();
      }
      
      let data = {
        targetValue: targetValue,
        computedTargetValue: computedTargetValue,
        resolvePromise: resolve,
        rejectPromise: reject
      };
      ({
        duration: data.duration = '1s',
        timingFunction: data.timingFunction = 'linear',
        delay: data.delay = '0s'
      } = options);
      this.element.style.setProperty(propertyName, computedCurrentValue);
      this._forceLayout();
      this._transitingProperties[propertyName] = data;
      this._updateTransitingProperties();
      this.element.style.setProperty(propertyName, computedTargetValue);
      
    });
  }

  _updateTransitingProperties() {
    let properties = [];
    let durations = [];
    let timingFunctions = [];
    let delays = [];
    for (let propertyName in this._transitingProperties) {
      let data = this._transitingProperties[propertyName];
      properties.push(propertyName);
      durations.push(data.duration);
      timingFunctions.push(data.timingFunction);
      delays.push(data.delay);
    }
    this.element.style.setProperty('transition-property', properties.join(','));
    this.element.style.setProperty('transition-duration', durations.join(','));
    this.element.style.setProperty('transition-timing-function', timingFunctions.join(','));
    this.element.style.setProperty('transition-delay', delays.join(','));
  }

  _onTransitionEnd(evt) {
    let propertyName = evt.propertyName;
    if (propertyName in this._transitingProperties) {
      let data = this._transitingProperties[propertyName];

      delete this._transitingProperties[propertyName];
      this._updateTransitingProperties();

      this.element.style.setProperty(propertyName, data.targetValue);
      data.resolvePromise();
    }
  }

  _forceLayout() {
    // Force layout (reference iron-collapse)
    this.element.scrollTop = this.element.scrollTop;
  }

  detach() {
    this.element.removeEventListener('transitionend', this.__bindedOnTransitionEnd);
  }

}
