import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorContext } from './base.exception';

export class ExternalApiException extends BaseException {
  constructor(
    message: string,
    provider: string,
    statusCode?: number,
    context?: ErrorContext,
  ) {
    super(
      message,
      statusCode && statusCode >= 500
        ? HttpStatus.BAD_GATEWAY
        : HttpStatus.SERVICE_UNAVAILABLE,
      'EXTERNAL_API_ERROR',
      {
        provider,
        externalStatusCode: statusCode,
        ...context,
      },
    );
  }
}

export class ExternalApiTimeoutException extends BaseException {
  constructor(provider: string, timeout: number, context?: ErrorContext) {
    super(
      `Request to ${provider} timed out after ${timeout}ms`,
      HttpStatus.GATEWAY_TIMEOUT,
      'EXTERNAL_API_TIMEOUT',
      {
        provider,
        timeout,
        ...context,
      },
    );
  }
}

export class ExternalApiRateLimitException extends BaseException {
  constructor(provider: string, retryAfter?: number, context?: ErrorContext) {
    super(
      `Rate limit exceeded for ${provider}`,
      HttpStatus.TOO_MANY_REQUESTS,
      'EXTERNAL_API_RATE_LIMIT',
      {
        provider,
        retryAfter,
        ...context,
      },
    );
  }
}

export class ExternalApiConfigurationException extends BaseException {
  constructor(provider: string, missingConfig: string, context?: ErrorContext) {
    super(
      `Configuration missing for ${provider}: ${missingConfig}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'EXTERNAL_API_CONFIG_ERROR',
      {
        provider,
        missingConfig,
        ...context,
      },
    );
  }
}
