export interface Admin {
  id?: number;
  name: string;
  email: string;
  password: string;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AdminSafe = Omit<Admin, 'password'>;
