import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';
import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

import '../../node_modules/@polymer/iron-icon/iron-icon.js';
import '../../node_modules/@polymer/paper-ripple/paper-ripple.js';

import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-styles/tutoria-styles.js';


export const template = `
<style>
  :host {
    display: block;
    overflow: auto;
  }

  #table {
    display: grid;
    grid-template-rows: 72px;
    grid-auto-rows: 64px;
    grid-column-gap: 24px;
  }

  dom-repeat {
    display: none;
  }

  .header {
    display: flex;
    align-items: center;
    @apply --tutoria-text--body1_font;
    color: var(--tutoria-text--secondary_color);
    white-space: nowrap;
  }
  .header[align-right] {
    flex-direction: row-reverse;
  }
  .header[sortable] {
    cursor: pointer;
  }

  .sorting-arrow {
    margin-left: 8px;
  }
  .header[align-right] .sorting-arrow {
    margin-left: unset;
    margin-right: 8px;
  }
  .header:not([sortable]) .sorting-arrow {
    display: none;
  }
  .header:not([sorting-order]) .sorting-arrow {
    visibility: hidden;
  }
  .header[sorting-order="descending"] .sorting-arrow {
    transform: rotate(180deg);
  }

  .row {
    position: relative;
    border-top: var(--tutoria-divider_color) 1px solid;
    transition: background-color 200ms ease-out;
  }
  .row[clickable] {
    cursor: pointer;
  }
  .row:hover {
    background-color: rgba(var(--tutoria-text--base_color_r),
                           var(--tutoria-text--base_color_g),
                           var(--tutoria-text--base_color_b),
                           0.1);
  }

  .ripple {
    color: var(--tutoria-text--base_color);
  }
  .row:not([clickable]) .ripple {
    display: none;
  }
  
  .cell {
    display: flex;
    align-items: center;
    @apply --tutoria-text--body2_font;
    color: var(--tutoria-text--primary_color);
    white-space: nowrap;
    pointer-events: none;
  }
  .cell[align-right] {
    justify-content: flex-end;
  }
</style>

<div id="table" style$="[[_computeTableStyle(columns.*)]]">

  <template is="dom-repeat" items="[[columns]]" as="column" index-as="columnIndex">
  
    <div class="header"
      style$="[[_computeHeaderStyle(columnIndex, columns.length)]][[column.style]][[column.headerStyle]]"
      align-right$="[[column.alignRight]]"
      sortable$="[[_computeColumnSortable(column.sortingFunction)]]"
      sorting-order$="[[_computeColumnSortingOrder(sortBy, sortByDescending, column.sortingFunction, column.propertyName)]]"
      on-click="_onHeaderClick">
      [[column.headerText]]

      <iron-icon class="sorting-arrow" icon="tutoria:arrow-downward"></iron-icon>

    </div>

  </template>

  <template is="dom-repeat" items="[[data]]" as="item" index-as="itemIndex" sort="[[_sort]]">

    <div class="row"
      style$="[[_computeRowStyle(itemIndex)]]"
      on-click="_onRowClick"
      clickable$="[[clickable]]">
      <paper-ripple class="ripple" recenters></paper-ripple>
    </div>

    <template is="dom-repeat" items="[[columns]]" as="column" index-as="columnIndex">
      <tutoria-table-cell class="cell"
        style$="[[_computeCellStyle(itemIndex, columnIndex, columns.length)]][[column.style]][[column.cellStyle]]"
        align-right$="[[column.alignRight]]"
        item="[[item]]"
        column="[[column]]">
      </tutoria-table-cell>
    </template>

  </template>

</div>
`;

