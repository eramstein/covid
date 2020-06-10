import { DATA_URL, TABLE_CONFIG, CHART_CONFIG, DEFAULT_RECORD, TABLE_ELEMENT_ID, CHART_ELEMENT_ID } from './config.js';
import { DataTable } from './components/data_table.js';
import { PieChart } from './components/pie_chart.js';
import { STATIC_DATA } from './data.js';

// Define custom web components
// --------------------------------------------------
customElements.define('data-table', DataTable);
customElements.define('pie-chart', PieChart);

// Load data
// --------------------------------------------------
fetch(DATA_URL, {
    method: 'get'
}).then((response) => {    
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText);
    }    
}).then((response) => {
    const dataIsValid = validateData(response);
    if (dataIsValid) {
        return response;
    } else {
        throw new Error('Invalid data');
    }       
}).then((response) => {
    setupComponents(response);    
}).catch((err) => {
    alert(`Error when loading data from ${DATA_URL} ${err}. Loading static data instead.`);
    // note: at the time I'm doing the assignment the API is quite unstable, this is just to make work more confortable
    setupComponents(STATIC_DATA);
});

// We store the data locally in order not to have to re-query the API too often
// Typically that would be something like a Redux or Vuex store, for this execrise a simple global variable
let STORE;

// Check if data is formatted as expected (basic version, a real application would need more)
// --------------------------------------------------
function validateData(data) {    
    return data.Countries && data.Global && data.Date;
}

// Pass loaded data to web components
// --------------------------------------------------
function setupComponents(data) {
    setupTable(data);
    setupPieChart(data);
    STORE = data;
}

function setupTable(data) {
    const table = document.querySelector(TABLE_ELEMENT_ID);
    table.setAttribute('config', JSON.stringify(TABLE_CONFIG));
    table.setAttribute('data', JSON.stringify(data.Countries));
}

function setupPieChart(data) {
    const chart = document.querySelector(CHART_ELEMENT_ID);
    chart.setAttribute('config', JSON.stringify(CHART_CONFIG));
    chart.setAttribute('data', JSON.stringify(makePieData(data[DEFAULT_RECORD])));
    chart.setAttribute('chart-title', DEFAULT_RECORD);
}

function makePieData(record) {
    return [
        { label: CHART_CONFIG.categoryLabels.TotalConfirmed, value: record.TotalConfirmed },
        { label: CHART_CONFIG.categoryLabels.TotalDeaths, value: record.TotalDeaths },
        { label: CHART_CONFIG.categoryLabels.TotalRecovered, value: record.TotalRecovered },
    ];
}

// Event listeners
// --------------------------------------------------
document.addEventListener('rowClicked', (e) => {
    updatePieChart(e.detail);    
});

function updatePieChart(data) {    
    const chart = document.querySelector(CHART_ELEMENT_ID);
    const pieData = makePieData(data);
    const title = data.Country;        
    chart.setAttribute('data', JSON.stringify(pieData));
    chart.setAttribute('chart-title', title);
}

function resetTable() {
    const table = document.querySelector(TABLE_ELEMENT_ID);
    table.setAttribute('config', JSON.stringify(TABLE_CONFIG));
}

function resetSelection() {
    updatePieChart({ Country: DEFAULT_RECORD, ...STORE[DEFAULT_RECORD] });
    resetTable();
}

document.querySelector('#cancel_button').onclick = resetSelection;