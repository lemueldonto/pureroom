export interface WeatherMockData {
  temperature: number, // celsius
  humidity: number,    // %
  cov: number,         // ppm
  co2: number,         // ppm
  airQuality: number,  //
}

export interface SmokeData {
  heat: boolean,
  smoke: boolean,
}

export interface MultiSensorData {
  temperature: number,
  // ultraviolet: number,
  // luminance: number,
  relative_humidty: number,
}

export enum AirQualityLabels {
  'good',
  'moderate',
  'unhealthy_for_sensitives',
  'unhealthy',
  'very_unhealthy',
  'hazardous',
}

export enum Polluters {
  'pm25',
  'pm10',
  'o3',
  'no2',
  'co2',
  'so2',
}


export interface AirQuality {
  label: AirQualityLabels,
  level: number,
  AQIColor: string,
}

export interface Weather {
  pressure: number,
  temperature: number,
  humidity: number,
}

export interface Pollution {
  pm10: number,
  pm25: number,
  co2: number,
  so2: number,
  no2: number
  dominantPolluter: Polluters,
}

export interface WeatherStationData {
  timestamp: Date,
  quality: AirQuality
  polluters: Pollution,
  weather: Weather
}
