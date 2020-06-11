import { BarChart } from './bar_chart.js';
import { TestUtils } from './test-utils.js';

customElements.define(BarChart.tag, BarChart);

describe('Bar Chart Component', () => {
    // example of a test to check if the components renders at all
    // basic, but rules out issues like browser compatibility or missing attributes checking
    it('renders at all', async () => {        
        const {shadowRoot} = await TestUtils.render(BarChart.tag);
        expect(shadowRoot).toBeTruthy();
    });
    // example of a test which doesn't require actually rendering the component
    // (btw, bad practice of accessing "private" attributes, just for speed sake for this assignment)
    it('computes the x scale properly', async () => {        
        const component = new BarChart();
        component._maxWidth = 100;
        component._maxVal = 1000;
        expect(component.xScale(500)).toEqual(50);
    });
    // example of a test which checks deeper in the created shadowRoot for proper DOM elements creation
    // here looking for an exact string in innerHTML is fragile (e.g. this one fails on Edge),
    // given enough time I would rather check individual properties one by one
    it('sizes and colors bars properly', async () => {        
        const {shadowRoot} = await TestUtils.render(BarChart.tag, {
            colors: '#4b9dd1,#f78851,#a2d9a3',
            maxval: '2000000',
            maxwidth: '150',
            data: '2000464,112924,533504',
        }); 
        const value = shadowRoot.innerHTML.includes('<div style="width: 150px; height: 20px; background-color: rgb(75, 157, 209);">'); 
        expect(value).toBeTruthy();
    });
});