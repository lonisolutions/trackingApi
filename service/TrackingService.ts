import { DetailedShipment } from "types";
import TrackingRepository from "../repository/TrackingRepository";
import { extractPostalAndCity } from "../helpers/regex";
import { NotFoundError, InternalServerError } from "../helpers/errors";

class TrackingService {
  private readonly trackingRepository: TrackingRepository;
  constructor() {
    this.trackingRepository = new TrackingRepository();
  }

  async findByTrackingNumberAndCarrier(
    trackingNumber: string,
    carrier: string
  ): Promise<DetailedShipment[]> {
    try {
      const shipments =
        await this.trackingRepository.findByTrackingNumberAndCarrier(
          trackingNumber,
          carrier
        );
      if (!shipments || shipments.length === 0) {
        throw new NotFoundError("No shipments found");
      }
      // we assume the addresses for all shipments are the same
      const receiverPostalAndCity = await extractPostalAndCity(
        shipments[0].receiver_address
      );
      const senderPostalAndCity = await extractPostalAndCity(
        shipments[0].sender_address
      );
      return shipments.map((shipment) => {
        return {
          ...shipment,
          receiver_postal_code: receiverPostalAndCity?.postalCode,
          receiver_city: receiverPostalAndCity.city,
          sender_postal_code: senderPostalAndCity.postalCode,
          sender_city: senderPostalAndCity.city,
        };
      });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error("Error from DB", error);
      throw new InternalServerError();
    }
  }
}

export default TrackingService;
