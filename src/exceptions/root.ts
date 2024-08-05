export class HttpException extends Error {
  /**
   * Constructs an HTTP exception.
   * @param message - The error message.
   * @param errorCode - A standardized error code.
   * @param statusCode - The HTTP status code.
   * @param errors - Additional error details.
   */
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  ADDRESS_NOT_FOUND = 1004,
  ADDRESS_DOES_NOT_BELONG = 1005,
  UNPROCESSABLE_ENTITY = 2004,
  INTERNAL_EXCEPTION = 3001,
  UNATHORIZED = 4001,
  UNAUTHENTICATED = 4002,
  PRODUCT_NOT_FOUND = 5001,
  ORDER_NOT_FOUND = 6001,
}
