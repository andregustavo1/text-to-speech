// erro com status HTTP, usado pelo handler de erros do app.js
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
