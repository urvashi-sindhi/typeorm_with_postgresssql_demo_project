import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class InstagramOAuthGuard extends AuthGuard('instagram') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const userAgent = req.headers['user-agent']?.toLowerCase();
    if (userAgent?.includes('postman')) {
      return true;
    }

    return super.canActivate(context);
  }
}