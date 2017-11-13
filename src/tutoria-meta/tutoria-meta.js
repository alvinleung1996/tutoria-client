import TutoriaElement from '../tutoria-element/tutoria-element.js';

const typeMap = new Map();

export default class TutoriaMeta extends TutoriaElement {

  static get properties() {
    return {
      type: {
        type: String,
        value: 'default'
      },
      key: {
        type: String
      },
      value: {
        type: String,
        notify: true
      },

      _isInStorage: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return [
      '_onMetaChanged(type, key, value.*)',
      // '_onValueChanged(value.*)'
    ];
  }

  _onMetaChanged(type, key, valueChangeRecord) {
    let oldType = this.__oldType;
    let oldKey = this.__oldKey;

    this.__oldType = type;
    this.__oldKey = key;

    if (type !== oldType || key !== oldKey) {
      if (oldType && oldKey) {
        this._removeFromStorage(oldType, oldKey);
      }
      if (type && key) {
        this._addToStorage(type, key);
      }
    } else {

      if (!this._isInStorage || this.dispatching) {
        return;
      }

      let valuePath = valueChangeRecord.path;
      let value = valueChangeRecord.value;
      
      if (!typeMap.has(type)) {
        return;
      }
      const keyMap = typeMap.get(type);
      if (!keyMap.has(key)) {
        return;
      }
      const elementSet = keyMap.get(key);

      for (let e of elementSet) {
        if (e !== this) {
          e.dispatching = true;
          e.notifyPath(valuePath, value);
          e.dispatching = false;
        }
      }

    }
  }

  _addToStorage(type, key) {
    if (!typeMap.has(type)) {
      typeMap.set(type, new Map());
    }
    const keyMap = typeMap.get(type);
    if (!keyMap.has(key)) {
      keyMap.set(key, new Set());
    }
    const elementSet = keyMap.get(key);
    if (elementSet.has(this)) {
      return;
    }

    if (elementSet.size > 0) {
      for (let e of elementSet) {
        this.value = e.value;
        break;
      }
    }

    elementSet.add(this);
    this._isInStorage = true;
  }

  _removeFromStorage(type, key) {
    if (!typeMap.has(type)) {
      return;
    }
    const keyMap = typeMap.get(type);
    if (!keyMap.has(key)) {
      return;
    }
    const elementSet = keyMap.get(key);

    elementSet.delete(this);
    this._isInStorage = false;

    if (elementSet.size == 0) {
      keyMap.delete(key);
    }
    if (keyMap.size == 0) {
      typeMap.delete(type);
    }
  }

  // _onValueChanged(record) {
  //   console.log(record);
  // }

}

window.customElements.define('tutoria-meta', TutoriaMeta);
