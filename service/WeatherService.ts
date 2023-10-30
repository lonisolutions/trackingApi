import axios from "axios";
import { CurrentWeather, WeatherData } from "types";
import WeatherRepository from "../repository/WeatherRepository";

class WeatherService {
  private readonly weatherRepository: WeatherRepository;
  constructor() {
    this.weatherRepository = new WeatherRepository();
  }

  async getWeather(postalCode: string, city: string): Promise<WeatherData> {
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
  }

  async getWeatherFromAPI(
    postalCode: string,
    city: string
  ): Promise<WeatherData> {
    const API_KEY = "0f0f310516f644d383d52570ba75954c";
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
    } catch (error: any) {
      console.error("Failed to fetch weather data:", error.message);
      throw error;
    }
  }
}

export default WeatherService;