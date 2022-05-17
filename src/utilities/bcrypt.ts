import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);
const pepper = process.env.BCRYPT_PASSWORD;

export function compareHash(password: string, hashString: string): Boolean {
  const result: Boolean = bcrypt.compareSync(password + pepper, hashString);
  return result;
}

export function createHash(password: string): string {
  const hash: string = bcrypt.hashSync(password + pepper, saltRounds) as string;
  return hash;
}
