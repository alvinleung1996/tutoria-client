import {Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';

export default class TutoriaElement extends PolymerElement {

  static get properties() {
    return {
      rootPath: {
        type: String,
        value: Tutoria.rootPath,
        readOnly: true
      },
      apiRootPath: {
        type: String,
        value: Tutoria.apiRootPath,
        readOnly: true
      },
      assetRootPath: {
        type: String,
        value: Tutoria.assetRootPath,
        readOnly: true
      }
    }
  }

}
