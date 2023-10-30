import knexInstance from "../db";
import { Knex } from "knex";
import { WeatherData } from "types";

class WeatherRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }
  async getWeatherByPostalCode(
    postalCode: string
  ): Promise<WeatherData | undefined> {
    return await this.knex<WeatherData>("weather")
      .where("postal_code", postalCode)
      .first();
  }

  async saveWeather(weatherData: WeatherData): Promise<void> {
    await this.knex<WeatherData>("weather")
      .insert(weatherData)
      .onConflict("postal_code")
      .merge();
  }
}

export default WeatherRepository;
