class CustomErrors extends Error {
  status: number;

  message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
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
