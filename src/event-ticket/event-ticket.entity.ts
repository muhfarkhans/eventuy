export interface EventTicket {
  id?: number;
  eventId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  available: number;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}
