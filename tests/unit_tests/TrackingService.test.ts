import { shipmentWithPostalCodesAndCities } from "types";
import TrackingRepository from "../../repository/TrackingRepository";
import { extractPostalAndCity } from "../../helpers/regex";
import { NotFoundError, InternalServerError } from "../../helpers/errors";
import TrackingService from "../../service/TrackingService";

jest.mock("../../repository/TrackingRepository");
jest.mock("../../helpers/regex");

const mockFindByTrackingNumberAndCarrier = jest.fn();
const mockExtractPostalAndCity = jest.fn();
console.error = jest.fn();

TrackingRepository.prototype.findByTrackingNumberAndCarrier =
  mockFindByTrackingNumberAndCarrier;
(extractPostalAndCity as any) = mockExtractPostalAndCity;

describe("TrackingService", () => {
  let trackingService: TrackingService;

  beforeEach(() => {
    trackingService = new TrackingService();
    jest.clearAllMocks();
  });

  describe("findByTrackingNumberAndCarrier", () => {
    it("should return shipments with postal and city details", async () => {
      mockFindByTrackingNumberAndCarrier.mockResolvedValue([
        {
          receiver_address: "street1 123",
          sender_address: "street2 456",
        },
      ]);
      mockExtractPostalAndCity.mockImplementation((address: string) => {
        if (address === "street1 123") {
          return { postalCode: "123", city: "Berlin" };
        }
        return { postalCode: "456", city: "Munich" };
      });

      const result = await trackingService.findByTrackingNumberAndCarrier(
        "TN123",
        "dhl"
      );

      expect(result[0].receiver_postal_code).toBe("123");
      expect(result[0].receiver_city).toBe("Berlin");
      expect(result[0].sender_postal_code).toBe("456");
      expect(result[0].sender_city).toBe("Munich");
    });

    it("should throw NotFoundError when no shipments are found", async () => {
      mockFindByTrackingNumberAndCarrier.mockResolvedValue([]);

      await expect(
        trackingService.findByTrackingNumberAndCarrier("TN123", "dhl")
      ).rejects.toThrow(new NotFoundError("No shipments found"));
    });

    it("should throw InternalServerError on unexpected errors", async () => {
      mockFindByTrackingNumberAndCarrier.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        trackingService.findByTrackingNumberAndCarrier(
          "tracking123",
          "carrierXYZ"
        )
      ).rejects.toThrow(new InternalServerError());
      expect(console.error).toHaveBeenCalledWith(
        "Error from DB",
        expect.any(Error)
      );
    });
  });
});
