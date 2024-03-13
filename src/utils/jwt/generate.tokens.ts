import { JwtService } from '@nestjs/jwt';
import { Company } from 'src/company/entities/company.entity';
import { SECRET_JWT } from 'src/constants';
import { Employee } from 'src/employee/entities/employee.entity';
const jwtService = new JwtService({ secret: SECRET_JWT });

export async function getJwtTokens(user: Company | Employee) {
  const acessToken = await jwtService.signAsync(
    { ...user },
    {
      expiresIn: '1d',
    },
  );

  return { acessToken };
}
