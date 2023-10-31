// WeatherRepository.test.ts

import WeatherRepository from "../../repository/WeatherRepository";
import knexInstance from "../../db";
import { WeatherData } from "types";

jest.mock("../../db");

describe("WeatherRepository", () => {
  let repo: WeatherRepository;

  beforeEach(() => {
    (knexInstance as jest.Mocked<any>).mockClear();

    repo = new WeatherRepository();
  });

  describe("getWeatherByPostalCode", () => {
    it("should fetch weather data by postal code", async () => {
      const mockData = { postal_code: "12345", temperature: 25 };

      (knexInstance as jest.Mocked<any>).mockReturnValue({
        where: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(mockData),
        }),
      } as any);

      const result = await repo.getWeatherByPostalCode("12345");
      expect(result).toEqual(mockData);
    });

    it("should return undefined when no data is found", async () => {
      (knexInstance as jest.Mocked<any>).mockReturnValue({
        where: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(undefined),
        }),
      } as any);

      const result = await repo.getWeatherByPostalCode("67890");
      expect(result).toBeUndefined();
    });
  });

  describe("saveWeather", () => {
    it("should save or update weather data", async () => {
      const mockData = {
        postal_code: "12345",
        temperature: 25,
      } as WeatherData;

      (knexInstance as jest.Mocked<any>).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          onConflict: jest.fn().mockReturnValue({
            merge: jest.fn().mockResolvedValue(undefined),
          }),
        }),
      } as any);

      await repo.saveWeather(mockData);

      expect(knexInstance).toHaveBeenCalledWith("weather");
      expect(knexInstance().insert).toHaveBeenCalledWith(mockData);
    });
  });
});
