import TrackingRepository from "../../repository/TrackingRepository";
import knexInstance from "../../db";

jest.mock("../../db");

describe("TrackingRepository", () => {
  let repo: TrackingRepository;

  beforeEach(() => {
    (knexInstance as jest.Mocked<any>).mockClear();

    repo = new TrackingRepository();
  });

  describe("findByTrackingNumberAndCarrier", () => {
    it("should fetch shipments by tracking number and carrier", async () => {
      const mockShipments = [
        {
          tracking_number: "TN123",
          carrier: "DHL",
        },
      ];

      (knexInstance as jest.Mocked<any>).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockResolvedValue(mockShipments),
      } as any);

      const result = await repo.findByTrackingNumberAndCarrier("TN123", "DHL");
      expect(result).toEqual(mockShipments);
    });

    it("should return an empty array when no shipments found", async () => {
      (knexInstance as jest.Mocked<any>).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await repo.findByTrackingNumberAndCarrier(
        "TN123",
        "wrong carrier"
      );
      expect(result).toEqual([]);
    });
  });
});
