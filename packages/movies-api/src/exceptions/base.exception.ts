import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorContext {
  [key: string]: any;
}

export abstract class BaseException extends HttpException {
  public readonly errorCode: string;
  public readonly context?: ErrorContext;
  public readonly timestamp: string;

  constructor(
    message: string,
    status: HttpStatus,
    errorCode: string,
    context?: ErrorContext,
  ) {
    super(message, status);
    this.errorCode = errorCode;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  public getErrorResponse() {
    return {
      statusCode: this.getStatus(),
      error: HttpStatus[this.getStatus()],
      message: this.message,
      errorCode: this.errorCode,
      timestamp: this.timestamp,
      ...(this.context && { context: this.context }),
    };
  }
}
