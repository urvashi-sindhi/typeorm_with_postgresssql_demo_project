import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { emailSend } from './lib/helpers/mail';
import { Messages } from './lib/utils/messages';
import { handleResponse } from './lib/helpers/handleResponse';
import { ResponseStatus } from './lib/utils/enum';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  googleLogin(req: any) {
    if (!req.user) {
      Logger.error(Messages.NOT_FOUND);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.NOT_FOUND,
      );
    }

    emailSend(req.user);

    Logger.log(Messages.LOGIN_SUCCESS);
    return Messages.LOGIN_SUCCESS;
  }

  twitterLogin(req: any) {
    if (!req.user) {
      Logger.error(Messages.NOT_FOUND);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.NOT_FOUND,
      );
    }

    emailSend(req.user);

    Logger.log(Messages.LOGIN_SUCCESS);
    return Messages.LOGIN_SUCCESS;
  }

  facebookLogin(req: any) {
    if (!req.user) {
      Logger.error(Messages.NOT_FOUND);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.NOT_FOUND,
      );
    }

    emailSend(req.user);

    Logger.log(Messages.LOGIN_SUCCESS);
    return Messages.LOGIN_SUCCESS;
  }

  instagramLogin(req: any) {
    if (!req.user) {
      Logger.error(Messages.NOT_FOUND);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.NOT_FOUND,
      );
    }

    emailSend(req.user);

    Logger.log(Messages.LOGIN_SUCCESS);
    return Messages.LOGIN_SUCCESS;
  }
}
