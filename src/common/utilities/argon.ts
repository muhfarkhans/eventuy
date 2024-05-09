import * as argon from 'argon2';

export function hashData(data: string) {
  return argon.hash(data);
}

export function verifyHashData(data: string, plain: string) {
  return argon.verify(data, plain);
}
