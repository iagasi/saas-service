import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { SECRET_JWT } from 'src/constants';
import { CompanyService } from 'src/company/company.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Company } from 'src/company/entities/company.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private conpanyService: CompanyService,
    private employeService: EmployeeService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT,
    });
  }

  async validate(whois: Company | Employee) {
    let user = null;

    if (whois.role == 'ADMIN') {
      user = await this.conpanyService.findOne(whois.id);
    }
    if (whois.role == 'USER') {
      user = await this.employeService.findOne(whois.id);
    }
    if (user && !user.active) {
      throw new ForbiddenException(
        'Account is not Activated got to login to receive Activation email one more time',
      );
    }
    if (user && !user.active) {
      throw new ForbiddenException(
        'Account is not Activated got to login to receive Activation email one more time',
      );
    }

    return user;
  }
}
