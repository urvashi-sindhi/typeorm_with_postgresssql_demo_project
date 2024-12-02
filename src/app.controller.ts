import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleOAuthGuard } from './lib/services/auth/guard/google-oauth.guard';
import { ResponseStatus } from './lib/utils/enum';
import { handleResponse } from './lib/helpers/handleResponse';
import { TwitterOAuthGuard } from './lib/services/auth/guard/twitter-oauth.guard';
import { FacebookOAuthGuard } from './lib/services/auth/guard/facebook-oauth.guard';
import { InstagramOAuthGuard } from './lib/services/auth/guard/instagram-oauth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @HttpCode(HttpStatus.OK)
  @Get('auth')
  @UseGuards(GoogleOAuthGuard)
  googleAuth(@Req() req: any) {
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      'http://localhost:5000/api/auth/google-redirect',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('auth/google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: any) {
    return this.appService.googleLogin(req);
  }

  @Get('auth/twitter')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TwitterOAuthGuard)
  twitterLogin(@Req() req: any) {
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      'http://localhost:5000/api/auth/twitter/callback',
    );
  }

  @Get('auth/twitter/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TwitterOAuthGuard)
  twitterCallback(@Req() req) {
    return this.appService.twitterLogin(req);
  }

  @Get('auth/facebook')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookOAuthGuard)
  facebookLogin(@Req() req: any) {
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      'http://localhost:5000/api/auth/facebook/callback',
    );
  }

  @Get('auth/facebook/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookOAuthGuard)
  facebookCallback(@Req() req) {
    return this.appService.facebookLogin(req);
  }

  @Get('auth/instagram')
  @HttpCode(HttpStatus.OK)
  @UseGuards(InstagramOAuthGuard)
  instagramLogin(@Req() req: any) {
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      'http://localhost:5000/api/auth/instagram/callback',
    );
  }

  @Get('auth/instagram/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(InstagramOAuthGuard)
  instagramCallback(@Req() req) {
    return this.appService.instagramLogin(req);
  }
}
