import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-table/tutoria-table.js';

import './tutoria-wallet-add-money-dialog.js';

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

  #balance {
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    align-items: center;
  }
  #balance-text {
    @apply --tutoria-text--display1_font;
    color: var(--tutoria-text--secondary_color);
  }
  #add-money-button {
    margin-left: 8px;
    color: rgba(var(--tutoria-text--base_color_r),
                var(--tutoria-text--base_color_g),
                var(--tutoria-text--base_color_b),
                0.3);
    transition: color 200ms ease-out;
  }
  #add-money-button:hover,
  #add-money-button:active {
    color: green;
    --paper-icon-button-ink-color: green;
  }

  #transactions-table {
    @apply --tutoria-shadow--elevation-2;
    border-radius: 4px;
    background-color: var(--tutoria-background--primary_color);
  }

  paper-icon-button {
    display: block;
  }
</style>

<tutoria-api-ajax>
  <iron-ajax id="wallet-ajax"
    method="GET"
    url="[[apiRootPath]]users/me/wallet"
    handle-as="json"
    last-response="{{_lastWalletAjaxResponse}}"
    last-error="{{_lastWalletAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="transactions-ajax"
    method="GET"
    url="[[apiRootPath]]users/me/wallet/transactions"
    handle-as="json"
    last-response="{{_lastTransactionsAjaxResponse}}"
    last-error="{{_lastTransactionsAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<section>
  <div class="section-content">
    <header>Wallet</header>
    <div id="balance"><span id="balance-text">$ [[_wallet.balance]]</span><paper-icon-button id="add-money-button" icon="tutoria:add-money" on-click="_onAddMoneyButtonClick"></paper-icon-button></div>
  </div>
</section>

<section>
  <div class="section-content">
    <header>Transaction History</header>
    <tutoria-table
      id="transactions-table"
      columns="[[_transactionaTableColumns]]"
      data="[[_transactionsTableData]]">
    </tutoria-table>
  </div>
</section>
`;

export default class TutoriaWalletPage extends TutoriaElement {

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
        value: 'Wallet',
        readOnly: true,
        notify: true
      },

      _wallet: {
        type: Object,
        computed: '_computeWallet(_lastWalletAjaxResponse)'
      },

      _transactionaTableColumns: {
        type: Array,
        value: () => [{
          propertyName: 'withdrawFromUser.action',
          onBindCallback: (cell, item, column) => {
            let icon = cell.querySelector('iron-icon');
            if (!icon) {
              icon = document.createElement('iron-icon');
              cell.appendChild(icon);
            }
            icon.setProperties({
              icon: item.action === 'withdraw' ?
                  'tutoria:withdraw-money' : 'tutoria:deposit-money',
            });
            icon.style.setProperty('color', item.action === 'withdraw' ? 'red' : 'green');
          }
        }, {
          headerText: 'Withdraw From',
          propertyName: 'withdrawFromUser.fullName',
        }, {
          headerText: 'Deposit To',
          propertyName: 'depositToUser.fullName'
        }, {
          headerText: 'Amount',
          propertyName: 'amount',
          width: '1fr',
          alignRight: true,
          cellPrefix: '$ ',
          sortingFunction: (a, b, descending) => descending ? (b.amount - a.amount) : (a.amount - b.amount)
        }, {
          headerText: 'Time',
          propertyName: 'time',
          alignRight: true,
          sortingFunction: (a, b, descending) => descending ? (b.time - a.time) : (a.time - b.time),
          onBindCallback: (cell, item, column) => {
            cell.textContent = item.time.toLocaleString();
          }
        }]
      },
      _transactionsTableData: {
        type: Array,
        computed: '_computeTransactionsTableData(_lastTransactionsAjaxResponse)'
      }
    };
  }

  _onVisibleChanged(visible) {
    if (visible) {
      this._loadData();
    }
  }

  _loadData() {
      this.$['wallet-ajax'].generateRequest();
      this.$['transactions-ajax'].generateRequest();
  }



  _computeWallet(response) {
    const wallet = response && response.data;
    if (!wallet) {
      return undefined;
    }
    wallet.balance = Number.parseFloat(wallet.balance);
    return wallet;
  }



  _computeTransactionsTableData(response) {
    const transactions = response && response.data;
    if (!transactions) {
      return [];
    }
    transactions.forEach(t => {
      t.time = new Date(t.time);
      t.amount = Number.parseFloat(t.amount);
    });
    return transactions;
  }



  _onAddMoneyButtonClick(evt) {
    let dialog = document.createElement('tutoria-wallet-add-money-dialog');
    dialog.addEventListener('tutoria-wallet-add-money-dialog-success', d => {
      this._loadData();
    });
    dialog.show();
  }

}

window.customElements.define('tutoria-wallet-page', TutoriaWalletPage);
