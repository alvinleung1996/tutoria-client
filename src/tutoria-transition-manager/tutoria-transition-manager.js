export default class TutoriaTransitionManager {

  constructor(element) {
    this.element = element;
    element.addEventListener('transitionend', this.__bindedOnTransitionEnd = this._onTransitionEnd.bind(this));
    this._transitionRecords = {};
  }

  transit(config) {
    const element = this.element;

    for (const propertyName in config) {
      const propertyConfig = config[propertyName];

      // If property is transiting
      if (propertyName in this._transitionRecords) {
        const record = this._transitionRecords[propertyName];

        delete this._transitionRecords[propertyName];
        record.rejectPromise('abort transition');

        let currentComputedValue = window.getComputedStyle(element).getPropertyValue(propertyName);
        this.element.style.setProperty(propertyName, currentComputedValue);
      } // end if

    } // end for
    this._updateTransitionStyles();



    const transitionRecords = {};
    // Create property record
    for (const propertyName in config) {
      transitionRecords[propertyName] = {};
    }

    // Record current computed value
    for (const propertyName in config) {
      const propertyConfig = config[propertyName];
      const record = transitionRecords[propertyName];
      record.fromValue = element.style.getPropertyValue(propertyName);
      record.fromComputedValue = window.getComputedStyle(element).getPropertyValue(propertyName);
    }

    // Apple target value for record
    for (const propertyName in config) {
      const propertyConfig = config[propertyName];
      const record = transitionRecords[propertyName];
      element.style.setProperty(propertyName, propertyConfig.value);
    }
    this._forceLayout();
    for (const propertyName in config) {
      const propertyConfig = config[propertyName];
      const record = transitionRecords[propertyName];
      record.toValue = propertyConfig.value;
      record.toComputedValue = window.getComputedStyle(element).getPropertyValue(propertyName);
    }
    for (const propertyName in config) {
      const propertyConfig = config[propertyName];
      const record = transitionRecords[propertyName];
      element.style.setProperty(propertyName, record.fromValue);
    }

    // Check if each element need to be animated
    // And normalize the property config
    for (const propertyName in config) {
      const propertyConfig = config[propertyName];
      const record = transitionRecords[propertyName];
      record.noAnimation = record.fromComputedValue === record.toComputedValue || propertyConfig.noAnimation;
      if (!record.noAnimation) {
        record.duration = propertyConfig.duration || '1s';
        record.timingFunction = propertyConfig.timingFunction || 'linear';
        record.delay = propertyConfig.delay || '0s';
      }
    }

    const transitionPromises = [];

    // Apply initial value
    for (const propertyName in config) {
      const propertyConfig = config[propertyName];
      const record = transitionRecords[propertyName];
      if (!record.noAnimation) {
        element.style.setProperty(propertyName, record.fromComputedValue);
        this._transitionRecords[propertyName] = record;
      }
    }
    this._forceLayout();
    this._updateTransitionStyles();
    // Apply target Value
    for (const propertyName in config) {
      const propertyConfig = config[propertyName];
      const record = transitionRecords[propertyName];
      if (record.noAnimation) {
        element.style.setProperty(propertyName, record.toValue);
      } else {
        element.style.setProperty(propertyName, record.toComputedValue);
        transitionPromises.push(new Promise((resolve, reject) => {
          record.resolvePromise = resolve;
          record.rejectPromise = reject;
        }));
      }
    }

    return Promise.all(transitionPromises);
  }

  _updateTransitionStyles() {
    const element = this.element;
    const properties = [];
    const durations = [];
    const timingFunctions = [];
    const delays = [];
    for (const propertyName in this._transitionRecords) {
      const record = this._transitionRecords[propertyName];
      properties.push(propertyName);
      durations.push(record.duration);
      timingFunctions.push(record.timingFunction);
      delays.push(record.delay);
    }
    element.style.setProperty('transition-property', properties.join(','));
    element.style.setProperty('transition-duration', durations.join(','));
    element.style.setProperty('transition-timing-function', timingFunctions.join(','));
    element.style.setProperty('transition-delay', delays.join(','));
  }

  _onTransitionEnd(evt) {
    const propertyName = evt.propertyName;
    if (propertyName in this._transitionRecords) {
      const record = this._transitionRecords[propertyName];

      delete this._transitionRecords[propertyName];
      this._updateTransitionStyles();

      this.element.style.setProperty(propertyName, record.toValue);
      record.resolvePromise();
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
