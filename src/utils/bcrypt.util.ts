import * as bcrypt from 'bcrypt';
import { ICompanyDb } from 'src/interfaces/company';
import { getJwtTokens } from './jwt/generate.tokens';
import { SALT } from 'src/constants';

export async function generateTokens(
  password: string,
  candidate: Omit<ICompanyDb, 'subscription'>,
) {
  const checkPassword = await bcrypt.compare(password, candidate.password);
  if (!checkPassword) {
    return null;
  }
  const userForToken = { ...candidate };
  delete userForToken.password;
  const tokens = await getJwtTokens(userForToken);
  return { acessToken: tokens.acessToken };
}

export async function generateHash(password: string) {
  const hash = await bcrypt.hash(password, parseInt(SALT));
  return hash;
}
