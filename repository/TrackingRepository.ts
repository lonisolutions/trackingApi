import knexInstance from "../db";
import { Knex } from "knex";
import { Shipment } from "types";

class TrackingRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async findByTrackingNumberAndCarrier(
    trackingNumber: string,
    carrier: string
  ): Promise<Shipment[]> {
    return await this.knex<Shipment>("shipments")
      .where("tracking_number", trackingNumber.toUpperCase())
      .andWhere("carrier", "ilike", carrier);
  }
}

export default TrackingRepository;
