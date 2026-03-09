export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  hotelName?: string;
  hotelLatitude?: number;
  hotelLongitude?: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
