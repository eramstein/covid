export const DATA_URL = 'https://api.covid19api.com/summary';

export const DEFAULT_RECORD = 'Global';

export const TABLE_CONFIG = {
    columns: [{
        label: 'Country',
        dataPropertyName: 'Country',
    },{
        label: 'Total Confirmed',
        dataPropertyName: 'TotalConfirmed',
    },{
        label: 'Total Deaths',
        dataPropertyName: 'TotalDeaths',
    },{
        label: 'Total Recovered',
        dataPropertyName: 'TotalRecovered',
    }],
};

export const CHART_CONFIG = {
    colors: ['rgb(66, 136, 181, 0.8)', 'rgb(247, 136, 81)', 'rgb(162, 217, 163)'],
    categoryLabels: {
        TotalConfirmed: 'Total Confirmed',
        TotalDeaths: 'Total Deaths',
        TotalRecovered: 'Total Recovered',
    },
};

export const TABLE_ELEMENT_ID = '#data_table_1';
export const CHART_ELEMENT_ID = '#pie_chart_1';