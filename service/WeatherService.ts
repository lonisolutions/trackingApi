import axios from "axios";
import { WeatherData } from "types";
import WeatherRepository from "../repository/WeatherRepository";
import { InternalServerError } from "../helpers/errors";
class WeatherService {
  private readonly weatherRepository: WeatherRepository;
  constructor() {
    this.weatherRepository = new WeatherRepository();
  }

  async getWeather(postalCode: string, city: string): Promise<WeatherData> {
    try {
      const weatherData = await this.weatherRepository.getWeatherByPostalCode(
        postalCode
      );
      if (
        weatherData &&
        weatherData.last_fetched > new Date(Date.now() - 3600000)
      ) {
        return {
          postal_code: postalCode,
          city: weatherData.city,
          temperature: weatherData.temperature,
          description: weatherData.description,
        } as WeatherData;
      } else {
        const weatherData = await this.getWeatherFromAPI(postalCode, city);
        await this.weatherRepository.saveWeather(weatherData);
        return weatherData;
      }
    } catch (error) {
      console.error("Error from DB", error);
      throw new InternalServerError("Error while fetching weather data");
    }
  }

  async getWeatherFromAPI(
    postalCode: string,
    city: string
  ): Promise<WeatherData> {
    const API_KEY = process.env.WEATHER_API_KEY || "your_default_key";
    const BASE_URL = "https://api.weatherbit.io/v2.0/current";

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          postal_code: postalCode,
          city: city,
          key: API_KEY,
        },
      });
      const weatherInfo = response.data.data[0];
      return {
        postal_code: postalCode,
        city: weatherInfo.city_name as string,
        temperature: weatherInfo.temp as number,
        description: weatherInfo.weather.description as string,
      } as WeatherData;
    } catch (error) {
      console.error("Error while fetching weather data from API:", error);
      throw new InternalServerError(
        "Error while fetching weather data from API"
      );
    }
  }
}

export default WeatherService;
