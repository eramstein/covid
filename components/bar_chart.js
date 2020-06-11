/*
BarChart Component

Attributes:
- colors {string}: a comma separated list of colors (rgb(), hex), e.g. '#4b9dd1,#f78851,#a2d9a3'
          they will be used in this sequence for each bar, looping from the first if there
          are more bars than colors
- maxWidth {number}: the maximum size in pixels of the bar if it matches the maximum data value
- maxVal {number}: the maximum total value of the data points
- data {string}: comma separated list of numbers
*/ 

const STYLES = `
    .container {
        display: flex;
    }
`;

export class BarChart extends HTMLElement {

    static get observedAttributes() {
        return ['data', 'config'];
    }

    static get tag() {
        return 'bar-chart';
    }

    constructor() {
        super();        
        
        this.container = document.createElement('div');
        this.container.className = 'container';

        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');  
        style.textContent = STYLES;
        
        shadow.appendChild(style);
        shadow.appendChild(this.container);
    }

    attributeChangedCallback(name, oldValue, newValue) {        
        if (name === 'data') {
            this._data = newValue.split(',').map(d => d * 1);
            if (this._colors && this._maxVal && this._maxWidth) {
                this.buildChart();
            }                                
        }        
    }

    buildChart() {        
        d3.select(this.container).selectAll('div')
            .data(this._data)
            .join('div')
                .style('width', d => { return this.xScale(d) + 'px' })
                .style('height', 20 + 'px')
                .style('background-color', (d, i) => this._colors[i]);
    }

    xScale(d) {        
        return Math.floor((d/this._maxVal) * this._maxWidth);
    }
    
    connectedCallback() {
        // TODO: attribute validation and safer "type casting"
        const colors = this.getAttribute('colors');
        if (colors) {
            this._colors = this.getAttribute('colors').split(',');
        }

        const maxVal = this.getAttribute('maxVal');
        if (maxVal) {
            this._maxVal = this.getAttribute('maxVal') * 1;
        }
        
        const maxWidth = this.getAttribute('maxWidth');
        if (maxWidth) {
            this._maxWidth = this.getAttribute('maxWidth') * 1;
        }
        
        if (this._colors && this._maxVal && this._maxWidth && this._data) {
            this.buildChart();
        }
    }

}