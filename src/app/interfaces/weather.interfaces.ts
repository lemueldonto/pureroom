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

export interface SeriesPoint {
    value: number,
    time: number,
}

export interface WeatherTimeSeries {
    temperature: SeriesPoint[],
    co2: SeriesPoint[],
    humidity: SeriesPoint[],
}

export type MeasureTypes = 'temperature' | 'co2' | 'humidity';

export interface LabeledSeriesPoint extends SeriesPoint {
    label: MeasureTypes;
}

export type FlatWeatherTimeSeries = LabeledSeriesPoint[];

export enum Polluters {
    'pm25',
    'pm10',
    'o3',
    'no2',
    'co2',
    'so2',
}
