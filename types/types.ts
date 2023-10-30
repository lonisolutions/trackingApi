export type Shipment = {
  id: number;
  tracking_number: string;
  carrier: string;
  sender_address: string;
  receiver_address: string;
  article_name: string;
  article_quantity: string;
  article_price: string;
  SKU: string;
  status: string;
};

export type shipmentWithPostalCodesAndCities = Shipment & {
  receiver_postal_code: string;
  receiver_city: string;
  sender_postal_code: string;
  sender_city: string;
};

export type WeatherData = {
  postal_code: string;
  city: string;
  temperature: number;
  description: string;
  last_fetched: Date;
};

export type CurrentWeather = {
  receiver_city: WeatherData;
  sender_city: WeatherData;
};
