import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseStatus } from '../utils/enum';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    console.log('exception--->', exception);
    const ctx = host.switchToHttp();
    ctx.getRequest();

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    httpStatus = exception['statusCode'] ? exception['statusCode'] : httpStatus;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    exception['name'];
    let exMessage = exception['message'];
    let exResponse;
    if (exception instanceof HttpException) {
      exResponse = exception.getResponse();

      if (exResponse?.trace && exResponse.trace.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        exResponse.trace;
      }
      if (exResponse?.message && exResponse.message.length > 0) {
        exMessage = exResponse.message;
      }
      if (exResponse?.data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        exResponse.data;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      exception;
    }

    const responseBody = {
      statusCode: httpStatus,
      status: ResponseStatus.ERROR,
      message: exMessage,
    };

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
