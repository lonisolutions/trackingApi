import axios from "axios";
import { WeatherData } from "types";
import WeatherRepository from "../repository/WeatherRepository";
import { InternalServerError } from "../helpers/errors";

const BASE_URL = "https://api.weatherbit.io/v2.0/current";
const ONE_HOUR_IN_MILLISECONDS = 3600000;

class WeatherService {
  private readonly weatherRepository: WeatherRepository;

  constructor() {
    this.weatherRepository = new WeatherRepository();
  }

  async getWeather(postalCode: string, city: string): Promise<WeatherData> {
    try {
      const cachedWeatherData =
        await this.weatherRepository.getWeatherByPostalCode(postalCode);
      if (
        cachedWeatherData &&
        cachedWeatherData.last_fetched >
          new Date(Date.now() - ONE_HOUR_IN_MILLISECONDS)
      ) {
        return cachedWeatherData;
      } else {
        const freshWeatherData = await this.getWeatherFromAPI(postalCode, city);
        await this.weatherRepository.saveWeather(freshWeatherData);
        return freshWeatherData;
      }
    } catch (error) {
      console.error("Error from DB for postal code:", postalCode, error);
      throw new InternalServerError("Error while fetching weather data");
    }
  }

  async getWeatherFromAPI(
    postalCode: string,
    city: string
  ): Promise<WeatherData> {
    const API_KEY = process.env.WEATHER_API_KEY;

    if (!API_KEY) {
      throw new InternalServerError("Weather API key is missing");
    }

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          postal_code: postalCode,
          city: city,
          key: API_KEY,
        },
        timeout: 5000,
      });
      const weatherInfo = response.data.data[0];
      return {
        postal_code: postalCode,
        city: weatherInfo.city_name as string,
        temperature: weatherInfo.temp as number,
        description: weatherInfo.weather.description as string,
      } as WeatherData;
    } catch (error) {
      console.error(
        "Error fetching weather data from API for postal code:",
        postalCode,
        error
      );
      throw new InternalServerError(
        "Error while fetching weather data from API"
      );
    }
  }
}

export default WeatherService;
