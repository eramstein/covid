/*
DataTable Component

Attributes:
- data {Array}: an array of objects.
- config {Object}: configures columns. there are 2 types:
    - data: simply specify the corresponding attribute and the label of the column header
    - component: nests another web component into the table's cell
                 component attributes can be specified in componentAttributes
                 in addition, a data attribute is added with the data attributes specified in dataPropertyNames

example config with one data column and one component column
    {
        columns: [{
            type: 'data',
            label: 'Country Name',
            dataPropertyName: 'Country',            
        },{
            type: 'component',
            label: 'Summary',
            componentName: 'bar-chart',
            dataPropertyNames: ['TotalConfirmed', 'TotalDeaths', 'TotalRecovered'],
            componentAttributes: { colors: CHART_COLORS },
        }],
    }

Implementation issues due to lack of time: 
- D3 should be imported by the component to make it self contained; here we simply load it in index.html
- the data is passed directly as an attribute: for lots of data the de-serialization might impact performances
  it would be nice to have an option to pass instead a function that fetches the data
- would be nice to have a scrollable tbody (at the moment the headers are invisible if scrolling too far)
- the component nesting is a bit hacked together quickly, a proper implementation would require much more time
*/ 

const STYLES = `
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: 10px 20px;
    }
    th {
        text-align: left;
        background-color: #f1f1f1;
    }
    td {
        border-bottom: 1px solid #ccc;
        cursor: pointer;
    }
    tr:hover td, tr.active td {
        background-color: #fafafa;
    }
`;

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

        this.activeRowIndex = null;

        this.clickRowEvent = (data, rowIndex) => {
            this.activeRowIndex = rowIndex;
            this.updateRows();
            return new CustomEvent('rowClicked', {
                bubbles: true,
                composed: true,
                detail: data,
            });
        };        
        
        const style = document.createElement('style');  
        style.textContent = STYLES;        

        const shadow = this.attachShadow({ mode: 'open' });
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
                    .text(d => d);
    }

    updateRows() {      
        const columns = this._config.columns;
        const rows = d3.select(this.tableBody)
            .selectAll('tr')
                .data(this._data)
                .join('tr')
                    .on('click', (d, i) => { this.dispatchEvent(this.clickRowEvent(d, i)); })
                    .attr('class', (d, i) => i === this.activeRowIndex ? 'active' : null);
                
        rows.selectAll('td')
            .data(d => getRowData(d, columns))
            .join('td')       
                .text(d => displayCellContent(d))
            .filter(d => d.type === 'component')
                .append('div')
                .text((d, i, el) => createComponent(d, i, el));

        function displayCellContent(d) {
            return d.text && d.text.toLocaleString();
        }
    
        function createComponent(d, i, el) {
            const div = el[0];
            if (div && !div.shadow) {
                const shadow = div.attachShadow({ mode: 'open' });        
                const component = document.createElement(d.componentName);
                Object.entries(d.componentAttributes).forEach(entry => {
                    component.setAttribute(entry[0], entry[1]);
                });
                component.setAttribute('data', d.data);          
                shadow.appendChild(component);
            }         
        }
    }    

    attributeChangedCallback(name, oldValue, newValue) {
        // note: typically we would check if oldValue === newValue,
        // however with D3 enter/update/exit lifecycle we anyways avoid DOM manipulation redundancy
        if (name === 'config') {
            this._config = JSON.parse(newValue);
            this.activeRowIndex = this._config.activeRowIndex;
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
    return columnsConfig.map(c => {
        if (c.type === 'component') {            
            return {
                ...c,
                data: c.dataPropertyNames.map(p => rowData[p]),
            };
        } else {
            return {
                ...c,
                text: rowData[c.dataPropertyName],
            };
        }        
    });
}