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
    super(403, {message: 'Not authorized'});
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
    super(400, {message});
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
  Response
}