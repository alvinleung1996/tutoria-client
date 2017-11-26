import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-icon/iron-icon.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-table/tutoria-table.js';

import './tutoria-message-detail-dialog.js';

export const template = `
<style>
  :host {
    display: block;
  }

  section {
    border-bottom: 1px solid var(--tutoria-divider_color);
  }
  .section-content {
    box-sizing: border-box;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .section-content > :not(:first-child) {
    margin-top: 16px;
  }

  header {
    @apply --tutoria-text--title_font;
    color: var(--tutoria-text--primary_color);
  }

  #messages-table {
    @apply --tutoria-shadow--elevation-2;
    border-radius: 4px;
    background-color: var(--tutoria-background--primary_color);
  }
</style>

<tutoria-api-ajax>
  <iron-ajax id="messages-ajax"
    method="GET"
    url="[[apiRootPath]]users/me/messages"
    handle-as="json"
    last-response="{{_lastMessagesAjaxResponse}}"
    last-error="{{_lastMessagesAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<section>
  <div class="section-content">
    <header>Messages</header>
    <tutoria-table
      id="messages-table"
      columns="[[_messagesTableColumns]]"
      data="[[_messagesTableData]]"
      clickable
      on-tutoria-table-row-click="_onMessagesTableRowClick">
    </tutoria-table>
  </div>
</section>
`;

export default class TutoriaMessagesPage extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      visible: {
        type: Boolean,
        observer: '_onVisibleChanged'
      },

      pageTitle: {
        type: String,
        value: 'Messages',
        readOnly: true,
        notify: true
      },

      _messagesTableColumns: {
        type: Array,
        value: () => [{
          propertyName: 'direction',
          onBindCallback: (cell, item, column) => {
            let icon = cell.querySelector('iron-icon');
            if (!icon) {
              icon = document.createElement('iron-icon');
              cell.appendChild(icon);
            }
            icon.setProperties({
              icon: item.role === 'receiver' ?
                  'tutoria:incoming-message' : 'tutoria:outgoing-message',
            });
            icon.style.setProperty('color', item.role === 'receiver' ? 'dodgerblue' : 'red');
          }
        }, {
          headerText: 'Sender',
          propertyName: 'sendUser.fullName',
        }, {
          headerText: 'Receiver',
          propertyName: 'receiveUser.fullName'
        }, {
          headerText: 'Title',
          propertyName: 'title',
          width: '1fr'
        }, {
          headerText: 'Time',
          propertyName: 'time',
          alignRight: true,
          sortingFunction: (a, b, descending) => descending ? (b.time - a.time) : (a.time - b.time),
          onBindCallback: (cell, item, column) => {
            cell.textContent = item.time.toLocaleString();
          }
        }, {
          headerText: 'Read',
          propertyName: 'read',
          sortingFunction: (a, b, descending) => descending ? (b.read - a.read) : (a.read - b.read),
          onBindCallback: (cell, item, column) => {
            let icon = cell.querySelector('iron-icon');
            if (!icon) {
              icon = document.createElement('iron-icon');
              icon.style.setProperty('color', 'green');
              cell.appendChild(icon);
            }
            icon.setProperties({
              icon: item.read ? 'tutoria:message-read' : undefined,
            });
          }
        }]
      },
      _messagesTableData: {
        type: Array,
        computed: '_computeMessagesTableData(_lastMessagesAjaxResponse)'
      }
    };
  }

  _onVisibleChanged(visible) {
    if (visible) {
      this._loadData();
    }
  }

  _loadData() {
      this.$['messages-ajax'].generateRequest();
  }



  _computeMessagesTableData(response) {
    const messages = response && response.data;
    if (!messages) {
      return [];
    }
    messages.forEach(t => {
      t.time = new Date(t.time);
    });
    return messages;
  }



  // _onAddMoneyButtonClick(evt) {
  //   let dialog = document.createElement('tutoria-wallet-add-money-dialog');
  //   dialog.addEventListener('tutoria-wallet-add-money-dialog-success', d => {
  //     this._loadData();
  //   });
  //   dialog.show();
  // }

  _onMessagesTableRowClick(evt) {
    const message = evt.detail.item;
    let dialog = document.createElement('tutoria-message-detail-dialog');
    dialog.message = message;
    dialog.addEventListener('tutoria-message-detail-dialog-close', e => {
      this._loadData();
    })
    dialog.show();
  }

}

window.customElements.define('tutoria-messages-page', TutoriaMessagesPage);
