export interface WeatherMockData {
    temperature: number, // celsius
    humidity: number,    // %
    cov: number,         // ppm
    co2: number,         // ppm
    airQuality: number,  //
}


export interface WeatherData {
    temperature: number, // celsius
    humidity: number,    // %
    co2: number,         // ppm
}

export interface SmokeData {
    heat: boolean,
    smoke: boolean,
}

export interface InfluxDBData {
    value: number,
    time: number,
}

export interface WeatherTimeseries {
    temperature: InfluxDBData[],
    co2: InfluxDBData[],
    humidity: InfluxDBData[],
}

export enum Polluters {
    'pm25',
    'pm10',
    'o3',
    'no2',
    'co2',
    'so2',
}
