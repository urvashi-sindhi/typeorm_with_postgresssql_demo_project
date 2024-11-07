import { HttpStatus } from '@nestjs/common';
import { ResponseStatus } from '../utils/enum';

export const handleResponse = (
  statusCode: number,
  status: string,
  message?: string,
  data?: any,
  error?: any,
) => {
  if (status === ResponseStatus.SUCCESS) {
    return {
      statusCode: statusCode || HttpStatus.OK,
      status,
      message,
      data,
      error,
    };
  } else {
    return {
      statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      status,
      message,
      data,
      error,
    };
  }
};
