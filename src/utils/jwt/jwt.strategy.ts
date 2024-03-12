import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { SECRET_JWT } from 'src/constants';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private conpanyService: CompanyService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT,
    });
  }

  async validate({ id }: { id: string }) {
    const company = await this.conpanyService.findOne(id);

    if (!company.active) {
      throw new ForbiddenException(
        'Accaunt is not Activated got to login to receive Activation email one more time',
      );
    }
    return company;
  }
}
