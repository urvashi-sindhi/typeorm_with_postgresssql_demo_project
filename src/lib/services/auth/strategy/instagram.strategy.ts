import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Profile, Strategy } from 'passport-instagram';
dotenv.config();

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor() {
    console.log('constructor....');

    super({
      clientID: 1275772363689915,
      clientSecret: '432e399b537a5b214432bfb276d0067f',
      callbackURL: 'http://localhost:5000/api/auth/instagram/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    console.log('profile', profile);
    const { name, emails } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
      refreshToken,
    };

    console.log('user', user);

    done(null, user);
  }
}
