import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: process.env.TWITTER_CONSUMER_ID,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      session: false,
      includeEmail: true,
    });
  }

  async validate(token: string, tokenSecret: string, profile: any, done) {
    const { id, username, displayName, photos, emails } = profile;

    const user = {
      id,
      username,
      displayName,
      email: emails[0].value,
      photo: photos[0].value,
      token,
      tokenSecret,
    };
    done(null, user);
  }
}
