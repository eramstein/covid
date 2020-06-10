const LEGEND_ELEMENT_HEIGHT = 20;

const STYLES = `
    .container {
        width: 100%;
    }
    .pie-chart-title {
        font-size: 18px;
        font-weight: bold;
        margin: 50px 0px;
        text-transform: uppercase;
    }
    text.pie-value {
        text-anchor: middle;
        font-weight: bold;
    }          
    path {
        stroke: #fff;
    }
`;

export class PieChart extends HTMLElement {

    static get observedAttributes() {
        return ['data', 'config', 'chart-title'];
    }

    constructor() {
        super();

        this._config = null;
        this._data = null;

        const container = document.createElement('div');
        container.className = 'container';
        this.containerElement = container;

        const title = document.createElement('div');
        title.className = 'pie-chart-title';
        this.titleElement = title;

        this.chartRoot = document.createElement('div');
        
        const style = document.createElement('style');  
        style.textContent = STYLES;
        
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(style);
        shadow.appendChild(container);
        container.appendChild(title);
        container.appendChild(this.chartRoot);

        this.setupChart();
    }

    setupChart() {
        this.arc = d3.arc() .innerRadius(0);
        this.labelArc = d3.arc();
        this.svg = d3.select(this.chartRoot).append('svg');
        this.pieContainer = this.svg.append('g');
        this.legend = this.svg.append('g');
        this.pie = d3.pie()
            .sort(null)
            .value(d => d.value);
    }

    updateChart() {
        const marginTop = Object.keys(this._config.categoryLabels).length * LEGEND_ELEMENT_HEIGHT;        
        const padding = 50;
        const width = this.containerElement.clientWidth - padding;
        const height = width;
        const radius = width / 2;

        // update sizing
        this.svg .attr('width', width).attr('height', height + marginTop);
        this.pieContainer.attr('transform', 'translate(' + width / 2 + ',' + (height / 2 + marginTop) + ')');
        this.arc.outerRadius(radius);
        this.labelArc.outerRadius(radius - 45).innerRadius(radius - 45);

        // redraw chart
        const data = this._data;
        const color = d3.scaleOrdinal().range(this._config.colors);
        const _arc = this.arc;
        const _labelArc = this.labelArc;
        const pieData = this.pie(data);

        this.pieContainer.selectAll('path')
            .data(pieData, d => d.data.label)
            .join('path')
                .attr('fill', d => color(d.data.label))
            .transition()
            .duration(750)
                .attrTween('d', arcTween);

        this.pieContainer.selectAll('text')
            .data(pieData, d => d.data.label)
            .join('text')
                .attr('class', 'pie-value')
                .text(d => d.value.toLocaleString())
            .transition()            
            .duration(750)
                .attrTween('transform', textTween);

        function arcTween(a) {
            const i = d3.interpolate(this._current, a);
            this._current = i(0);            
            return function(t) {
                return _arc(i(t));
            };
        }

        function textTween(a) {
            const i = d3.interpolate(this._current, a);
            this._current = i(0);            
            return function(t) {
                return 'translate(' + _labelArc.centroid(i(t)) + ')';
            };
        }
    }

    updateTitle(title) {            
        this.titleElement.innerText = title;
    }

    updateLegend() {            
        const labels = Object.values(this._config.categoryLabels);
        const rectSize = LEGEND_ELEMENT_HEIGHT;
        const rectPadding = 3;
        const textPadding = 16;

        this.legend.selectAll('text')
            .data(labels)
            .join('text')
                .text(d => d)
                .attr('transform', (d, i) => 'translate(' + (rectSize + rectPadding) + ', ' + (textPadding + i * (LEGEND_ELEMENT_HEIGHT + rectPadding)) + ')');
        
        this.legend.selectAll('rect')
            .data(this._config.colors)
            .join('rect')
                .attr('fill', d => d)
                .attr('width', rectSize)
                .attr('height', rectSize)
                .attr('transform', (d, i) => 'translate(0, ' + i * (LEGEND_ELEMENT_HEIGHT + rectPadding) + ')');        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'config') {
            this._config = JSON.parse(newValue);
            this.updateLegend();    
            if (this._data) {
                this.updateChart();
            }
        }
        if (name === 'data') {            
            this._data = JSON.parse(newValue);
            if (this._config) {
                this.updateChart();
            }
        }
        if (name === 'chart-title') {
            this.updateTitle(newValue);
        }
    }

  }