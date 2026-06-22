import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('JwtStrategy criada');
    console.log(
      '🚀 ~ JwtStrategy ~ constructor ~ process.env.JWT_SECRET:',
      process.env.JWT_SECRET,
    );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    console.log('JWT VALIDATED:', payload);

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
