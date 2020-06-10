/*
    This one is a bit hacked together in the last minute
    But I thought it would be useful to have a way to compare countries at a glance
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
        return (d/this._maxVal) * this._maxWidth;
    }

    connectedCallback() {
        this._colors = this.getAttribute('colors').split(',');
        this._maxVal = this.getAttribute('maxVal') * 1;
        this._maxWidth = this.getAttribute('maxWidth') * 1;
        this.buildChart();
    }

  }