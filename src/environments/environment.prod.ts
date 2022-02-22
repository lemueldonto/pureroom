import { environmentBase } from './environment.base';

export const environment = {
    ...environmentBase,

    influxUrl: '/weather/',
    scoreUrl: 'http://192.168.215.3:8080',
    production: true,
};
