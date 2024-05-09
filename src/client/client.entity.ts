export interface Client {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  isVerified: number;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClientSafe = Omit<Client, 'password'>;
