export const DATA_URL = 'https://api.covid19api.com/summary';

export const DEFAULT_RECORD = 'Global';

export const CHART_COLORS = ['#4b9dd1', '#f78851', '#a2d9a3'];

export const TABLE_CONFIG = {
    columns: [{
        label: 'Country',
        dataPropertyName: 'Country',
        type: 'data',
    },{
        label: 'Summary',
        componentName: 'bar-chart',
        componentAttributes: {
            colors: CHART_COLORS,
            maxVal: 2000000,
            maxWidth: 150,
        },
        dataPropertyNames: ['TotalConfirmed', 'TotalDeaths', 'TotalRecovered'],
        type: 'component',
    },{
        label: 'Total Confirmed',
        dataPropertyName: 'TotalConfirmed',
        type: 'data',
    },{
        label: 'Total Deaths',
        dataPropertyName: 'TotalDeaths',
        type: 'data',
    },{
        label: 'Total Recovered',
        dataPropertyName: 'TotalRecovered',
        type: 'data',
    }],
};

export const CHART_CONFIG = {
    colors: CHART_COLORS,
    categoryLabels: {
        TotalConfirmed: 'Total Confirmed',
        TotalDeaths: 'Total Deaths',
        TotalRecovered: 'Total Recovered',
    },
};

export const TABLE_ELEMENT_ID = '#data_table_1';
export const CHART_ELEMENT_ID = '#pie_chart_1';
export const CANCEL_BUTTON_ID = '#cancel_button';