/*
Notes for improvements: 
- D3 has to be imported by the component to make it re-usable; here we simply load it in index.html
- the data is passed directly as an attribute: for lots of data the de-serialization might impact performances
  it would be nice to have an option to pass instead a function that fetches the data
*/

export class DataTable extends HTMLElement {

    static get observedAttributes() {
        return ['data', 'config'];
    }

    constructor() {
        super();

        this._config = null;
        this._data = null;
                      
        const table = document.createElement('table');
        const tableHead = document.createElement('thead');
        this.tableHeadRow = document.createElement('tr');
        this.tableBody = document.createElement('tbody');

        this.clickRowEvent = (data) => {
            return new CustomEvent('rowClicked', {
                bubbles: true,
                composed: true,
                detail: data,
            });
        };
        
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');  
        style.textContent = `
            th {
                color: red;
            }
        `;        
        shadow.appendChild(style);

        table.appendChild(tableHead);
        tableHead.appendChild(this.tableHeadRow);
        table.appendChild(this.tableBody);
        shadow.appendChild(table);
    }    

    updateHeaders() {
        const columnNames = this._config.columns.map(col => col.label);

        d3.select(this.tableHeadRow)
            .selectAll('th')
                .data(columnNames)
                .join('th')
                .append('th').text(d => d);
    }

    updateRows() {      
        const columns = this._config.columns;

        const rows = d3.select(this.tableBody)
            .selectAll('tr')
                .data(this._data)
                .join('tr')
                .on('click', d => { this.dispatchEvent(this.clickRowEvent(d)); });

        rows.selectAll('td')
            .data(d => getRowData(d, columns))
            .join('td')
            .append('td')
            .text(d => d);    
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // note: typically we would check if oldValue === newValue,
        // however with D3 enter/update/exit lifecycle we anyways avoid DOM manipulation redundancy
        if (name === 'config') {
            this._config = JSON.parse(newValue);
            this.updateHeaders();
            if (this._data) {
                this.updateRows();
            }
        }
        if (name === 'data') {
            this._data = JSON.parse(newValue);
            if (this._config) {
                this.updateRows();
            }
        }
    }

  }

  function getRowData(rowData, columnsConfig) {
      return columnsConfig.map(c => rowData[c.dataPropertyName]);
  }