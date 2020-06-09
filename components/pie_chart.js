export class PieChart extends HTMLElement {

    static get observedAttributes() {
        return ['data', 'config'];
    }

    constructor() {
        super();

        this._config = null;
        this._data = null;

        this.chartRoot = document.createElement('div');

        const width = 960,
            height = 500,
            radius = Math.min(width, height) / 2;

        this.arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        this.labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        this.pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        this.chartRootElement = d3.select(this.chartRoot).append("svg")
            .attr('width', width)
            .attr('height', height)
        .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');  
        style.textContent = `
            .arc text {
                font: 10px sans-serif;
                text-anchor: middle;
            }          
            .arc path {
                stroke: #fff;
            }
        `;        
        shadow.appendChild(style);
        shadow.appendChild(this.chartRoot);
    }

    updateChart() {     
        const data = this._data;

        const color = d3.scaleOrdinal().range(this._config.colors);
        const _labelArc = this.labelArc;
        const pieData = this.pie(data);

        this.chartRootElement.selectAll("path")
            .data(pieData, d => d.data.label)
            .join("path")
                .attr("fill", d => color(d.data.label))
            .transition()
            .duration(750)
                .attr("d", this.arc);

        this.chartRootElement.selectAll("text")
            .data(pieData, d => d.data.label)
            .join("text")
                .text(function(d) { return d.value; })
            .transition()
            .duration(750)
                .attr("transform", function(d) { return "translate(" + _labelArc.centroid(d) + ")"; });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'config') {
            this._config = JSON.parse(newValue);            
        }
        if (name === 'data') {            
            this._data = JSON.parse(newValue);            
        }
        if (this._config && this._data) {
            this.updateChart();
        }
    }

  }