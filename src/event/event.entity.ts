export interface Event {
  id?: number;
  clientId: number;
  adminId?: number;
  title: string;
  description: string;
  thumbnail: string;
  logo: string;
  startTime: Date;
  endTime: Date;
  location: string;
  googleMaps: string;
  isAccepted?: number;
  isPublished?: number;
  rejectReason?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
