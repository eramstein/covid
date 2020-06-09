export const DATA_URL = 'https://api.covid19api.com/summary';

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
    colors: ['#98abc5', '#8a89a6', '#7b6888'],
    categoryLabels: {
        TotalConfirmed: 'Total Confirmed',
        TotalDeaths: 'Total Deaths',
        TotalRecovered: 'Total Recovered',
    },
};