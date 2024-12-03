import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Strategy } from 'passport-instagram-graph';
dotenv.config();

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor() {
    super({
      clientID: 1275772363689915,
      clientSecret: '432e399b537a5b214432bfb276d0067f',
      callbackURL:
        'https://56d4-110-227-210-69.ngrok-free.app/api/auth/instagram/callback',
      scope: ['user_profile', 'user_media'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { id, username, accountType } = profile;

    const user = {
      id,
      username,
      accountType,
      accessToken,
    };

    done(null, user);
  }
}
