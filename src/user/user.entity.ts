export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  isVerified: number;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserSafe = Omit<User, 'password'>;
