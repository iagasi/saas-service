import * as bcrypt from 'bcrypt';
import { ICompanyDb } from 'src/interfaces/company';
import { getJwtTokens } from './jwt/generate.tokens';
import { SALT } from 'src/constants';
import { Employee } from 'src/employee/entities/employee.entity';
import { Company } from 'src/company/entities/company.entity';

export async function generateTokens(
  password: string,
  candidate: Company | Employee,
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
