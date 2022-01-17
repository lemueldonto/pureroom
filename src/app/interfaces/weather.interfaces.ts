export interface WeatherData {
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