export default class TutoriaTable extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      columns: {
        type: Array,
        value: () => []
      },
      data: {
        type: Array,
        value: () => []
      },

      sortBy: {
        type: String,
        notify: true,
      },
      sortByDescending: {
        type: Boolean,
        value: false,
        notify: true
      },
      _sort: {
        type: Function,
        computed: '_computeSort(sortBy, sortByDescending, columns.*)'
      },

      clickable: {
        type: Boolean,
        value: false
      }
    };
  }



  _computeSort(sortBy, sortByDescending, columnsRecord) {
    const columns = columnsRecord && columnsRecord.base;
    let sort = undefined;
    if (sortBy && columns) {
      let sortingFunction = columns.find(h => h.propertyName === sortBy).sortingFunction;
      if (sortingFunction) {
        sort = (a, b) => sortingFunction(a, b, sortByDescending);
      }
    }
    return sort;
  }



  _computeTableStyle(columnsChangeRecord) {
    let columns = (columnsChangeRecord && columnsChangeRecord.base) || [];
    let style = 'grid-template-columns:';
    columns.forEach(column => {
      style += ' ';
      if ('width' in column) {
        style += column.width;
      } else {
        style += 'auto';
      }
    });
    style += ';';
    return style;
  }

  _computeHeaderStyle(columnIndex, columnsLength) {
    let style = `grid-row: 0; grid-column: ${columnIndex+1};`;
    if (columnIndex === 0) {
      style += ' padding-left: 24px;';
    } else if (columnIndex === (columnsLength - 1)) {
      style += ' padding-right: 24px;';
    }
    return style;
  }

  _computeColumnSortable(sortingFunction) {
    return Boolean(sortingFunction);
  }

  _computeColumnSortingOrder(sortBy, descending, sortingFunction, propertyName) {
    if (typeof sortBy !== 'string' || sortBy !== propertyName || !sortingFunction) {
      return undefined;
    }
    return descending ? 'descending' : 'ascending';
  }

  _computeRowStyle(itemIndex) {
    return `grid-row: ${itemIndex+2}; grid-column: 1 / -1`;
  }

  _computeCellStyle(itemIndex, columnIndex, columnsLength) {
    let style = `grid-row: ${itemIndex+2}; grid-column: ${columnIndex+1};`;
    if (columnIndex === 0) {
      style += ' padding-left: 24px;';
    } else if (columnIndex === (columnsLength - 1)) {
      style += ' padding-right: 24px;';
    }
    return style;
  }



  _onHeaderClick(evt) {
    const column = evt.model.column;
    if (column.sortingFunction) {
      if (this.sortBy === column.propertyName) {
        this.sortByDescending = !this.sortByDescending;
      } else {
        this.setProperties({
          sortBy: column.propertyName,
          sortByDescending: false
        });
      }
    }
  }

  _onRowClick(evt) {
    if (!this.clickable) {
      return;
    }
    this.dispatchEvent(new CustomEvent('tutoria-table-row-click', {
      detail: {
        item: evt.model.item
      }
    }));
  }

}

window.customElements.define('tutoria-table', TutoriaTable);


export const cellTemplate = `
<style>
  :host {
    display: block;
  }
</style>
<slot></slot>
`;

export class TutoriaTableCell extends TutoriaElement {

  static get template() {
    return cellTemplate;
  }

  static get properties() {
    return {
      item: {
        type: Object
      },
      column: {
        type: Object
      }
    };
  }

  static get observers() {
    return [
      '_onItemOrHeaderChanged(item.*, column.*)'
    ];
  }

  _onItemOrHeaderChanged(itemRecord, columnRecord) {
    const item = itemRecord && itemRecord.base;
    const column = columnRecord && columnRecord.base;

    if (column.onBindCallback) {
      column.onBindCallback(this, item, column);
    } else {
      let text = '';
      if ('cellPrefix' in column) text += column.cellPrefix;
      let data = this.get(column.propertyName, item);
      if (data !== undefined) {
        text += data;
      }
      if ('cellSuffix' in column) text += column.cellSuffix;
      this.textContent = text;
    }
  }

}

window.customElements.define('tutoria-table-cell', TutoriaTableCell);
