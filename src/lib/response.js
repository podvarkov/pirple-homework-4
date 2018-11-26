class Response {
  constructor(status, payload) {
    this.status = status
    this.payload = payload
  }

  json() {
    return JSON.stringify(this.payload)
  }
}

class NotAuthorizedError extends Response {
  constructor() {
    super(401, {message: 'Not authorized'});
  }
}

class BadRequestError extends Response {
  constructor(message = "Bad request") {
    super(400, {message});
  }
}


class InternalError extends Response {
  constructor(message = "Server Error", e) {
    super(500, {message});
    this.originError = e
  }
}

class NotFoundError extends Response{
  constructor(message = "Not found") {
    super(404, {message})
  }
}

class ValidationError extends Response {
  constructor(message = "Validation error") {
    super(422, {message});
  }
}

class PaymentError extends Response {
  constructor(payload) {
    super(400, {message: "Payment error", ...payload});
  }
}

class OkResponse extends Response {
  constructor(payload = {}) {
    super(200, payload);
  }
}

module.exports = {
  ValidationError,
  OkResponse,
  InternalError,
  NotAuthorizedError,
  NotFoundError,
  PaymentError,
  BadRequestError,
  Response
}