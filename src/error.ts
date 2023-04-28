class CustomErrors extends Error {
  statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
  }

  static badRequest(message: string) {
    return new CustomErrors(400, message);
  }

  static notFound(message: string) {
    return new CustomErrors(404, message);
  }

  static internalServerError(message: string) {
    return new CustomErrors(500, message);
  }
}

export default CustomErrors;
