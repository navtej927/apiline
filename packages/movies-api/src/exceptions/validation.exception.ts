import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorContext } from './base.exception';

export class ValidationException extends BaseException {
  constructor(
    message: string,
    field?: string,
    value?: any,
    context?: ErrorContext,
  ) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', {
      field,
      value,
      ...context,
    });
  }
}

export class PaginationException extends BaseException {
  constructor(page: number, maxPage: number, context?: ErrorContext) {
    super(
      `Invalid page number: ${page}. Must be between 1 and ${maxPage}`,
      HttpStatus.BAD_REQUEST,
      'PAGINATION_ERROR',
      {
        page,
        maxPage,
        ...context,
      },
    );
  }
}

export class QueryParameterException extends BaseException {
  constructor(
    parameter: string,
    value: any,
    expectedType: string,
    context?: ErrorContext,
  ) {
    super(
      `Invalid query parameter '${parameter}': expected ${expectedType}, got ${typeof value}`,
      HttpStatus.BAD_REQUEST,
      'QUERY_PARAMETER_ERROR',
      {
        parameter,
        value,
        expectedType,
        ...context,
      },
    );
  }
}
