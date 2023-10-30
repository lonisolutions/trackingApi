import { Shipment, shipmentWithPostalCodesAndCities } from "types";
import TrackingRepository from "../repository/TrackingRepository";
import { extractPostalAndCity } from "../helpers/regex";

class TrackingService {
  private readonly trackingRepository: TrackingRepository;
  constructor() {
    this.trackingRepository = new TrackingRepository();
  }

  async findByTrackingNumberAndCarrier(
    trackingNumber: string,
    carrier: string
  ): Promise<shipmentWithPostalCodesAndCities[]> {
    const shipments =
      await this.trackingRepository.findByTrackingNumberAndCarrier(
        trackingNumber,
        carrier
      );
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
  }
}

export default TrackingService;
