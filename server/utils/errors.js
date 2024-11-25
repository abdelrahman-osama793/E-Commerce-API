'use strict';

class HttpError extends Error {
  constructor({ message, statusCode, code, error = '' }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.error = '';
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Bad request error', error) {
    super({
      statusCode: 400,
      message,
      code: 'bad_request',
      error
    });
  }  
}

class ResourceNotFoundError extends HttpError {
  constructor(message = 'Resource not found error', error) {
    super({
      message,
      statusCode: 404,
      code: 'resource_not_found',
      error
    });
  }
}

class InternalServerError extends HttpError {
  constructor(message = 'Internal server error', error) {
    super({
      message,
      statusCode: 500,
      code: 'internal_server_error',
      error
    });
  }
}

class AuthorizationError extends HttpError {
  constructor(message = 'Unauthorized error', error) {
    super({
      message,
      statusCode: 401,
      code: 'authorization_error',
      error
    });
  }
}

class AuthenticationError extends HttpError {
  constructor(message = 'Unauthorized error', error) {
    super({
      message,
      statusCode: 403,
      code: 'authentication_error',
      error
    });
  }
}

module.exports = {
  BadRequestError,
  ResourceNotFoundError,
  InternalServerError,
  AuthorizationError,
  AuthenticationError
};
