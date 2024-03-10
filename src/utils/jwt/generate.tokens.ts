import { JwtService } from '@nestjs/jwt';
import { SECRET_JWT } from 'src/constants';
import { ICompanyDb } from 'src/interfaces/company';
const jwtService = new JwtService({ secret: SECRET_JWT });

export async function getJwtTokens(user: Omit<ICompanyDb, 'password'>) {
  const acessToken = await jwtService.signAsync(
    { ...user },
    {
      expiresIn: '1d',
    },
  );

  return { acessToken };
}
