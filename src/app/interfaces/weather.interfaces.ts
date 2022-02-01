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

export type TimeSeries = SeriesPoint[];

export interface WeatherTimeSeries {
    temperature: TimeSeries,
    co2: TimeSeries,
    humidity: TimeSeries,
    scores: TimeSeries,
}

export type MeasureTypes = 'temperature' | 'co2' | 'humidity' | 'scores';

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
