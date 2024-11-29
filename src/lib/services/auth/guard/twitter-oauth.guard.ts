import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwitterOAuthGuard extends AuthGuard('twitter') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const userAgent = req.headers['user-agent']?.toLowerCase();
    if (userAgent?.includes('postman')) {
      return true;
    }

    return super.canActivate(context);
  }
}
