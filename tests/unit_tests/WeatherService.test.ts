import axios from "axios";
import { WeatherData } from "types";
import WeatherRepository from "../../repository/WeatherRepository";
import { InternalServerError } from "../../helpers/errors";
import WeatherService from "../../service/WeatherService";

jest.mock("axios");
jest.mock("../../repository/WeatherRepository");

const mockGetWeatherByPostalCode = jest.fn();
const mockSaveWeather = jest.fn();
WeatherRepository.prototype.getWeatherByPostalCode = mockGetWeatherByPostalCode;
WeatherRepository.prototype.saveWeather = mockSaveWeather;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("WeatherService", () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("getWeather", () => {
    it("should return weather data from repository if it's recent", async () => {
      const mockWeatherData = {
        last_fetched: new Date(),
        city: "Berlin",
        temperature: 25,
        description: "Dark as always",
      };
      mockGetWeatherByPostalCode.mockResolvedValueOnce(mockWeatherData);

      const result = await weatherService.getWeather("123", "Berlin");

      expect(result.city).toBe("Berlin");
      expect(mockSaveWeather).not.toHaveBeenCalled();
    });

    it("should fetch weather from API and save it if the repository data is old", async () => {
      const mockWeatherData = {
        last_fetched: new Date(Date.now() - 7200000),
        city: "Berlin",
        temperature: 25,
        description: "Dark as always",
      };
      mockGetWeatherByPostalCode.mockResolvedValueOnce(mockWeatherData);

      const mockApiResponse = {
        data: {
          data: [
            {
              city_name: "Berlin",
              temp: 20,
              weather: { description: "Cold" },
            },
          ],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await weatherService.getWeather("123", "Berlin");

      expect(result.city).toBe("Berlin");
      expect(mockSaveWeather).toHaveBeenCalledWith({
        postal_code: "123",
        city: "Berlin",
        temperature: 20,
        description: "Cold",
      });
    });

    it("should throw InternalServerError on database errors", async () => {
      mockGetWeatherByPostalCode.mockRejectedValueOnce(new Error());

      await expect(weatherService.getWeather("123", "Berlin")).rejects.toThrow(
        new InternalServerError("Error while fetching weather data")
      );
    });
  });

  describe("getWeatherFromAPI", () => {
    it("should fetch weather data from the API", async () => {
      const mockApiResponse = {
        data: {
          data: [
            {
              city_name: "Berlin",
              temp: 20,
              weather: { description: "Cold" },
            },
          ],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await weatherService.getWeatherFromAPI("123", "Berlin");

      expect(result.city).toBe("Berlin");
      expect(result.description).toBe("Cold");
    });

    it("should throw InternalServerError on API errors", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error());

      await expect(
        weatherService.getWeatherFromAPI("123", "Berlin")
      ).rejects.toThrow(
        new InternalServerError("Error while fetching weather data from API")
      );
    });
  });
});
